const axios = require('axios');
const NodeCache = require('node-cache');

// Создаем кэш с временем жизни 5 минут
const cache = new NodeCache({ stdTTL: 300 });

exports.getCryptos = async (sortBy = 'market_cap', limit = 10) => {
  try {
    const cacheKey = `cryptos_${sortBy}_${limit}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1';
    const { data } = await axios.get(url);

    // Сортировка по выбранному параметру
    const sortedCryptos = data.sort((a, b) => b[sortBy] - a[sortBy]);

    // Ограничение по количеству
    const cryptos = sortedCryptos.slice(0, limit).map(coin => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.current_price,
      market_cap: coin.market_cap,
      change_24h: coin.price_change_percentage_24h,
    }));

    cache.set(cacheKey, cryptos);
    return cryptos;
  } catch (error) {
    console.error('Ошибка при запросе к CoinGecko API:', error.message);
    throw new Error('Ошибка при запросе к CoinGecko API: ' + error.message);
  }
};

exports.getCryptoNews = async (coinId) => {
  try {
    const cacheKey = `news_${coinId}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    const apiKey = '38a3b05c2c88bf50cc029994534440577a04782b';
    const url = `https://cryptopanic.com/api/v1/posts/?auth_token=${apiKey}&currencies=${coinId.toUpperCase()}`;

    const { data } = await axios.get(url);

    // Проверка наличия данных
    if (!data.results) {
      throw new Error('Новости не найдены');
    }

    // Форматирование данных новостей
    const news = data.results.map((post) => ({
      title: post.title,
      url: post.url,
      published_at: post.published_at,
      source: post.source.title,
    }));

    cache.set(cacheKey, news);
    return news;
  } catch (error) {
    console.error('Ошибка при запросе новостей:', error.response ? error.response.data : error.message);
    throw new Error('Ошибка при запросе новостей: ' + (error.response ? error.response.data : error.message));
  }
};

exports.searchCryptos = async (query) => {
  try {
    const cacheKey = `search_${query.toLowerCase()}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1';
    const { data } = await axios.get(url);

    // Поиск по частичному вводу (название или символ)
    const filteredCryptos = data
      .filter(coin =>
        coin.name.toLowerCase().includes(query.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(query.toLowerCase())
      )
      .map(coin => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        price: coin.current_price,
        market_cap: coin.market_cap,
        change_24h: coin.price_change_percentage_24h,
      }));

    cache.set(cacheKey, filteredCryptos);
    return filteredCryptos;
  } catch (error) {
    console.error('Ошибка при поиске криптовалют:', error.message);
    throw new Error('Ошибка при поиске криптовалют: ' + error.message);
  }
};

exports.getCryptoDetails = async (id) => {
  try {
    const cacheKey = `details_${id}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
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

    cache.set(cacheKey, details);
    return details;
  } catch (error) {
    console.error('Ошибка при запросе данных о монете:', error.message);
    throw new Error('Ошибка при запросе данных о монете: ' + error.message);
  }
};