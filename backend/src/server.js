const app = require('./app');
const config = require('./config');
const cors = require('cors');
const { parseAndSaveCryptoData, startAutoUpdate } = require('./parser');
startAutoUpdate(5, 100); // Будет обновлять данные каждые 10 минут

const allowedOrigins = [
  'http://localhost:3000',
  'https://web.telegram.org',
  'https://web.telegram.org/k/',
  'https://t.me',
  'https://your-mini-app-domain.com',
  'http://localhost:55120',
  'https://fallaciously-eloquent-tenpounder.cloudpub.ru',
  'http://195.133.48.208',
  'http://195.133.48.208'
   // ваш домен
  
];


app.use(cors({ 
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  optionsSuccessStatus: 200,
  credentials: true
}));

app.use((req, res, next) => {
  console.log(`🔍 Получен запрос от: ${req.headers.origin}`);
  next();
});

// Пример маршрута для /api
app.get('/api', (req, res) => {
  res.json({ message: 'API is working' });  // Просто возвращает сообщение
});



const PORT = process.env.PORT || 3001; // Измените 3000 на другой порт, например 3001

app.listen(PORT,'0.0.0.0', () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
