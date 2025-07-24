const Quiz =require( "../models/Quiz.js");
const Lesson =require( "../models/Lesson.js");

// Create quiz (instructor only)
export const createQuiz = async (req, res) => {
  try {
    const { lessonId, questions } = req.body;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const quiz = new Quiz({ lesson: lessonId, questions });
    await quiz.save();

    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get quiz for a lesson
export const getQuizByLesson = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ lesson: req.params.lessonId });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Submit quiz answers
export const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body; // array of { questionIndex, selectedAnswer }
    const quiz = await Quiz.findOne({ lesson: req.params.lessonId });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let score = 0;
    quiz.questions.forEach((q, index) => {
      const userAnswer = answers.find((a) => a.questionIndex === index);
      if (userAnswer && userAnswer.selectedAnswer === q.correctAnswer) {
        score++;
      }
    });

    res.json({
      message: "Quiz submitted",
      total: quiz.questions.length,
      correct: score
    });
    ///modify the quizes
    //gtgdhjhsdvgggcfdhdgj
    const user = await User.findById(req.user.userId);
    const existing = user.quizResults.find(q => q.lesson.toString() === quiz.lesson.toString());

    if (!existing) {
    user.quizResults.push({
    lesson: quiz.lesson,
    score,
    total: quiz.questions.length
    });
    await user.save();
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


