
let socket;

const app = new Vue({
  el: '#app',
  data: {
    userName: '',
  },
  methods: {
    userLogin: (event) => {
      console.log()
      if (event.keyCode === 13) {
        initWebsocket();
      }
    }
  }
});

function initWebsocket() {
  if (!socket) {
    console.log('initializing Websocket');
    socket = new WebSocket('ws://localhost:8000');
    socket.onopen = socketOpenHandler;
    socket.onmessage = socketMessageHandler;
    socket.onclose = socketCloseHandler;
    socket.onerror = socketErrorHandler;
  }
};

function socketOpenHandler(event) {
  console.log(event);
};

function socketMessageHandler(event) {
  console.log(event);
};

function socketCloseHandler(event) {
  console.log(event);
};

function socketErrorHandler(error) {
  console.error(error);
};
