var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var readline = require('readline');
require('dotenv').config();
const { auth, requiresAuth } = require('express-openid-connect');

var indexRouter	= require('./routes/index');
var dashboardRouter = require('./routes/dashboard');
var contactRouter = require('./routes/contact');
var privacyPolicyRouter = require('./routes/privacy-policy');
var userPolicyRouter = require('./routes/user-policy');
var roadmapRouter = require('./routes/roadmap');
var helpOutRouter = require('./routes/helpout');

var app = express();

app.use(
	auth({
		authRequired: false,
		auth0Logout: true,
		issuerBaseURL: process.env.ISSUER_BASE_URL,
		baseURL: process.env.BASE_URL,
		clientID: process.env.CLIENT_ID,
		secret: process.env.SECRET
	})
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);
app.use('/contact', contactRouter);
app.use('/privacy-policy', privacyPolicyRouter);
app.use('/privacy-policy.html', privacyPolicyRouter); // Deprecate after next release
app.use('/user-policy', userPolicyRouter);
app.use('/roadmap', roadmapRouter);
app.use('/helpout', helpOutRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'production' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
