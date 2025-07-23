const express= require( "express");
const mongoose =require( "mongoose");

const dotenv =require( "dotenv");
const cors =require( "cors");
const connectDB = require("./config/db.js");
const authRoutes= require( "./routes/authRoutes.js");
const courseRoutes =require( "./routes/courseRoutes.js");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});
