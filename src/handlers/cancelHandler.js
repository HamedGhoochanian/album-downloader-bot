const db = require('../db');
const { log } = require('../logger');

const cancelHandler = async (ctx) => {
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
  if (state === 'waiting_for_songs' || state === 'waiting_for_name') {
    await db.insertOrUpdate({
      text: `UPDATE albums
             SET state='cancelled'
             WHERE id = $1`,
      values: [album.id],
    });
    ctx.reply('album was cancelled');
  }
};

module.exports = cancelHandler;
