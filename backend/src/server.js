const app = require('./app');
const config = require('./config');

const PORT = process.env.PORT || 3001; // Измените 3000 на другой порт, например 3001

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});