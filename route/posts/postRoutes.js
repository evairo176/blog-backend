const express = require("express");
const {
  photoUpload,
  postImgResize,
} = require("../../middleware/uploads/photoUpload");
const {
  createPostController,
  fetchAllPostController,
  fetchSinglePostController,
  fetchSinglePostByIdUserontroller,
  fetchSinglePostUpdateController,
  updatePostController,
  deletePostController,
  toggleAddLikeToPostConstroller,
  toggleAddDisLikeToPostConstroller,
} = require("../../controller/posts/PostController");
const authMiddleware = require("../../middleware/auth/authMiddleware");

const postRoutes = express.Router();

postRoutes.post(
  "/",
  authMiddleware,
  photoUpload.single("image"),
  // mencoba
  // postImgResize,
  createPostController
);
postRoutes.put("/likes", authMiddleware, toggleAddLikeToPostConstroller);
postRoutes.put("/dislikes", authMiddleware, toggleAddDisLikeToPostConstroller);

postRoutes.get("/", fetchAllPostController);
postRoutes.get("/user", authMiddleware, fetchSinglePostByIdUserontroller);
postRoutes.get("/user/:id", fetchSinglePostUpdateController);
postRoutes.get("/:id", fetchSinglePostController);
postRoutes.put(
  "/:id",
  authMiddleware,
  photoUpload.single("image"),
  updatePostController
);
postRoutes.delete("/:id", authMiddleware, deletePostController);

module.exports = postRoutes;
