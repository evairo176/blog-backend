const express = require("express");
const {
  createPostController,
} = require("../../controller/posts/PostController");
const authMiddleware = require("../../middleware/auth/authMiddleware");

const postRoutes = express.Router();

postRoutes.post("/", authMiddleware, createPostController);

module.exports = postRoutes;
