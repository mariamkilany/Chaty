const express = require("express");
const { createServer } = require("http");
const cors = require("cors");
const { join } = require("path");
const { Server } = require("socket.io");
const PORT = process.env.PORT || 7000;

const app = express();
app.use(cors());

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
  },
});

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  console.log("a user connected with socket id " + socket.id);
  // socket.to(socket.id).emit("");
  socket.on("message", (msg) => {
    io.emit("broadcast_message", msg);
  });
  socket.on("typing", () => {
    socket.broadcast.emit("show_typing_status");
  });
  socket.on("stop_typing", () => {
    socket.broadcast.emit("clear_typing");
  });
  socket.on("disconnect", () => {
    console.log("left the chat with socket id " + socket.id);
  });
});

/**
 * emit --> oublish to an event using emit('event name')
 *
 * on --> listen to event using on('event name',callback)
 *
 */

server.listen(PORT, () => {
  console.log("listening on http://localhost:" + PORT);
});
