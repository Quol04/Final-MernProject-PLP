const Course = require("../models/Course");
const User = require("../models/User");

// Create a new course
const createCourse = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;

    const course = new Course({
      title,
      description,
      category,
      price,
      instructor: req.user.userId
    });

    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name email");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name")
      .populate("students", "name");
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Enroll in a course
const enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    const user = await User.findById(req.user.userId);

    if (!course || !user) return res.status(404).json({ message: "Course or user not found" });

    if (course.students.includes(user._id)) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    course.students.push(user._id);
    user.enrolledCourses.push(course._id);

    await course.save();
    await user.save();

    res.json({ message: "Enrolled successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  enrollInCourse
};
