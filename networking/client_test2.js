console.log("running client_test2.js...");

const socket = new WebSocket("ws://localhost:9090");
var roomCode;
var myId;

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

function sendPlayerShoot(socket, code, data) {
    const payload = {"state": "SHOOT", "code": code, "data": data};
    socket.send(JSON.stringify(payload));
}

function sendPlayerDead(socket, code, data) {
    const payload = {"state": "DEAD", "code": code, "data": data};
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
        roomCode = data.code;
        myId = data.id;
        populateCode(roomCode);
    }
    if (data.state == 'GAME_START') {
        console.log("start the game already");
        roomCode = data.code;
        myId = data.id;
        player.x = data.x;
        player.y = data.y;
        myOrientation = data.orientation;
        enemy.x = data.enemyX;
        enemy.y = data.enemyY;
        enemy.orientation = data.enemyOrientation;
        running = true;
        startingGame();
    }
    if (data.state == 'UPDATE') {
        //console.log(data.enemy);
        enemy.x = data.enemy.x;
        enemy.y = data.enemy.y;
        enemy.deltaX = data.enemy.deltaX;
        enemy.deltaY = data.enemy.deltaY;
        enemy.orientation = data.enemy.orientation;
        enemy.state = 8; // TODO: fix this
    }
    if (data.state == 'SHOOT') {
        enemyBullet.x = data.bullet.x;
        enemyBullet.y = data.bullet.y;
        enemyBullet.deltaX = data.bullet.deltaX;
        enemyBullet.deltaY = data.bullet.deltaY;
        enemyBullet.orientation = data.bullet.orientation;
        enemyBullet.state = 8;
        enemyBullet.active = true;
    }
    if (data.state == 'RESPAWN') {
        myBullet.active = false;
        enemyBullet.active = false;
        isShooting = false;
        if (data.player.name == myId) {
            player.x = data.player.x;
            player.y = data.player.y;
            player.deltaX = data.player.deltaX;
            player.deltaY = data.player.deltaY;
            myOrientation = data.player.orientation;
        } else {
            enemy.x = data.player.x;
            enemy.y = data.player.y;
            enemy.deltaX = data.player.deltaX;
            enemy.deltaY = data.player.deltaY;
            enemy.orientation = data.player.orientation;
        }
    }
}

function generateUUID4() {
    let u = Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16);
    let guid = [u.substr(0,8), u.substr(8,4), '4000-8' + u.substr(13,3), u.substr(16,12)].join('-');
    return guid;
}
