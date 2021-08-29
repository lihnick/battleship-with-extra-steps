
const lobby = ({
  lobbyId = '',
  users = [],
} = {}) => ({
  lobbyId,
  users,
  addUser(user) {
    user.setLobbyId(this.lobbyId);
    this.users.push(user);
    return this;
  },
});

module.exports = lobby;
