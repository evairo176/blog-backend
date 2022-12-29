const express = require("express");
const {
  photoUpload,
  postImgResize,
} = require("../../middleware/uploads/photoUpload");
const {
  createPostController,
  fetchAllPostController,
  fetchSinglePostController,
  updatePostController,
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

postRoutes.get("/", fetchAllPostController);
postRoutes.get("/:id", fetchSinglePostController);
postRoutes.put("/:id", authMiddleware, updatePostController);

module.exports = postRoutes;
