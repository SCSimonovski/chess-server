const { findGameById } = require("../utils/game.js");

const handleDraw = function (draw, socket, io) {
  const game = findGameById(socket.id);

  if (!game) return;

  if (draw === true) {
    socket.to(game.room).emit("gameOver", "Draw by Agreement");
  } else {
    socket.to(game.room).emit("draw");
  }
};

module.exports = handleDraw;
