import bcrypt from "bcryptjs";
import Student from "../models/Student.js";
import Parent from "../models/Parent.js";
import User from "../models/User.js";
import Class from "../models/Class.js";

const mongoose = require("mongoose");

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

    // Check if student email exists
    const existingStudent = await Student.findOne({ email: studentEmail });
    if (existingStudent) {
      return new Response(
        JSON.stringify({ message: "Student with this email already exists." }),
        { status: 400 }
      );
    }

    // Check if class exists
    const classExists = await Class.findById(studentClass);
    if (!classExists) {
      return new Response(
        JSON.stringify({ message: "Class not found." }),
        { status: 404 }
      );
    }

    // Check if parent exists
    let parent = await Parent.findOne({ identityNumber });

    const hashedStudentPassword = await bcrypt.hash(studentPassword, 10);

    // Create student User
    const studentUser = await User.create({
      email: studentEmail,
      password: hashedStudentPassword,
      role: "Student",
    });

    if (parent) {
      // Link student to existing parent
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

    // Create new parent and link
    const hashedParentPassword = await bcrypt.hash(parentPassword, 10);

    const parentUser = await User.create({
      email: parentEmail,
      password: hashedParentPassword,
      role: "Parent",
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
    const students = await Student.find()
      .populate("parent")
      .populate("class");      

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
    const waitlist = await Student.find({ addToWaitList: true })
      .populate("parent")
      .populate("class");

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

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return new Response(JSON.stringify({ message: "Invalid student ID format" }), {
        status: 400,
      });
    }

    const studentData = await Student.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(studentId)
        }
      },

      {
        $lookup: {
          from: "parents",
          localField: "parent",
          foreignField: "_id",
          as: "parent"
        }
      },
      {
        $unwind: {
          path: "$parent",
          preserveNullAndEmptyArrays: true
        }
      },

      {
        $lookup: {
          from: "attendances",
          let: { studentId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$$studentId", "$records.student"]
                }
              }
            },
            {
              $unwind: "$records"
            },
            {
              $match: {
                $expr: {
                  $eq: ["$records.student", "$$studentId"]
                }
              }
            },
            {
              $lookup: {
                from: "classes",
                localField: "class",
                foreignField: "_id",
                as: "classInfo"
              }
            },
            {
              $lookup: {
                from: "teachers",
                localField: "teacher",
                foreignField: "_id",
                as: "teacherInfo"
              }
            },
            {
              $project: {
                date: 1,
                status: "$records.status",
                remarks: "$records.remarks",
                className: { $arrayElemAt: ["$classInfo.name", 0] },
                teacherName: { $arrayElemAt: ["$teacherInfo.name", 0] }
              }
            },
            {
              $sort: { date: -1 }
            }
          ],
          as: "attendance"
        }
      },

      {
        $lookup: {
          from: "assessments",
          let: { studentClass: "$class" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$class", "$$studentClass"] },
                    { $eq: ["$type", "Assignment"] }
                  ]
                }
              }
            },
            {
              $lookup: {
                from: "teachers",
                localField: "teacher",
                foreignField: "_id",
                as: "teacherInfo"
              }
            },
            {
              $lookup: {
                from: "classes",
                localField: "class",
                foreignField: "_id",
                as: "classInfo"
              }
            },
            {
              $project: {
                title: 1,
                description: 1,
                subject: 1,
                totalMarks: 1,
                dateAssigned: 1,
                dueDate: 1,
                attachments: 1,
                teacherName: { $arrayElemAt: ["$teacherInfo.name", 0] },
                className: { $arrayElemAt: ["$classInfo.name", 0] }
              }
            },
            {
              $sort: { dueDate: 1 }
            }
          ],
          as: "assignments"
        }
      },

      {
        $project: {
          _id: 1,
          name: "$studentName",
          email: 1,
          phone: 1,
          dateOfBirth: 1,
          gender: 1,
          address: 1,
          class: 1,
          parent: {
            _id: 1,
            name: "$parent.fullName", 
            email: "$parent.email",
            phone: "$parent.phone",
            spouse: "$parent.spouse",
            spousePhone: "$parent.spousePhone",
            emergencyPhone: "$parent.emergencyPhone",
            identityNumber: "$parent.identityNumber"
          },
          attendance: 1,
          assignments: 1,
          enrollDate: 1, // Added enrollDate
          fee: 1, // Added fee
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]);

    if (!studentData || studentData.length === 0) {
      return new Response(
        JSON.stringify({ message: "Student not found." }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Student fetched successfully.",
        student: studentData[0]
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

