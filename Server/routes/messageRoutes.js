const express = require('express');
const {verifyToken} = require('../middlewares/authMiddleware');
const { fetchMessages } = require('../controllers/messageController');

const router = express.Router();
router.get('/', verifyToken, async (req, res) => {
    const messages = await fetchMessages();
    res.json(messages);
});

module.exports = router;
