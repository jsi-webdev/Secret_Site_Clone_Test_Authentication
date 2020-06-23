//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  User.findOne({ email: username }, function (err, foundUser) {
    if (!err) {
      bcrypt.compare(req.body.password, foundUser.password, function (
        err,
        result
      ) {
        if (result === true) {
          res.render("secrets");
        } else {
          res.send(err);
        }
      });
    } else {
      res.send(err);
    }
  });
});

app.post("/register", function (req, res) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash,
    });
    newUser.save(function (err) {
      if (!err) {
        res.render("secrets");
      } else {
        res.send(err);
      }
    });
  });
});

app.listen(3000, function (err) {
  if (!err) {
    console.log("Server is successfully started on Port 3000");
  }
});
