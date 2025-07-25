const express= require( "express");
const mongoose =require( "mongoose");

const dotenv =require( "dotenv");
const cors =require( "cors");
const connectDB = require("./config/db");
const authRoutes= require( "./routes/authRoutes");
const courseRoutes =require( "./routes/courseRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const quizRoutes=require( "./routes/quizRoutes");
const adminRoutes = require( "./routes/adminRoutes");
const app = express();

dotenv.config();



const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);

app.use("/api/courses", courseRoutes);

app.use("/api/lessons", lessonRoutes);

app.use("/api/quizzes", quizRoutes);

app.use("/api/admin", adminRoutes);


app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});
