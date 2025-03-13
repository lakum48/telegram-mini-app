import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './News.css';

function News() {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNews, setSelectedNews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [limit, setLimit] = useState(2);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('market_cap'); // По умолчанию сортировка по капитализации
  const [sortOrder, setSortOrder] = useState('desc'); // По умолчанию сортировка по убыванию
  const searchInputRef = useRef(null);
  const limitInputRef = useRef(null);

  useEffect(() => {
    fetchCryptos();
  }, [limit, sortBy, sortOrder]); 

  const fetchCryptos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://trenchantly-sensitive-mara.cloudpub.ru/api/cryptos?sortBy=${sortBy}&sortOrder=${sortOrder}&limit=${limit}`);
      setCryptos(response.data);
    } catch (error) {
      setError('Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  const fetchCryptoSearch = async () => {
    if (!searchQuery.trim()) {
      fetchCryptos(); 
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`https://trenchantly-sensitive-mara.cloudpub.ru/api/search?query=${searchQuery}`);
      setCryptos(response.data);
    } catch (error) {
      setError('Ошибка при поиске данных');
    } finally {
      setLoading(false);
    }
  };

  const fetchNews = async (coinId) => {
    console.log(`Запрос новостей для криптовалюты с ID: ${coinId}`);
    try {
      const response = await axios.get(`https://trenchantly-sensitive-mara.cloudpub.ru/api/news/${coinId}`);
      console.log('Получены новости:', response.data);
      setSelectedNews(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Ошибка при получении новостей:', error);
      setSelectedNews([]);
      setIsModalOpen(true);
    }
  };

   


  const handleLimitChange = (e) => {
    const value = Number(e.target.value);
    if (value > 0) {
      setLimit(value);
    }
    setTimeout(() => limitInputRef.current?.focus(), 0);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClick = () => {
    fetchCryptoSearch(); 
  };

  const handleSortChange = (e) => {
    const [sortField, order] = e.target.value.split('|');
    setSortBy(sortField);
    setSortOrder(order);
  };

  if (loading) return <p>Загрузка данных...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="news-container">
      <h2>Новости криптовалют</h2>

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

      <label htmlFor="crypto-limit">Количество монет:</label>
      <input
        type="number"
        id="crypto-limit"
        value={limit}
        onChange={handleLimitChange}
        ref={limitInputRef}
        min="1"
        step="1"
      />

      <label htmlFor="sort-options">Сортировать по:</label>
      <select id="sort-options" onChange={handleSortChange} value={`${sortBy}|${sortOrder}`}>
        <option value="price|asc">Цена (по возрастанию)</option>
        <option value="price|desc">Цена (по убыванию)</option>
        <option value="market_cap|asc">Капитализация (по возрастанию)</option>
        <option value="market_cap|desc">Капитализация (по убыванию)</option>
        <option value="change_24h|asc">Изменение за 24 часа (по возрастанию)</option>
        <option value="change_24h|desc">Изменение за 24 часа (по убыванию)</option>
      </select>

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
