const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, default: 0 },
  level: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'], 
    default: 'beginner' 
  },
  duration: { type: Number }, // Duration in hours
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  requirements: [{ type: String }], // Array of course requirements
  learningOutcomes: [{ type: String }], // Array of learning outcomes
  isPublished: { type: Boolean, default: false },
  thumbnail: { type: String }, // URL or path to thumbnail image
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Course", courseSchema);
