const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express(); // inicializar o aplicativo
app.use(cors()); // permite a comunicacao do backend com o frontend
const server = http.createServer(app); // criar um servidor http

// criar uma instancia que permite conexao com qualquer origem
const io = new Server(server, {
    cors: { origin: "*" }
});

let users = {}; // lista dos usuarios conectados

io.on('connection', (socket) => {
    console.log('Novo usuário:', socket.id);

    socket.on('update-location', (data) => {
        users[socket.id] = data;
        io.emit('all-locations', users); // envia a lista de usuarios para todos os usuarios
    });

    socket.on('disconnect', () => {
        delete users[socket.id];
        io.emit('all-locations', users);
    });
});

app.get('/', (req, res) => {
    res.send('O servidor de mapas está online! 🚀');
});

server.listen(3001, () => console.log('🚀 Servidor rodando em http://localhost:3001'));

// socket.emit -> envia para o cliente que enviou
// io.emit -> envia para todos os clientes
// socket.broadcast.emit -> envia para todos os clientes, exceto o que enviou