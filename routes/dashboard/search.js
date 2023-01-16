const Router = require('express-promise-router');
const router = new Router();

router.get('/', async (req, res) => {
  res.render('dashboard/search', {
    title: 'Argonovo | Search',
  });
});

module.exports = router;