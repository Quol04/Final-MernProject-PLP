const express = require("express");
const router = express.Router();

const {
  createCourse,
  getAllCourses,
  getCourseById,
  enrollInCourse,
  deleteCourse,
  getInstructorCourses,
  updateCourse,
  toggleCoursePublish
} = require("../controllers/courseController");

const { protect, requireRole } = require("../middlewares/authMiddleware");


// Public
router.get("/", getAllCourses);

// Protected - Instructor routes (must come before /:id route)
router.get("/instructor/my-courses", protect, requireRole("instructor"), getInstructorCourses);
router.post("/", protect, requireRole("instructor"), createCourse);
router.put("/:id", protect, requireRole("instructor"), updateCourse);
router.patch("/:id", protect, requireRole("instructor"), updateCourse); // Allow PATCH for partial updates
router.patch("/:id/publish", protect, requireRole("instructor"), toggleCoursePublish);
router.delete("/:id", protect, requireRole("instructor"), deleteCourse);

// Public (must come after specific routes)
router.get("/:id", getCourseById);

// Protected - Student routes
router.post("/:id/enroll", protect, requireRole("student"), enrollInCourse);


module.exports = router;