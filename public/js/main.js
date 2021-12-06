
let socket;

initWebsocket();

const app = new Vue({
  el: '#app',
  data: {
    showState: {
      userLogin: true,
      lobbyLogin: false,
      lobbyDetails: false,
      gameOverlays: false,
    },
    userName: '',
    userId: '',
    lobbyList: [],
    lobbyName: '',
    lobbyId: '',
    lobbyDetails: [],
  },
  methods: {
    userNameChange(event) {
      if (event.keyCode === 13) {
        message.send({ type: 'namePlayer', userName: this.userName }, socket);
        message.send({ type: 'listLobby' }, socket);
        this.showState = { ...this.showState, userLogin: false, lobbyLogin: true };
      }
    },
    lobbyIdChange(event) {
      if (event.keyCode === 13) {
        this.makeLobby(this.lobbyName);
      }
    },
    joinLobby(lobbyId) {
      console.log(lobbyId);
      message.send({ type: 'joinLobby', lobbyId }, socket);
      this.showState = { ...this.showState, lobbyLogin: false, lobbyDetails: true };
    },
    makeLobby() {
      console.log(`Creating new Lobby: ${this.lobbyName}`);
      message.send({ type: 'makeLobby', lobbyName: this.lobbyName }, socket);
      this.showState = { ...this.showState, lobbyLogin: false, lobbyDetails: true };
    },
    startLobby() {
      message.send({ type: 'startLobby', lobbyId: this.lobbyId }, socket);
      this.showState = { ...this.showState, lobbyDetails: false, gameOverlays: true };
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
