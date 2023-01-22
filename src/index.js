const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, "../public");
const PORT = process.env.PORT || 3000;

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
    console.log("New WebSocket connection!");

    socket.emit("message", "Welcome to the app!");
    socket.broadcast.emit("message", "A new user has joined!");

    socket.on("sendMessage", (message) => {
        io.emit("message", message);
    });

    socket.on("disconnect", () => {
        io.emit("message", "A user has left!");
    });
});

server.listen(PORT, () => {
    console.log(`Server started at port: ${PORT}`);
});
