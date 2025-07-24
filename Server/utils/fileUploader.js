const multer = require( "multer");
const path = require( "path");

// Create uploads directory if not exists
const fs =require( "fs");
const uploadPath = "uploads";
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = file.originalname.split(".")[0].replace(/\s/g, "_");
    cb(null, `${name}_${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /mp4|mov|avi|mkv/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed"));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
