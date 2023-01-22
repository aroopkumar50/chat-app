const socket = io();

socket.on("message", (message) => {
    console.log(message);
});

const send = document
    .querySelector("#message-form")
    .addEventListener("submit", (e) => {
        e.preventDefault();
        const message = e.target.elements.message.value;
        socket.emit("sendMessage", message, (error) => {
            if (error) {
                return console.log(error);
            }

            console.log("Message Delivered!");
        });
    });

document.querySelector("#send-location").addEventListener("click", () => {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
    }

    navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const location = {
            latitude,
            longitude,
        };

        socket.emit("sendLocation", location, () => {
            console.log("Location Shared!");
        });
    });
});
