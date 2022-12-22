const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const dbConnect = require("./config/db/dbConnect");

const app = express();
//DB
dbConnect();

//Register
app.post("/api/users/register", (req, res) => {
  //business logic
  res.json({ user: "User Registered" });
});

//Login
app.post("/api/users/login", (req, res) => {
  //business logic
  res.json({ user: "User Login" });
});

//fetch all users
app.post("/api/users/login", (req, res) => {
  //business logic
  res.json({ user: "User Login" });
});

//server
const port = process.env.PORT || 5000;
app.listen(port, console.log("Express server listening on port: " + port));
