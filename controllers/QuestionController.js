var QuestionModel = require("../models/QuestionModel.js");

/**
 * QuestionController.js
 *
 * @description :: Server-side logic for managing Questions.
 */
module.exports = {
  /**
   * QuestionController.list()
   */
  list: function (req, res) {
    QuestionModel.find(function (err, Questions) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting Question.",
          error: err,
        });
      }

      return res.json(Questions);
    });
  },

  /**
   * QuestionController.show()
   */
  show: function (req, res) {
    var id = req.params.id;

    QuestionModel.findOne({ _id: id }, function (err, Question) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting Question.",
          error: err,
        });
      }

      if (!Question) {
        return res.status(404).json({
          message: "No such Question",
        });
      }

      return res.json(Question);
    });
  },

  /**
   * QuestionController.create()
   */
  create: function (req, res) {
    var Question = new QuestionModel({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      user: req.body.user,
    });

    Question.save(function (err, Question) {
      if (err) {
        return res.status(500).json({
          message: "Error when creating Question",
          error: err,
        });
      }

      return res.status(201).json(Question);
    });
  },

  /**
   * QuestionController.update()
   */
  update: function (req, res) {
    var id = req.params.id;

    QuestionModel.findOne({ _id: id }, function (err, Question) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting Question",
          error: err,
        });
      }

      if (!Question) {
        return res.status(404).json({
          message: "No such Question",
        });
      }

      Question.title = req.body.title ? req.body.title : Question.title;
      Question.description = req.body.description
        ? req.body.description
        : Question.description;
      Question.date = req.body.date ? req.body.date : Question.date;
      Question.user = req.body.user ? req.body.user : Question.user;

      Question.save(function (err, Question) {
        if (err) {
          return res.status(500).json({
            message: "Error when updating Question.",
            error: err,
          });
        }

        return res.json(Question);
      });
    });
  },

  /**
   * QuestionController.remove()
   */
  remove: function (req, res) {
    var id = req.params.id;

    QuestionModel.findByIdAndRemove(id, function (err, Question) {
      if (err) {
        return res.status(500).json({
          message: "Error when deleting the Question.",
          error: err,
        });
      }

      return res.status(204).json();
    });
  },
};
