const app = require('./app');
const config = require('./config');

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});