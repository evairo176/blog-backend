const express = require("express");
const {
  createCategoryController,
  fetchAllCategoryController,
  fetchCategoryController,
} = require("../../controller/categories/CategoryController");
const authMiddleware = require("../../middleware/auth/authMiddleware");

const categoryRoutes = express.Router();

categoryRoutes.post("/", authMiddleware, createCategoryController);
categoryRoutes.get("/", authMiddleware, fetchAllCategoryController);
categoryRoutes.get("/:id", authMiddleware, fetchCategoryController);

module.exports = {
  categoryRoutes,
};
