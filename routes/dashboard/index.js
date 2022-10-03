var express = require('express');
var app = express();

var reviewRouter	= require('./review');
var processRouter	= require('./process');

app.use('/', reviewRouter);

//processing quees are
//  0 = review everything with priorites
//  1 = just review amazon flagged images
//  2 = just review unflagged (should be good) images
app.use('/review(\/[012])?', reviewRouter);

// example /process/id/1323/mod/j
//  modification image_id=1, done processing
app.use('/process\/id\/[0-9]+\/mod\/[a-z0-9]', processRouter);

module.exports = app;