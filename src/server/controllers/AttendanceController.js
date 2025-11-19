import Attendance from "../models/Attendance";
import Class from "../models/Class";
import Teacher from "../models/Teacher";

export const markAttendance = async (req) => {
  try {
    const body = await req.json();
    const { classId, teacherId, date, records } = body;

    if (!classId || !teacherId || !date || !records) {
      return new Response(
        JSON.stringify({ message: "classId, teacherId, date, and records are required" }),
        { status: 400 }
      );
    }

    const foundClass = await Class.findById(classId);
    if (!foundClass)
      return new Response(JSON.stringify({ message: "Class not found" }), { status: 404 });

    const foundTeacher = await Teacher.findById(teacherId);
    if (!foundTeacher)
      return new Response(JSON.stringify({ message: "Teacher not found" }), { status: 404 });

    const existing = await Attendance.findOne({ class: classId, date: new Date(date) });
    if (existing)
      return new Response(JSON.stringify({ message: "Attendance already marked for this date" }), {
        status: 400,
      });

    const attendance = new Attendance({
      class: classId,
      teacher: teacherId,
      date,
      records,
    });

    await attendance.save();

    foundTeacher.attendanceRecords.push(attendance._id);
    await foundTeacher.save();

    return new Response(
      JSON.stringify({
        message: "Attendance recorded successfully",
        attendance,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error marking attendance:", error);
    return new Response(
      JSON.stringify({ message: "Server error", error: error.message }),
      { status: 500 }
    );
  }
};
