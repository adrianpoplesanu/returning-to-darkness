const WebSocket = require('ws');

let socket = new WebSocket("ws://localhost:8090");

//socket.send("hello")

socket.onopen = function(event) {
    socket.send("client: hello from client");
}

socket.onmessage = function(event) {
    console.log(event.data);
}
