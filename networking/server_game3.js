function Game() {
    console.log("initializing a game");
    this.player1 = new Player();
    this.player2 = new Player();
    this.player1Bullet = new Bullet();
    this.plauer2Bullet = new Bullet();
    this.alwaysVisiblePlayers = true;
    this.board = generateBoard();
}

function Player(x, y) {
    this.name = ""; // player1 or player2
    this.x = x;
    this.y = y;
    this.state = 0;
    this.deltaX = 0;
    this.deltaY = 0;
    this.lumination = false;
    this.shoot = false;
}

function Bullet() {
    this.name = ""; // player1 or player2
    this.x = 0;
    this.y = 0;
    this.deltaX = 0;
    this.deltaY = 0;
    this.state = 0;
}

function generateBoard() {
    //...
}

function handleUpdatePlayerState(room, data) {
    var myId = data.name;
    if (myId == "player1") {
        var payload = {
            state: "UPDATE",
            enemy: {
                name: "player1",
                x: data.x,
                y: data.y,
                deltaX: data.deltaX,
                deltaY: data.deltaY,
                orientation: data.orientation,
                lumination: false,
                shoot: false
            }
        };
        sendClientUpdate(room.player2_ws, payload);
    }
    if (myId == "player2") {
        var payload = {
            state: "UPDATE",
            enemy: {
                name: "player2",
                x: data.x,
                y: data.y,
                deltaX: data.deltaX,
                deltaY: data.deltaY,
                orientation: data.orientation,
                lumination: false,
                shoot: false
            }
        };
        sendClientUpdate(room.player1_ws, payload);
    }
}

function handlePlayerShoot(room, data) {
    var myId = data.name;
    if (myId == "player1") {
        var payload = {
            state: "SHOOT",
            bullet: {
                name: "player1",
                x: data.x,
                y: data.y,
                deltaX: data.deltaX,
                deltaY: data.deltaY,
                orientation: data.orientation
            }
        }
        sendClientUpdate(room.player2_ws, payload);
    }
    if (myId == "player2") {
        var payload = {
            state: "SHOOT",
            bullet: {
                name: "player2",
                x: data.x,
                y: data.y,
                deltaX: data.deltaX,
                deltaY: data.deltaY,
                orientation: data.orientation
            }
        }
        sendClientUpdate(room.player1_ws, payload);
    }
}

function handleDeadPlayer(room, data) {
    var myId = data.name;
    if (myId == "player1") {
        var payload = {
            state: "RESPAWN",
            player: {
                name: "player1",
                x: 15,
                y: 15,
                deltaX: 0,
                deltaY: 0,
                orientation: 0
            }
        }
        sendClientUpdate(room.player1_ws, payload);
        sendClientUpdate(room.player2_ws, payload);
    }
    if (myId == "player2") {
        var payload = {
            state: "RESPAWN",
            player: {
                name: "player2",
                x: 15,
                y: 15,
                deltaX: 0,
                deltaY: 0,
                orientation: 0
            }
        }
        sendClientUpdate(room.player1_ws, payload);
        sendClientUpdate(room.player2_ws, payload);
    }
}

function sendClientUpdate(ws, payload) {
    ws.send(JSON.stringify(payload));
}

function test() {
    console.log('server_game2.test()');
}

module.exports = { Game, Player, generateBoard, handleUpdatePlayerState, handlePlayerShoot, handleDeadPlayer };
