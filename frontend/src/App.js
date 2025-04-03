import React, { useState } from 'react';
import './App.css';
import Cube from './Cube';
import Profile from './Profile';
import MarketAnalysis from './MarketAnalysis';
import Predictions from './Predictions';
import News from './News';
import FAQ from './FAQ';

// Импортируем изображения из папки frontend/src/pic
import homeIcon from './pic/home.png';
import marketIcon from './pic/chat.png';
import predictionsIcon from './pic/predictions.png';
import newsIcon from './pic/news.png';
import profileIcon from './pic/profile.png';
import faqIcon from './pic/faq.png';

function App() {
  const [activeTab, setActiveTab] = useState(null);

  const renderContent = () => {
    if (!activeTab) return <Cube />;

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
        return <Cube />;
    }
  };

  return (
    <div className="app">
      <div className="landing-page">
        <main>{renderContent()}</main>

        <nav className="bottom-navbar">
          <button onClick={() => setActiveTab(null)}>
            <img src={homeIcon} alt="Home" />
          </button>
          <button onClick={() => setActiveTab('market')}>
            <img src={marketIcon} alt="Market" />
          </button>
          <button onClick={() => setActiveTab('predictions')}>
            <img src={predictionsIcon} alt="Predictions" />
          </button>
          <button onClick={() => setActiveTab('news')}>
            <img src={newsIcon} alt="News" />
          </button>
          <button onClick={() => setActiveTab('profile')}>
            <img src={profileIcon} alt="Profile" />
          </button>
          <button onClick={() => setActiveTab('faq')}>
            <img src={faqIcon} alt="FAQ" />
          </button>
        </nav>
      </div>
    </div>
  );
}

export default App;
