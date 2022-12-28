const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

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

//image risezing
const profilePhotoResize = async (req, res, next) => {
  //check if there no file to resize
  if (!req.file) return next();
  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat("jpeg")
    .jpeg({
      quality: 90,
    })
    .toFile(path.join(`public/images/profile/${req.file.filename}`));
  next();
};

module.exports = {
  profilePhotoUpload,
  profilePhotoResize,
};
