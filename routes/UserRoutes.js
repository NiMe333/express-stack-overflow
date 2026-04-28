var express = require("express");
var router = express.Router();

var UserController = require("../controllers/UserController.js");
var UserModel = require("../models/UserModel");
var QuestionModel = require("../models/QuestionModel");
var AnswerModel = require("../models/AnswerModel");

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

/*
 * GET
 */
router.get("/", UserController.list);

/*
 * GET
 */
router.get("/:id", UserController.show);

/*
 * POST
 */
router.post("/", UserController.create);

/*
 * PUT
 */
router.put("/:id", UserController.update);

/*
 * DELETE
 */
router.delete("/:id", UserController.remove);

module.exports = router;
