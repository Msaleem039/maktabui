import bcrypt from "bcryptjs";
import Parent from "../models/Parent.js";
import Student from "../models/Student.js";
import User from "../models/User.js"; 

export const createParent = async (req) => {
  try {
    const body = await req.json();
    const {
      // Parent details
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

      // Student details
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

    return new Response(
      JSON.stringify({
        message: "Parent and Student created successfully.",
        parent,
        student,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating parent:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
};
