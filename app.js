var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const rateLimit = require('express-rate-limit');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//Trust proxy because of NGINX
app.set('trust proxy', 1);

app.use(logger(':method :url :status :response-time ms - :remote-addr'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Rate limiting
const registerApiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, //1 hour
  max: 15,
});

const loginApiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, //1 hour
  max: 50,
});

//Routes

// API/V1

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  //res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.error = {};
  res.locals.error.status = err.status || 500;
  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    e: {
      message: res.locals.message,
      status: res.locals.error.status,
    },
  });
});

module.exports = app;
