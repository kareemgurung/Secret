//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.use(express.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"]
});

const User = new mongoose.model("User", userSchema);

// Home route
app.route("/")

  .get(function(req, res) {
    res.render("home");
  });

// Login route
app.route("/login")

  .get(function(req, res) {
    res.render("login");
  })

  .post(function(req, res) {
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({
      email: userName
    }, function(err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser.password === password) {
          res.render("secrets");
        }
      }
    });
  });

// Register route
app.route("/register")

  .get(function(req, res) {
    res.render("register");
  })

  .post(function(req, res) {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password
    });
    newUser.save(function(err) {
      if (!err) {
        res.render("secrets");
      } else {
        res.render(err);
      }
    });
  });

// Secrets route
app.route("/secrets")

  .get(function(req, res) {
    res.render("secrets");
  });

// Submit route
app.route("/submit")

  .get(function(req, res) {
    res.render("submit");
  });

app.listen(3000, function() {
  console.log("Server is running on port 3000");
});
