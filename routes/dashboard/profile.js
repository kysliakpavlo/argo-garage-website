const Router = require('express-promise-router');
const util = require('util');
const db = require('../../db');
const router = new Router();
require('dotenv').config();

router.get('/', async (req, res) => {
  res.render('dashboard/profile', {
    title: 'Argonovo | Profile',
  });
});

module.exports = router;