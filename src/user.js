
const user = ({
  sessionId = '', 
  lobbyId = '',
  userName = '',
} = {}) => ({
  sessionId,
  lobbyId,
  userName,
  setUserName(name) {
    this.userName = name;
    return this;
  }
});

module.exports = user;
