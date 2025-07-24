import User from "../models/User.js";


// Get user progress including completed lessons and quiz results

export const getUserProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate("completedLessons", "title course")
      .populate("quizResults.lesson", "title course");

    res.json({
      completedLessons: user.completedLessons,
      quizResults: user.quizResults
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
