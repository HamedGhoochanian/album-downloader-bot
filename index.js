const { Telegraf } = require('telegraf');
const config = require('config');
const handlers = require('./src/handlers');

const bot = new Telegraf(config.get('BOT_TOKEN'));

bot.command('hello', (ctx) => ctx.reply('Hello'));

bot.command('start', handlers.commands.startHandler);

bot.command('done', handlers.commands.doneHandler);

bot.command('cancel', handlers.commands.cancelHandler);

bot.on('text', handlers.types.textHandler);

bot.on('audio', handlers.types.audioHandler);

bot.launch()
  .then(() => {
    console.log('bot started');
  });
