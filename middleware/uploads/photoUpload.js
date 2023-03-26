const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

const photoUpload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
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
