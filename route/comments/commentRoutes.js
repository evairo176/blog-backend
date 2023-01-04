const express = require("express");
const {
  createCommentController,
  fetchAllCommentController,
  fetchSingleCommentController,
  updateCommentController,
  deleteCommentController,
} = require("../../controller/comments/commentController");
const authMiddleware = require("../../middleware/auth/authMiddleware");

const commentRoutes = express.Router();

commentRoutes.post("/", authMiddleware, createCommentController);
commentRoutes.get("/", authMiddleware, fetchAllCommentController);
commentRoutes.get("/:id", authMiddleware, fetchSingleCommentController);
commentRoutes.put("/:id", authMiddleware, updateCommentController);
commentRoutes.delete("/:id", authMiddleware, deleteCommentController);

module.exports = commentRoutes;
