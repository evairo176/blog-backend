const express = require("express");
const {
  createPostController,
} = require("../../controller/posts/PostController");
const authMiddleware = require("../../middleware/auth/authMiddleware");
const {
  photoUpload,
  postImgResize,
} = require("../../middleware/uploads/photoUpload");

const postRoutes = express.Router();

postRoutes.post(
  "/",
  authMiddleware,
  photoUpload.single("image"),
  postImgResize,
  createPostController
);

module.exports = postRoutes;
