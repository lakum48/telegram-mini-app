const { parseCryptoData } = require('../utils/parser');

exports.getCryptos = async () => {
  const cryptos = await parseCryptoData();
  console.log('Cryptos from service:', cryptos); // Вывод данных в консоль
  return cryptos;
};

exports.getCryptoDetails = async (id) => {
  const cryptos = await parseCryptoData();
  return cryptos.find((crypto) => crypto.id === id);
};