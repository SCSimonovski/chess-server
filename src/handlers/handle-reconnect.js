const { reconnect, findGame } = require("../utils/game.js");

const handleReconnect = function (data, acknowledgement) {
  const socket = this;

  let game = findGame(data.room);
  if (!game) {
    acknowledgement({ error: "Something went wrong, could not reconnect" });
    return;
  }

  if (data.isSpectator) {
    socket.join(game.room);
    socket.emit("time", game.time);
    acknowledgement({ message: "you've been successfuly reconnected!" });
    return;
  }

  let { room, time } = reconnect(socket.id, data);
  socket.join(room);
  socket.emit("time", time);

  socket.broadcast.emit("roomIsFull", { room, isFull: true });

  acknowledgement({ message: "you've been successfuly reconnected!" });
};

module.exports = handleReconnect;
