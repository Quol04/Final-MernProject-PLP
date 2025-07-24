const mongoose= require( "mongoose");

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String }, // Can be a file path or external link
  content: { type: String },  // Optional text content
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model("Lesson", lessonSchema);