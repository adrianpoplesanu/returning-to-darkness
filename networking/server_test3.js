const game = require("./server_game3");
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
    if (data.state == 'SHOOT') {
        handle_player_shoot(ws, data);
    }
    if (data.state == 'DEAD') {
        handle_dead_player(ws, data);
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

    var spawnPoints = [{x1: 3, y1: 3, x2: 26, y2: 26}];
    var orientation1 = 1;
    var orientation2 = 3;

    const payload1 = {"state": "GAME_START", "code": code, "id": "player1", x: spawnPoints[0].x1, y: spawnPoints[0].y1, enemyX: spawnPoints[0].x2, enemyY: spawnPoints[0].y2, orientation: orientation1, enemyOrientation: orientation2};
    const payload2 = {"state": "GAME_START", "code": code, "id": "player2", x: spawnPoints[0].x2, y: spawnPoints[0].y2, enemyX: spawnPoints[0].x1, enemyY: spawnPoints[0].y1, orientation: orientation2, enemyOrientation: orientation1};
    var game1 = new game.Game();
    rooms[code].game = game1;
    sendMessage(rooms[code].player1_ws, JSON.stringify(payload1));
    sendMessage(rooms[code].player2_ws, JSON.stringify(payload2));
}

function handle_update_room(ws, data) {
    const code = data.code;
    game.handleUpdatePlayerState(rooms[data.code], data.data);
}

function handle_player_shoot(ws, data) {
    game.handlePlayerShoot(rooms[data.code], data.data);
}

function handle_dead_player(ws, data) {
    game.handleDeadPlayer(rooms[data.code], data.data);
}

function sendMessage(ws, message) {
    ws.send(message);
}

/*
// agar.io model
function sendUpdates() {
    console.log("aaa");
}

setInterval(sendUpdates, 1000 / 10);
*/

// game physics needs to be processed and then send/receive messages
