const express = require("express");
const {
  createCommentController,
  fetchAllCommentController,
} = require("../../controller/comments/commentController");
const authMiddleware = require("../../middleware/auth/authMiddleware");

const commentRoutes = express.Router();

commentRoutes.post("/", authMiddleware, createCommentController);
commentRoutes.get("/", authMiddleware, fetchAllCommentController);

module.exports = commentRoutes;
