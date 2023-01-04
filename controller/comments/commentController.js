const expressAsyncHandler = require("express-async-handler");
const Comment = require("../../model/comments/Comment");
const validateMongoDbId = require("../../utils/validateMongoDbId");

//----------------------------------------------
// create comment
//----------------------------------------------
const createCommentController = expressAsyncHandler(async (req, res) => {
  // 1. get id user
  const user = req.user;
  // 2. get the post Id
  const { postId, description } = req.body;
  try {
    const comment = await Comment.create({
      post: postId,
      user: user,
      description: description,
    });
    console.log(postId);
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------
// fetch all comment
//----------------------------------------------

const fetchAllCommentController = expressAsyncHandler(async (req, res) => {
  try {
    const comment = await Comment.find({}).sort("-created");
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------
// fetch detail comment
//----------------------------------------------

const fetchSingleCommentController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const comment = await Comment.findById(id);
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------
// update comment
//----------------------------------------------

const updateCommentController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  validateMongoDbId(id);
  try {
    const comment = await Comment.findByIdAndUpdate(
      id,
      {
        description: description,
      },
      { new: true, runValidators: true }
    );
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createCommentController,
  fetchAllCommentController,
  fetchSingleCommentController,
  updateCommentController,
};
