import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Инициализация Telegram Web Apps API
const tg = window.Telegram.WebApp;


// Настройка API URL (используем переменные окружения для гибкости)
const apiUrl = process.env.REACT_APP_API_URL || 'http://195.133.48.208/api/';

if (tg) {
  tg.ready(); // Подготовка мини-приложения
  tg.expand(); // Разворачиваем на весь экран
  tg.setBackgroundColor("#000000"); // Чёрный фон
  tg.enableClosingConfirmation(); // Защита от случайного выхода

  console.log("Telegram WebApp API загружен:", tg);
} else {
  console.error("⚠️ Telegram WebApp API не найден. Запусти мини-приложение в Telegram.");
}

// Функция для загрузки данных с API
const fetchData = async () => {
  try {
    const response = await fetch(`${apiUrl}cryptos?limit=2`);  // Пример запроса
    const data = await response.json();
    // Здесь вы можете обновить состояние, если нужно
    console.log(data); // Логируем ответ с API
  } catch (error) {
    console.error("Ошибка при загрузке данных с API:", error);
  }
};

// Вызываем функцию для загрузки данных при инициализации
fetchData();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
