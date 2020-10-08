var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

http.listen(3000);


io.on('connection', (socket) => {
console.log("Connection Recieved");
});