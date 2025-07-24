const express = require("express");
const router = express.Router();

const {
  createCourse,
  getAllCourses,
  getCourseById,
  enrollInCourse
} = require("../controllers/courseController");

const { protect, requireRole } = require("../middlewares/authMiddleware");


// Public
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

// Protected
router.post("/", protect, requireRole("instructor"), createCourse);
router.post("/:id/enroll", protect, requireRole("student"), enrollInCourse);


module.exports = router;