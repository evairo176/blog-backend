const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const crypto = require("crypto");

//create schema for user model
const userSchema = new mongoose.Schema(
  {
    firstName: {
      required: [true, "Nama depan harus di isi"],
      type: String,
    },
    lastName: {
      required: [true, "Nama belakang harus di isi"],
      type: String,
    },
    profilePhoto: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2014/04/02/10/25/man-303792_960_720.png",
    },
    email: {
      required: [true, "Email harus di isi"],
      type: String,
    },
    bio: {
      type: String,
    },
    password: {
      required: [true, "Password harus di isi"],
      type: String,
    },
    postCount: {
      type: Number,
      default: 0,
    },

    // harusnya isBloked
    isBlock: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["Admin", "Guest", "Blogger"],
    },
    isFollowing: {
      type: Boolean,
      default: false,
    },
    isUnFollowing: {
      type: Boolean,
      default: false,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    accountVerificationToken: {
      type: String,
    },
    accountVerificationExpires: {
      type: Date,
    },
    viewedBy: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    followers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    following: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    active: {
      type: Boolean,
      default: false,
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

//virtual method to populate created posts
userSchema.virtual("posts", {
  ref: "Post",
  foreignField: "user",
  localField: "_id",
});

userSchema.pre("save", async function (next) {
  // console.log(this);
  if (!this.isModified("password")) {
    next();
  }
  // hash password
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hashSync(this.password, salt);
  next();
});

// match password
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// verfication account
userSchema.methods.createAccountVerficationToken = async function () {
  // create a token
  const verificationToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  this.accountVerificationExpires = Date.now() + 30 * 60 * 1000; // 10 menit

  return verificationToken;
};

// password reset
userSchema.methods.createPasswordResetToken = async function () {
  // create a token
  const resetToken = crypto.randomBytes(32).toString("hex");
  // console.log(resetToken);
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 menit

  return resetToken;
};

//Compile schema to model
const User = mongoose.model("User", userSchema);

module.exports = User;
