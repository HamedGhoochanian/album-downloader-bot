const db = require('../db');

const textHandler = async (ctx) => {
  const [user] = await db.executeQuery({
    text: 'SELECT * FROM users WHERE id=$1',
    values: [ctx.message.chat.id],
  });
  if (user === undefined) {
    ctx.reply('that was your first message');
    await db.insertOrUpdate({
      text: 'INSERT INTO users(id, username, state) VALUES ($1,$2,$3)',
      values: [ctx.message.chat.id, ctx.message.chat.username, 0],
    });
    ctx.reply(`Welcome ${ctx.message.chat.first_name}`);
  } else if (user.state === 1) {
    await db.insertOrUpdate({
      text: 'INSERT INTO albums(name, creator_id) VALUES ($1,$2)',
      values: [ctx.message.text, user.id],
    });
    await db.insertOrUpdate({
      text: 'UPDATE users SET latest_album_id=(SELECT max(id) FROM albums WHERE creator_id=$1) WHERE id=$1',
      values: [user.id],
    });
    ctx.reply('Album name received');
  } else {
    ctx.reply('invalid');
  }
};

exports.textHandler = textHandler;
