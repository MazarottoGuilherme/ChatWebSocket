const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: process.env.DB_SECRET,
    database: 'ChatWithWebSocket',
    connectionLimit: 15
}).promise();

module.exports = pool;