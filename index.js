// Libraries
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// Classes
var Lobby = require("./objects/lobbytemplate.js")

// tl;dr this is basically a holder for all of the 'servers'
var Projects = {

}

// Connection Port
http.listen(process.env.PORT || 3000);

console.log(new Lobby(null, "test lobby"));
io.on('connection', (socket) => {
    console.log(socket.request);
    socket.on("createProjectInstance", (data)=>{
        // check if data has a project name
        // check if project name already exists in given context
        // create a new project instance
    })
});