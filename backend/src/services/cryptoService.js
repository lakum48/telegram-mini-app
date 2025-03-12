const axios = require('axios');
const NodeCache = require('node-cache');

// Создаем кэш с временем жизни 5 минут
const cache = new NodeCache({ stdTTL: 300 });

exports.getCryptos = async (sortBy = 'market_cap', limit = 10) => {
  try {
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1';
    const { data } = await axios.get(url);

    // Сортировка по выбранному параметру
    const sortedCryptos = data.sort((a, b) => b[sortBy] - a[sortBy]);

    // Ограничение по количеству
    const cryptos = sortedCryptos.slice(0, limit);

    return cryptos;
  } catch (error) {
    console.error('Ошибка при запросе к CoinGecko API:', error.message);
    throw new Error('Ошибка при запросе к CoinGecko API: ' + error.message);
  }
};

exports.searchCryptos = async (query) => {
  try {
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1';
    const { data } = await axios.get(url);

    // Поиск по частичному вводу
    const filteredCryptos = data.filter(coin =>
      coin.name.toLowerCase().includes(query.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(query.toLowerCase())
    );

    return filteredCryptos;
  } catch (error) {
    console.error('Ошибка при поиске криптовалют:', error.message);
    throw new Error('Ошибка при поиске криптовалют: ' + error.message);
  }
};

exports.getCryptoDetails = async (id) => {
  try {
    const url = `https://api.coingecko.com/api/v3/coins/${id}`;
    const { data } = await axios.get(url);

    const details = {
      id: data.id,
      name: data.name,
      symbol: data.symbol,
      price: data.market_data.current_price.usd,
      market_cap: data.market_data.market_cap.usd,
      change_24h: data.market_data.price_change_percentage_24h,
    };

    return details;
  } catch (error) {
    console.error('Ошибка при запросе данных о монете:', error.message);
    throw new Error('Ошибка при запросе данных о монете: ' + error.message);
  }
};