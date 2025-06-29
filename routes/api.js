const express = require('express');
const axios = require('axios');
const Search = require('../models/Search');

const router = express.Router();

router.post('/search', async (req, res) => {
  const term = req.body.term;
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${term}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
  const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`;

  try {
    console.log('🔍 A pesquisar:', term);

    // Fazer as chamadas às APIs externas
    const [weatherRes, wikiRes] = await Promise.all([
      axios.get(weatherUrl),
      axios.get(wikiUrl)
    ]);

    // Verificações
    if (weatherRes.data.cod && weatherRes.data.cod !== 200) {
      throw new Error('OpenWeather: cidade não encontrada');
    }

    if (wikiRes.data.title === "Not found.") {
      throw new Error('Wikipedia: termo não encontrado');
    }

    const results = {
      weather: weatherRes.data,
      wikipedia: wikiRes.data
    };

    // Guardar pesquisa no histórico
    await Search.create({ userId: req.user._id, term, results });

    // Buscar histórico atualizado
    const history = await Search.find({ userId: req.user._id }).sort({ timestamp: -1 }).limit(5);

    // Renderizar dashboard
    res.render('dashboard', {
      user: req.user,
      results,
      history
    });

  } catch (err) {
    console.error('❌ Erro ao fazer mashup:', err.message);
    res.status(500).send('Erro no servidor: ' + err.message);
  }
});

module.exports = router;
