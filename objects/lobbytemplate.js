class Lobby {
    constructor(id, name) {
        this.id = id || Math.floor(Math.random()*999999999999);
        this.name = name || "no name";
    }

    get id(){
        return this.id;
    }
    
}

nodule.exports = Lobby;