class Lobby {
    constructor(id, name, socket) {
        this.id = id || Math.floor(Math.random()*999999999999);
        this.name = name;
        this.host = socket;
        this.users = {
            
        }
    }



}

module.exports = Lobby;