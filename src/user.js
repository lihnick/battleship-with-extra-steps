
const user = ({
  socket = null,
  sessionId = '', 
  lobbyId = '',
  userName = '',
} = {}) => ({
  socket,
  sessionId,
  lobbyId,
  userName,
  setSocket(socket) {
    this.socket = socket;
    return this;
  },
  setUserName(name) {
    this.userName = name;
    return this;
  }
});

module.exports = user;
