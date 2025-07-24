const express = require("express");
const { protect } = require("../middleware/authMiddleware.js");
const router = express.Router();

const { getUserProgress } =require( "../controllers/userController.js");


router.get("/progress", protect, getUserProgress);

module.exports = router;