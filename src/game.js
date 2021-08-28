const user = require('./user');
const short = require('short-uuid');

const game = () => {
  const allUsers = {};

  const api = {
    addPlayer: () => {
      const sessionId = short.generate()
      const newUser = user({sessionId});
      allUsers[sessionId] = newUser;
      console.log(allUsers);
      return sessionId;
    },
    message: (data) => {
      console.log(allUsers);
      console.log(data);
    },
  };
  return api;
};

module.exports = game;