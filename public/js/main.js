
let socket;

initWebsocket();

const app = new Vue({
  el: '#app',
  data: {
    showLobby: false,
    userName: '',
    userId: '',
    lobbyId: '',
  },
  methods: {
    userNameChange: (event) => {
      if (event.keyCode === 13) {
        message.send({ type: 'name', userName: app.userName }, socket);
        app.showLobby = true;
      }
    },
    lobbyIdChange: (event) => {
      if (event.keyCode === 13) {
        app.joinLobby();
      }
    },
    joinLobby: () => {
      if (app.lobbyId) {
        message.send({ type: 'join', lobbyId: app.lobbyId }, socket);
      }
    },
    makeLobby: () => {
      message.send({ type: 'make' }, socket);
    }
  }
});

function initWebsocket() {
  if (!socket) {
    console.log('initializing Websocket');
    socket = new WebSocket('ws://localhost:8000');
    socket.onopen = event => {
      console.log('Connected', event);
      console.log('Vue App', app);
    };
    socket.onmessage = event => {
      message.read(app, event, socket);
    }
    socket.onclose = event => {
      console.log(event);
    };
    socket.onerror = error => {
      console.error(error);
    };
  }
};
