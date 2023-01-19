const Router = require('express-promise-router');
const router = new Router();

router.get('/', async (req, res) => {
  res.render('dashboard/profile', {
    title: 'Argonovo | Profile',
    user: req.oidc.user,
  });
});

module.exports = router;