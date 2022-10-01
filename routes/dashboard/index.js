var express = require('express');
var path = require('path');
var app = express();

var flaggedRouter	= require('./flagged');

app.use('/', flaggedRouter);
app.use('/flagged', flaggedRouter);
app.use('/review', flaggedRouter);

module.exports = app;