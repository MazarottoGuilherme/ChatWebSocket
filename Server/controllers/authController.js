const jwt = require('jsonwebtoken');
const { VerifyUser, UsuarioJaExiste, CadastroUsuario } = require('../models/userModel');
const { setAuthCookie } = require('../Utils/tokenUtils');

exports.login = async (req, res) => {
    const { user, pass } = req.body;
    const UserId = await VerifyUser(user, pass);
    console.log('userid:' + UserId)
    if (!UserId) return res.status(401).json({ message: 'Invalid credentials' });

    setAuthCookie(res, UserId);

    res.status(200).json({ message: 'Login successful' });
};

exports.cadastro = async (req, res) =>{
    const {email, user, pass} = req.body;
    const JaExiste = await UsuarioJaExiste(email);

    if(JaExiste) return res.status(401).json({message: 'User already exists'});

    const UsuarioId = await CadastroUsuario(user, email, pass);

    setAuthCookie(res, UsuarioId);

    res.status(201).json({message: 'User created'});
}
