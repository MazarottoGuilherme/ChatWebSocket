const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

const configureSocket = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ['GET', 'POST'],
            credentials: true
        }
    });
    return io;
};

module.exports = configureSocket;
