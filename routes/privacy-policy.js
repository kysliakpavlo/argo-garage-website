var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('privacy-policy', { title: 'Argonovo | Privacy Policy' });
});

module.exports = router;
