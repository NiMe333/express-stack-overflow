var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
require("dotenv").config();
var session = require("express-session");

var indexRouter = require("./routes/index");
var questionRouter = require("./routes/QuestionRoutes");
var answerRouter = require("./routes/AnswerRoutes");
var userRouter = require("./routes/UserRoutes");
var authRouter = require("./routes/auth");

var app = express();

// Connect to MongoDB
mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => console.log("MongoDB error:", err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs"); // uses Handlebars

app.use(logger("dev")); // log in terminal
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // Za POST form
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "your_secret_key",
    resave: false, // ne shranjuje sessiona, če ni sprememb
    saveUninitialized: false, // ne ustvari praznih sej
  }),
);

app.use(function (req, res, next) {
  res.locals.user = req.session.user; // globalno shranim user-ja
  next();
});

function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  next();
}

app.use("/", indexRouter);

app.use("/questions", requireLogin, questionRouter);
app.use("/answers", requireLogin, answerRouter);
app.use("/user", requireLogin, userRouter);
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
