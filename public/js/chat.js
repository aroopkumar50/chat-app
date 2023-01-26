const socket = io();

const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild;

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // Visible Height
    const visibleHeight = $messages.offsetHeight;

    // Height of messages container
    const containerHeight = $messages.scrollHeight;

    // How far have we scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
};

socket.on("message", (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format("h:mm a")
    });
    $messages.insertAdjacentHTML("beforeend", html);
    autoscroll();
});

socket.on("locationMessage", (locationMesage) => {
    console.log(locationMesage);
    const html = Mustache.render(locationMessageTemplate, {
        username: locationMesage.username,
        url: locationMesage.url,
        createdAt: moment(locationMesage.createdAt).format("h:mm a")
    });
    $messages.insertAdjacentHTML("beforeend", html);
    autoscroll();
});

socket.on("roomData", ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room, 
        users
    });

    document.querySelector("#sidebar").innerHTML = html;
});

const send = $messageForm.addEventListener("submit", (e) => {
    e.preventDefault();

    $messageFormButton.setAttribute("disabled", "disabled");

    const message = e.target.elements.message.value;
    socket.emit("sendMessage", message, (error) => {
        $messageFormButton.removeAttribute("disabled");
        $messageFormInput.value = "";
        $messageFormInput.focus();

        if (error) {
            return console.log(error);
        }

        console.log("Message Delivered!");
    });
});

$sendLocationButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
    }

    $sendLocationButton.setAttribute("disabled", "disabled");

    navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const location = {
            latitude,
            longitude
        };

        socket.emit("sendLocation", location, () => {
            $sendLocationButton.removeAttribute("disabled");
            console.log("Location Shared!");
        });
    });
});

socket.emit("join", { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = "/";
    }
});