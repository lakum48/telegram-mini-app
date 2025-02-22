const cryptoService = require('../services/cryptoService');

exports.getCryptos = async (req, res) => {
  try {
    const cryptos = await cryptoService.getCryptos();
    res.json(cryptos);
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