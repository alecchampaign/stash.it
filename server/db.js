const Pool = require('pg-pool');
const url = require('url');

const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(':');

const pool = new Pool({
  user: auth[0],
  password: auth[1],
  database: params.pathname.split('/')[1],
  host: params.hostname,
  port: params.port,
  ssl: true,
  max: 20,
  idleTimeoutMillis: 1000,
  connectionTimeoutMillis: 3000
});
module.exports = pool;

// const pool = new Pool({
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: 'stashit',
//   host: 'db',
//   port: process.env.DB_PORT,
//   max: 20,
//   idleTimeoutMillis: 1000,
//   connectionTimeoutMillis: 3000
// });
// module.exports = pool;
