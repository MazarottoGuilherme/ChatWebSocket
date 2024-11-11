const express = require('express');
const { login, cadastro } = require('../controllers/authController');

const router = express.Router();
router.post('/login', login);
router.post('/cadastro', cadastro)

module.exports = router;