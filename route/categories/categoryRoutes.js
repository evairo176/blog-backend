const express = require("express");
const {
  createCategoryController,
} = require("../../controller/categories/CategoryController");
const authMiddleware = require("../../middleware/auth/authMiddleware");

const categoryRoutes = express.Router();

categoryRoutes.post("/", authMiddleware, createCategoryController);

module.exports = {
  categoryRoutes,
};
