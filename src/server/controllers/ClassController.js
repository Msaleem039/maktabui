import Class from "../models/Class";
import Teacher from "../models/Teacher";

export const createClass = async (req) => {
  try {
    const body = await req.json();
        
    const { name, code, subject, description, teacherId, startDate, endDate } = body;
        
    if (!teacherId || !name || !subject) {
      console.log("Missing fields:", { 
        teacherId: !!teacherId, 
        name: !!name, 
        subject: !!subject 
      });
      return new Response(
        JSON.stringify({ message: "Teacher, name, and subject are required" }),
        { status: 400 }
      );
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return new Response(JSON.stringify({ message: "Teacher not found" }), { status: 404 });
    }

    const newClass = new Class({
      name,
      code,
      subject,
      description,
      teacherId,
      startDate,
      endDate,
    });

    await newClass.save();

    teacher.assignedClasses.push(newClass._id);
    await teacher.save();

    return new Response(
      JSON.stringify({
        message: "Class created successfully",
        class: newClass,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating class:", error);
    return new Response(
      JSON.stringify({ message: "Server error", error: error.message }),
      { status: 500 }
    );
  }
};

export const getAllClassesName = async () => {
  try {
    const classes = await Class.find({}, { _id: 1, name: 1 }); 

    if (!classes || classes.length === 0) {
      return new Response(
        JSON.stringify({ message: "No classes found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Classes fetched successfully",
        classes,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching classes:", error);
    return new Response(
      JSON.stringify({ message: "Server error", error: error.message }),
      { status: 500 }
    );
  }
};

export const getAllClasses = async () => {
  try {
    const classes = await Class.find({}).sort({ createdAt: -1 });

    if (!classes || classes.length === 0) {
      return new Response(
        JSON.stringify({ message: "No classes found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Classes fetched successfully",
        classes,
        count: classes.length,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching classes:", error);
    return new Response(
      JSON.stringify({ message: "Server error", error: error.message }),
      { status: 500 }
    );
  }
};

