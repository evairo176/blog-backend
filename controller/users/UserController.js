const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../../config/token/generateToken");
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
  console.log("updateProfileController");
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

  // 1.
  await User.findByIdAndUpdate(followId, {
    $push: {
      followers: loginUserId,
    },
  });
  // 2.
  await User.findByIdAndUpdate(loginUserId, {
    $push: {
      following: followId,
    },
  });
  res.send("You have successfully followed this user");
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
};
