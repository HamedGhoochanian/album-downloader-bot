const db = require('../db');
const { download } = require('../utils');

const audioHandler = async (ctx) => {
  await db.executeQuery({
    text: 'UPDATE users SET state = 2 WHERE id = $1',
    values: [ctx.message.chat.id],
  });
  const fileURL = (await ctx.telegram.getFileLink(ctx.message.audio.file_id)).href;
  const audioName = ctx.message.audio.file_name;
  await download(fileURL, './temp', audioName);
  await db.insertOrUpdate({
    text: `INSERT INTO songs(creator_id, album_id, file_name)
           VALUES ((SELECT id
                    FROM users
                    WHERE id = $1
                   ),
                   (SELECT latest_album_id
                    FROM users
                    WHERE id = $2
                   ), $3)`,
    values: [ctx.message.chat.id, ctx.message.chat.id, audioName],
  });
};

exports.audioHandler = audioHandler;
