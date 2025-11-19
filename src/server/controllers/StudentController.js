import bcrypt from "bcryptjs";
import Student from "../models/Student.js";
import Parent from "../models/Parent.js";
import User from "../models/User.js";

export const createStudent = async (req) => {
  try {
    const body = await req.json();
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

      studentName,
      studentPhone,
      studentAddress,
      addToWaitList: studentWaitList,
      dateOfBirth,
      gender,
      enrollDate,
      fee,
      studentEmail,
      studentPassword,
      class: studentClass,
    } = body;

    let parent = await Parent.findOne({ identityNumber });

    if (parent) {
      const hashedStudentPassword = await bcrypt.hash(studentPassword, 10);

      const studentUser = await User.create({
        email: studentEmail,
        password: hashedStudentPassword,
        role: "Student",
      });

      const student = await Student.create({
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

      parent.students.push(student._id);
      await parent.save();

      return new Response(
        JSON.stringify({
          message: "Existing parent found. Linked new student.",
          parent,
          student,
          existingParent: true,
        }),
        { status: 200 }
      );
    }

    const hashedParentPassword = await bcrypt.hash(parentPassword, 10);
    const hashedStudentPassword = await bcrypt.hash(studentPassword, 10);

    const parentUser = await User.create({
      email: parentEmail,
      password: hashedParentPassword,
      role: "Parent",
    });

    const studentUser = await User.create({
      email: studentEmail,
      password: hashedStudentPassword,
      role: "Student",
    });

    parent = await Parent.create({
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
    });

    const student = await Student.create({
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

    parent.students.push(student._id);
    await parent.save();

    return new Response(
      JSON.stringify({
        message: "New student and parent created successfully.",
        student,
        parent,
        existingParent: false,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating student:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
};

export const getAllStudent = async (req) => {
  try {
    const students = await Student.find().populate("parent");

    return new Response(
      JSON.stringify({
        message: "Students fetched successfully.",
        students,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
};

export const getAllWaitlistStudent = async (req) => {
  try {
    const waitlist = await Student.find({ addToWaitList: true });

    return new Response(
      JSON.stringify({
        message: "Waitlist students fetched successfully.",
        waitlist,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching waitlisted students:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
};

export const addToWaitlist = async (req) => {
  try {
    const { studentId } = await req.json();

    if (!studentId) {
      return new Response(JSON.stringify({ message: "studentId is required" }), {
        status: 400,
      });
    }

    const student = await Student.findByIdAndUpdate(
      studentId,
      { addToWaitList: true },
      { new: true }
    );

    if (!student) {
      return new Response(
        JSON.stringify({ message: "Student not found." }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Student added to waitlist.",
        student,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error adding to waitlist:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
};

export const removeFromWaitlist = async (req) => {
  try {
    const { studentId } = await req.json();

    if (!studentId) {
      return new Response(JSON.stringify({ message: "studentId is required" }), {
        status: 400,
      });
    }

    const student = await Student.findByIdAndUpdate(
      studentId,
      { addToWaitList: false },
      { new: true }
    );

    if (!student) {
      return new Response(
        JSON.stringify({ message: "Student not found." }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Student removed from waitlist.",
        student,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error removing from waitlist:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
};

export const getStudentById = async (req) => {
  try {
    const { studentId } = await req.json();

    if (!studentId) {
      return new Response(JSON.stringify({ message: "studentId is required" }), {
        status: 400,
      });
    }

    const student = await Student.findById(studentId).populate("parent");

    if (!student) {
      return new Response(
        JSON.stringify({ message: "Student not found." }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Student fetched successfully.",
        student,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching student by ID:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
};

