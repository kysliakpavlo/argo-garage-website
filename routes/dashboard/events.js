const Router = require('express-promise-router');
const router = new Router();

router.get('/', async (req, res) => {
  res.render('dashboard/events', {
    title: 'Argonovo | Events',
  });
});

module.exports = router;