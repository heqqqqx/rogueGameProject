var mapWidth = 120;
var mapHeight = 60;
var maxRooms = 4;
var corridorLength = [2, 4];

var map = new ROT.Map.Digger(mapWidth, mapHeight, {
    roomWidth: [4, 20],
    roomHeight: [4, 20],
    corridorLength: corridorLength,
    dugPercentage: 0.2,
    timeLimit: 5000,
    maxRooms: maxRooms
});

var displayOptions = {
    width: mapWidth,
    height: mapHeight,
    fontSize: 30,
    fontFamily: "Ubuntu Mono",
    bg: "#000",
    fg: "#fff"
};
var display = new ROT.Display(displayOptions);

var mapContainer = document.getElementById("map-container");
mapContainer.appendChild(display.getContainer());

map.create(function (x, y, value) {
    if (value) {
        display.draw(x, y, "#", "#653", "#320");
    } else {
        display.draw(x, y, ".");
    }
});

var rooms = map.getRooms();
console.log(rooms);
for (var i in rooms) {
    console.log("center rooms" + rooms[i].getCenter());
    console.log("rooms : " + i)
}


class Character {
    constructor(x, y, symbol, color) {
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.color = color;
    }
}
function drawCharacter(character) {
    display.draw(character.x, character.y, character.symbol, character.color);
}
function handleInput(key) {
    switch (key) {
        case 'z':
            moveCharacter(playerCharacter, 0, -1);
            break;
        case 's':
            moveCharacter(playerCharacter, 0, 1);
            break;
        case 'q':
            moveCharacter(playerCharacter, -1, 0);
            break;
        case 'd':
            moveCharacter(playerCharacter, 1, 0);
            break;
    }
    drawCharacter(playerCharacter);
}

function moveCharacter(character, dx, dy) {
    deleteCharacter(playerCharacter);
    if (isCollision(character.x + dx, character.y + dy)) {
        console.log("collision");
        return;
    }
    else {
        character.x += dx;
        character.y += dy;
    }

}
function deleteCharacter(character) {
    display.draw(character.x, character.y, ".");
}




function isCollision(x, y) {
    // let freeCoordinates = getFreeCoordinates();
    console.log("x : " + x + " y : " + y);
    if (x < 0 || x >= mapWidth || y < 0 || y >= mapHeight) {
        console.log("collision 0");
        return true;
    }
    // else if (isInFreeCoordinates(x, y) == true) {
    //     console.log("collision 1");
    //     return true;
    
    console.log("pas de collision");
    return false;
}

let randomRooms = rooms[Math.floor(Math.random() * rooms.length)];
let randomCenter = randomRooms.getCenter();

const playerCharacter = new Character(randomCenter[0], randomCenter[1], '@', 'red');
drawCharacter(playerCharacter);

window.addEventListener('keydown', function (event) {
    handleInput(event.key);
});
