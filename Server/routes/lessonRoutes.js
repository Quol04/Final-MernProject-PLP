const express = require( "express");
const { createLesson, getLessonsByCourse } = require( "../controllers/lessonController.js");
const { protect, requireRole } = require( "../middleware/authMiddleware.js");
const upload = require( "../utils/fileUploader.js");
const { markLessonComplete } = require( "../controllers/lessonController.js");

const router = express.Router();

// Instructor uploads lesson with video
router.post("/", protect, requireRole("instructor"), upload.single("video"), createLesson);


// Get all lessons of a course (students + instructors)
router.get("/:courseId", protect, getLessonsByCourse);

// Mark lesson as complete
router.post("/complete", protect, markLessonComplete);

module.exports = router;



