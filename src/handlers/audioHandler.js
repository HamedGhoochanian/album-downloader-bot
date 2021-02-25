const db = require('../db');
const utils = require('../utils');
const { log } = require('../logger');

const audioHandler = async (ctx) => {
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
  if (state === 'waiting_for_songs') {
    const audioName = ctx.message.audio.file_name;
    try {
      const fileURL = (await ctx.telegram.getFileLink(ctx.message.audio.file_id)).href;
      await utils.download(fileURL,
        `./downloads/${chat.id}/${album.name.replace(/\s+/g, '-')}-${album.date.getTime()}`, audioName);
      await db.insertOrUpdate({
        text: `INSERT INTO songs(creator_id, album_id, file_name, date)
               VALUES ($1, $2, $3, now())`,
        values: [chat.id, album.id, audioName],
      });
      log({
        level: 'info',
        message: `saved song ${audioName} for album ${album.name} id: ${album.id}`,
      });
    } catch (e) {
      log({
        level: 'info',
        message: `error ${e.message} while saving song ${audioName}`
          + `for album ${album.name} id: ${album.id}`,
      });
    }
  }
};

exports.audioHandler = audioHandler;
