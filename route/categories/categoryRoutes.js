const express = require("express");
const {
  createCategoryController,
  fetchAllCategoryController,
  fetchCategoryController,
  updateCategoryController,
} = require("../../controller/categories/CategoryController");
const authMiddleware = require("../../middleware/auth/authMiddleware");

const categoryRoutes = express.Router();

categoryRoutes.post("/", authMiddleware, createCategoryController);
categoryRoutes.get("/", authMiddleware, fetchAllCategoryController);
categoryRoutes.get("/:id", authMiddleware, fetchCategoryController);
categoryRoutes.put("/:id", authMiddleware, updateCategoryController);

module.exports = {
  categoryRoutes,
};
