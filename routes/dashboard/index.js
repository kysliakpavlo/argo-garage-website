var express = require('express');
var app = express();

var profileRouter	= require('./profile');
var eventsRouter	= require('./events');
var reviewRouter	= require('./review');
var processRouter	= require('./process');
var searchRouter	= require('./search');

const namespace = (process.env.MANAGEMENT_API_IDENTIFIER || '').replace(/\/$/, '') + '/permissions';

function checkPermissions(perm) {
  return (req, res, next) => {
    if (Array.isArray(req.oidc.user[namespace]) && req.oidc.user[namespace].includes(perm)) {
      next();
    } else {
      res.redirect('/dashboard');
    }
  };
}

app.use('/', profileRouter);
app.use('/profile', profileRouter);
app.use('/events', checkPermissions('create:events'), eventsRouter);
app.use('/review', checkPermissions('update:review'), reviewRouter);
app.use('/search', checkPermissions('read:article'), searchRouter);

// example /process/id/1323/mod/j
//  modification image_id=1, done processing
app.use('/process\/id\/[0-9]+\/mod\/[a-z0-9]', processRouter);

module.exports = app;