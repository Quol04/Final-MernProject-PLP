const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["student", "instructor", "admin"], default: "student" },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]
}, { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
