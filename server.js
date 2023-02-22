const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const dbConnect = require("./config/db/dbConnect");
const userRoutes = require("./route/users/usersRoutes");
const postRoutes = require("./route/posts/postRoutes");
const { errorHandler, notFound } = require("./middleware/error/errorHandler");
const commentRoutes = require("./route/comments/commentRoutes");
const emailRoutes = require("./route/emails/emailRoutes");
const { categoryRoutes } = require("./route/categories/categoryRoutes");
const app = express();
var cors = require("cors");

//DB
dbConnect();

const allowList = [
  "https://blog-backend-ruddy.vercel.app",
  "https://evairo176-blog.netlify.app",
  "http://localhost:5000",
];

app.use(
  cors({
    // Your origin prop in cors({})
    origin: function (origin, callback) {
      // Log and check yourself if the origin actually matches what you've defined in the allowList array
      console.log(origin);

      if (allowList.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json());

// user routes
app.use("/api/users", userRoutes);
// post routes
app.use("/api/posts", postRoutes);
// comment routes
app.use("/api/comments", commentRoutes);
// email routes
app.use("/api/emails", emailRoutes);
// category routes
app.use("/api/category", categoryRoutes);
// error handler
app.use(notFound);
app.use(errorHandler);

// server
const port = process.env.PORT || 5000;
app.listen(port, console.log("Express server listening on port: " + port));
