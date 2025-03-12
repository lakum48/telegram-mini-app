const TelegramBot = require('node-telegram-bot-api');

const token = '7713849891:AAF0ZqFq-LTkbeMKqHPFq_-h0wZjXR-K58Y';
const webAppUrl = 'https://fallaciously-eloquent-tenpounder.cloudpub.ru/'

const bot = new TelegramBot(token, {polling: true});


bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text; 

  if(text === '/start') {
    await bot.sendMessage(chatId, 'Приветствую тебя в нашем боте Крипто-Аналитике !',{
      reply_murkup:{
        inline_keyboard:[
          [{text:'Сайт', web_app: {url: webAppUrl}}]
        ]
      }

    })
  }
});