# 🎓 Online Learning Platform

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for online course management and learning.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Usage Guide](#-usage-guide)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## ✨ Features

- 🔐 **User Authentication** - Registration and login system
- 👥 **Role-based Access** - Students, Instructors, and Admins
- 📚 **Course Management** - Create, read, update, and delete courses
- 📝 **User Enrollment** - Students can enroll in courses
- 🔒 **Secure Routes** - JWT-based authentication
- 🌐 **RESTful API** - Clean and organized API structure

---
## 🛠️ Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

---

### Tools

- **Nodemon** - Development server auto-restart

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **npm** or **yarn** - Package manager (comes with Node.js)
- **Git** - Version control

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/Quol04/Final-MernProject-PLP.git
cd Final-MernProject-PLP
```

### Step 2: Install Server Dependencies

```bash
cd Server
npm install
```

### Step 3: Install Frontend Dependencies (when frontend is added)

```bash
cd ../client
npm install
```

---

## 🔧 Environment Setup

### Create Environment Variables

1. In the `Server` folder, create a `.env` file:

```bash
cd Server
touch .env    # On Windows: type nul > .env
```

2. Add the following environment variables to your `.env` file:

```env
# Database
MONGO_URI=mongodb://localhost:27017/online-learning-platform
# For MongoDB Atlas, use: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

# JWT Secret (use a strong, random string)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Server Port
PORT=5000
```

### MongoDB Setup Options

#### Option 1: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use: `MONGO_URI=mongodb://localhost:27017/online-learning-platform`

#### Option 2: MongoDB Atlas (Recommended)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Replace `<username>`, `<password>`, and `<database>` in the connection string

## 🏃‍♂️ Running the Application

### Start the Backend Server

```bash
cd Server
npm run dev    # Development mode with nodemon
# OR
npm start      # Production mode
```

The server will start on `http://localhost:5000`

### Start the Frontend (when available)

```bash
cd client
npm start
```

The frontend will start on `http://localhost:3000`

## 🔌 API Endpoints

### Authentication Routes

| Method | Endpoint             | Description       | Body                              |
| ------ | -------------------- | ----------------- | --------------------------------- |
| POST   | `/api/auth/register` | Register new user | `{ name, email, password, role }` |
| POST   | `/api/auth/login`    | User login        | `{ email, password }`             |

### Course Routes

| Method | Endpoint        | Description     | Authentication |
| ------ | --------------- | --------------- | -------------- |
| GET    | `/api/courses/` | Get all courses | Optional       |

### Example API Requests

#### Register a New User

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

#### Login

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

## 📁 Project Structure

```
Final-MernProject-PLP/
│
├── README.md
├── Server/
│   ├── package.json
│   ├── server.js                 # Main server file
│   ├── .env                      # Environment variables
│   │
│   ├── config/
│   │   └── db.js                 # Database connection
│   │
│   ├── controllers/
│   │   └── authControllers.js    # Authentication logic
│   │
│   ├── middlewares/
│   │   └── authMiddleware.js     # JWT authentication middleware
│   │
│   ├── models/
│   │   └── User.js               # User data model
│   │
│   └── routes/
│       ├── authRoutes.js         # Authentication routes
│       └── courseRoutes.js       # Course routes
│
└── client/ (Frontend - to be added)
    ├── src/
    ├── public/
    └── package.json
```

## 📖 Usage Guide

### For Students

1. Register with role "student"
2. Login to receive JWT token
3. Browse available courses
4. Enroll in courses

### For Instructors

1. Register with role "instructor"
2. Login to receive JWT token
3. Create and manage courses
4. View enrolled students

### For Admins

1. Register with role "admin"
2. Login to receive JWT token
3. Manage all users and courses
4. Access admin dashboard

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use

```bash
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:** Change the PORT in your `.env` file or kill the process using the port:

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill
```

#### MongoDB Connection Error

```bash
MongoNetworkError: failed to connect to server
```

**Solutions:**

1. Make sure MongoDB is running locally
2. Check your `MONGO_URI` in `.env`
3. Verify network connectivity for Atlas

#### JWT Authentication Error

```bash
JsonWebTokenError: invalid signature
```

**Solution:** Make sure your `JWT_SECRET` is consistent and not empty

#### Missing Dependencies

```bash
Cannot find module 'express'
```

**Solution:** Install dependencies:

```bash
cd Server
npm install
```

### Environment Issues

#### .env File Not Loading

- Make sure `.env` is in the `Server` folder
- Check file name (no extra extensions)
- Verify `dotenv.config()` is called in server.js

### Database Issues

#### MongoDB Atlas Connection

1. Whitelist your IP address
2. Check username/password
3. Ensure network access is configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 Development Scripts

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Run tests (when added)
npm test
```

## 🔒 Security Notes

- Never commit `.env` files to version control
- Use strong JWT secrets in production
- Validate all user inputs
- Implement rate limiting for production
- Use HTTPS in production

## 📞 Support

If you encounter any issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review console logs for error messages
3. Verify all environment variables are set correctly
4. Ensure all dependencies are installed

---

**Happy Learning! 🎓**

> This project is part of a MERN stack learning journey. Feel free to contribute and improve!
