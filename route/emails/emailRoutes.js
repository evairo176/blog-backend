const express = require("express");
const {
  sendMessageController,
} = require("../../controller/emails/EmailController");
const authMiddleware = require("../../middleware/auth/authMiddleware");
const emailRoutes = express.Router();

emailRoutes.post("/", authMiddleware, sendMessageController);

module.exports = emailRoutes;
