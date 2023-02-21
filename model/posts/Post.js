const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
    },
    //create by only category
    category: {
      type: String,
      required: [true, "Post category is required"],
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    isDisLiked: {
      type: Boolean,
      default: false,
    },
    numViews: {
      type: Number,
      default: 0,
    },
    viewAt: Date,
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    disLikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please author is required"],
    },
    description: {
      type: String,
      required: [true, "Please description is required"],
    },
    image: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2022/12/14/15/40/aussie-7655642_960_720.jpg",
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

// compile
const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
