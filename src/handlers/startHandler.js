const db = require('../db');
const { log } = require('../logger');

const startHandler = async (ctx) => {
  const { chat } = ctx.message;
  const [user] = await db.executeQuery({
    text: 'SELECT * FROM users WHERE id=$1',
    values: [chat.id],
  });

  if (user === undefined) {
    await db.insertOrUpdate({
      text: 'INSERT INTO users(id, username) VALUES ($1,$2)',
      values: [chat.id, chat.first_name],
    });
    ctx.reply(`Welcome ${ctx.message.chat.first_name}`);
    ctx.reply('Please enter the album/playlist name');
    // eslint-disable-next-line no-unused-vars
    const album = await db.insertOrUpdate({
      text: `INSERT INTO albums(name, creator_id, date, state)
             VALUES (NULL, $1, NOW(), 'waiting_for_name')`,
      values: [chat.id],
    });
    log({
      level: 'info',
      message: `startHandler created user with id: ${chat.id}`,
    });
  } else {
    const [album] = await db.executeQuery({
      text: `SELECT a.id as id, a.name as name, a.state as state, a.date as date
             FROM users u
                      join albums a on u.id = a.creator_id
             WHERE u.id = $1
             ORDER BY a.date DESC
             LIMIT 1`,
      values: [chat.id],
    });
    const { state } = album;
    if (state === 'zipped' || state === 'cancelled') {
      ctx.reply('Please enter a name for your album');
      await db.insertOrUpdate({
        text: `UPDATE albums
               SET state='waiting_for_name'
               WHERE id = $1`,
        values: [album.id],
      });
    } else if (state === 'waiting_for_name') {
      ctx.reply(`You have an unfinished album still waiting for a name
      either continue it or cancel it before starting a new album`);
      log({
        level: 'info',
        message: `user with id ${chat.id} tried invalid start`,
      });
    } else if (state === 'waiting_for_songs') {
      ctx.reply(`you have an unfinished album still waiting for songs
      either finish the previous album or cancel it before starting a new one`);
      log({
        level: 'info',
        message: `user with id ${chat.id} tried invalid start`,
      });
    }
  }
};

module.exports = startHandler;
