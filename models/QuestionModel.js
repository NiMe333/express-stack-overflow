var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
  title: String,
  description: String,
  date: Date,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  views: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Question", QuestionSchema);
