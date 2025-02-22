const axios = require('axios');
const NodeCache = require('node-cache');

// Создаем кэш с временем жизни 5 минут
const cache = new NodeCache({ stdTTL: 300 });

exports.getCryptos = async () => {
  try {
    // Проверяем, есть ли данные в кэше
    const cachedCryptos = cache.get('cryptos');
    if (cachedCryptos) {
      console.log('Данные получены из кэша');
      return cachedCryptos;
    }

    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1';
    const { data } = await axios.get(url);

    const cryptos = data.map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
    }));

    // Сохраняем данные в кэше
    cache.set('cryptos', cryptos);
    console.log('Данные сохранены в кэше');

    return cryptos;
  } catch (error) {
    console.error('Ошибка при запросе к CoinGecko API:', error.message);
    throw new Error('Ошибка при запросе к CoinGecko API: ' + error.message);
  }
};

exports.getCryptoDetails = async (id) => {
  try {
    // Проверяем, есть ли данные в кэше
    const cachedDetails = cache.get(id);
    if (cachedDetails) {
      console.log('Данные получены из кэша');
      return cachedDetails;
    }

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

    // Сохраняем данные в кэше
    cache.set(id, details);
    console.log('Данные сохранены в кэше');

    return details;
  } catch (error) {
    console.error('Ошибка при запросе данных о монете:', error.message);
    throw new Error('Ошибка при запросе данных о монете: ' + error.message);
  }
};