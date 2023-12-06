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
    const payload = {"state": "CREATE_ROOM", "code": generateUUID4()};
    socket.send(JSON.stringify(payload));
}

function sendPlayerPosition(socket, code, data) {
    const payload = {"state": "UPDATE", "code": code, "data": data};
    socket.send(JSON.stringify(payload));
}

function joinRoom(socket, code) {
    console.log("joining room");
    console.log(code);
    const payload = {"state": "JOIN_ROOM", "code": code};
    socket.send(JSON.stringify(payload));
}

function handleMessage(message) {
    const data = JSON.parse(message.toString());
    if (data.state == 'ROOM_CREATED') {
        console.log(data.code);
    }
    if (data.state == 'GAME_START') {
        //... start the game
    }
    if (data.state == 'UPDATE') {
        //... update game state
    }
}

function generateUUID4() {
    let u = Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16);
    let guid = [u.substr(0,8), u.substr(8,4), '4000-8' + u.substr(13,3), u.substr(16,12)].join('-');
    return guid;
}
