const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const dbConnect = require("./config/db/dbConnect");
const userRoutes = require("./route/users/usersRoute");
const { errorHandler, notFound } = require("./middleware/error/errorHandler");
const app = express();

//DB
dbConnect();

app.use(express.json());

// // 1. custom middleware
// const logger = (req, res, next) => {
//   console.log("am logger");
//   next();
// };

// // 2. use middleware
// app.use(logger);
app.use("/api/users", userRoutes);

// error handler
app.use(notFound);
app.use(errorHandler);

//server
const port = process.env.PORT || 5000;
app.listen(port, console.log("Express server listening on port: " + port));
