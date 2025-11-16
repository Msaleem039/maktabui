import Timetable from "../models/TimeTable";
import Class from "../models/Class";
import Teacher from "../models/Teacher";

export const createTimetable = async (req) => {
  try {
    const body = await req.json();
    const { classId, teacherId, dayOfWeek, startTime, endTime, subject, topic } = body;

    if (!classId || !teacherId || !dayOfWeek || !startTime || !endTime) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    const foundClass = await Class.findById(classId);
    if (!foundClass)
      return new Response(JSON.stringify({ message: "Class not found" }), { status: 404 });

    const foundTeacher = await Teacher.findById(teacherId);
    if (!foundTeacher)
      return new Response(JSON.stringify({ message: "Teacher not found" }), { status: 404 });

    const conflict = await Timetable.findOne({
      teacher: teacherId,
      dayOfWeek,
      startTime,
      endTime,
    });
    if (conflict)
      return new Response(JSON.stringify({ message: "Timetable conflict detected" }), {
        status: 400,
      });

    const timetable = new Timetable({
      class: classId,
      teacher: teacherId,
      dayOfWeek,
      startTime,
      endTime,
      subject,
      topic,
    });

    await timetable.save();

    foundTeacher.timetable.push(timetable._id);
    await foundTeacher.save();

    return new Response(
      JSON.stringify({
        message: "Timetable created successfully",
        timetable,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating timetable:", error);
    return new Response(
      JSON.stringify({ message: "Server error", error: error.message }),
      { status: 500 }
    );
  }
};
