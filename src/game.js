const user = require('./user');
const short = require('short-uuid');

const game = () => {
  const allUsers = {};

  const api = {
    addPlayer: () => {
      const sessionId = short.generate();
      const newUser = user({sessionId});
      allUsers[sessionId] = newUser;
      return sessionId;
    },
  };
  return api;
};

module.exports = game;