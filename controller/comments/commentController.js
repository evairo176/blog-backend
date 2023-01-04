const expressAsyncHandler = require("express-async-handler");
const Comment = require("../../model/comments/Comment");

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

module.exports = {
  createCommentController,
};
