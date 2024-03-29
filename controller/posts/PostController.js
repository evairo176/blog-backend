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
  // console.log(req.body);
  const { _id } = req.user;
  // console.log(_id);
  //   validateMongoDbId(req.body.user);
  // check if bad words
  const filter = new Filter();
  const isProfane = filter.isProfane(req.body.title, req.body.description);
  //   console.log(isProfane);
  if (isProfane) {
    await User.findByIdAndUpdate(_id, {
      isBlock: true,
    });
    throw new Error(
      "Creating failed because it content profane words and you havae been blocked"
    );
  }
  let localPath;
  let imgUpload;
  if (req.file.filename) {
    // // 1. get the path to img
    // localPath = `public/images/posts/${req.file.filename}`;
    // 2. upload to cloudinary
    imgUpload = await cloudinaryUploadImg(req.file.path);
    //   res.json(imgUpload);
  }

  try {
    const post = await Post.create({
      ...req.body,
      image: imgUpload?.url ? imgUpload?.url : null,
      user: _id,
    });
    // remove uploaded img
    fs.unlinkSync(localPath);
    // res.json(imgUpload);
    res.json({
      message: `Post with title ${req?.body.title} was created successfully`,
      post: post,
    });
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------
// fetch all post
//----------------------------------------------

const fetchAllPostController = expressAsyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    let sort = req.query.sort || "createdAt";
    let category = req.query.category || "All";

    const genreOptions = [
      "Indonesia",
      "Malaysia",
      "Timor Leste",
      "Singapura",
      "Vietnam",
    ];

    category === "All"
      ? (category = [...genreOptions])
      : (category = req.query.category.split(","));

    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    let sortBy = {};

    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = "desc";
    }

    const post = await Post.find({
      title: { $regex: ".*" + search + ".*" },
      description: { $regex: ".*" + search + ".*" },
    })
      .populate("user")
      .populate("likes")
      .populate("disLikes")
      .where("category")
      .in([...category])
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);

    const total = await Post.countDocuments({
      title: { $regex: ".*" + search + ".*" },
      description: { $regex: ".*" + search + ".*" },
      category: { $in: [...category] },
    });

    const response = {
      error: false,
      total,
      page: page + 1,
      limit: limit,
      category: genreOptions,
      post,
    };
    // console.log(response);
    res.json(response);

    // const post = await Post.find({})
    //   .populate("user")
    //   .populate("likes")
    //   .populate("disLikes");
    // res.json(post);
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
    post.viewAt = Date.now();
    await post.save();
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------
// fetch single post update
//----------------------------------------------

const fetchSinglePostUpdateController = expressAsyncHandler(
  async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
      const post = await Post.findById(id).populate("user");
      res.json(post);
    } catch (error) {
      res.json(error);
    }
  }
);

//----------------------------------------------
// fetch single post by id user
//----------------------------------------------

const fetchSinglePostByIdUserontroller = expressAsyncHandler(
  async (req, res) => {
    const id = req.query.user_id;
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    console.log({ id, page, limit, search });
    validateMongoDbId(id);

    try {
      const post = await Post.find({
        user: id,
        title: { $regex: ".*" + search + ".*" },
        description: { $regex: ".*" + search + ".*" },
      })
        .populate("user")
        .populate("likes")
        .populate("disLikes")
        // .where("category")
        // .in([...category])
        // .sort(sortBy)
        .skip(page * limit)
        .limit(limit);
      console.log(post.length);
      const total = await Post.countDocuments({
        title: { $regex: ".*" + search + ".*" },
        description: { $regex: ".*" + search + ".*" },
      });

      const response = {
        error: false,
        total,
        page: page + 1,
        limit: limit,
        // category: genreOptions,
        post,
      };
      // console.log(response);
      res.json(response);
    } catch (error) {
      res.json(error);
    }
  }
);

//----------------------------------------------
// update post
//----------------------------------------------

const updatePostController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const post = await Post.find({ id: id });
  if (req.file) {
    image_url = await cloudinaryUploadImg(req.file.path);
    imgUpload = image_url?.url;
  } else {
    imgUpload = post?.image;
  }
  try {
    const postUpdate = await Post.findByIdAndUpdate(
      id,
      {
        ...req.body,
        user: req.user,
        image: imgUpload,
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
  const isLiked = post?.isLiked;
  // 4. check this user has disliked this post ?
  const alreadyDisLikes = post?.disLikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  // 5. remove the user from disliked list
  if (alreadyDisLikes) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: {
          disLikes: loginUserId,
        },
        isDisLiked: false,
      },
      { new: true }
    );
    res.json({
      message: `You have successfully undisliked and like a post ${post?.title}`,
      post: post,
    });
  }
  // 6. remove the user likes from this post
  if (isLiked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: {
          likes: loginUserId,
        },
        isLiked: false,
      },
      { new: true }
    );
    res.json({
      message: `You have successfully unliked a post ${post?.title}`,
      post: post,
    });
  } else {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          likes: loginUserId,
        },
        isLiked: true,
      },
      { new: true }
    );
    res.json({
      message: `You Successfully liked a Post ${post?.title}`,
      post: post,
    });
  }
});

//----------------------------------------------
// dislikes
//----------------------------------------------

const toggleAddDisLikeToPostConstroller = expressAsyncHandler(
  async (req, res) => {
    // 1. find the post by id
    const { postId } = req.body;
    const post = await Post.findById(postId);
    // 2. find id login user
    const loginUserId = req?.user?._id;
    // 3. find this user has disliked this post ?
    const isDisLiked = post?.isDisLiked;
    // 4. check this user has like this post ?
    const alreadyLikes = post?.likes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );

    // 5. remove the user from likes list
    if (alreadyLikes) {
      const post = await Post.findByIdAndUpdate(
        postId,
        {
          $pull: {
            likes: loginUserId,
          },
          isLiked: false,
        },
        { new: true }
      );
      res.json({
        message: `You have successfully unliked and disliked a post ${post?.title}`,
        post: post,
      });
    }
    // 6. remove the user likes from this post
    if (isDisLiked) {
      const post = await Post.findByIdAndUpdate(
        postId,
        {
          $pull: {
            disLikes: loginUserId,
          },
          isDisLiked: false,
        },
        { new: true }
      );
      res.json({
        message: `You have successfully undisliked a post ${post?.title}`,
        post: post,
      });
    } else {
      const post = await Post.findByIdAndUpdate(
        postId,
        {
          $push: {
            disLikes: loginUserId,
          },
          isDisLiked: true,
        },
        { new: true }
      );
      res.json({
        message: `You Successfully Disliked a Post ${post?.title}`,
        post: post,
      });
    }
  }
);

module.exports = {
  createPostController,
  fetchAllPostController,
  fetchSinglePostController,
  fetchSinglePostByIdUserontroller,
  fetchSinglePostUpdateController,
  updatePostController,
  deletePostController,
  toggleAddLikeToPostConstroller,
  toggleAddDisLikeToPostConstroller,
};
