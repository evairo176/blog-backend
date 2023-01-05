const expressAsyncHandler = require("express-async-handler");

const sendMessageController = expressAsyncHandler(async (req, res) => {
  res.json("abogo");
});

module.exports = {
  sendMessageController,
};
