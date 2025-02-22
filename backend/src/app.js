const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const config = require('./config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Корневой маршру
app.get('/', (req, res) => {
  res.send('Сервер работает!');
});

// Маршруты
app.use('/api', routes);

module.exports = app;