const db = require('../db');

// TODO pu each handler in a separate file
const startHandler = async (ctx) => {
  const [user] = await db.executeQuery({
    text: 'SELECT * FROM users WHERE id=$1',
    values: [ctx.message.chat.id],
  });
  if (user === undefined) {
    // TODO add logging here
    await db.insertOrUpdate({
      text: 'INSERT INTO users(id, username, state) VALUES ($1,$2,$3)',
      values: [ctx.message.chat.id, ctx.message.chat.username, 1],
    });
    ctx.reply(`Welcome ${ctx.message.chat.first_name}`);
    ctx.reply('Please enter the album/playlist name');
  } else if (user.state === 1) {
    ctx.reply('You have not finished your previous session');
    ctx.reply('Please enter the album/playlist name');
  } else if (user.state === 2) {
    ctx.reply('You have not finished your previous session');
  } else {
    await db.insertOrUpdate({
      text: 'UPDATE users SET state=1 WHERE id=$1',
      values: [ctx.message.chat.id],
    });
    ctx.reply('Please enter the album/playlist name');
  }
};

exports.startHandler = startHandler;
