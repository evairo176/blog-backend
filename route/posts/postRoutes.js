const express = require("express");
const {
  createPostController,
  fetchAllPostController,
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

postRoutes.get("/", authMiddleware, fetchAllPostController);

module.exports = postRoutes;
