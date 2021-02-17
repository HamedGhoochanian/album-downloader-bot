const config = require('config');
const {
  Pool,
} = require('pg');

const connectionConfig = {
  host: config.get('PGHOST'),
  user: config.get('PGUSER'),
  password: config.get('PGPASSWORD'),
  database: config.get('PGDATABASE'),
  port: config.get('PGPORT'),
};
const pool = new Pool(connectionConfig);
pool.on('error', (err) => {
  throw new Error('Unexpected error on idle client', err);
});

exports.insertOrUpdate = (query) => {
  // eslint-disable-next-line no-param-reassign
  query.text += ' RETURNING *;';
  return pool.query(query)
    .then((result) => result.rows)
    .catch((e) => {
      throw e;
    });
};

exports.executeQuery = (query) => pool.query(query)
  .then((result) => result.rows)
  .catch((e) => {
    throw e;
  });
