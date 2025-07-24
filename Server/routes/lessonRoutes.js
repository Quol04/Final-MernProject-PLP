const express = require("express");
const { 
  createLesson, 
  getLessonsByCourse, 
  markLessonComplete 
} = require("../controllers/lessonController");
const { protect, requireRole } = require("../middlewares/authMiddleware");
const upload = require("../utils/fileUploader");

const router = express.Router();

// Instructor uploads lesson with video
router.post("/", protect, requireRole("instructor"), upload.single("video"), createLesson);


// Get all lessons of a course (students + instructors)
router.get("/:courseId", protect, getLessonsByCourse);

// Mark lesson as complete
router.post("/complete", protect, markLessonComplete);

module.exports = router;



