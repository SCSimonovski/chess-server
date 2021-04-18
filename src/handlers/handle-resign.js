const { setTime } = require("../utils/game.js");

const handleResign = function (message) {
  socket.to(data.room).emit("gameOver", message);
};

module.exports = handleResign;
