const express = require("express");
const {
  createCategoryController,
  fetchAllCategoryController,
} = require("../../controller/categories/CategoryController");
const authMiddleware = require("../../middleware/auth/authMiddleware");

const categoryRoutes = express.Router();

categoryRoutes.post("/", authMiddleware, createCategoryController);
categoryRoutes.get("/", authMiddleware, fetchAllCategoryController);

module.exports = {
  categoryRoutes,
};
