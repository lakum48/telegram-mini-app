const cryptoService = require('../services/cryptoService');

exports.getCryptos = async (req, res) => {
  try {
    const { sortBy = 'market_cap', limit = 10 } = req.query;
    const cryptos = await cryptoService.getCryptos(sortBy, limit);

    if (cryptos.length === 0) {
      return res.status(404).json({ message: 'Список криптовалют пуст' });
    }

    res.json(cryptos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getCryptoNews = async (req, res) => {
  try {
    const { coinId } = req.params;
    const news = await cryptoService.getCryptoNews(coinId);
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCryptoDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const details = await cryptoService.getCryptoDetails(id);
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchCryptos = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Не указан поисковый запрос' });
    }

    const cryptos = await cryptoService.searchCryptos(query);
    res.json(cryptos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};