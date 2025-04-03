import React, { useState, useRef, useEffect } from 'react';
import './News.css';
import cryptoData from './cr.json';

function News() {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNews, setSelectedNews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [limit, setLimit] = useState(2);
  const [tempLimit, setTempLimit] = useState(2); // Добавляем временное состояние для лимита
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const limitInputRef = useRef(null);

  // Загружаем данные из JSON при монтировании компонента и при изменении лимита
  useEffect(() => {
    setLoading(true);
    try {
      const limitedData = cryptoData.slice(0, limit);
      setCryptos(limitedData);
    } catch (error) {
      setError('Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Обработка поиска
  const fetchCryptoSearch = () => {
    if (!searchQuery.trim()) {
      const limitedData = cryptoData.slice(0, limit);
      setCryptos(limitedData);
      return;
    }

    setLoading(true);
    try {
      const query = searchQuery.toLowerCase();
      const filteredData = cryptoData.filter(coin => 
        coin.name.toLowerCase().includes(query) || 
        coin.symbol.toLowerCase().includes(query)
      ).slice(0, limit);
      setCryptos(filteredData);
    } catch (error) {
      setError('Ошибка при поиске данных');
    } finally {
      setLoading(false);
    }
  };

  // Заглушка для получения новостей
  const fetchNews = (coinId) => {
    const mockNews = [
      {
        title: `Новости о ${cryptoData.find(c => c.id === coinId)?.name || 'криптовалюте'}`,
        source: "CryptoNews",
        published_at: new Date().toISOString(),
        url: "https://example.com"
      }
    ];
    setSelectedNews(mockNews);
    setIsModalOpen(true);
  };

  const handleLimitChange = (e) => {
    const value = Number(e.target.value);
    if (value > 0) {
      setTempLimit(value); // Сохраняем во временное состояние
    }
  };

  const applyLimit = () => {
    setLimit(tempLimit); // Применяем временное значение к основному лимиту
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClick = () => {
    fetchCryptoSearch();
  };

  if (loading) return <p>Загрузка данных...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="news-container">
      <h2>Новости криптовалют</h2>

      <p>Введите монету:</p>
      <label htmlFor="crypto-search">Поиск криптовалюты:</label>
      <div className="search-container">
        <input
          type="text"
          id="crypto-search"
          value={searchQuery}
          onChange={handleSearchChange}
          ref={searchInputRef}
          placeholder="Введите название или символ"
        />
        <button onClick={handleSearchClick}>ПОИСК</button>
      </div>

      <p>Количество отображаемых монет:</p>
      <label htmlFor="crypto-limit">Количество монет:</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          type="number"
          id="crypto-limit"
          value={tempLimit}
          onChange={handleLimitChange}
          ref={limitInputRef}
          min="1"
          step="1"
        />
        <button onClick={applyLimit}>Применить</button>
      </div>

      <div className="crypto-list">
        {cryptos.length > 0 ? (
          cryptos.map((coin) => (
            <div key={coin.id} className="crypto-item">
              <h3>{coin.name} ({coin.symbol.toUpperCase()})</h3>
              <p>Цена: ${coin.price}</p>
              <p>Рыночная капитализация: ${coin.market_cap.toLocaleString()}</p>
              <p>Изменение за 24 часа: {coin.change_24h}%</p>
              <button onClick={() => fetchNews(coin.id)}>Посмотреть новости</button>
            </div>
          ))
        ) : (
          <p>Ничего не найдено</p>
        )}
      </div>

      {isModalOpen && (
        <div className="news-modal">
          <div className="news-modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
            <h3>Новости</h3>
            {selectedNews.length > 0 ? (
              selectedNews.map((news, index) => (
                <div key={index} className="news-item">
                  <h4>{news.title}</h4>
                  <p>Источник: {news.source}</p>
                  <p>Опубликовано: {new Date(news.published_at).toLocaleString()}</p>
                  <a href={news.url} target="_blank" rel="noopener noreferrer">Читать далее</a>
                </div>
              ))
            ) : (
              <p>Новости не найдены</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default News;