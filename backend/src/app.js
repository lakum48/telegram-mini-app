const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const config = require('./config');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Разрешить запросы с фронтенда
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Разрешенные методы
  credentials: true // Разрешить передачу куки и заголовков авторизации
}));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`🔍 Получен запрос от: ${req.headers.origin}`);
  next();
});

// Корневой маршрут
app.get('/', (req, res) => {
  res.send('Сервер работает!');
});

// Маршруты
app.use('/api', routes);

module.exports = app;