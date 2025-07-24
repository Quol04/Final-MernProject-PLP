const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
const User = require("../models/User");

const createLesson = async (req, res) => {
  try {
    const { title, content, courseId } = req.body;
    const videoUrl = req.file?.path;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const lesson = new Lesson({
      title,
      content,
      videoUrl,
      course: courseId
    });

    await lesson.save();

    // Add lesson to course
    course.lessons.push(lesson._id);
    await course.save();

    res.status(201).json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all lessons of a course
const getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const lessons = await Lesson.find({ course: courseId });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//mark lesson as complete
const markLessonComplete = async (req, res) => {
  try {
    const { lessonId } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user.completedLessons.includes(lessonId)) {
      user.completedLessons.push(lessonId);
      await user.save();
    }

    res.json({ message: "Lesson marked complete" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createLesson,
  getLessonsByCourse,
  markLessonComplete
};

