const User = require("../models/User.js");
const Course = require("../models/Course.js");
const Lesson = require("../models/Lesson.js");

// Dashboard summary
 const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalLessons = await Lesson.countDocuments();

    const totalEnrollments = await Course.aggregate([
      { $unwind: "$students" },
      { $count: "enrollments" }
    ]);

    res.json({
      totalUsers,
      totalCourses,
      totalLessons,
      totalEnrollments: totalEnrollments[0]?.enrollments || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// View all users
 const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete user
 const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// View all courses
 const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name email");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete course
 const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllCourses,
  deleteCourse
};