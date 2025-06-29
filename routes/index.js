const express = require('express');
const Search = require('../models/Search');
const router = express.Router();

function isAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

// Rota para a raiz '/'
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

router.get('/dashboard', isAuth, async (req, res) => {
  const history = await Search.find({ userId: req.user._id }).sort({ timestamp: -1 }).limit(5);
  res.render('dashboard', { user: req.user, results: null, history });
});

module.exports = router;
