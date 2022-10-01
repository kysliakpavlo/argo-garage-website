var express = require('express');
var path = require('path');
var app = express();

var flaggedRouter	= require('./flagged');
var reviewRouter	= require('./review');

app.use('/', flaggedRouter);
app.use('/flagged', flaggedRouter);
app.use('/review', reviewRouter);

module.exports = app;