const express = require("express");
const router = express.Router();

// Placeholder route for courses
router.get("/", (req, res) => {
  res.json({ message: "Course routes working" });
});

module.exports = router;
