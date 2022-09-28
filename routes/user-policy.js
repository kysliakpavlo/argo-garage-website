var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('user-policy', { title: 'Argonovo | User Policy' });
});

module.exports = router;
