const pool = require('../config/db');
const bcrypt = require('bcrypt');

exports.VerifyUser = async (email, password) => {
    const [result] = await pool.query('SELECT id, password FROM usuario WHERE email = ?', [email]);
    if (result.length === 0) return null;

    const PasswordMatch = await bcrypt.compare(password, result[0]['password']);
    return PasswordMatch ? result[0]['id'] : null;
};


exports.UsuarioJaExiste = async (email) => {
    const [result] = await pool.query('SELECT count(1) FROM usuario WHERE email = ?', [email]);
    if (result[0]['count(1)'] === 0) return false;

    return true;
}

exports.CadastroUsuario = async (Username, Email, Password) => {
    try{
        const pass = await bcrypt.hash(Password, 12);
        const [result] = await pool.query('INSERT INTO usuario (email, username, password) VALUES (?, ?, ?)', [Email, Username, pass])
        const UsuarioId = result.insertId;
        return UsuarioId;
    }catch(err){
        console.log(err);
    }
}