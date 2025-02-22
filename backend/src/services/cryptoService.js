const { parseCryptoData } = require('../utils/parser');

exports.getCryptos = async () => {
  const cryptos = await parseCryptoData();
  return cryptos;
};

exports.getCryptoDetails = async (id) => {
  const cryptos = await parseCryptoData();
  return cryptos.find((crypto) => crypto.id === id);
};