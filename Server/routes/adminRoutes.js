const express = require("express");
const {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllCourses,
  deleteCourse
} = require("../controllers/adminController");
const { protect, requireRole } = require("../middlewares/authMiddleware");

const router = express.Router();

// Protect all admin routes
router.use(protect, requireRole("admin"));

// Summary stats
router.get("/stats", getDashboardStats);

// Users
router.get("/users", getAllUsers);
router.delete("/users/:userId", deleteUser);

// Courses
router.get("/courses", getAllCourses);
router.delete("/courses/:courseId", deleteCourse);

module.exports = router;
