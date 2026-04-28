var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
  profileImage: {
    type: String,
    default: "/images/default-avatar.png",
  },
});

module.exports = mongoose.model("User", UserSchema);
