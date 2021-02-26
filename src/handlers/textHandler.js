const { log } = require('../logger');
const db = require('../db');
const utils = require('../utils');

const textHandler = async (ctx) => {
  const { chat } = ctx.message;
  const [album] = await db.executeQuery({
    text: `SELECT a.id as id, a.name as name, a.state as state, a.date as date, u.id as user_id
           FROM users u
                    join albums a on u.id = a.creator_id
           WHERE u.id = $1
           ORDER BY a.date DESC
           LIMIT 1`,
    values: [chat.id],
  });

  if (album === undefined) {
    ctx.reply('You are not a user, user /start to become one');
  }
  const { state } = album;
  /* if user was waiting for a name, then set the incoming message as the latest album's name
  * otherwise inform them that the action was uncool */
  if (state === 'waiting_for_name') {
    let name = ctx.message.text;
    await db.insertOrUpdate({
      text: `UPDATE albums
             SET name=$1,
                 state='waiting_for_songs'
             WHERE id = $2`,
      values: [name, album.id],
    });
    log({
      level: 'info',
      message: `set name ${name} for album with id ${album.id}`,
    });
    ctx.reply('Album created, now send me some songs');
    try {
      name = name.replace(/\s+/g, '-');
      console.log(name);
      await utils.run(`mkdir -p ./downloads/${chat.id}/"${name}-${album.date.getTime()}"`);
      log({
        level: 'info',
        message: `created directory for album ${album.id}`,
      });
    } catch (e) {
      log({
        level: 'error',
        message: e.message,
      });
    }
  } else {
    await ctx.replyWithPhoto({
      source: './resources/not_supposed.jpg',
    }, {
      caption: 'uncool👀',
    });
    log({
      level: 'info',
      message: `user ${album.user_id} informed of invalid action`,
    });
  }
};

module.exports = textHandler;
