const game = require("./server_game2");
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 9090 });

var connections = [];
var connections_map = {};
var rooms = {};

wss.on('connection', ws => {
    ws.on('message', message => {
        handleMessage(ws, message);
    });

    ws.on('close', message => {
        handleClose(ws);
    });
});

function handleMessage(ws, message) {
    const data = JSON.parse(message.toString());
    if (data.state == 'INIT') {
        console.log("init message received");
        const id = connections.length;
        connections.push(ws);
        ws.id = id;
        connections_map[id] = ws;
        console.log(ws.id);
    }
    if (data.state == 'CREATE_ROOM') {
        console.log("create room[" + data.code + "] message received");
        handle_create_room(ws, data.code);
        const payload = {"state": "ROOM_CREATED", "code": data.code};
        sendMessage(ws, JSON.stringify(payload));
    }
    if (data.state == 'JOIN_ROOM') {
        console.log("join room[" + data.code + "] message received");
        handle_join_room(ws, data.code);
    }
    if (data.state == 'UPDATE') {
        handle_update_room(ws, data);
    }
}

function handleClose(ws) {
    console.log("closing connection");
    console.log(ws.id);
    connections.splice(ws.id, 1);
    delete connections_map[ws.id];
}

function handle_create_room(ws, code) {
    console.log("room code generated: " + code);
    rooms[code] = {
        player1_ws: ws
    };
}

function handle_join_room(ws, code) {
    rooms[code].player2_ws = ws;
    const payload = {"state": "GAME_START", "code": code};
    var game = Game();
    rooms[code].game = game;
    sendMessage(rooms[code].player1_ws, JSON.stringify(payload));
    sendMessage(rooms[code].player2_ws, JSON.stringify(payload));
}

function handle_update_room(ws, data) {
    game.handleUpdatePlayerState(data.data);
}

function sendMessage(ws, message) {
    ws.send(message);
}

// game physics needs to be processed and then send/receive messages
