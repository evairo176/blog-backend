const expressAsyncHandler = require("express-async-handler");
const Category = require("../../model/categories/Category");
const validateMongoDbId = require("../../utils/validateMongoDbId");

//----------------------------------------------
// create category
//----------------------------------------------

const createCategoryController = expressAsyncHandler(async (req, res) => {
  let titleOri = req?.body?.title;
  titleOri = titleOri
    .split(" ") // Memenggal nama menggunakan spasi
    .map((nama) => nama.charAt(0).toUpperCase() + nama.slice(1)) // Ganti huruf besar kata-kata pertama
    .join(" ");

  const titleCategoryExists = await Category.findOne({
    title: titleOri,
  });

  if (titleCategoryExists) throw new Error("Title Category exists");

  try {
    const category = await Category.create({
      user: req.user._id,
      title: titleOri,
    });
    res.json({
      message: `Create new category ${category.title} successfully`,
      category: category,
    });
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
    res.json({
      message: `Show all categories successfully`,
      categories: categories,
    });
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------
// fetch / detail category
//----------------------------------------------

const fetchCategoryController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const categories = await Category.findById(id)
      .populate("user")
      .sort("_createdAt");
    res.json({
      message: `Show detail category successfully`,
      detailCategory: categories,
    });
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------
// update categori
//----------------------------------------------

const updateCategoryController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  let titleOri = req?.body?.title;
  titleOri = titleOri
    .split(" ") // Memenggal nama menggunakan spasi
    .map((nama) => nama.charAt(0).toUpperCase() + nama.slice(1)) // Ganti huruf besar kata-kata pertama
    .join(" ");

  const titleCategoryExists = await Category.findOne({
    title: titleOri,
  });

  if (titleCategoryExists) throw new Error("Title Category exists");
  try {
    const category = await Category.findByIdAndUpdate(
      id,
      {
        title: titleOri,
      },
      { new: true, runValidators: true }
    );
    res.json({
      message: `Update Category Successfully`,
      updateCategory: category,
    });
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------
// delete category
//----------------------------------------------

const deleteCategoryController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const category = await Category.findByIdAndDelete(id);
    res.json({
      message: `Delete category ${category.title} successfully`,
      deleteCategory: category,
    });
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createCategoryController,
  fetchAllCategoryController,
  fetchCategoryController,
  updateCategoryController,
  deleteCategoryController,
};
