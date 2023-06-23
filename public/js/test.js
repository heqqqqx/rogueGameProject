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
    fontSize: 10,
    fontFamily: "Ubuntu Mono",
    bg: "#000",
    fg: "#fff"
};
var display = new ROT.Display(displayOptions);

var mapContainer = document.getElementById("map-container");
mapContainer.appendChild(display.getContainer());
var mapMatrix = [];

map.create(function(x, y, value) {
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
    constructor(x, y, symbol, color, sightRadius, damage, maxHP, currentHP) {
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.color = color;
        this.sightRadius = sightRadius;
        this.damage = damage;
        this.maxHP = maxHP;
        this.currentHP = currentHP;
    }
    takeTurn() {
        if (!this.isAlive()) {
            return;
        }
        if (Math.abs(this.x - playerCharacter.x) <= this.sightRadius &&
            Math.abs(this.y - playerCharacter.y) <= this.sightRadius) {
            if (Math.abs(this.x - playerCharacter.x) <= 1 &&
                Math.abs(this.y - playerCharacter.y) <= 1) {
                playerCharacter.currentHP -= this.damage * (1 - playerCharacter.defense / 10);
                if (playerCharacter.currentHP < 0) playerCharacter.currentHP = 0;
                console.log(`Player HP: ${playerCharacter.currentHP}`);
                console.log(rat.x, rat.y, playerCharacter.x, playerCharacter.y)
            } else {
                let dx = Math.sign(playerCharacter.x - this.x);
                let dy = Math.sign(playerCharacter.y - this.y);
                moveCharacter(this, dx, dy);
            }
        }
    }
    takeDamage(damage) {
        this.currentHP -= damage;
        if (this.currentHP < 0) this.currentHP = 0;
    }

    isAlive() {
        return this.currentHP > 0;
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

    attack(target) {
        let damage = this.power;
        if (this.weapon) {
            damage += this.weapon.attack();
        }
        target.currentHP -= damage;
        if (target.currentHP < 0) target.currentHP = 0;
    }
    updateStats() {
        document.getElementById('hp').textContent = `HP: ${this.currentHP}`;
        document.getElementById('defense').textContent = `Defense: ${this.defense}`;
        document.getElementById('power').textContent = `Power: ${this.power}`;
        document.getElementById('weapon').textContent = `Weapon: ${this.weapon ? this.weapon.name : 'None'}`;
        document.getElementById('ammo').textContent = `Ammo: ${this.weapon ? this.weapon.ammo : 'None'}`;

    }
}

class Weapon {
    constructor(x, y, symbol, color, damage, range, ammo, name) {
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.color = color;
        this.damage = damage;
        this.range = range;
        this.ammo = ammo;
        this.name = name;

    }

    attack() {
        if (this.ammo > 0) {
            this.ammo--;
            return this.damage;
        }
        return 0;
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

let visibleCells = new Set(); // Store the visible cells

function updateFOV() {
    var x = playerCharacter.x;
    var y = playerCharacter.y;
    var visibilityRadius = 10;
    display.clear();

    visibleCells.clear(); // Clear the set before recomputing

    fov.compute(x, y, visibilityRadius, function(startX, startY, r, visibility) {
        let cellKey = startX + ',' + startY;
        visibleCells.add(cellKey); // Add the cell to the visible set

        if (mapMatrix[startX][startY] === 1) {
            display.draw(startX, startY, "#", "#653", "#320");
        } else {
            display.draw(startX, startY, ".");
        }
    });

    // Only draw the character if they're visible
    if (visibleCells.has(playerCharacter.x + ',' + playerCharacter.y)) {
        drawCharacter(playerCharacter);
    }

    if (weapon1 && visibleCells.has(weapon1.x + ',' + weapon1.y)) {
        drawWeapon(weapon1);
    }

    if (weapon2 && visibleCells.has(weapon2.x + ',' + weapon2.y)) {
        drawWeapon(weapon2);
    }

    if (rat && visibleCells.has(rat.x + ',' + rat.y) && rat.isAlive()) {
        drawCharacter(rat);
    }
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
    playerCharacter.updateStats();

    rat.takeTurn();

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
let enemies = [];
let rat = new Enemy(enemyCenter[0], enemyCenter[1], 'R', 'green', 5, 10, 30, 30);
enemies.push(rat);


let randomRoomsForWeapons = [rooms[Math.floor(Math.random() * rooms.length)], rooms[Math.floor(Math.random() * rooms.length)]];
let randomCentersForWeapons = [randomRoomsForWeapons[0].getCenter(), randomRoomsForWeapons[1].getCenter()];

let weapon1 = new Weapon(randomCentersForWeapons[0][0], randomCentersForWeapons[0][1], 'G', 'blue', 30, 4, 4, "Gun");
let weapon2 = new Weapon(randomCentersForWeapons[1][0], randomCentersForWeapons[1][1], 'G', 'blue', 30, 4, 4, "Gun");

drawWeapon(weapon1);
drawWeapon(weapon2);
drawCharacter(rat);

window.addEventListener('keydown', function(event) {
    handleInput(event.key);
});

updateFOV();




window.addEventListener('click', function(event) {
    if (!playerCharacter.weapon) {
        console.log('no weapon');
        return
    };
    const bounds = event.target.getBoundingClientRect();
    const x = Math.floor((event.clientX - bounds.left) / displayOptions.fontSize);
    const y = Math.floor((event.clientY - bounds.top) / displayOptions.fontSize);



    if (x === rat.x && y === rat.y) {
        rat.takeDamage(playerCharacter.weapon.damage);
        console.log('hitted rat for ' + playerCharacter.weapon.damage + ' damage')
        console.log('used one ammo. ' + playerCharacter.weapon.ammo + ' ammo left')
        console.log('rat has ' + rat.currentHP + ' hp left')
        return;
    }

});