const axios = require('axios');
const fs = require('fs');
const path = require('path');

const CRYPTO_DATA_FILE = path.join(__dirname, '../../frontend/src/cr.json');

async function parseAndSaveCryptoData(limit = 10) { // Добавляем параметр limit
  try {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1`;
    
    const { data } = await axios.get(url);
    
    const cryptos = data.map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.current_price,
      market_cap: coin.market_cap,
      change_24h: coin.price_change_percentage_24h
    }));

    // Создаем директории, если их нет
    const dir = path.dirname(CRYPTO_DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(CRYPTO_DATA_FILE, JSON.stringify(cryptos, null, 2));
    console.log(`Сохранено ${cryptos.length} криптовалют в ${CRYPTO_DATA_FILE}`);
    return cryptos;
  } catch (error) {
    console.error('Ошибка:', error.message);
    throw error;
  }
}

function startAutoUpdate(intervalMinutes = 10, limit = 10) { // Добавляем параметр limit
  parseAndSaveCryptoData(limit).catch(console.error);
  setInterval(() => parseAndSaveCryptoData(limit).catch(console.error), 
    intervalMinutes * 60 * 1000);
  console.log(`Автообновление: каждые ${intervalMinutes} мин, ${limit} монет`);
}

module.exports = { parseAndSaveCryptoData, startAutoUpdate };