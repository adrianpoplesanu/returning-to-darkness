console.log("running client_test2.js...");

const socket = new WebSocket("ws://localhost:9090");

socket.addEventListener("open", (event) => {
    initializeConnection(socket);
});

socket.addEventListener("close", (event) => {
    console.log("connection closed by server");
});

socket.addEventListener("message", (event) => {
    handleMessage(event.data);
});

function initializeConnection(socket) {
    console.log("initializing");
    const payload = {"state": "INIT"};
    socket.send(JSON.stringify(payload));
}

function createRoom(socket) {
    console.log("creating room");
    const payload = {"state": "CREATE_ROOM", "code": "aaa"};
    socket.send(JSON.stringify(payload));
}

function sendPlayerPosition(socket, data) {
    const payload = {"state": "UPDATE", "code": "aaa", x: 4, y: 5};
    socket.send(JSON.stringify(payload));
}

function joinRoom(socket) {
    console.log("joining room");
    const payload = {"state": "JOIN_ROOM", "code": "aaa"};
    socket.senf(JSON.stringify(payload));
}

function handleMessage(message) {
    const data = JSON.parse(message.toString());
}
