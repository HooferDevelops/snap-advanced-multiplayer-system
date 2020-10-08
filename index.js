// Libraries
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// Classes
var lobby = require("./objects/lobbytemplate.js")

// Connection Port
http.listen(process.env.PORT || 3000);

console.log(new lobby());
io.on('connection', (socket) => {

});