import Grade from "../models/Grade";
import Student from "../models/Student";
import Assessment from "../models/Assessments";

export const createGrade = async (req) => {
  try {
    const { assessmentId, studentId, marksObtained, gradedBy, feedback } = await req.json();

    const assessment = await Assessment.findById(assessmentId);
    const student = await Student.findById(studentId);

    if (!assessment || !student) {
      return new Response(
        JSON.stringify({ message: "Assessment or Student not found" }),
        { status: 404 }
      );
    }

    const percentage = (marksObtained / assessment.totalMarks) * 100;
    let gradeLetter;
    if (percentage >= 90) gradeLetter = "A+";
    else if (percentage >= 80) gradeLetter = "A";
    else if (percentage >= 70) gradeLetter = "B+";
    else if (percentage >= 60) gradeLetter = "B";
    else if (percentage >= 50) gradeLetter = "C";
    else if (percentage >= 40) gradeLetter = "D";
    else gradeLetter = "F";

    const newGrade = await Grade.create({
      assessment: assessmentId,
      student: studentId,
      marksObtained,
      gradedBy,
      feedback,
      grade: gradeLetter,
      status: "Graded",
    });

    return new Response(
      JSON.stringify({
        message: "Grade created successfully",
        grade: newGrade,
      }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
};

export const getGrades = async (req) => {
  try {
    const { gradeId, studentId } = await req.json();

    if (gradeId) {
      const grade = await Grade.findById(gradeId)
        .populate("assessment", "title subject totalMarks")
        .populate("student", "studentName email")
        .populate("gradedBy", "fullName");

      if (!grade)
        return new Response(JSON.stringify({ message: "Grade not found" }), { status: 404 });

      return new Response(
        JSON.stringify({
          message: "Grade fetched successfully",
          grade,
        }),
        { status: 200 }
      );
    }

    if (studentId) {
      const grades = await Grade.find({ student: studentId })
        .populate("assessment", "title subject totalMarks")
        .populate("gradedBy", "fullName");

      return new Response(
        JSON.stringify({
          message: "Grades for student fetched successfully",
          grades,
        }),
        { status: 200 }
      );
    }

    const grades = await Grade.find()
      .populate("assessment", "title subject totalMarks")
      .populate("student", "studentName email")
      .populate("gradedBy", "fullName");

    return new Response(
      JSON.stringify({
        message: "All grades fetched successfully",
        grades,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
};
