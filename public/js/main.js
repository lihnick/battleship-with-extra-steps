
let socket;

initWebsocket();

const app = new Vue({
  el: '#app',
  data: {
    showState: {
      userLogin: true,
      lobbyLogin: false,
      lobbyDetails: false,
    },
    userName: '',
    userId: '',
    lobbyList: [],
    lobbyId: '',
    lobbyDetails: [],
  },
  methods: {
    userNameChange(event) {
      if (event.keyCode === 13) {
        message.send({ type: 'namePlayer', userName: app.userName }, socket);
        message.send({ type: "listLobby" }, socket);
        app.showState = { ...app.showState, userLogin: false, lobbyLogin: true };
      }
    },
    lobbyIdChange(event) {
      if (event.keyCode === 13) {
        app.joinLobby();
      }
    },
    joinLobby() {
      if (app.lobbyId) {
        message.send({ type: 'joinLobby', lobbyId: app.lobbyId }, socket);
        app.showState = { ...app.showState, lobbyLogin: false, lobbyDetails: true };
      }
    },
    makeLobby() {
      message.send({ type: 'makeLobby' }, socket);
      app.showState = { ...app.showState, lobbyLogin: false, lobbyDetails: true };
    },
    startLobby() {
      message.send({ type: 'startLobby', lobbyId: app.lobbyId }, socket);
      app.showState = { ...app.showState, lobbyDetails: false, gameBoard: true };
    },
  }
});

function initWebsocket() {
  if (!socket) {
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
