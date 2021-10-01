const { Pool } = require('pg');

const pool = new Pool(); // auto search .env 
module.exports = {
    query: (text, params) => pool.query(text, params),
}
