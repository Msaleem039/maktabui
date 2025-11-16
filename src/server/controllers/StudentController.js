import bcrypt from "bcryptjs";
import Student from "../models/Student.js";
import Parent from "../models/Parent.js";
import User from "../models/User.js"; 

export const createStudent = async (req) => {
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

    // Check if parent already exists
    let parent = await Parent.findOne({ identityNumber });

    if (parent) {
      const hashedStudentPassword = await bcrypt.hash(studentPassword, 10);

      const studentUser = await User.create({
        email: studentEmail,
        password: hashedStudentPassword,
        role: "Student",
      });

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
          message: "Existing parent found. Linked new student.",
          parent,
          student,
          existingParent: true,
        }),
        { status: 200 }
      );
    }

    // Hash passwords
    const hashedParentPassword = await bcrypt.hash(parentPassword, 10);
    const hashedStudentPassword = await bcrypt.hash(studentPassword, 10);

    // Create users
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

    // Create parent
    parent = new Parent({
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

    // Create student
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
