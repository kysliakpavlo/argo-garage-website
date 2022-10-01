var express = require('express');
var app = express();

var flaggedRouter	= require('./flagged');

app.use('/', flaggedRouter);

module.exports = app;