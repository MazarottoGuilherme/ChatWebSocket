const pool = require('../config/db');

exports.sendMessage = async (userId, msg) => {
    await pool.query("INSERT INTO mensagens (usuario, mensagem) VALUES (?, ?)", [userId, msg]);
};

exports.fetchMessages = async () => {
    const [rows] = await pool.query("SELECT * FROM mensagens");
    return rows;
};
