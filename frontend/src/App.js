import React, { useState } from 'react';
import './App.css';
import Profile from './Profile'; // Импортируем компонент профиля
import MarketAnalysis from './MarketAnalysis'; // Импортируем компонент анализа рынка
import Predictions from './Predictions'; // Импортируем компонент прогнозов
import News from './News'; // Импортируем компонент новостей
import FAQ from './FAQ'; // Импортируем компонент FAQ

function App() {
  const [activeTab, setActiveTab] = useState('market');

  const renderContent = () => {
    switch (activeTab) {
      case 'market':
        return <MarketAnalysis />;
      case 'predictions':
        return <Predictions />;
      case 'news':
        return <News />;
      case 'profile':
        return <Profile />;
      case 'faq':
        return <FAQ />;
      default:
        return <MarketAnalysis />;
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Crypto Analyst Bot</h1>
        <p>Получайте актуальные данные о криптовалютах</p>
      </header>
      <nav>
        <button onClick={() => setActiveTab('market')}>Анализ рынка</button>
        <button onClick={() => setActiveTab('predictions')}>Прогнозы</button>
        <button onClick={() => setActiveTab('news')}>Новости</button>
        <button onClick={() => setActiveTab('profile')}>Профиль</button>
        <button onClick={() => setActiveTab('faq')}>FAQ</button> {/* Новая кнопка */}
      </nav>
      <main>
        {renderContent()}
      </main>
      <footer>
        <p>© 2025 Crypto Analyst Bot. Все права защищены.</p>
      </footer>
    </div>
  );
}

export default App;