var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
var UserModel = require("../models/UserModel");

// Prikaz registracije
router.get("/register", function (req, res) {
  res.render("auth/register");
});

// Registracija uporabnika
router.post("/register", async function (req, res) {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;

  var existingUser = await UserModel.findOne({ email: email });

  if (existingUser) {
    return res.send("Uporabnik s tem emailom že obstaja.");
  }

  // hash gesla
  var hashedPassword = await bcrypt.hash(password, 10);

  var user = new UserModel({
    username: username,
    email: email,
    password: hashedPassword,
  });

  await user.save();

  res.redirect("/auth/login");
});

// Prikaz login forme
router.get("/login", function (req, res) {
  res.render("auth/login");
});

// Prijava uporabnika
router.post("/login", async function (req, res) {
  var email = req.body.email;
  var password = req.body.password;

  var user = await UserModel.findOne({ email: email });

  if (!user) {
    return res.render("auth/login", {
      error: "Napačen email ali geslo.",
      email: email,
    });
  }

  // preverjanje gesla
  var validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.render("auth/login", {
      error: "Napačen email ali geslo.",
    });
  }

  // shranimo uporabnika v session
  req.session.user = {
    _id: user._id,
    username: user.username,
    email: user.email,
    profileImage: user.profileImage,
  };

  res.redirect("/questions");
});

// Odjava
router.get("/logout", function (req, res) {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
