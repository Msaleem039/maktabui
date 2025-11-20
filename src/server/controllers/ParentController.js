import bcrypt from "bcryptjs";
import Parent from "../models/Parent.js";
import Student from "../models/Student.js";
import User from "../models/User.js";
import stripe from "../utils/stripe.js";
import Invoice from "../models/Invoice.js";
import Payment from "../models/Payments.js";

const mongoose = require("mongoose");

const calculateNextPaymentDate = (frequency) => {
  const date = new Date();
  switch (frequency) {
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    case "quarterly":
      date.setMonth(date.getMonth() + 3);
      break;
    default:
      date.setMonth(date.getMonth() + 1);
  }
  return date;
};

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
      cardDetails,
      recurringEnabled = false,
      recurringFrequency = "monthly",
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
      recurringPayment: {
        enabled: recurringEnabled,
        nextPaymentDate: recurringEnabled ? calculateNextPaymentDate(recurringFrequency) : null,
        frequency: recurringFrequency,
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

    let paymentResult = null;
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: fee * 100,
        currency: "USD",
        customer: stripeCustomer.id,
        payment_method: paymentMethodId,
        off_session: true,
        confirm: true,
        metadata: {
          studentId: student._id.toString(),
          studentName: studentName,
          type: "initial_enrollment"
        }
      });

      const payment = new Payment({
        parent: parent._id,
        student: student._id,
        invoiceNumber: `INIT-${Date.now()}`,
        amount: fee * 100,
        currency: "USD",
        paymentMethod: {
          paymentMethodId: paymentMethodId,
          cardBrand: cardDetails.brand,
          last4: cardDetails.last4,
          expMonth: cardDetails.expMonth,
          expYear: cardDetails.expYear
        },
        stripePaymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        description: `Initial enrollment fee for ${studentName}`,
        metadata: {
          studentName: studentName,
          type: "initial_enrollment"
        }
      });
      await payment.save();

      paymentResult = {
        id: payment._id,
        amount: payment.amount,
        status: payment.status,
        paymentDate: payment.paymentDate
      };

    } catch (stripePaymentError) {
      console.error("Stripe payment error:", stripePaymentError);
      paymentResult = {
        error: stripePaymentError.message,
        status: "failed"
      };
    }

    return new Response(
      JSON.stringify({
        message: "Parent and Student created successfully.",
        parent: {
          id: parent._id,
          fullName: parent.fullName,
          email: parent.email,
          stripeCustomerId: parent.cardDetail.stripeCustomerId,
          recurringPayment: parent.recurringPayment
        },
        student: {
          id: student._id,
          studentName: student.studentName,
          email: student.email
        },
        payment: paymentResult
      }),
      { status: 201 }
    );

  } catch (error) {
    console.error("❌ Error creating parent:", error);
    if (stripeCustomer && stripeCustomer.id) {
      try {
        await stripe.customers.del(stripeCustomer.id);
      } catch (cleanupError) {
        console.error("Stripe cleanup error:", cleanupError);
      }
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

export const processCardPayment = async (req) => {
  let paymentIntent;

  try {
    const body = await req.json();
    const {
      amount,
      selectedDate,
      paymentMethodId,
      cardDetails,
      invoiceId
    } = body;

    if (!amount || !selectedDate || !paymentMethodId || !cardDetails) {
      return new Response(
        JSON.stringify({ message: "Amount, date, payment method, and card details are required" }),
        { status: 400 }
      );
    }

    const invoice = await Invoice.findById(invoiceId).populate("parent");
    if (!invoice) {
      return new Response(
        JSON.stringify({ message: "Invoice not found" }),
        { status: 404 }
      );
    }

    const parent = invoice.parent;
    if (!parent) {
      return new Response(
        JSON.stringify({ message: "Parent not found" }),
        { status: 404 }
      );
    }

    let stripeCustomerId = parent.cardDetail?.stripeCustomerId;

    if (!stripeCustomerId) {
      try {
        const stripeCustomer = await stripe.customers.create({
          name: parent.fullName,
          email: parent.email,
          phone: parent.phone,
          address: { line1: parent.address },
          metadata: {
            parentId: parent._id.toString(),
            identityNumber: parent.identityNumber
          },
        });

        stripeCustomerId = stripeCustomer.id;

        await Parent.findByIdAndUpdate(parent._id, {
          "cardDetail.stripeCustomerId": stripeCustomerId
        });
      } catch (stripeError) {
        console.error("Stripe customer creation error:", stripeError);
        return new Response(
          JSON.stringify({ message: `Stripe error: ${stripeError.message}` }),
          { status: 400 }
        );
      }
    }

    try {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: stripeCustomerId,
      });

      await stripe.customers.update(stripeCustomerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      await Parent.findByIdAndUpdate(parent._id, {
        "cardDetail.defaultPaymentMethodId": paymentMethodId,
        $push: {
          "cardDetail.paymentMethods": {
            paymentMethodId,
            cardBrand: cardDetails.brand,
            last4: cardDetails.last4,
            expMonth: cardDetails.expMonth,
            expYear: cardDetails.expYear,
            isDefault: true,
          }
        }
      });

    } catch (stripeError) {
      console.error("Stripe payment method error:", stripeError);
      return new Response(
        JSON.stringify({ message: `Payment method error: ${stripeError.message}` }),
        { status: 400 }
      );
    }

    try {
      const baseUrl = 'http://localhost:3000';
      const returnUrl = `${baseUrl}/dashboard/finance/invoice/${invoiceId}/payment-done`;

      try {
        new URL(returnUrl);
      } catch (urlError) {
        console.error('Invalid return URL:', returnUrl);
        return new Response(
          JSON.stringify({ message: "Invalid return URL configuration" }),
          { status: 500 }
        );
      }

      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(amount) * 100),
        currency: "usd",
        customer: stripeCustomerId,
        payment_method: paymentMethodId,
        confirm: true,
        return_url: returnUrl,
        metadata: {
          parentId: parent._id.toString(),
          invoiceId: invoiceId.toString(),
          parentName: parent.fullName,
          invoiceNumber: invoice.invoiceNumber
        }
      });

      if (paymentIntent.status === 'succeeded') {
        const updatedInvoice = await Invoice.findById(invoiceId);
        if (updatedInvoice) {
          updatedInvoice.status = "paid";
          updatedInvoice.paidAmount = parseFloat(amount);
          updatedInvoice.paidAt = new Date(selectedDate);
          updatedInvoice.paymentMethod = parent.cardDetail?.paymentMethods?.[0]?._id || null;
          updatedInvoice.paymentReference = paymentIntent.id;
          updatedInvoice.stripePaymentIntentId = paymentIntent.id;

          await updatedInvoice.save();

          console.log("✅ Invoice updated successfully:", {
            invoiceId: updatedInvoice._id,
            status: updatedInvoice.status,
            paidAmount: updatedInvoice.paidAmount,
            paidAt: updatedInvoice.paidAt,
            paymentReference: updatedInvoice.paymentReference
          });
        }

        return new Response(
          JSON.stringify({
            message: "Card payment processed successfully",
            payment: {
              id: paymentIntent.id,
              amount: amount,
              status: paymentIntent.status,
              invoiceId: invoiceId,
              invoiceNumber: invoice.invoiceNumber,
              paidAt: new Date(selectedDate)
            },
            parent: {
              id: parent._id,
              fullName: parent.fullName,
              email: parent.email,
              stripeCustomerId: stripeCustomerId
            },
            invoice: {
              id: invoice._id,
              status: "paid",
              paidAmount: amount,
              paidAt: selectedDate
            }
          }),
          { status: 200 }
        );

      } else if (paymentIntent.status === 'requires_action') {
        return new Response(
          JSON.stringify({
            message: "Payment requires additional authentication",
            requiresAction: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
          }),
          { status: 200 }
        );
      } else {
        await Invoice.findByIdAndUpdate(invoiceId, {
          status: "pending",
          paymentReference: paymentIntent.id,
          stripePaymentIntentId: paymentIntent.id
        });

        return new Response(
          JSON.stringify({
            message: `Payment failed: ${paymentIntent.status}`
          }),
          { status: 400 }
        );
      }

    } catch (paymentError) {
      console.error("Stripe payment processing error:", paymentError);

      await Invoice.findByIdAndUpdate(invoiceId, {
        status: "pending",
        paymentReference: paymentIntent?.id || null,
        stripePaymentIntentId: paymentIntent?.id || null
      });

      return new Response(
        JSON.stringify({ message: `Payment processing error: ${paymentError.message}` }),
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("❌ Error processing card payment:", error);

    if (paymentIntent && paymentIntent.id) {
      try {
        await stripe.paymentIntents.cancel(paymentIntent.id);
      } catch (cancelError) {
        console.error("Error canceling payment intent:", cancelError);
      }
    }

    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 500 }
    );
  }
};

