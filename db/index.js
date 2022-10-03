const { Pool } = require('pg');

const pool = new Pool({
  host  : process.env.RDS_HOSTNAME,
  user  : process.env.RDS_USERNAME,
  port  : process.env.RDS_PORT,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB_NAME
});

module.exports = {
  query: (text, params) => pool.query(text, params),
}