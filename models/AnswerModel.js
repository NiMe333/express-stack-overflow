var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AnswerSchema = new Schema({
  content: String,
  date: Date,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: "Question",
  },
  accepted: Boolean,
});

module.exports = mongoose.model("Answer", AnswerSchema);
