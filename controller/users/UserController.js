const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../../config/token/generateToken");
const User = require("../../model/users/User");

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

module.exports = { userRegisterController, userLoginController };
