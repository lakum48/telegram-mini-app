document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const cryptoDetails = document.getElementById('crypto-details');
  const sortBySelect = document.getElementById('sort-by');
  const limitInput = document.getElementById('limit');
  const refreshButton = document.getElementById('refresh-button');
  const cryptoList = document.getElementById('crypto-list');

  // Элементы модального окна
  const newsModal = document.getElementById('news-modal');
  const newsContent = document.getElementById('news-content');
  const closeModal = document.querySelector('.close');

  // Функция для открытия модального окна
  const openModal = () => {
    newsModal.style.display = 'block';
  };

  // Функция для закрытия модального окна
  const closeModalHandler = () => {
    newsModal.style.display = 'none';
  };

  // Закрытие модального окна при клике на крестик
  closeModal.addEventListener('click', closeModalHandler);

  // Закрытие модального окна при клике вне его области
  window.addEventListener('click', (event) => {
    if (event.target === newsModal) {
      closeModalHandler();
    }
  });

  // Функция для загрузки списка криптовалют
  const loadCryptos = async (sortBy = 'market_cap', limit = 100) => {
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
          <p>Изменение за 24 часа: ${coin.change_24h}%</p>
          <button onclick="loadNews('${coin.id}')">Посмотреть новости</button>
        `;
        cryptoList.appendChild(coinElement);
      });
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      cryptoList.innerHTML = '<p>Ошибка при загрузке данных</p>';
    }
  };

  // Функция для загрузки новостей
  window.loadNews = async (coinId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/news/${coinId}`);
      const news = await response.json();

      // Очистка содержимого модального окна
      newsContent.innerHTML = '';

      // Отображение новостей
      if (news.length > 0) {
        news.forEach((item) => {
          const newsItem = document.createElement('div');
          newsItem.className = 'news-item';
          newsItem.innerHTML = `
            <h4>${item.title}</h4>
            <p>Источник: ${item.source}</p>
            <p>Опубликовано: ${new Date(item.published_at).toLocaleString()}</p>
            <a href="${item.url}" target="_blank">Читать далее</a>
          `;
          newsContent.appendChild(newsItem);
        });
      } else {
        newsContent.innerHTML = '<p>Новости не найдены</p>';
      }

      // Открытие модального окна
      openModal();
    } catch (error) {
      console.error('Ошибка при загрузке новостей:', error);
      newsContent.innerHTML = '<p>Ошибка при загрузке новостей</p>';
      openModal();
    }
  };

  // Загрузка всех монет при загрузке страницы
  loadCryptos();

  // Обновление списка при нажатии на кнопку
  refreshButton.addEventListener('click', () => {
    const sortBy = sortBySelect.value;
    const limit = limitInput.value;
    loadCryptos(sortBy, limit);
  });

  // Поиск криптовалюты
  searchButton.addEventListener('click', async () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      alert('Введите название монеты или символ');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/search?query=${query}`);
      const data = await response.json();

      // Очистка списка перед добавлением новых данных
      cryptoList.innerHTML = '';

      // Отображение результатов поиска
      if (data.length > 0) {
        data.forEach(coin => {
          const coinElement = document.createElement('div');
          coinElement.className = 'crypto-item';
          coinElement.innerHTML = `
            <h3>${coin.name} (${coin.symbol.toUpperCase()})</h3>
            <p>Цена: $${coin.price}</p>
            <p>Рыночная капитализация: $${coin.market_cap}</p>
            <p>Изменение за 24 часа: ${coin.change_24h}%</p>
            <button onclick="loadNews('${coin.id}')">Посмотреть новости</button>
          `;
          cryptoList.appendChild(coinElement);
        });
      } else {
        cryptoList.innerHTML = '<p>Ничего не найдено</p>';
      }
    } catch (error) {
      console.error('Ошибка при поиске:', error);
      cryptoList.innerHTML = '<p>Ошибка при поиске</p>';
    }
  });
});