export const getAllParentsWithStudents = async (req) => {
  try {
    const parents = await Parent.find()
      .populate("students", "studentName _id")
      .select("_id fullName");      

    return new Response(
      JSON.stringify({
        success: true,
        data: parents
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching parents with students:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error"
      }),
      { status: 500 }
    );
  }
};

export const addCardDetail = async (req) => {
  try {
    const body = await req.json();
    const { parentId, cardData } = body;
    console.log("cardData", cardData);

    if (!parentId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Parent ID is required"
        }),
        { status: 400 }
      );
    }

    if (!cardData || !cardData.paymentMethodId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Card data with paymentMethodId is required"
        }),
        { status: 400 }
      );
    }

    const parent = await mongoose.models.Parent.findById(parentId);
    if (!parent) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Parent not found"
        }),
        { status: 404 }
      );
    }

    const isFirstCard = !parent.cardDetail?.paymentMethods || parent.cardDetail.paymentMethods.length === 0;
    
    const newCard = {
      paymentMethodId: cardData.paymentMethodId,
      cardBrand: cardData.cardBrand,
      last4: cardData.last4,
      expMonth: cardData.expMonth,
      expYear: cardData.expYear,
      isDefault: isFirstCard || cardData.isDefault || false,
    };

    if (!parent.cardDetail) {
      parent.cardDetail = {
        stripeCustomerId: cardData.stripeCustomerId || parent.cardDetail?.stripeCustomerId,
        paymentMethods: [newCard]
      };
    } else {
      if (newCard.isDefault && parent.cardDetail.paymentMethods.length > 0) {
        parent.cardDetail.paymentMethods.forEach(card => {
          card.isDefault = false;
        });
      }

      parent.cardDetail.paymentMethods.push(newCard);

      if (cardData.stripeCustomerId) {
        parent.cardDetail.stripeCustomerId = cardData.stripeCustomerId;
      }
    }

    await parent.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Card added successfully",
        card: newCard
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error adding card detail:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message
      }),
      { status: 500 }
    );
  }
}

