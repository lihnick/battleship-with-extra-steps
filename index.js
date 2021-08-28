const express = require('express');
const ws = require('ws');
const game = require('./src/game');
const app = express();
const port = 8000;

const wsServer = new ws.Server({ noServer: true });
const gameRef = game();

app.use(express.static('public'));

wsServer.on('connection', (socket) => {
  console.log('test');
  const response = gameRef.addPlayer();
  socket.send(response);

  socket.on('message', (msg) => {
    const response = gameRef.message(msg);
    socket.send(response);
  });

  socket.on('close', (end) => {
    console.log(`end: ${end}`);
  });

  socket.on('error', (err) => {
    console.log(err);
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