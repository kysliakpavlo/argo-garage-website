var express = require('express');
var app = express();

var profileRouter	= require('./profile');
var eventsRouter	= require('./events');
var reviewRouter	= require('./review');
var processRouter	= require('./process');
var searchRouter	= require('./search');

app.use('/', profileRouter);
app.use('/profile', profileRouter);
app.use('/events', eventsRouter);
app.use('/review', reviewRouter);
app.use('/search', searchRouter);

// example /process/id/1323/mod/j
//  modification image_id=1, done processing
app.use('/process\/id\/[0-9]+\/mod\/[a-z0-9]', processRouter);

module.exports = app;