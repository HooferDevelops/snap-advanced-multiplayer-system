// Libraries
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// Classes
var Lobby = require("./objects/lobbytemplate.js")
var Project = require("./objects/projecttemplate.js")
// tl;dr this is basically a holder for all of the 'servers'
var Projects = {

}

// Connection Port
http.listen(process.env.PORT || 3000);

console.log(new Lobby(null, "test lobby"));
io.on('connection', (socket) => {



    socket.on("createProjectInstance", (data)=>{
        // check if data has a project name
        // check if project name already exists in given context
        // create a new project instance
        if (!data || !data.projectName || Projects[data.projectName]){
            return;
        }
        
        Projects[data.projectName] = new Project(data.projectName);
    })

    socket.on("createLobbyInstance", (data)=>{
        // check if data has a project name
        // check if project name exists in projects
        // create new lobby instance
        // emit back a response of the lobby name
        if (!data || !data.projectName || !Projects[data.projectName]){
            return;
        }

        var id = Math.floor(Math.random() * 99999999);
        var lobbyName = data.projectName + "-" + id;

        Projects[data.projectName].lobbies[lobbyName] = new Lobby(id, lobbyName, socket);
        socket.emit("createLobbyInstance", lobbyName);
    })

    socket.on("disconnect", (data)=>{
        console.log("disconnected");
        // check if socket was a host
        // delete server instance and emit disconnect
    })
});
