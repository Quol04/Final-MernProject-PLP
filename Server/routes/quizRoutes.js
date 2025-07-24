const express = require("express");
const { createQuiz, getQuizByLesson, submitQuiz } = require("../controllers/quizController");
const { protect, requireRole } = require("../middlewares/authMiddleware");

const router = express.Router();

// Create quiz (instructor)
router.post("/", protect, requireRole("instructor"), createQuiz);

// Get quiz for a lesson
router.get("/:lessonId", protect, getQuizByLesson);

// Submit quiz answers
router.post("/:lessonId/submit", protect, submitQuiz);


module.exports = router;