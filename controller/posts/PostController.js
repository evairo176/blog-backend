const expressAsyncHandler = require("express-async-handler");
const Post = require("../../model/posts/Post");
const validateMongoDbId = require("../../utils/validateMongoDbId");
const Filter = require("bad-words");
const User = require("../../model/users/User");
const cloudinaryUploadImg = require("../../utils/cloudinary");
const fs = require("fs");

//----------------------------------------------
// create post
//----------------------------------------------
const createPostController = expressAsyncHandler(async (req, res) => {
  //   console.log(req.file);
  const { _id } = req.user;
  //   console.log(id);
  //   validateMongoDbId(req.body.user);
  // check if bad words
  const filter = new Filter();
  const isProfane = filter.isProfane(req.body.title, req.body.description);
  //   console.log(isProfane);
  if (isProfane) {
    await User.findByIdAndUpdate(id, {
      isBlock: true,
    });
    throw new Error(
      "Creating failed because it content profane words and you havae been blocked"
    );
  }
  // 1. get the path to img
  const localPath = `public/images/posts/${req.file.filename}`;
  // 2. upload to cloudinary
  const imgUpload = await cloudinaryUploadImg(localPath);
  //   res.json(imgUpload);

  try {
    const post = await Post.create({
      ...req.body,
      image: imgUpload?.url,
      user: _id,
      //   title:req.body.title
    });
    // remove uploaded img
    fs.unlinkSync(localPath);

    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------
// fetch all post
//----------------------------------------------

const fetchAllPostController = expressAsyncHandler(async (req, res) => {
  try {
    const post = await Post.find({}).populate("user");
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------
// fetch single post
//----------------------------------------------

const fetchSinglePostController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const post = await Post.findById(id).populate("user");
    // update number of view
    await Post.findByIdAndUpdate(
      id,
      {
        $inc: {
          numViews: 1,
        },
      },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------
// update post
//----------------------------------------------

const updatePostController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const postUpdate = await Post.findByIdAndUpdate(
      id,
      {
        ...req.body,
        user: req.user,
      },
      { new: true }
    );
    res.json(postUpdate);
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------
// delete post
//----------------------------------------------

const deletePostController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  // check validation
  validateMongoDbId(id);
  try {
    const deletePost = await Post.findByIdAndDelete(id);
    res.json(deletePost);
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------
// likes
//----------------------------------------------

const toggleAddLikeToPostConstroller = expressAsyncHandler(async (req, res) => {
  // 1. find the post by id
  const { postId } = req.body;
  const post = await Post.findById(postId);
  // 2. find id login user
  const loginUserId = req?.user?._id;
  // 3. find this user has liked this post ?
  const isLiked = post.isLiked;
  // 4. check this user has disliked this post ?
  console.log(isLiked);
  console.log(loginUserId);
  res.json(post);
});

module.exports = {
  createPostController,
  fetchAllPostController,
  fetchSinglePostController,
  updatePostController,
  deletePostController,
  toggleAddLikeToPostConstroller,
};
