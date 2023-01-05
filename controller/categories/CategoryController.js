const expressAsyncHandler = require("express-async-handler");
const Category = require("../../model/categories/Category");

//----------------------------------------------
// create category
//----------------------------------------------

const createCategoryController = expressAsyncHandler(async (req, res) => {
  try {
    const category = await Category.create({
      user: req.user._id,
      title: req.body.title,
    });
    res.json(category);
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------
// fetch all category
//----------------------------------------------

const fetchAllCategoryController = expressAsyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({})
      .populate("user")
      .sort("_createdAt");
    res.json(categories);
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------
// fetch / detail category
//----------------------------------------------

const fetchCategoryController = expressAsyncHandler(async (req, res) => {
  res.json("abc");
});

module.exports = {
  createCategoryController,
  fetchAllCategoryController,
  fetchCategoryController,
};
