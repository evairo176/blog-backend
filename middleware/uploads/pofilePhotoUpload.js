const multer = require("multer");

// storage
const multerStorage = multer.memoryStorage();

//file type checking
const multerFilter = (req, file, callback) => {
  // check file type
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    // rejected files
    callback(
      {
        message: "Unsupported file format",
      },
      false
    );
  }
};

const profilePhotoUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});

module.exports = {
  profilePhotoUpload,
};
