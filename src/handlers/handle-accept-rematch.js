const { findGameById } = require("../utils/game.js");

const handleAcceptRematch = function (isAccepted, socket, io) {
  const game = findGameById(socket.id);

  if (game && isAccepted && game.rematch) {
    io.in(game.room).emit("setTime", game.resetTime);
    io.in(game.room).emit("playRematch");
  } else {
    socket.to(game.room).emit("rematchDeclined");
  }

  game.rematch = false;
};

module.exports = handleAcceptRematch;
