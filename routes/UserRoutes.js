var express = require("express");
var router = express.Router(); // router

var UserController = require("../controllers/UserController.js"); // Controler
var UserModel = require("../models/UserModel"); // User model
var QuestionModel = require("../models/QuestionModel"); // Qouestion model
var AnswerModel = require("../models/AnswerModel"); // Answer model

// Prikaz javnega profila uporabnika
router.get("/profile/:id", async function (req, res) {
  try {
    var user = await UserModel.findById(req.params.id); // Id from URL

    var questionCount = await QuestionModel.countDocuments({
      // koliko vprašanj je ustvaril ta user
      user: user._id,
    });

    var answerCount = await AnswerModel.countDocuments({
      // koliko odgovorov je napisal
      user: user._id,
    });

    var acceptedCount = await AnswerModel.countDocuments({
      // koliko odgovorov je bilo označenih kot accepted
      user: user._id,
      accepted: true,
    });

    res.render("users/show", {
      // rendera template
      // poslje data v view kot object
      profileUser: user, // v view se klice -> {{profileUser.username}}
      questionCount: questionCount,
      answerCount: answerCount,
      acceptedCount: acceptedCount,
    });
  } catch (err) {
    res.send(err);
  }
});

// Generirani route-i za uporabnike
router.get("/", UserController.list);
router.get("/:id", UserController.show);
router.post("/", UserController.create);
router.put("/:id", UserController.update);
router.delete("/:id", UserController.remove);

module.exports = router;
