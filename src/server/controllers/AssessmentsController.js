import Assessment from "../models/Assessments";
import Class from "../models/Class";
import Teacher from "../models/Teacher";

export const createAssessment = async (req) => {
  try {
    const { title, description, type, subject, classId, teacherId, totalMarks, dueDate, attachments } = await req.json();

    const classExists = await Class.findById(classId);
    const teacherExists = await Teacher.findById(teacherId);

    if (!classExists || !teacherExists) {
      return new Response(
        JSON.stringify({ message: "Class or Teacher not found" }),
        { status: 404 }
      );
    }

    const newAssessment = await Assessment.create({
      title,
      description,
      type,
      subject,
      class: classId,
      teacher: teacherId,
      totalMarks,
      dueDate,
      attachments,
    });

    return new Response(
      JSON.stringify({
        message: "Assessment created successfully",
        assessment: newAssessment,
      }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
};

export const getAssessments = async (req) => {
  try {
    const { assessmentId } = await req.json();

    if (assessmentId) {
      const assessment = await Assessment.findById(assessmentId)
        .populate("class", "name code")
        .populate("teacher", "fullName email");

      if (!assessment)
        return new Response(JSON.stringify({ message: "Assessment not found" }), { status: 404 });

      return new Response(
        JSON.stringify({
          message: "Assessment fetched successfully",
          assessment,
        }),
        { status: 200 }
      );
    }

    const assessments = await Assessment.find()
      .populate("class", "name code")
      .populate("teacher", "fullName email");

    return new Response(
      JSON.stringify({
        message: "All assessments fetched successfully",
        assessments,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
};
