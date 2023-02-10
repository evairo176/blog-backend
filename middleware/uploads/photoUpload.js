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

const photoUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000000 },
});

//image resizing
const profilePhotoResize = async (req, res, next) => {
  //check if there no file to resize
  if (!req.file) return next();
  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    .resize(950, 750)
    .toFormat("jpeg")
    .jpeg({
      quality: 90,
    })
    .toFile(path.join(`public/images/profile/${req.file.filename}`));
  next();
};

//Post image resizing
const postImgResize = async (req, res, next) => {
  //check if there no file to resize
  if (!req.file) return next();
  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({
      quality: 90,
    })
    .toFile(path.join(`public/images/posts/${req.file.filename}`));
  next();
};

module.exports = {
  photoUpload,
  profilePhotoResize,
  postImgResize,
};
