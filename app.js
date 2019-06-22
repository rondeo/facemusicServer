var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');
var methodOverride = require('method-override');
var cloudinary = require('cloudinary');

var usersRouter = require('./routes/users');
var genresRouter = require('./routes/genres');
var indexRouter = require('./routes/index');
var messageRouter = require('./routes/messages');
var updateRouter = require('./routes/updates');

// var socket = require('./socket/socket');

var app = express();
// app.io = require('socket.io')();
// socket(app.io);

require('dotenv').config();

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
})

mongoose.connect(
  process.env.MONGODB_URI, { useNewUrlParser: true }, err => 
  err ? console.log('Error: ', err) : console.log('MongoDB is connected!')
)

mongoose.set('useFindAndModify', false);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'frontend/build')));
app.use(cors());
app.use(methodOverride('_method')); 

app.use('/users', usersRouter);
app.use('/genres', genresRouter);
app.use('/messages', messageRouter);
app.use('/updates', updateRouter);
app.use('/', indexRouter);

app.use((req, res, next) => {
  res.header("Access-Control-Expose-Headers", "Access-Control-Allow-Origin")
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Authorization");
  next();
})

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
