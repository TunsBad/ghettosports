var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var authenticate = require('./authenticate');
var cors = require('cors');

var config = require('./config');

mongoose.Promise = global.Promise;

mongoose.connect(config.mongoUrl, { useMongoClient: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Server has successfully connected to Database");
});

var index = require('./routes/index');
var users = require('./routes/users');
var gossipRouter = require('./routes/gossipRouter');
var enquiryRouter = require('./routes/enquiryRouter');
var topstoryRouter = require('./routes/topstoryRouter');
var ghstoryRouter = require('./routes/ghstoryRouter');
var headlineRouter = require('./routes/headlineRouter');
var webstoryRouter = require('./routes/webstoryRouter');

var app = express();

app.set('port', (process.env.PORT || 3000));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// passport config
app.use(passport.initialize());

app.use(express.static(path.join(__dirname, 'frontend/app')));

app.use('/', index);
app.use('/users', users);
app.use('/gossips', gossipRouter);
app.use('/enquiries', enquiryRouter);
app.use('/topstories', topstoryRouter);
app.use('/ghstories', ghstoryRouter);
app.use('/headlines', headlineRouter);
app.use('/webstories', webstoryRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

app.listen(app.get('port'), function() {
  console.log('The app is running on port', app.get('port'));
});

module.exports = app;
