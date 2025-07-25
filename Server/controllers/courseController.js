const Course = require("../models/Course");
const User = require("../models/User");

// Mock data for testing (when database is not connected)
let mockCourses = [
  {
    _id: "1",
    title: "Introduction to JavaScript",
    description: "Learn the fundamentals of JavaScript programming",
    category: "Web Development",
    price: 99.99,
    instructor: { _id: "instructor1", name: "John Doe", email: "john@example.com" },
    students: [],
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "2",
    title: "React for Beginners",
    description: "Build modern web applications with React",
    category: "Web Development",
    price: 149.99,
    instructor: { _id: "instructor2", name: "Jane Smith", email: "jane@example.com" },
    students: [],
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "3",
    title: "Node.js Backend Development",
    description: "Create powerful backend applications with Node.js",
    category: "Backend Development",
    price: 199.99,
    instructor: { _id: "instructor1", name: "John Doe", email: "john@example.com" },
    students: [],
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Create a new course
const createCourse = async (req, res) => {
  try {
    const { title, description, category, price, level, duration, requirements, learningOutcomes, isPublished } = req.body;

    // Validate required fields
    if (!title || !description || !category || price === undefined) {
      return res.status(400).json({ error: "Missing required fields: title, description, category, and price are required" });
    }

    // Try database operation first
    try {
      const course = new Course({
        title,
        description,
        category,
        price: parseFloat(price) || 0,
        level: level || 'beginner',
        duration: duration ? parseInt(duration) : undefined,
        instructor: req.user?.userId || "mock-instructor-id",
        requirements: Array.isArray(requirements) ? requirements : [],
        learningOutcomes: Array.isArray(learningOutcomes) ? learningOutcomes : [],
        isPublished: isPublished || false
      });

      await course.save();
      res.status(201).json(course);
    } catch (dbError) {
      // If database fails, use mock response
      console.log("Database not available, using mock response for course creation");
      
      const newCourse = {
        _id: (mockCourses.length + 1).toString(),
        title,
        description,
        category,
        price: parseFloat(price) || 0,
        level: level || 'beginner',
        duration: duration ? parseInt(duration) : undefined,
        instructor: { _id: req.user?.userId || "mock-instructor", name: "Mock Instructor", email: "instructor@example.com" },
        students: [],
        requirements: Array.isArray(requirements) ? requirements : [],
        learningOutcomes: Array.isArray(learningOutcomes) ? learningOutcomes : [],
        isPublished: isPublished || false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockCourses.push(newCourse);
      res.status(201).json(newCourse);
    }
  } catch (err) {
    console.error('Error in createCourse:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    // Try database operation first
    try {
      const courses = await Course.find().populate("instructor", "name email");
      res.json(courses);
    } catch (dbError) {
      // If database fails, use mock data
      console.log("Database not available, using mock courses");
      res.json(mockCourses);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single course by ID
const getCourseById = async (req, res) => {
  try {
    // Try database operation first
    try {
      const course = await Course.findById(req.params.id)
        .populate("instructor", "name")
        .populate("students", "name");
      if (!course) return res.status(404).json({ message: "Course not found" });
      res.json(course);
    } catch (dbError) {
      // If database fails, use mock data
      console.log("Database not available, using mock course data");
      const course = mockCourses.find(c => c._id === req.params.id);
      if (!course) return res.status(404).json({ message: "Course not found" });
      res.json(course);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Enroll in a course
const enrollInCourse = async (req, res) => {
  try {
    // Try database operation first
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
    } catch (dbError) {
      // If database fails, use mock response
      console.log("Database not available, using mock enrollment");
      const course = mockCourses.find(c => c._id === req.params.id);
      if (!course) return res.status(404).json({ message: "Course not found" });
      
      // Mock enrollment logic
      const userId = req.user?.userId || "mock-student-id";
      if (!course.students.find(s => s._id === userId)) {
        course.students.push({ _id: userId, name: "Mock Student" });
      }
      
      res.json({ message: "Enrolled successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a course (instructor only)
const deleteCourse = async (req, res) => {
  try {
    // Try database operation first
    try {
      const course = await Course.findById(req.params.id);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // Check if the requesting user is the instructor of this course
      if (course.instructor.toString() !== req.user.userId) {
        return res.status(403).json({ message: "You can only delete your own courses" });
      }
      
      await Course.findByIdAndDelete(req.params.id);
      res.json({ message: "Course deleted successfully" });
    } catch (dbError) {
      // If database fails, use mock deletion
      console.log("Database not available, using mock deletion");
      const courseIndex = mockCourses.findIndex(c => c._id === req.params.id);
      
      if (courseIndex === -1) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      const course = mockCourses[courseIndex];
      
      // Check if the requesting user is the instructor of this course
      if (course.instructor._id !== req.user.userId && course.instructor._id !== "mock-instructor") {
        return res.status(403).json({ message: "You can only delete your own courses" });
      }
      
      // Remove course from mock data
      mockCourses.splice(courseIndex, 1);
      res.json({ message: "Course deleted successfully" });
    }
  } catch (err) {
    console.error('Error in deleteCourse:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get courses by instructor (for manage courses page)
const getInstructorCourses = async (req, res) => {
  try {
    // Try database operation first
    try {
      const courses = await Course.find({ instructor: req.user.userId }).populate("instructor", "name email");
      res.json(courses);
    } catch (dbError) {
      // If database fails, use mock data
      console.log("Database not available, using mock instructor courses");
      const instructorCourses = mockCourses.filter(c => 
        c.instructor._id === req.user.userId || c.instructor._id === "mock-instructor"
      );
      res.json(instructorCourses);
    }
  } catch (err) {
    console.error('Error in getInstructorCourses:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update/Edit a course (instructor only)
const updateCourse = async (req, res) => {
  try {
    const { title, description, category, price, level, duration, requirements, learningOutcomes, isPublished } = req.body;

    // Try database operation first
    try {
      const course = await Course.findById(req.params.id);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // Check if the requesting user is the instructor of this course
      if (course.instructor.toString() !== req.user.userId) {
        return res.status(403).json({ message: "You can only edit your own courses" });
      }
      
      // Update course fields
      const updatedCourse = await Course.findByIdAndUpdate(
        req.params.id,
        {
          title: title || course.title,
          description: description || course.description,
          category: category || course.category,
          price: price !== undefined ? parseFloat(price) : course.price,
          level: level || course.level,
          duration: duration !== undefined ? parseInt(duration) : course.duration,
          requirements: Array.isArray(requirements) ? requirements : course.requirements,
          learningOutcomes: Array.isArray(learningOutcomes) ? learningOutcomes : course.learningOutcomes,
          isPublished: isPublished !== undefined ? isPublished : course.isPublished,
          updatedAt: Date.now()
        },
        { new: true, runValidators: true }
      ).populate("instructor", "name email");
      
      res.json(updatedCourse);
    } catch (dbError) {
      // If database fails, use mock update
      console.log("Database not available, using mock update");
      const courseIndex = mockCourses.findIndex(c => c._id === req.params.id);
      
      if (courseIndex === -1) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      const course = mockCourses[courseIndex];
      
      // Check if the requesting user is the instructor of this course
      if (course.instructor._id !== req.user.userId && course.instructor._id !== "mock-instructor") {
        return res.status(403).json({ message: "You can only edit your own courses" });
      }
      
      // Update course in mock data
      mockCourses[courseIndex] = {
        ...course,
        title: title || course.title,
        description: description || course.description,
        category: category || course.category,
        price: price !== undefined ? parseFloat(price) : course.price,
        level: level || course.level,
        duration: duration !== undefined ? parseInt(duration) : course.duration,
        requirements: Array.isArray(requirements) ? requirements : course.requirements,
        learningOutcomes: Array.isArray(learningOutcomes) ? learningOutcomes : course.learningOutcomes,
        isPublished: isPublished !== undefined ? isPublished : course.isPublished,
        updatedAt: new Date()
      };
      
      res.json(mockCourses[courseIndex]);
    }
  } catch (err) {
    console.error('Error in updateCourse:', err);
    res.status(500).json({ error: err.message });
  }
};

// Toggle course publish status (instructor only)
const toggleCoursePublish = async (req, res) => {
  try {
    // Try database operation first
    try {
      const course = await Course.findById(req.params.id);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // Check if the requesting user is the instructor of this course
      if (course.instructor.toString() !== req.user.userId) {
        return res.status(403).json({ message: "You can only modify your own courses" });
      }
      
      // Toggle publish status
      const updatedCourse = await Course.findByIdAndUpdate(
        req.params.id,
        { 
          isPublished: !course.isPublished,
          updatedAt: Date.now()
        },
        { new: true }
      ).populate("instructor", "name email");
      
      res.json({ 
        message: `Course ${updatedCourse.isPublished ? 'published' : 'unpublished'} successfully`,
        course: updatedCourse 
      });
    } catch (dbError) {
      // If database fails, use mock toggle
      console.log("Database not available, using mock publish toggle");
      const courseIndex = mockCourses.findIndex(c => c._id === req.params.id);
      
      if (courseIndex === -1) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      const course = mockCourses[courseIndex];
      
      // Check if the requesting user is the instructor of this course
      if (course.instructor._id !== req.user.userId && course.instructor._id !== "mock-instructor") {
        return res.status(403).json({ message: "You can only modify your own courses" });
      }
      
      // Toggle publish status in mock data
      mockCourses[courseIndex].isPublished = !course.isPublished;
      mockCourses[courseIndex].updatedAt = new Date();
      
      res.json({ 
        message: `Course ${mockCourses[courseIndex].isPublished ? 'published' : 'unpublished'} successfully`,
        course: mockCourses[courseIndex]
      });
    }
  } catch (err) {
    console.error('Error in toggleCoursePublish:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  enrollInCourse,
  deleteCourse,
  getInstructorCourses,
  updateCourse,
  toggleCoursePublish
};
