const express = require("express");
const {
  photoUpload,
  postImgResize,
} = require("../../middleware/uploads/photoUpload");
const {
  createPostController,
  fetchAllPostController,
  fetchSinglePostController,
} = require("../../controller/posts/PostController");
const authMiddleware = require("../../middleware/auth/authMiddleware");

const postRoutes = express.Router();

postRoutes.post(
  "/",
  authMiddleware,
  photoUpload.single("image"),
  postImgResize,
  createPostController
);

postRoutes.get("/", authMiddleware, fetchAllPostController);
postRoutes.get("/:id", authMiddleware, fetchSinglePostController);

module.exports = postRoutes;
