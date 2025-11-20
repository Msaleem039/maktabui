import bcrypt from "bcryptjs";
import Parent from "../models/Parent.js";
import Student from "../models/Student.js";
import User from "../models/User.js";
import stripe from "../utils/stripe.js";
import Invoice from "../models/Invoice.js";
const mongoose = require("mongoose");

export const createParent = async (req) => {
  let stripeCustomer;

  try {
    const body = await req.json();
    const { parent: parentData, children: childrenData } = body;

    if (!parentData || !childrenData || childrenData.length === 0) {
      return new Response(
        JSON.stringify({ message: "Parent and at least one child data are required" }),
        { status: 400 }
      );
    }

    const {
      fullName,
      address,
      phone,
      spouse,
      spousePhone,
      emergencyPhone,
      addToWaitList: parentWaitList,
      email: parentEmail,
      password: parentPassword,
      identityNumber,
      paymentMethodId,
      cardDetails
    } = parentData;

    const firstChild = childrenData[0];
    const {
      studentName,
      phone: studentPhone,
      address: studentAddress,
      addToWaitList: studentWaitList,
      dateOfBirth,
      gender,
      enrollDate,
      fee,
      email: studentEmail,
      password: studentPassword,
      class: studentClass,
    } = firstChild;

    if (!parentPassword || !studentPassword || !paymentMethodId) {
      return new Response(
        JSON.stringify({ message: "Parent & student passwords and payment method are required" }),
        { status: 400 }
      );
    }

    const existingParent = await Parent.findOne({ email: parentEmail });
    if (existingParent) return new Response(JSON.stringify({ message: "Parent email exists" }), { status: 400 });

    const existingStudent = await Student.findOne({ email: studentEmail });
    if (existingStudent) return new Response(JSON.stringify({ message: "Student email exists" }), { status: 400 });

    const hashedParentPassword = await bcrypt.hash(parentPassword, 10);
    const hashedStudentPassword = await bcrypt.hash(studentPassword, 10);

    try {
      stripeCustomer = await stripe.customers.create({
        name: fullName,
        email: parentEmail,
        phone,
        address: { line1: address },
        metadata: { parentIdentity: identityNumber },
      });

      await stripe.paymentMethods.attach(paymentMethodId, { customer: stripeCustomer.id });

      await stripe.customers.update(stripeCustomer.id, {
        invoice_settings: { default_payment_method: paymentMethodId },
      });
    } catch (stripeError) {
      console.error("Stripe error:", stripeError);
      return new Response(JSON.stringify({ message: `Stripe error: ${stripeError.message}` }), { status: 400 });
    }

    const parentUser = await User.create({ email: parentEmail, password: hashedParentPassword, role: "Parent" });
    const studentUser = await User.create({ email: studentEmail, password: hashedStudentPassword, role: "Student" });

    const parent = new Parent({
      fullName,
      address,
      phone,
      spouse,
      spousePhone,
      emergencyPhone,
      addToWaitList: parentWaitList,
      email: parentEmail,
      password: hashedParentPassword,
      identityNumber,
      user: parentUser._id,
      cardDetail: {
        stripeCustomerId: stripeCustomer.id,
        defaultPaymentMethodId: paymentMethodId,
        paymentMethods: [{
          paymentMethodId,
          cardBrand: cardDetails.brand,
          last4: cardDetails.last4,
          expMonth: cardDetails.expMonth,
          expYear: cardDetails.expYear,
          isDefault: true,
        }],
      },
    });
    await parent.save();

    const student = new Student({
      studentName,
      phone: studentPhone,
      address: studentAddress,
      addToWaitList: studentWaitList,
      dateOfBirth,
      gender,
      enrollDate,
      fee,
      class: studentClass,
      email: studentEmail,
      password: hashedStudentPassword,
      parent: parent._id,
      user: studentUser._id,
    });
    await student.save();

    parent.students.push(student._id);
    await parent.save();

    const invoice = new Invoice({
      parent: parent._id,
      student: student._id,
      invoiceNumber: `INV-${Date.now()}`,
      items: [
        {
          description: `Fee for ${studentName}`,
          amount: fee * 100,
          quantity: 1,
        },
      ],
      totalAmount: fee * 100,
      currency: "USD",
      paymentMethod: parent.cardDetail.paymentMethods[0]._id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      notes: "Initial enrollment fee",
    });

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: fee * 100,
        currency: "USD",
        customer: stripeCustomer.id,
        payment_method: paymentMethodId,
        off_session: true,
        confirm: true,
      });

      invoice.paidAmount = fee * 100;
      invoice.status = "paid";
      invoice.paidAt = new Date();
    } catch (stripePaymentError) {
      console.error("Stripe payment error:", stripePaymentError);
      invoice.status = "pending";
      invoice.paidAmount = 0;
    }

    await invoice.save();

    return new Response(
      JSON.stringify({
        message: "Parent, Student, and Invoice created successfully.",
        parent: { id: parent._id, fullName: parent.fullName, email: parent.email, stripeCustomerId: parent.cardDetail.stripeCustomerId },
        student: { id: student._id, studentName: student.studentName, email: student.email },
        invoice: { id: invoice._id, invoiceNumber: invoice.invoiceNumber, totalAmount: invoice.totalAmount, status: invoice.status },
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating parent:", error);
    if (stripeCustomer && stripeCustomer.id) {
      try { await stripe.customers.del(stripeCustomer.id); }
      catch (cleanupError) { console.error("Stripe cleanup error:", cleanupError); }
    }
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
};

export const getAllParents = async (req) => {
  try {
    const params = req.body;

    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc"
    } = params;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const searchQuery = search ? {
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { identityNumber: { $regex: search, $options: "i" } }
      ]
    } : {};

    const filterQuery = {
      ...searchQuery,
      addToWaitList: false
    };

    const total = await Parent.countDocuments(filterQuery);

    const parents = await Parent.find(filterQuery)
      .populate("students", "studentName email phone class")
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(limitNum)
      .select("-password");

    return new Response(
      JSON.stringify({
        success: true,
        data: parents,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalItems: total,
          itemsPerPage: limitNum
        }
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching parents:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error"
      }),
      { status: 500 }
    );
  }
}

