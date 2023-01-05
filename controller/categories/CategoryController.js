const expressAsyncHandler = require("express-async-handler");

//----------------------------------------------
// create category
//----------------------------------------------

const createCategoryController = expressAsyncHandler(async (req, res) => {
  res.json("abc");
});

module.exports = {
  createCategoryController,
};
