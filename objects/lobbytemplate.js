class Lobby {
    constructor(id, name) {
        this.id = id || Math.floor(Math.random()*999999999999);
        this.name = name;
    }



}

module.exports = Lobby;