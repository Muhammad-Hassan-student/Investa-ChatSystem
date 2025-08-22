import multer from "multer";

const storage = multer.memoryStorage(); //store files temperory in memory


const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max file size 10MB for images
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      return cb(null, true); // Allow images only
    }
    return cb(new Error("Only image files are allowed"), false); // Reject others
  },
});
export default upload