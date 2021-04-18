const { toggleFlip } = require("../utils/game.js");

const handleFlip = function () {
  const socket = this;

  toggleFlip(socket.id);
};

module.exports = handleFlip;