export const getAllWaitlistParents = async (req) => {
  try {
    const params = req.body;

    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc"
    } = params;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const searchQuery = search ? {
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { identityNumber: { $regex: search, $options: "i" } }
      ]
    } : {};

    const filterQuery = {
      ...searchQuery,
      addToWaitList: true
    };

    const total = await Parent.countDocuments(filterQuery);

    const waitlistParents = await Parent.find(filterQuery)
      .populate("students", "studentName email phone class")
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(limitNum)
      .select("-password");

    return new Response(
      JSON.stringify({
        success: true,
        data: waitlistParents,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalItems: total,
          itemsPerPage: limitNum
        }
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching waitlist parents:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error"
      }),
      { status: 500 }
    );
  }
}

export const getParentById = async (req) => {
  try {
    const { id } = await req.json();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid or missing parent ID" }),
        { status: 400 }
      );
    }

    const parent = await Parent.findById(id)
      .populate("students")
      .select("-password");

    if (!parent) {
      return new Response(
        JSON.stringify({ success: false, message: "Parent not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: parent }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching parent by ID:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500 }
    );
  }
};

export const addToWaitList = async (req) => {
  try {
    const { id } = await req.json();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid or missing parent ID" }),
        { status: 400 }
      );
    }

    const parent = await Parent.findById(id);

    if (!parent) {
      return new Response(
        JSON.stringify({ success: false, message: "Parent not found" }),
        { status: 404 }
      );
    }

    if (parent.addToWaitList) {
      return new Response(
        JSON.stringify({ success: false, message: "Parent is already on waitlist" }),
        { status: 400 }
      );
    }

    parent.addToWaitList = true;
    await parent.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Parent and associated students added to waitlist successfully",
        data: {
          id: parent._id,
          fullName: parent.fullName,
          email: parent.email,
          addToWaitList: parent.addToWaitList
        }
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error adding parent to waitlist:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error"
      }),
      { status: 500 }
    );
  }
}

export const removeFromWaitList = async (req) => {
  try {
    const { id } = await req.json();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid or missing parent ID" }),
        { status: 400 }
      );
    }

    const parent = await Parent.findById(id);

    if (!parent) {
      return new Response(
        JSON.stringify({ success: false, message: "Parent not found" }),
        { status: 404 }
      );
    }

    if (!parent.addToWaitList) {
      return new Response(
        JSON.stringify({ success: false, message: "Parent is not on waitlist" }),
        { status: 400 }
      );
    }

    parent.addToWaitList = false;
    await parent.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Parent and associated students removed from waitlist successfully",
        data: {
          id: parent._id,
          fullName: parent.fullName,
          email: parent.email,
          addToWaitList: parent.addToWaitList
        }
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error removing parent from waitlist:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error"
      }),
      { status: 500 }
    );
  }
}
