var AnswerModel = require("../models/AnswerModel.js");

/**
 * AnswerController.js
 *
 * @description :: Server-side logic for managing Answers.
 */
module.exports = {
  /**
   * AnswerController.list()
   */
  list: function (req, res) {
    AnswerModel.find(function (err, Answers) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting Answer.",
          error: err,
        });
      }

      return res.json(Answers);
    });
  },

  /**
   * AnswerController.show()
   */
  show: function (req, res) {
    var id = req.params.id;

    AnswerModel.findOne({ _id: id }, function (err, Answer) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting Answer.",
          error: err,
        });
      }

      if (!Answer) {
        return res.status(404).json({
          message: "No such Answer",
        });
      }

      return res.json(Answer);
    });
  },

  /**
   * AnswerController.create()
   */
  create: function (req, res) {
    var Answer = new AnswerModel({
      content: req.body.content,
      date: req.body.date,
      user: req.body.user,
      question: req.body.question,
      accepted: req.body.accepted,
    });

    Answer.save(function (err, Answer) {
      if (err) {
        return res.status(500).json({
          message: "Error when creating Answer",
          error: err,
        });
      }

      return res.status(201).json(Answer);
    });
  },

  /**
   * AnswerController.update()
   */
  update: function (req, res) {
    var id = req.params.id;

    AnswerModel.findOne({ _id: id }, function (err, Answer) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting Answer",
          error: err,
        });
      }

      if (!Answer) {
        return res.status(404).json({
          message: "No such Answer",
        });
      }

      Answer.content = req.body.content ? req.body.content : Answer.content;
      Answer.date = req.body.date ? req.body.date : Answer.date;
      Answer.user = req.body.user ? req.body.user : Answer.user;
      Answer.question = req.body.question ? req.body.question : Answer.question;
      Answer.accepted = req.body.accepted ? req.body.accepted : Answer.accepted;

      Answer.save(function (err, Answer) {
        if (err) {
          return res.status(500).json({
            message: "Error when updating Answer.",
            error: err,
          });
        }

        return res.json(Answer);
      });
    });
  },

  /**
   * AnswerController.remove()
   */
  remove: function (req, res) {
    var id = req.params.id;

    AnswerModel.findByIdAndRemove(id, function (err, Answer) {
      if (err) {
        return res.status(500).json({
          message: "Error when deleting the Answer.",
          error: err,
        });
      }

      return res.status(204).json();
    });
  },
};
