const { findGameById } = require("../utils/game.js");

const handleGameOver = function (message) {
  const socket = this;
  const game = findGameById(socket.id);

  if (game) {
    clearInterval(game.timer);
    game.time = { ...game.resetTime };
    socket.to(game.room).emit("gameOver", message);
  }
};

module.exports = handleGameOver;
