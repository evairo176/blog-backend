const express = require("express");
const {
  createCommentController,
} = require("../../controller/comments/commentController");
const authMiddleware = require("../../middleware/auth/authMiddleware");

const commentRoutes = express.Router();

commentRoutes.post("/", authMiddleware, createCommentController);

module.exports = commentRoutes;
