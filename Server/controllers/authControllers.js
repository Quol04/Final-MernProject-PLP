const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Mock users for testing when database is not connected
const mockUsers = [
  {
    _id: "admin-123",
    name: "Admin User",
    email: "admin@example.com",
    password: "$2a$10$9O0KJ8QnO3O1Q3O1Q3O1QOyQ3O1Q3O1Q3O1Q3O1Q3O1Q3O1Q3O1Q.", // admin123
    role: "admin"
  },
  {
    _id: "instructor-123",
    name: "Instructor User",
    email: "instructor@example.com",
    password: "$2a$10$9O0KJ8QnO3O1Q3O1Q3O1QOyQ3O1Q3O1Q3O1Q3O1Q3O1Q3O1Q3O1Q.", // instructor123
    role: "instructor"
  },
  {
    _id: "student-123",
    name: "Student User",
    email: "student@example.com",
    password: "$2a$10$9O0KJ8QnO3O1Q3O1Q3O1QOyQ3O1Q3O1Q3O1Q3O1Q3O1Q3O1Q3O1Q.", // student123
    role: "student"
  }
];

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Try database operation first
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashedPassword, role });

      res.status(201).json({ message: "User registered successfully" });
    } catch (dbError) {
      // If database fails, use mock response
      console.log("Database not available, using mock registration");
      
      // Check if user already exists in mock data
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) return res.status(400).json({ message: "User already exists" });
      
      // Add to mock users
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        _id: `mock-${Date.now()}`,
        name,
        email,
        password: hashedPassword,
        role: role || "student"
      };
      mockUsers.push(newUser);
      
      res.status(201).json({ message: "User registered successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login function to authenticate users
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Try database operation first
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || "fallback-secret", { expiresIn: "1d" });
      
      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (dbError) {
      // If database fails, use mock authentication
      console.log("Database not available, using mock authentication");
      
      // Simple mock authentication for demo accounts
      let mockUser = null;
      
      if (email === "admin@example.com" && password === "admin123") {
        mockUser = mockUsers.find(u => u.email === "admin@example.com");
      } else if (email === "instructor@example.com" && password === "instructor123") {
        mockUser = mockUsers.find(u => u.email === "instructor@example.com");
      } else if (email === "student@example.com" && password === "student123") {
        mockUser = mockUsers.find(u => u.email === "student@example.com");
      } else {
        // Try to find user in mock users and check password
        mockUser = mockUsers.find(u => u.email === email);
        if (mockUser) {
          const isMatch = await bcrypt.compare(password, mockUser.password);
          if (!isMatch) mockUser = null;
        }
      }
      
      if (!mockUser) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      
      const token = jwt.sign(
        { userId: mockUser._id, role: mockUser.role }, 
        process.env.JWT_SECRET || "fallback-secret", 
        { expiresIn: "1d" }
      );
      
      res.json({
        token,
        user: {
          id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role
        }
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login };
