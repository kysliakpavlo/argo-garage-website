const Router = require('express-promise-router');
const router = new Router();

router.get('/', async (req, res) => {
  res.render('dashboard/profile', {
    title: 'Argonovo | Profile',
  });
});

module.exports = router;