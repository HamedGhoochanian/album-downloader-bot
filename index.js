const { Telegraf } = require('telegraf');
const config = require('config');
const handlers = require('./src/handlers');

const bot = new Telegraf(config.get('BOT_TOKEN'));

bot.command('oldschool', (ctx) => ctx.reply('Hello'));

/*
0 is idle state
1 is waiting for album name
2 is waiting for files
 */
bot.command('start', handlers.commands.startHandler);

bot.command('done', handlers.commands.doneHandler);

bot.on('text', handlers.types.textHandler);

bot.on('audio', handlers.types.audioHandler);

bot.launch()
  .then(() => {
    console.log('bot started');
  });
