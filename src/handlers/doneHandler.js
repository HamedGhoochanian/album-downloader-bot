const exec = require('await-exec');
const db = require('../db');

const doneHandler = async (ctx) => {
  const [user] = await db.executeQuery({
    text: 'SELECT * FROM users WHERE id = $1',
    values: [ctx.message.chat.id],
  });
  if (user === undefined) {
    ctx.reply('U is not a member');
  } else if (user.state === 0) {
    ctx.reply('U haven\'t started an album');
  } else if (user.state === 1) {
    ctx.reply('sad to see you go');
  } else {
    // TODO add logging for done command
    const songs = await db.executeQuery({
      text: `SELECT s.file_name as name, a.name as album
             FROM songs s
                      join albums a on a.id = s.album_id
                      join users u on u.latest_album_id = a.id
             WHERE u.id = $1
             GROUP BY s.id, a.name`,
      values: [ctx.message.chat.id],
    });
    const { album } = songs[0];
    await exec(`mkdir "./temp/${album}"`);
    // TODO add logging for file operations
    // eslint-disable-next-line no-restricted-syntax
    for (const s of songs) {
      // eslint-disable-next-line no-await-in-loop
      await exec(`mv "./temp/${s.name}" "./temp/${album}"`);
    }
    const zipPath = `"./temp/${album}.zip"`;
    await exec(`zip -r ${zipPath} "./temp/${album}"`);
    await db.insertOrUpdate({
      text: 'UPDATE users SET state = 0 WHERE id = $1',
      values: [ctx.message.chat.id],
    });
    await ctx.replyWithDocument({ source: `./temp/${album}.zip` }, { caption: 'test' });
  }
};

exports.doneHandler = doneHandler;
