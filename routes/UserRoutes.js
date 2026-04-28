var express = require("express");
var router = express.Router();

var UserController = require("../controllers/UserController.js");
var UserModel = require("../models/UserModel");
var QuestionModel = require("../models/QuestionModel");
var AnswerModel = require("../models/AnswerModel");

// Prikaz javnega profila uporabnika
router.get("/profile/:id", async function (req, res) {
  try {
    var user = await UserModel.findById(req.params.id);

    var questionCount = await QuestionModel.countDocuments({
      user: user._id,
    });

    var answerCount = await AnswerModel.countDocuments({
      user: user._id,
    });

    var acceptedCount = await AnswerModel.countDocuments({
      user: user._id,
      accepted: true,
    });

    res.render("users/show", {
      profileUser: user,
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
