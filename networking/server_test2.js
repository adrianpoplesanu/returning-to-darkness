const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 9090 });

connections = [];
rooms = {};

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
    }
    if (data.state == 'CREATE_ROOM') {
        console.log("create room message received");
    }
    if (data.state == 'JOIN_ROOM') {
        console.log("join room message received");
    }
    if (data.state == 'UPDATE') {
        console.log("update player stte message received");
    }
}

function handleClose(ws) {
    console.log("closing connection");
}

function sendMessage(ws, message) {
    ws.send(message);
}

// game physics needs to be processed and then send/receive messages
