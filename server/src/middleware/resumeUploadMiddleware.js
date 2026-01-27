const multer = require("multer");

// Store file in memory buffer (will be sent to S3 directly)
const storage = multer.memoryStorage();

// File filter for validation
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
  ];

  if (!allowedMimes.includes(file.mimetype)) {
    return cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Only PDF and DOCX allowed.`
      )
    );
  }

  cb(null, true);
};

// Configure multer
const resumeUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

module.exports = resumeUpload;
