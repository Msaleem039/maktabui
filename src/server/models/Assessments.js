import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    type: {
      type: String,
      enum: ["Quiz", "Exam", "Assignment", "Project", "Other"],
      default: "Exam",
    },
    subject: { type: String, required: true },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    totalMarks: { type: Number, required: true },
    dateAssigned: { type: Date, default: Date.now },
    dueDate: { type: Date },
    attachments: [String], 
  },
  { timestamps: true }
);

export default mongoose.models.Assessment || mongoose.model("Assessment", assessmentSchema);
