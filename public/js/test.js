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
    fontSize:  10,
    fontFamily: "Ubuntu Mono",
    bg: "#000",
    fg: "#fff"
};
var display = new ROT.Display(displayOptions);

var mapContainer = document.getElementById("map-container");
mapContainer.appendChild(display.getContainer());
var mapMatrix = [];

map.create(function (x, y, value) {
    if (!mapMatrix[x]) {
        mapMatrix[x] = [];
    }
    mapMatrix[x][y] = value;
    if (value) {
        display.draw(x, y, "#", "#653", "#320");
    } else {
        display.draw(x, y, "");
    }
    
});
var rooms = map.getRooms();
for (var i in rooms) {
    console.log("center rooms" + rooms[i].getCenter());
    console.log("rooms : " + i)
}

class Enemy {
    constructor(x, y, symbol, color, sightRadius, damage) {
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.color = color;
        this.sightRadius = sightRadius;
        this.damage = damage;
    }

    takeTurn() {
        if (Math.abs(this.x - playerCharacter.x) <= this.sightRadius &&
            Math.abs(this.y - playerCharacter.y) <= this.sightRadius) {
            if (Math.abs(this.x - playerCharacter.x) <= 1 && 
                Math.abs(this.y - playerCharacter.y) <= 1) {
                    playerCharacter.currentHP -= this.damage * (1 - playerCharacter.defense / 10);
                    if (playerCharacter.currentHP < 0) playerCharacter.currentHP = 0;
                console.log(`Player HP: ${playerCharacter.currentHP}`);
            } else {
                let dx = Math.sign(playerCharacter.x - this.x);
                let dy = Math.sign(playerCharacter.y - this.y);
                moveCharacter(this, dx, dy);
            }
        }
    }
}
class Character {
    constructor(x, y, symbol, color, maxHP, currentHP, defense, power) {
      this.x = x;
      this.y = y;
      this.symbol = symbol;
      this.color = color;
      this.maxHP = maxHP;
      this.currentHP = currentHP;
      this.defense = defense;
      this.power = power;
    }
    pickupDefense(defense) {
        this.defense += defense;
        if (this.defense > 10) this.defense = 10;
    }
    // Method to take damage
    takeDamage(damage) {
      //
      this.currentHP -= damage * (1 - this.defense / 10);
      if (this.currentHP < 0) this.currentHP = 0;
    }
    
    // Method to heal
    heal(amount) {
      this.currentHP += amount;
      if (this.currentHP > this.maxHP) this.currentHP = this.maxHP;
    }
    
    // Method to check if character is alive
    isAlive() {
      return this.currentHP > 0;
    }
  }

class Weapon {
    constructor(x, y, symbol, color, damage, range, ammo) {
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.color = color;
        this.damage = damage;
        this.range = range;
        this.ammo = ammo;
    }
}

class Potion {
    constructor(x, y, symbol, color, healAmount) {
        this.x = y;
        this.y = y;
        this.symbol = symbol;
        this.color = color;
        this.healAmount = healAmount;
    }
}

function drawCharacter(character) {
    display.draw(character.x, character.y, character.symbol, character.color);
}

function drawWeapon(weapon) {
    display.draw(weapon.x, weapon.y, weapon.symbol, weapon.color);
}

function drawPotion(potion) {
    display.draw(potion.x, potion.y, potion.symbol, potion.color);
}

var fov = new ROT.FOV.PreciseShadowcasting(function(x, y) {
    return !mapMatrix[x][y];
});

function updateFOV() {
    var x = playerCharacter.x;
    var y = playerCharacter.y;
    var visibilityRadius = 10;
    display.clear();

    fov.compute(x, y, visibilityRadius, function(startX, startY, r, visibility) {
        if(mapMatrix[startX][startY] === 1) {
            display.draw(startX, startY, "#", "#653", "#320");
        } else {
            display.draw(startX, startY, ".");
        }
    });
    
    drawCharacter(playerCharacter);
    if (weapon1) drawWeapon(weapon1);
    if (weapon2) drawWeapon(weapon2);
}

