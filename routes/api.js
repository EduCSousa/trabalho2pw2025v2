const express = require('express');
const axios = require('axios');
const Search = require('../models/Search');

const router = express.Router();

router.post('/search', async (req, res) => {
  const term = req.body.term;
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${term}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
  const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`;

  try {
    const [weatherRes, wikiRes] = await Promise.all([
      axios.get(weatherUrl),
      axios.get(wikiUrl)
    ]);

    const results = {
      weather: weatherRes.data,
      wikipedia: wikiRes.data
    };

    await Search.create({ userId: req.user._id, term, results });

    res.render('dashboard', { user: req.user, results });
  } catch (err) {
    res.send('Erro ao procurar informações');
  }
});

module.exports = router;
