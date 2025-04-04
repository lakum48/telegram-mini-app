const TelegramBot = require('node-telegram-bot-api');
const token = '7713849891:AAF0ZqFq-LTkbeMKqHPFq_-h0wZjXR-K58Y';
const bot = new TelegramBot(token, {polling: true});

// Хранилище чатов (в реальном приложении используйте БД)
const activeChats = {};

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  
  if (msg.text === '/start') {
    await bot.sendMessage(chatId, 'Добро пожаловать на наш сайт!', {
      reply_markup: {
        inline_keyboard: [
          [{text: 'Открыть сайт', web_app: {url: 'http://195.133.48.208:3000/'}}]
        ]
      }
    });
  }
});

// Обработка данных из WebApvp
bot.on('web_app_data', async (msg) => {
  const data = JSON.parse(msg.web_app_data.data);
  
  if (data.type === 'new_message') {
    const adminId = 'ВАШ_ID_В_TELEGRAM'; // Замените на ваш ID
    const userInfo = `Пользователь: ${data.username} (ID: ${data.userId})`;
    
    // Сохраняем чат
    activeChats[data.userId] = {
      username: data.username,
      chatId: msg.chat.id
    };
    
    // Отправляем уведомление админу
    await bot.sendMessage(adminId, `✉️ Новое сообщение\n${userInfo}\n\n${data.message}`);
  }
});