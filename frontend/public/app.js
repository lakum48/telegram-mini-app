document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const cryptoDetails = document.getElementById('crypto-details');

  searchButton.addEventListener('click', async () => {
    const cryptoId = searchInput.value.trim().toLowerCase();
    if (!cryptoId) {
      alert('Введите ID монеты');
      return;
    }

    // Добавляем задержку в 1 секунду
    setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/cryptos/${cryptoId}`);
        const data = await response.json();

        if (data) {
          cryptoDetails.innerHTML = `
            <h2>${data.name} (${data.symbol.toUpperCase()})</h2>
            <p>Цена: $${data.price}</p>
            <p>Рыночная капитализация: $${data.market_cap}</p>
            <p>Изменение за 24 часа: ${data.change_24h}%</p>
          `;
        } else {
          cryptoDetails.innerHTML = '<p>Монета не найдена</p>';
        }
      } catch (error) {
        console.error('Ошибка при запросе данных:', error);
        cryptoDetails.innerHTML = '<p>Ошибка при загрузке данных</p>';
      }
    }, 1000); // Задержка в 1 секунду
  });
});