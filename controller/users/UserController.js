const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../../config/token/generateToken");
const { findById } = require("../../model/users/User");
const User = require("../../model/users/User");
const validateMongoDbId = require("../../utils/validateMongoDbId");

//----------------------------------------------
// Register
//----------------------------------------------

const userRegisterController = expressAsyncHandler(async (req, res) => {
  // check if user is already registered
  const userExists = await User.findOne({ email: req?.body?.email });

  if (userExists) throw new Error("user already registered");

  try {
    const user = await User.create({
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      password: req?.body?.password,
    });
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------
// Login
//----------------------------------------------

const userLoginController = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists
  const userFound = await User.findOne({ email });

  if (userFound && (await userFound.isPasswordMatched(password))) {
    res.json({
      _id: userFound?._id,
      firstName: userFound?.firstName,
      lastName: userFound?.lastName,
      email: userFound?.email,
      profilePhoto: userFound?.profilePhoto,
      isAdmin: userFound?.isAdmin,
      token: generateToken(userFound?._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid login credentials");
  }

  // res.json("User Login");
});

//----------------------------------------------
// fetch all auser
//----------------------------------------------

const fetchUserController = expressAsyncHandler(async (req, res) => {
  try {
    const user = await User.find({});
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------
// delete user
//----------------------------------------------

const deleteUserController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  // check id
  validateMongoDbId(id);
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json(deleteUser);
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------
// detail user
//----------------------------------------------

const detailUserController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  // check id
  validateMongoDbId(id);
  try {
    const detailUser = await User.findById(id);
    res.json(detailUser);
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------
// user profile
//----------------------------------------------

const userProfileController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  // check id
  console("user profile");
  validateMongoDbId(id);
  try {
    const myProfile = await User.findById(id);
    res.json(myProfile);
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------
// update profile
//----------------------------------------------

const updateProfileController = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  // check id
  console.log(_id);
  validateMongoDbId(_id);
  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
      {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        email: req?.body?.email,
        bio: req?.body?.bio,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(updateUser);
  } catch (error) {
    res.json(error);
  }
});

//----------------------------------------------
// update password
//----------------------------------------------

const updatePasswordController = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  // check id
  validateMongoDbId(_id);

  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updateUser = await user.save();
    res.json(updateUser);
  }
  res.json(user);
});

//----------------------------------------------
// following
//----------------------------------------------

const followingController = expressAsyncHandler(async (req, res) => {
  // 1. find the user you want to follow and update it's followers field
  // 2. update the login user following field
  const { followId } = req.body;
  const loginUserId = req.user.id;
  console.log({ followId, loginUserId });

  const targetUser = await User.findById(followId);
  const alreadyFollowing = targetUser?.followers?.find(
    (user) => user?.toString() === loginUserId.toString()
  );

  // console.log(alreadyFollowing);
  // console.log(loginUserId.toString());

  if (alreadyFollowing) throw new Error("You have already followed this user");

  // 1.
  await User.findByIdAndUpdate(
    followId,
    {
      $push: {
        followers: loginUserId,
      },
      isFollowing: true,
    },
    {
      new: true,
    }
  );
  // 2.
  await User.findByIdAndUpdate(
    loginUserId,
    {
      $push: {
        following: followId,
      },
    },
    { new: true }
  );
  res.json("You have successfully followed this user");
});

//----------------------------------------------
// unfollow
//----------------------------------------------

const unfollowController = expressAsyncHandler(async (req, res) => {
  // 1. find the user you want to unfollow and update it's followers field
  // 2. update the login user following field
  const { unFollowId } = req.body;
  const loginUserId = req.user.id;

  validateMongoDbId(unFollowId);

  const targetUser = await User.findById(unFollowId);
  const alreadyUnFollowing = targetUser?.followers?.find(
    (user) => user?.toString() === loginUserId.toString()
  );

  if (!alreadyUnFollowing)
    throw new Error("You have already unfollowed this user");

  await User.findByIdAndUpdate(
    unFollowId,
    {
      $pull: {
        followers: loginUserId,
      },
      isFollowing: false,
    },
    { new: true }
  );

  await User.findByIdAndUpdate(
    loginUserId,
    {
      $pull: {
        following: unFollowId,
      },
    },
    { new: true }
  );

  res.json("You have successfully unfollowed this user");

  // res.send("You have unfollowed this user");
});

//----------------------------------------------
// block user
//----------------------------------------------

const blockUserController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoDbId(id);
  // console.log(id);

  const user = await User.findByIdAndUpdate(
    id,
    {
      isBlock: true,
    },
    { new: true }
  );
  res.json("user successfully blocked");
});

//----------------------------------------------
// unblock user
//----------------------------------------------

const unBlockUserController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongoDbId(id);
  // console.log(id);

  const user = await User.findByIdAndUpdate(
    id,
    {
      isBlock: false,
    },
    { new: true }
  );
  res.json("user successfully unblocked");
});

//----------------------------------------------
// Account send email verification
//----------------------------------------------

const verifUserController = expressAsyncHandler(async (req, res) => {
  try {
    var nodemailer = require("nodemailer");
    // email sender function
    var transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "dbcfc2cffccb15",
        pass: "6ed76388b7c484",
      },
    });
    var mailOptions = {
      from: "Dicki Prasetya",
      to: "semenjakpetang176",
      subject: "Email Verification Account",
      text: "Email content",
    };
    transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.json(500, error.message);
      } else {
        console.log("Email sent");
        res.json("Email sent");
      }
    });
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  userRegisterController,
  userLoginController,
  fetchUserController,
  deleteUserController,
  detailUserController,
  userProfileController,
  updateProfileController,
  updatePasswordController,
  followingController,
  unfollowController,
  blockUserController,
  unBlockUserController,
  verifUserController,
};