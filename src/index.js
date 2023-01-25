const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { generateMessage, generateLocationMessage } = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, "../public");
const PORT = process.env.PORT || 3000;

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
    console.log("New WebSocket connection!");

    socket.emit("message", generateMessage("Welcome to the app!"));
    socket.broadcast.emit("message", generateMessage("A new user has joined!"));

    socket.on("sendMessage", (message, callback) => {
        const filter = new Filter();

        if (filter.isProfane(message)) {
            return callback("Profanity is not allowed!");
        }

        io.emit("message", generateMessage(message));
        callback();
    });

    socket.on("sendLocation", (location, callback) => {
        io.emit(
            "locationMessage",
            generateLocationMessage(`https://google.com/maps?q=${location.latitude},${location.longitude}`)
        );
        callback();
    });

    socket.on("disconnect", () => {
        io.emit("message", generateMessage("A user has left!"));
    });
});

server.listen(PORT, () => {
    console.log(`Server started at port: ${PORT}`);
});
