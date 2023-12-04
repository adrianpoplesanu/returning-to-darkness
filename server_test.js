const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8090 });

wss.on('connection', ws => {
    //console.log(ws);
    console.log("connection received")
    ws.on('message', message => {
        //console.log(message);
        //console.log(message.inspect());
        console.log(message.toString());
        ws.send("server: received");
    });
});
