import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Инициализация Telegram Web Apps API
const tg = window.Telegram.WebApp;
const initData = tg.initData;
if (tg) {
  tg.ready(); // Подготовка мини-приложения
  tg.expand(); // Разворачиваем на весь экран
  tg.setBackgroundColor("#000000"); // Чёрный фон
  tg.enableClosingConfirmation(); // Защита от случайного выхода

  console.log("Telegram WebApp API загружен:", tg);
} else {
  console.error("⚠️ Telegram WebApp API не найден. Запусти мини-приложение в Telegram.");
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);