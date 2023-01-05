const expressAsyncHandler = require("express-async-handler");
const Email = require("../../model/email/Email");
const Filter = require("bad-words");

const sendMessageController = expressAsyncHandler(async (req, res) => {
  const { to, subject, message } = req.body;
  const { _id, email } = req.user;
  const emailMessage = subject + " " + message;
  console.log(emailMessage);
  const filter = new Filter();
  const isProfane = filter.isProfane(emailMessage);
  if (isProfane)
    throw new Error("Email sent failed, because it contains profane words");

  try {
    const createEmail = await Email.create({
      from: email,
      to: to,
      subject: subject,
      message: message,
      sentBy: _id,
    });
    var nodemailer = require("nodemailer");
    var transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    var mailOptions = {
      from: `"Fred Foo 👻" <${email}>`,
      to: to,
      subject: subject,
      html: `<div>${message}</div>`,
    };
    await transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.json(500, error.message);
      } else {
        res.json({
          message: "mail sent successfully",
          data: createEmail,
          info: info,
        });
      }
    });
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  sendMessageController,
};
