const express = require("express");
const {
  userRegisterController,
  userLoginController,
  fetchUserController,
  deleteUserController,
  userProfileController,
  updateProfileController,
  updatePasswordController,
  followingController,
  detailUserController,
  unfollowController,
  blockUserController,
  unBlockUserController,
  generateEmailTokenController,
} = require("../../controller/users/UserController");
const authMiddleware = require("../../middleware/auth/authMiddleware");
const userRoutes = express.Router();

userRoutes.post("/register", userRegisterController);
userRoutes.post("/login", userLoginController);
userRoutes.get("/", authMiddleware, fetchUserController);
userRoutes.get("/:id", detailUserController);
userRoutes.get("/:id", deleteUserController);
userRoutes.post(
  "/generate-verify-email-token",
  authMiddleware,
  generateEmailTokenController
);
userRoutes.put("/follow", authMiddleware, followingController);
userRoutes.put("/unfollow", authMiddleware, unfollowController);
userRoutes.put("/block-user/:id", authMiddleware, blockUserController);
userRoutes.put("/unblock-user/:id", authMiddleware, unBlockUserController);
userRoutes.get("/profile/:id", authMiddleware, userProfileController);
userRoutes.put("/password", authMiddleware, updatePasswordController);
userRoutes.put("/:id", authMiddleware, updateProfileController);
userRoutes.delete("/:id", deleteUserController);

module.exports = userRoutes;