export const setCardDefault = async (req) => {
  try {
    const body = await req.json();
    const { parentId, paymentMethodId } = body;
    console.log("Setting default card:", { parentId, paymentMethodId });

    if (!parentId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Parent ID is required"
        }),
        { status: 400 }
      );
    }

    if (!paymentMethodId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Payment Method ID is required"
        }),
        { status: 400 }
      );
    }

    const parent = await mongoose.models.Parent.findById(parentId);
    if (!parent) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Parent not found"
        }),
        { status: 404 }
      );
    }

    if (!parent.cardDetail || !parent.cardDetail.paymentMethods || parent.cardDetail.paymentMethods.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No payment methods found for this parent"
        }),
        { status: 404 }
      );
    }

    const cardToSetDefault = parent.cardDetail.paymentMethods.find(
      card => card.paymentMethodId === paymentMethodId
    );

    if (!cardToSetDefault) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Payment method not found"
        }),
        { status: 404 }
      );
    }

    parent.cardDetail.paymentMethods.forEach(card => {
      card.isDefault = false;
    });

    cardToSetDefault.isDefault = true;

    parent.cardDetail.defaultPaymentMethodId = paymentMethodId;

    await parent.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Card set as default successfully",
        defaultCard: cardToSetDefault
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error setting card as default:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message
      }),
      { status: 500 }
    );
  }
}

export const removeCardDetail = async (req) => {
  try {
    const body = await req.json();
    const { parentId, paymentMethodId } = body;
    console.log("Removing card:", { parentId, paymentMethodId });

    if (!parentId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Parent ID is required"
        }),
        { status: 400 }
      );
    }

    if (!paymentMethodId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Payment Method ID is required"
        }),
        { status: 400 }
      );
    }

    const parent = await mongoose.models.Parent.findById(parentId);
    if (!parent) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Parent not found"
        }),
        { status: 404 }
      );
    }

    if (!parent.cardDetail || !parent.cardDetail.paymentMethods || parent.cardDetail.paymentMethods.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No payment methods found for this parent"
        }),
        { status: 404 }
      );
    }

    const cardToRemove = parent.cardDetail.paymentMethods.find(
      card => card.paymentMethodId === paymentMethodId
    );

    if (!cardToRemove) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Payment method not found"
        }),
        { status: 404 }
      );
    }

    const wasDefault = cardToRemove.isDefault;
    const remainingCardsCount = parent.cardDetail.paymentMethods.length - 1;

    parent.cardDetail.paymentMethods = parent.cardDetail.paymentMethods.filter(
      card => card.paymentMethodId !== paymentMethodId
    );

    if (wasDefault && remainingCardsCount > 0) {
      parent.cardDetail.paymentMethods[0].isDefault = true;
      parent.cardDetail.defaultPaymentMethodId = parent.cardDetail.paymentMethods[0].paymentMethodId;
    } else if (remainingCardsCount === 0) {
      parent.cardDetail.defaultPaymentMethodId = null;
    }

    await parent.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Card removed successfully",
        removedCard: cardToRemove,
        remainingCards: parent.cardDetail.paymentMethods.length
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error removing card:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message
      }),
      { status: 500 }
    );
  }
}