const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["student", "instructor", "admin"], default: "student" },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
  quizResults: [
  {
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
    score: Number,
    total: Number
  }
  ]

}, { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
