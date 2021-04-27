const { getGamesArr } = require("../utils/game.js");

const handleCreateGame = require("../handlers/handle-create-game.js");
const handleJoinGame = require("../handlers/handle-join-game.js");
const handleStartGame = require("../handlers/handle-start-game.js");
const handleReconnect = require("../handlers/handle-reconnect.js");
const handleMove = require("../handlers/handle-move.js");
const handleGameOver = require("../handlers/handle-game-over.js");
const handleRematch = require("../handlers/handle-rematch.js");
const handleDisconnect = require("../handlers/handle-disconnect.js");
const handleResign = require("../handlers/handle-resign.js");
const handleDraw = require("../handlers/handle-draw.js");
const handleSpectator = require("../handlers/handle-spectator.js");
const handleGetTime = require("../handlers/handle-get-time.js");
const handleFlip = require("../handlers/handle-flip.js");

module.exports = (io, socket) => {
  socket.on("activeGames", (acknowledgement) => {
    acknowledgement(getGamesArr());
  });

  socket.on("createGame", handleCreateGame);
  socket.on("joinGame", (data, acknowledgement) =>
    handleJoinGame(data, acknowledgement, socket, io)
  );
  socket.on("startGame", (room) => handleStartGame(room, socket, io));
  socket.on("move", (data) => handleMove(data, socket, io));
  socket.on("resign", handleResign);
  socket.on("draw", (data) => handleDraw(data, socket, io));
  socket.on("rematch", (isAccepted) => handleRematch(isAccepted, socket, io));
  socket.on("getTime", handleGetTime);
  socket.on("gameOver", handleGameOver);
  socket.on("reconnect", handleReconnect);
  socket.on("disconnect", () => handleDisconnect(socket, io));
  socket.on("leaveRoom", () => handleDisconnect(socket, io));
  socket.on("spectator", handleSpectator);
  socket.on("flip", handleFlip);
};
