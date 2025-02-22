const axios = require('axios');
const cheerio = require('cheerio');

async function parseCryptoData() {
  try {
    const url = 'https://coinmarketcap.com/';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const cryptos = [];
    $('tr.cmc-table-row').each((i, element) => {
      const name = $(element).find('.cmc-table__column-name a').text().trim();
      const price = $(element).find('.cmc-table__cell--sort-by__price span').text().trim();
      if (name && price) {
        cryptos.push({ id: name.toLowerCase(), name, price });
      }
    });

    console.log('Parsed cryptos:', cryptos); // Вывод данных в консоль
    return cryptos.slice(0, 10); // Возвращаем топ-10 криптовалют
  } catch (error) {
    console.error('Ошибка при парсинге данных:', error.message);
    throw new Error('Ошибка при парсинге данных: ' + error.message);
  }
}

module.exports = { parseCryptoData };
