const app = require('./app');
const config = require('./config');

const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000', // Разрешаем запросы с локального фронтенда
  'https://web.telegram.org', // Добавляем Telegram Web
  'https://web.telegram.org/k/', // Для безопасности укажем конкретный поддомен
  'https://t.me', // Добавьте этот домен
  'https://your-mini-app-domain.com' // Если у вас есть кастомный домен для Mini App
];


app.use(cors({ 
  origin: function(origin, callback) {
    // Если origin пустой (например, для запросов с cURL или Postman), то разрешить доступ
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



const PORT = process.env.PORT || 3001; // Измените 3000 на другой порт, например 3001

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
