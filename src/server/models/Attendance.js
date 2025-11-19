const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
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
    date: {
      type: Date,
      required: true,
    },
    records: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
          required: true,
        },
        status: {
          type: String,
          enum: ["Present", "Absent", "Late", "Excused"],
          default: "Absent",
        },
        remarks: {
          type: String,
          default: "",
        },
      },
    ],
  },
  { timestamps: true }
);

export default  mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
