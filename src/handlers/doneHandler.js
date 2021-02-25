const config = require('config');
const utils = require('../utils');
const db = require('../db');
const { log } = require('../logger');

const doneHandler = async (ctx) => {
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
  const { state } = album;
  if (album === undefined) {
    ctx.reply('U is not a user');
  } else if (state === 'waiting_for_name') {
    ctx.reply('your album has no name, first give it a name');
  } else if (state === 'zipping') {
    ctx.reply('your album is getting processed');
  } else if (state === 'waiting_for_songs') {
    const songs = await db.executeQuery({
      text: `SELECT s.id as song_id, a.id as album_id, a.date as album_date, a.name as album_name
             FROM songs s
                      join albums a on a.id = s.album_id
             WHERE s.album_id = (SELECT a.id as id
                                 FROM users u
                                          join albums a on u.id = a.creator_id
                                 WHERE u.id = $1
                                 ORDER BY a.date DESC
                                 LIMIT 1)`,
      values: [ctx.message.chat.id],
    });
    if (songs.length === 0) {
      ctx.reply('this album has no songs yet, send me some songs first');
      return;
    }
    try {
      const albumDash = songs[0].album_name.replace(/\s+/g, '-');
      const timeStamp = songs[0].album_date.getTime();
      const serverIP = config.get('server_ip');
      const serverPort = config.get('server_port');
      const zipPath = `./downloads/${chat.id}/${albumDash}-${timeStamp}`;
      await utils.run(`zip -r ${zipPath}/${albumDash}.zip ${zipPath}`);
      ctx.reply(`Your download link is ${serverIP}:${serverPort}/`
        + `user/${chat.id}/album/${albumDash}-${timeStamp}/file/${albumDash}.zip`);
      await db.insertOrUpdate({
        text: `UPDATE albums
               SET state='zipped'
               WHERE id = $1`,
        values: [songs[0].album_id],
      });
    } catch (e) {
      log({
        level: 'error',
        message: e.message,
        time: new Date(),
      });
    }
  }
};

exports.doneHandler = doneHandler;