function moveCharacter(character, dx, dy) {
    deleteCharacter(playerCharacter);
    if (isCollision(character.x + dx, character.y + dy)) {
        console.log("collision");
        return;
    } else {
        character.x += dx;
        character.y += dy;
    }
    updateFOV();  
}

function deleteCharacter(character) {
    display.draw(character.x, character.y, "");
}

function isCollision(x, y) {
    console.log("x : " + x + " y : " + y);
    if (x < 0 || x >= mapWidth || y < 0 || y >= mapHeight || mapMatrix[x][y] == 1) {
        console.log("collision");
        return true;
    }
    console.log("pas de collision");
    return false;
}

function handleInput(key) {
    switch (key) {
        case 'z':
            moveCharacter(playerCharacter, 0, -1);
            pickUpWeapon(playerCharacter);
            break;
        case 's':
            moveCharacter(playerCharacter, 0, 1);
            pickUpWeapon(playerCharacter);
            break;
        case 'q':
            moveCharacter(playerCharacter, -1, 0);
            pickUpWeapon(playerCharacter);
            break;
        case 'd':
            moveCharacter(playerCharacter, 1, 0);
            pickUpWeapon(playerCharacter);
            break;
    }
    drawCharacter(playerCharacter);
    rat.takeTurn(); 
    drawCharacter(rat);
}

function pickUpWeapon(character) {
    if (weapon1 && character.x === weapon1.x && character.y === weapon1.y) {
        character.weapon = weapon1;
        console.log(character);
        deleteWeapon(weapon1);
        weapon1 = null;
    } else if (weapon2 && character.x === weapon2.x && character.y === weapon2.y) {
        character.weapon = weapon2;
        console.log(character);
        deleteWeapon(weapon2);
        weapon2 = null;
    }
}


function deleteWeapon(weapon) {
    display.draw(weapon.x, weapon.y, "");
}

let randomRooms = rooms[Math.floor(Math.random() * rooms.length)];
let randomCenter = randomRooms.getCenter();
const playerCharacter = new Character(randomCenter[0], randomCenter[1], '@', 'red', 100, 100, 9, 5);
drawCharacter(playerCharacter);
let randomEnemyRoom = rooms[Math.floor(Math.random() * rooms.length)];
let enemyCenter = randomEnemyRoom.getCenter();
let rat = new Enemy(enemyCenter[0], enemyCenter[1], 'R', 'green', 5, 10);

let randomRoomsForWeapons = [rooms[Math.floor(Math.random() * rooms.length)], rooms[Math.floor(Math.random() * rooms.length)]];
let randomCentersForWeapons = [randomRoomsForWeapons[0].getCenter(), randomRoomsForWeapons[1].getCenter()];

let weapon1 = new Weapon(randomCentersForWeapons[0][0], randomCentersForWeapons[0][1], 'G', 'blue', 30, 4, 4);
let weapon2 = new Weapon(randomCentersForWeapons[1][0], randomCentersForWeapons[1][1], 'G', 'blue', 30, 4, 4);

drawWeapon(weapon1);
drawWeapon(weapon2);
drawCharacter(rat);

window.addEventListener('keydown', function (event) {
    handleInput(event.key);
});

updateFOV();

window.addEventListener('click', function(event) {
    const x = Math.floor(event.clientX / displayOptions.fontSize);
    const y = Math.floor(event.clientY / displayOptions.fontSize);
    attackEnemy(playerCharacter, x, y);
});

function attackEnemy(character, x, y) {
    if (character.weapon && Math.abs(character.x - x) <= character.weapon.range && Math.abs(character.y - y) <= character.weapon.range && character.weapon.ammo > 0) {
        character.weapon.ammo--;
        // Assuming that an enemy object exists and its health can be updated
        // enemy.takeDamage(character.weapon.damage);
    }
}
