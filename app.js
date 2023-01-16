var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var readline = require('readline');
require('dotenv').config();
const { auth, requiresAuth } = require('express-openid-connect');

var indexRouter	= require('./routes/index');
var dashboardRouter = require('./routes/dashboard/index');
var privacyPolicyRouter = require('./routes/privacy-policy');
var userPolicyRouter = require('./routes/user-policy');

var app = express();

app.use(
	auth({
		authRequired: false,
		auth0Logout: true,
		issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
		baseURL: process.env.AUTH0_BASE_URL,
		clientID: process.env.AUTH0_CLIENT_ID,
		secret: process.env.AUTH0_SECRET
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
app.use('/dashboard', requiresAuth(), dashboardRouter);
app.use('/privacy-policy', privacyPolicyRouter);
app.use('/privacy-policy.html', privacyPolicyRouter); // Deprecate after next release
app.use('/user-policy', userPolicyRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === process.env.ENVIRONMENT ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
