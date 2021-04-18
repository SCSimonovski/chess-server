const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const routes = require("./routes/routes");
const registerGameListeners = require("./listeners/game-listeners");

const port = process.env.PORT || 4001;

const app = express();
app.use(routes);
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

const onConnection = (socket) => {
  registerGameListeners(io, socket);
};
io.on("connection", onConnection);

server.listen(port, () => console.log(`Listening on port ${port}`));
