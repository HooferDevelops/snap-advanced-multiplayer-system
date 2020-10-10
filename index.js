// Libraries
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// Classes
var Lobby = require("./objects/lobby.js")
var Project = require("./objects/project.js")
var User = require("./objects/user.js")

// tl;dr this is basically a holder for all of the 'servers'
var Projects = {

}
// temp
global.Projects = Projects;

// Connection Port
http.listen(process.env.PORT || 3000);

io.on('connection', (socket) => {



    socket.on("createProjectInstance", (data)=>{
        // check if data has a project name
        // check if project name already exists in given context
        // create a new project instance
        if (!data || !data.projectName)
            return;
        if (Projects[data.projectName])
            return;
        
        Projects[data.projectName] = new Project(data.projectName);
    })

    socket.on("createLobbyInstance", (data)=>{
        // check if data has a project name
        // check if project name exists in projects
        // create new lobby instance
        // emit back a response of the lobby name
        if (!data || !data.projectName)
            return;
        if (!Projects[data.projectName])
            return;

        var id = Math.floor(Math.random() * 99999999);
        var lobbyName = data.projectName + "-" + id;

        Projects[data.projectName].lobbies[lobbyName] = new Lobby(id, lobbyName, socket);
        socket.emit("createLobbyInstance", lobbyName);
    })

    socket.on("joinLobbyInstance", (data)=>{
        // check if data has project name
        // check if data has lobby name
        // check if project exists
        // check if lobby exists inside of project
        // add user to lobby
        // emit back a response (likely the lobby name)
        if (!data || !data.projectName || !data.lobbyName)
            return;
        if (!Projects[data.projectName])
            return;
        if (!Projects[data.projectName].lobbies[data.lobbyName])
            return;
        
        var project = Projects[data.projectName];
        var lobby = project.lobbies[data.lobbyName];
        // check if user is already connected to lobby
        if (lobby.users[socket.id])
            return;
        lobby.users[socket.id] = new User(socket);
        socket.emit("joinLobbyInstance", data.lobbyName);
    })

    socket.on("getLobbies", (data)=>{
        // check if data has project name
        if (!data || !data.projectName)
            return;
        if (!Projects[data.projectName])
            return;
        
        var list = Object.keys(Projects[data.projectName].lobbies).map(l=>{
            return Projects[data.projectName].lobbies[l].name;
        })
        socket.emit("getLobbies", list);
    })

    socket.on("tellHost", (data)=>{
        // check if data has project name
        // check if data has lobby name
        // check if lobby exits
        // emit data to lobby host
        
        if (!data || !data.projectName || !data.lobbyName || !data.info || !data.name)
            return;
        if (!Projects[data.projectName])
            return;
        if (!Projects[data.projectName].lobbies[data.lobbyName])
            return;
        
        Projects[data.projectName].lobbies[data.lobbyName].host.emit("host-" + Projects[data.projectName].lobbies[data.lobbyName].name + "-" + data.name, data.info);
    })

    socket.on("tellClient", (data)=>{
        // check if data has project name
        // check if data has lobby name
        // check if lobby exits
        // emit data to lobby host

        if (!data || !data.projectName || !data.lobbyName || !data.info || !data.name)
            return;
        if (!Projects[data.projectName])
            return;
        if (!Projects[data.projectName].lobbies[data.lobbyName])
            return;
        if (data.info.contents)
            data.info = data.info.contents;
        
        Object.keys(Projects[data.projectName].lobbies[data.lobbyName].users).forEach(userIndex=>{
            user = Projects[data.projectName].lobbies[data.lobbyName].users[userIndex];
            user.socket.emit("client-" + Projects[data.projectName].lobbies[data.lobbyName].name + "-" + data.name, data.info);
        })
    })

    socket.on("disconnect", (data)=>{
        console.log("disconnected");
        // check if socket was a host
        // delete server instance and emit disconnect
        

        // oh my goodness this code hurts my head, i would revise it but i don't feel like it
        Object.keys(Projects).forEach((project)=>{
            Object.keys(Projects[project].lobbies).forEach((lobby)=>{
                if (Projects[project].lobbies[lobby].host == socket){
                    Object.keys(Projects[project].lobbies[lobby].users).forEach(user=>{
                        Projects[project].lobbies[lobby].users[user].socket.disconnect();
                    })
                    delete Projects[project].lobbies[lobby];
                }
            })
        })

    })
});
