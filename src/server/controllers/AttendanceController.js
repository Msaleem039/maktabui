import Attendance from "../models/Attendance";
import Class from "../models/Class";
import Teacher from "../models/Teacher";
import Student from "../models/Student";

export const markAttendance = async (req) => {
  try {
    const body = await req.json();
    const { classId, teacherId, date, records } = body;

    if (!classId || !teacherId || !date || !records || !Array.isArray(records)) {
      return new Response(
        JSON.stringify({ success: false, message: "All fields are required" }),
        { status: 400 }
      );
    }

    const classExists = await Class.findById(classId);
    if (!classExists) {
      return new Response(
        JSON.stringify({ success: false, message: "Class not found" }),
        { status: 404 }
      );
    }

    const teacherExists = await Teacher.findById(teacherId);
    if (!teacherExists) {
      return new Response(
        JSON.stringify({ success: false, message: "Teacher not found" }),
        { status: 404 }
      );
    }

    for (const record of records) {
      if (!record.studentId || !record.status) {
        return new Response(
          JSON.stringify({ success: false, message: `Invalid record: ${JSON.stringify(record)}` }),
          { status: 400 }
        );
      }

      const studentExists = await Student.findById(record.studentId);
      if (!studentExists) {
        return new Response(
          JSON.stringify({ success: false, message: `Student not found: ${record.studentId}` }),
          { status: 404 }
        );
      }
    }

    let attendance = await Attendance.findOne({ classId, date });

    if (attendance) {
      attendance.records = records;
      attendance.teacherId = teacherId; 
      await attendance.save();

      return new Response(
        JSON.stringify({ success: true, message: "Attendance updated successfully", data: attendance }),
        { status: 200 }
      );
    } else {
      attendance = await Attendance.create({
        classId,
        teacherId,
        date,
        records,
      });

      return new Response(
        JSON.stringify({ success: true, message: "Attendance marked successfully", data: attendance }),
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error creating/updating attendance:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error", error: error.message }),
      { status: 500 }
    );
  }
};