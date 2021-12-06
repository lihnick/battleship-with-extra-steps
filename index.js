const express = require('express');
const ws = require('ws');
const game = require('./src/game');
const app = express();
const port = 8000;

const wsServer = new ws.Server({ noServer: true });
const gameRef = game();

app.use(express.static('public'));

wsServer.on('connection', (socket) => {
  gameRef.connect(socket);

  socket.on('message', (data) => {
    gameRef.read(data, socket);
  });

  socket.on('close', (end) => {
    gameRef.disconnect(socket);
  });

  socket.on('error', (err) => {
    console.error(err);
  });
});

const server = app.listen(port, () => {
  console.log(`App started at http://localhost:${port}/`);
});

server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, client => {
    wsServer.emit('connection', client, request);
  });
});