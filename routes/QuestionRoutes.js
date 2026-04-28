var express = require("express");
var router = express.Router();
var QuestionModel = require("../models/QuestionModel");
var AnswerModel = require("../models/AnswerModel");

// GET all questions
router.get("/", async function (req, res) {
  try {
    var questions = await QuestionModel.find()
      .populate("user")
      .sort({ date: -1 });

    questions = questions.map(function (q) {
      return {
        ...q._doc,
        formattedDate: new Date(q.date).toLocaleString("sl-SI", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    });

    res.render("questions/index", { questions: questions });
  } catch (err) {
    res.send(err);
  }
});

// GET create form
router.get("/new", function (req, res) {
  res.render("questions/new");
});

// POST create question
router.post("/create", async function (req, res) {
  try {
    var question = new QuestionModel({
      title: req.body.title,
      description: req.body.description,
      date: new Date(),
      user: req.session.user._id,
      views: 0,
      activity: 0,
    });

    await question.save();
    res.redirect("/questions");
  } catch (err) {
    res.send(err);
  }
});
// GET hot questions
router.get("/hot", async function (req, res) {
  try {
    var questions = await QuestionModel.find();

    var hotQuestions = [];

    for (var i = 0; i < questions.length; i++) {
      var question = questions[i];

      var answerCount = await AnswerModel.countDocuments({
        question: question._id,
      });

      var hoursOld = (new Date() - new Date(question.date)) / (1000 * 60 * 60);

      if (hoursOld < 1) {
        hoursOld = 1;
      }

      var scorePerHour = (question.activity || 0) / hoursOld;

      hotQuestions.push({
        ...question._doc,
        answerCount: answerCount,
        activity: question.activity || 0,
        hotScore: scorePerHour.toFixed(2),
        formattedDate: new Date(question.date).toLocaleString("sl-SI", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }

    hotQuestions = hotQuestions
      .filter(function (q) {
        return parseFloat(q.hotScore) > 3;
      })
      .sort(function (a, b) {
        return b.hotScore - a.hotScore;
      })
      .slice(0, 5);

    res.render("questions/hot", {
      questions: hotQuestions,
    });
  } catch (err) {
    res.send(err);
  }
});

// GET single question + answers
router.get("/:id", async function (req, res) {
  try {
    await QuestionModel.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1, activity: 1 },
    });

    var question = await QuestionModel.findById(req.params.id).populate("user");

    var answers = await AnswerModel.find({ question: req.params.id })
      .populate("user")
      .sort({ accepted: -1, date: -1 });

    answers = answers.map(function (a) {
      return {
        ...a._doc,
        formattedDate: new Date(a.date).toLocaleString("sl-SI", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    });

    var isOwner =
      question.user._id.toString() === req.session.user._id.toString();

    res.render("questions/show", {
      question: question,
      answers: answers,
      isOwner: isOwner,
    });
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
