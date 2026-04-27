var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
require('dotenv').config();

var indexRouter = require('./routes/index');
var questionRouter = require('./routes/QuestionRoutes');
var answerRouter = require('./routes/AnswerRoutes');
var userRouter = require('./routes/UserRoutes');

var app = express();

// Connect to MongoDB
mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.log('MongoDB error:', err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/questions', questionRouter);
app.use('/answers', answerRouter);
app.use('/user', userRouter);

app.get('/db-test', async (req, res) => {
  try {
    const result = await mongoose.connection.db.admin().ping();

    res.json({
      message: 'MongoDB Atlas connection works',
      result
    });
  } catch (err) {
    res.status(500).json({
      message: 'MongoDB Atlas connection failed',
      error: err.message
    });
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
