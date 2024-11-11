const http = require('http');
const app = require('./app');
const configureSocket = require('./config/socket');
const { DevolveUserIdCookie } = require('./middlewares/authMiddleware')
const pool = require('./config/db')
const server = http.createServer(app);
const io = configureSocket(server);

const ChatsNamespace = io.of('/chats');
ChatsNamespace.use((socket, next) => {
    DevolveUserIdCookie(socket, next)
});
ChatsNamespace.on('connection', async (socket) => {
    if (!socket.recovered) {
        const UsuarioId = socket.userId;
        console.log(UsuarioId)
        var [results] = await pool.query('CALL GetChatsByUserId(?)', [UsuarioId]);
        socket.emit('LoadAllChats', results[0]);
    }
});

const MensagensNamespace = io.of('/mensagens');
MensagensNamespace.use((socket, next) => {
    DevolveUserIdCookie(socket, next)
});
MensagensNamespace.on('connection', async (socket) => {
    var chatid = socket.handshake.query.chatId;
    var userId = socket.userId;
    var [results] = await pool.query('CALL VerificaUsuarioAcessaChat(?, ?)', [userId, chatid]);
    const TemAcesso = results[0][0]['UsuarioAcesso'] == '1';
    if (!TemAcesso) {
        socket.emit('AccessDenied', 'You dont have permission to access this chat');
        socket.disconnect();
        return;
    }

    socket.join(`chat_${chatid}`);

    if (!socket.recovered) {
        var [mensagens] = await pool.query('CALL LoadMensagens(?)', [chatid])
        mensagens = mensagens[0];
        mensagens = mensagens.map((msg) => ({
            content: msg.content,
            isUser: msg.user_id === userId
        }));        
        socket.emit('LoadMensagens', mensagens);
    }

    socket.on('SendMessage', async (mensagem) => {
        console.log('chatid: ' + chatid)
        console.log('userid: ' + userId)
        console.log('Mensagem: ' + mensagem)
        const [aaa] = await pool.query('CALL InsertMessage(?, ?, ?)', [userId, chatid, mensagem]);
        const MensagemId = aaa[0][0]['MessageId']
        const retorno = {
            id: MensagemId,
            Mensagem: mensagem,
            IsUser: true
        }
        socket.emit('SendMessage', retorno);

        socket.broadcast.to(`chat_${chatid}`).emit('SendMessage', {
            id: MensagemId,
            Mensagem: mensagem,
            IsUser: false
        });
    
    })

});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));