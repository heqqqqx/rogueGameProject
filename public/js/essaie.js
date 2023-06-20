class Game {
    constructor(mapWidth, mapHeight, maxRooms, corridorLength, displayOptions) {
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.maxRooms = maxRooms;
        this.corridorLength = corridorLength;
        this.displayOptions = displayOptions;
        this.map = null;
        this.display = null;
        this.mapContainer = null;
        this.rooms = [];
        this.playerCharacter = null;
    }

    initialize() {
        this.createMap();
        this.createDisplay();
        this.createPlayerCharacter();
        this.drawMap();
        this.addEventListeners();
    }

    createMap() {
        this.map = new ROT.Map.Digger(this.mapWidth, this.mapHeight, {
            roomWidth: [4, 20],
            roomHeight: [4, 20],
            corridorLength: this.corridorLength,
            dugPercentage: 0.2,
            timeLimit: 5000,
            maxRooms: this.maxRooms
        });

        this.rooms = this.map.getRooms();
    }

    createDisplay() {
        this.display = new ROT.Display(this.displayOptions);
        this.mapContainer = document.getElementById("map-container");
        this.mapContainer.appendChild(this.display.getContainer());
    }




    drawMap() {
        this.map.create((x, y, value) => {
            if (value) {
                this.display.draw(x, y, "#", "#653", "#320");
            } else {
                this.display.draw(x, y, ".");
            }
        });
    }




    isInFreeCoordinates(x, y) {
        for (let i = 0; i < this.rooms.length; i++) {
            const room = this.rooms[i];
            if (room.getLeft() <= x && x <= room.getRight() && room.getTop() <= y && y <= room.getBottom()) {
                return false;
            }
        }
        return true;
    }

    addEventListeners() {
        window.addEventListener('keydown', event => {
            this.handleInput(event.key);
        });
    }
}

class Character extends Game {
    constructor(x, y, symbol, color) {
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.color = color;
    }

    createPlayerCharacter() {
        if (this.rooms.length === 0) {
            console.error("No rooms available.");
            return;
        }

        const randomRoom = this.rooms[Math.floor(Math.random() * this.rooms.length)];
        const randomCenter = randomRoom.getCenter();

        this.playerCharacter = new Character(randomCenter[0], randomCenter[1], '@', 'red');
        this.drawCharacter(this.playerCharacter); // Ajouter cette ligne pour afficher le personnage
    }
    drawCharacter(character) {
        this.display.draw(character.x, character.y, character.symbol, character.color);
    }
    handleInput(key) {
        switch (key) {
            case 'z':
                this.moveCharacter(this.playerCharacter, 0, -1);
                break;
            case 's':
                this.moveCharacter(this.playerCharacter, 0, 1);
                break;
            case 'q':
                this.moveCharacter(this.playerCharacter, -1, 0);
                break;
            case 'd':
                this.moveCharacter(this.playerCharacter, 1, 0);
                break;
        }
        this.drawCharacter(this.playerCharacter);
    }

    moveCharacter(character, dx, dy) {
        if (character) {
            this.deleteCharacter(character);
            if (this.isCollision(character.x + dx, character.y + dy)) {
                console.log("collision");
                return;
            } else {
                character.x += dx;
                character.y += dy;
            }
        }
    }


    deleteCharacter(character) {
        if (character) {
            Game.display.draw(character.x, character.y, ".");
        }
    }


    isCollision(x, y) {
        if (x < 0 || x >= Game.mapWidth || y < 0 || y >= Game.mapHeight) {
            console.log("collision 0");
            return true;
        } else if (Game.isInFreeCoordinates(x, y)) {
            console.log("collision 1");
            return true;
        }
        console.log("pas de collision");
        return false;
    }
}

// Utilisation de la classe Game
const mapWidth = 120;
const mapHeight = 60;
const maxRooms = 4;
const corridorLength = [2, 4];
const displayOptions = {
    width: mapWidth,
    height: mapHeight,
    fontSize: 30,
    fontFamily: "Ubuntu Mono",
    bg: "#000",
    fg: "#fff"
};

const game = new Game(mapWidth, mapHeight, maxRooms, corridorLength, displayOptions);
game.initialize();
