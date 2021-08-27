const express = require('express');
const ws = require('ws');
const game = require('./src/game');
const app = express();
const port = 8000;

const wsServer = new ws.Server({ noServer: true });
const gameRef = game();

app.use(express.static('public'));

wsServer.on('connection', (socket) => {
  socket.on('open', (usr) => {
    const result = gameRef.addPlayer();
    socket.send(result);
  });
  socket.on('message', (msg) => {
    console.log(`msg: ${msg}`);
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