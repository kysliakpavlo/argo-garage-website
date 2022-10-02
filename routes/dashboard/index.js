var express = require('express');
var app = express();

var flaggedRouter	= require('./flagged');
var reviewRouter	= require('./review');
var processRouter	= require('./process');

app.use('/', flaggedRouter);
app.use('/flagged', flaggedRouter);
app.use('/review', reviewRouter);

// example /process/id/1323/mod/j
//  modification image_id=1, done processing
app.use('/process\/id\/[0-9]+\/mod\/[a-z0-9]', processRouter);

module.exports = app;