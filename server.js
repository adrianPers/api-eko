require('dotenv').config();

const http = require('http');

const { Server } = require('socket.io');

const app = require('./app');

const chatSocket = require('./sockets/chatSocket');

const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: [
      process.env.CLIENT_URL,
      process.env.ADMIN_URL
    ]
  }
});


chatSocket(io);


const PORT = process.env.PORT || 3000;


server.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});