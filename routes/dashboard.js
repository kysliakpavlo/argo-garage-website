var express = require('express');
var router = express.Router();

var leftColumn = 'Left Column';
var middleColumn = 'Middle Column';
var rightColumn = 'Right Column';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('moderate', {
    title: 'Argonovo | Dashboard',
    left: leftColumn,
    middle: middleColumn,
    right: rightColumn
  });
});

module.exports = router;
