const express = require('express');
const cors = require('cors');
const app = require('./app');
const config = require('./config');

const allowedOrigins = [
  'http://localhost:3000', 
  'https://web.telegram.org', 
  'https://web.telegram.org/k/' 
];

app.use(cors({ 
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`⛔ Блокирован запрос от: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
));

app.use((req, res, next) => {
  console.log(`🔍 Получен запрос от: ${req.headers.origin}`);
  next();
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
