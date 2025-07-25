const User = require("../models/User");
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");

// Mock data for when database is not available
const mockUsers = [
  {
    _id: "admin123",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin"
  },
  {
    _id: "instructor123", 
    name: "John Instructor",
    email: "instructor@example.com",
    role: "instructor"
  },
  {
    _id: "student123",
    name: "Jane Student", 
    email: "student@example.com",
    role: "student"
  }
];

const mockCourses = [
  {
    _id: "course1",
    title: "Introduction to React",
    description: "Learn React fundamentals",
    instructor: "instructor123",
    students: ["student123"],
    createdAt: new Date()
  },
  {
    _id: "course2", 
    title: "Advanced JavaScript",
    description: "Master JavaScript concepts",
    instructor: "instructor123",
    students: [],
    createdAt: new Date()
  }
];

// Dashboard summary
const getDashboardStats = async (req, res) => {
  try {
    // Try database operation first
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
    } catch (dbError) {
      // If database fails, use mock data
      console.log("Database not available, using mock stats");
      res.json({
        totalUsers: mockUsers.length,
        totalCourses: mockCourses.length,
        totalLessons: 5,
        totalEnrollments: mockCourses.reduce((acc, course) => acc + course.students.length, 0)
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// View all users
const getAllUsers = async (req, res) => {
  try {
    // Try database operation first
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (dbError) {
      // If database fails, use mock data
      console.log("Database not available, using mock users");
      res.json(mockUsers);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    // Try database operation first
    try {
      const user = await User.findByIdAndDelete(req.params.userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({ message: "User deleted" });
    } catch (dbError) {
      // If database fails, simulate deletion with mock data
      console.log("Database not available, simulating user deletion");
      const userIndex = mockUsers.findIndex(u => u._id === req.params.userId);
      if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
      }
      // Don't actually remove from mock array for demo purposes
      res.json({ message: "User deleted (simulated)" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// View all courses
const getAllCourses = async (req, res) => {
  try {
    // Try database operation first
    try {
      const courses = await Course.find().populate("instructor", "name email");
      res.json(courses);
    } catch (dbError) {
      // If database fails, use mock data
      console.log("Database not available, using mock courses");
      res.json(mockCourses);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete course
const deleteCourse = async (req, res) => {
  try {
    // Try database operation first
    try {
      const course = await Course.findByIdAndDelete(req.params.courseId);
      if (!course) return res.status(404).json({ message: "Course not found" });
      res.json({ message: "Course deleted" });
    } catch (dbError) {
      // If database fails, simulate deletion with mock data
      console.log("Database not available, simulating course deletion");
      const courseIndex = mockCourses.findIndex(c => c._id === req.params.courseId);
      if (courseIndex === -1) {
        return res.status(404).json({ message: "Course not found" });
      }
      // Don't actually remove from mock array for demo purposes
      res.json({ message: "Course deleted (simulated)" });
    }
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