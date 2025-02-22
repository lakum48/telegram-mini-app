async function parseCryptoData() {
  try {
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';
    const { data } = await axios.get(url);

    const cryptos = data.map((coin) => ({
      id: coin.id,
      name: coin.name,
      price: coin.current_price,
    }));

    console.log('Parsed cryptos:', cryptos);
    return cryptos;
  } catch (error) {
    console.error('Ошибка при парсинге данных:', error.message);
    throw new Error('Ошибка при парсинге данных: ' + error.message);
  }
}