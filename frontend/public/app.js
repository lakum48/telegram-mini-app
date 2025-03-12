document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const cryptoDetails = document.getElementById('crypto-details');
  const sortBySelect = document.getElementById('sort-by');
  const limitInput = document.getElementById('limit');
  const refreshButton = document.getElementById('refresh-button');
  const cryptoList = document.getElementById('crypto-list');

  // Функция для загрузки списка криптовалют
  const loadCryptos = async () => {
    const sortBy = sortBySelect.value;
    const limit = limitInput.value;

    try {
      const response = await fetch(`http://localhost:3001/api/cryptos?sortBy=${sortBy}&limit=${limit}`);
      const data = await response.json();

      // Очистка списка перед добавлением новых данных
      cryptoList.innerHTML = '';

      // Отображение списка криптовалют
      data.forEach(coin => {
        const coinElement = document.createElement('div');
        coinElement.className = 'crypto-item';
        coinElement.innerHTML = `
          <h3>${coin.name} (${coin.symbol.toUpperCase()})</h3>
          <p>Цена: $${coin.price}</p>
          <p>Рыночная капитализация: $${coin.market_cap}</p>
        `;
        cryptoList.appendChild(coinElement);
      });
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      cryptoList.innerHTML = '<p>Ошибка при загрузке данных</p>';
    }
  };

  // Загрузка списка при загрузке страницы
  loadCryptos();

  // Обновление списка при нажатии на кнопку
  refreshButton.addEventListener('click', loadCryptos);

  // Поиск криптовалюты
  searchButton.addEventListener('click', async () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      alert('Введите название монеты');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/search?query=${query}`);
      const data = await response.json();

      // Очистка списка перед добавлением новых данных
      cryptoList.innerHTML = '';

      // Отображение результатов поиска
      data.forEach(coin => {
        const coinElement = document.createElement('div');
        coinElement.className = 'crypto-item';
        coinElement.innerHTML = `
          <h3>${coin.name} (${coin.symbol.toUpperCase()})</h3>
          <p>Цена: $${coin.price}</p>
          <p>Рыночная капитализация: $${coin.market_cap}</p>
        `;
        cryptoList.appendChild(coinElement);
      });
    } catch (error) {
      console.error('Ошибка при поиске:', error);
      cryptoList.innerHTML = '<p>Ошибка при поиске</p>';
    }
  });
});