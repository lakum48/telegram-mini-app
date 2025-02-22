const axios = require('axios');

async function parseCryptoData() {
  try {
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';
    const { data } = await axios.get(url);

    // Преобразуем данные в нужный формат
    const cryptos = data.map((coin) => ({
      id: coin.id,
      name: coin.name,
      price: coin.current_price,
      market_cap: coin.market_cap,
      change_24h: coin.price_change_percentage_24h,
    }));

    console.log('Parsed cryptos:', cryptos); // Вывод данных в консоль
    return cryptos;
  } catch (error) {
    console.error('Ошибка при запросе к CoinGecko API:', error.message);
    throw new Error('Ошибка при запросе к CoinGecko API: ' + error.message);
  }
}

module.exports = { parseCryptoData };