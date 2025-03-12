import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Инициализация Telegram Web Apps API
const tg = window.Telegram.WebApp;
tg.ready(); // Сообщаем Telegram, что приложение готово
tg.expand(); // Расширяем приложение на весь экран

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);