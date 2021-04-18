const { findGameById } = require("../utils/game.js");

const handleGetTime = function (side, acknowledgement) {
  const socket = this;
  const game = findGameById(socket.id);
  if (!game) return;

  acknowledgement(game.time[side]);
};

module.exports = handleGetTime;
