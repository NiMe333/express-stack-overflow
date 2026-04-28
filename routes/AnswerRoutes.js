var express = require("express");
var router = express.Router();
var AnswerModel = require("../models/AnswerModel");
var QuestionModel = require("../models/QuestionModel");

// POST create answer
router.post("/create/:questionId", async function (req, res) {
  try {
    var answer = new AnswerModel({
      content: req.body.content,
      date: new Date(),
      user: req.session.user._id,
      question: req.params.questionId,
      accepted: false,
    });

    await answer.save();

    // povečaj aktivnost vprašanja (odgovor = +3)
    await QuestionModel.findByIdAndUpdate(req.params.questionId, {
      $inc: { activity: 3 },
    });

    res.redirect("/questions/" + req.params.questionId);
  } catch (err) {
    res.send(err);
  }
});

// POST accept answer
router.post("/accept/:answerId", async function (req, res) {
  try {
    var answer = await AnswerModel.findById(req.params.answerId).populate(
      "question",
    );

    if (!answer) {
      return res.send("Odgovor ne obstaja.");
    }

    var question = answer.question;

    // preveri če je uporabnik lastnik vprašanja
    if (question.user.toString() !== req.session.user._id.toString()) {
      return res.send("Nimaš dovoljenja za sprejem tega odgovora.");
    }

    // nastavi tega kot accepted
    answer.accepted = true;
    await answer.save();

    // povečaj aktivnost
    await QuestionModel.findByIdAndUpdate(question._id, {
      $inc: { activity: 1 },
    });

    res.redirect("/questions/" + question._id);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
