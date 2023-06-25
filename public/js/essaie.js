var mapWidth = 120;
var mapHeight = 60;
var maxRooms = 4;
var corridorLength = [2, 4];

var map = new ROT.Map.Rogue(mapWidth, mapHeight);
var level = 1
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


function getRandomWalkableCoordinate() {
    var walkableCoordinates = [];

    for (var x = 0; x < mapWidth; x++) {
        for (var y = 0; y < mapHeight; y++) {
            if (mapMatrix[x][y] === 0) {
                walkableCoordinates.push({ x: x, y: y });
            }
        }
    }

    if (walkableCoordinates.length > 0) {
        var randomCoordinateIndex = Math.floor(Math.random() * walkableCoordinates.length);
        return walkableCoordinates[randomCoordinateIndex];
    }

    return null; // Retourne null s'il n'y a pas de coordonnées où marcher
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

        if (Math.random() < 0.3) { // Ajout de l'aléatoire avec une chance de 50% de se déplacer
            return;
        }

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

    takeDamage(damage) {
        this.currentHP -= damage;

        if (this.currentHP < 0) {
            this.currentHP = 0;
        }


    }

    isAlive() {
        return this.currentHP > 0;
    }
}
class Character {
    constructor(x, y, symbol, color, maxHP, currentHP, defense, power, gold) {
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.color = color;
        this.maxHP = maxHP;
        this.currentHP = currentHP;
        this.defense = defense;
        this.power = power;
        this.gold = gold;
    }
    pickupDefense(defense) {
        this.defense += defense;
        if (this.defense > 10) this.defense = 11;
    }

    takeDamage(damage) {
        //
        this.currentHP -= damage * (1 - this.defense / 11);
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
        //print weapon ammo only when the player pick up a weapon
        if (this.weapon) {
            document.getElementById('ammo').textContent = `Ammo: ${this.weapon.ammo}`;
        } else {
            document.getElementById('ammo').textContent = `Ammo: 0`;
        }
        // document.getElementById('ammo').textContent = `Ammo: ${this.weapon ? this.weapon.ammo : 'None'}`;
        document.getElementById('gold').textContent = `Gold: ${this.gold}`;
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
class Gold {
    constructor(x, y, symbol, color) {
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.color = color;
    }
}


class Potion {
    constructor(x, y, symbol, color, healAmount) {
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.color = color;
        this.healAmount = healAmount;
    }
}

function generateEnemies(level) {
    const enemies = [];

    for (let i = 0; i < level * 2; i++) {
        let ratCoordinates = getRandomWalkableCoordinate();
        let rat = new Enemy(
            ratCoordinates.x,
            ratCoordinates.y,
            'R',
            'green',
            5 + level,
            10 + level * 3,
            30 + level * 10,
            30 + level * 10
        );
        console.log(rat);
        enemies.push(rat);
    }

    return enemies;
}

function generateWeapon(level) {
    let weapons = [];

    for (let i = 0; i < level * 2; i++) {
        let weaponCoordinates = getRandomWalkableCoordinate();
        let weapon = new Weapon(
            weaponCoordinates.x,
            weaponCoordinates.y,
            'W',
            'blue',
            20,
            10,
            0,
            "Gun"
        );
        // console.log(weapon);
        weapons.push(weapon);
    }

    return weapons;
}


function drawCharacter(character) {
    display.draw(character.x, character.y, character.symbol, character.color);
}

function drawWeapon(weapon) {
    display.draw(weapon.x, weapon.y, weapon.symbol, weapon.color);
}

function drawGold(gold) {
    display.draw(gold.x, gold.y, gold.symbol, gold.color);
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
    try {
        fov.compute(x, y, visibilityRadius, function(startX, startY, r, visibility) {
            let cellKey = startX + ',' + startY;
            visibleCells.add(cellKey); // Add the cell to the visible set

            if (mapMatrix[startX][startY] === 1) {
                display.draw(startX, startY, "#", "#653", "#320");
            } else {
                display.draw(startX, startY, ".");
            }
        });
    } catch (e) {
        // console.log(e);
    }

    // Only draw the character if they're visible
    if (visibleCells.has(playerCharacter.x + ',' + playerCharacter.y)) {
        drawCharacter(playerCharacter);
    }


    // if (weapon2 && visibleCells.has(weapon2.x + ',' + weapon2.y)) {
    //     drawWeapon(weapon2);
    // }
    for (let w of weapons) {
        if (visibleCells.has(w.x + ',' + w.y)) {
            drawCharacter(w);
        }
    }
    for (let rat of enemies) {
        if (visibleCells.has(rat.x + ',' + rat.y) && rat.isAlive()) {
            drawCharacter(rat);
        }
    }
    if (gold && visibleCells.has(gold.x + ',' + gold.y)) {
        drawGold(gold);
    }
}

function getEnemy(x, y) {
    for (let rat of enemies) {
        if (rat.x === x && rat.y === y) {
            return rat;
        }
    }
    return null;
}

function moveCharacter(character, dx, dy) {
    deleteCharacter(character);
    if (isCollision(character.x + dx, character.y + dy)) {
        drawCharacter(character);
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
    // console.log("x : " + x + " y : " + y);
    if (x < 0 || x >= mapWidth || y < 0 || y >= mapHeight || mapMatrix[x][y] == 1) {
        // console.log("collision");
        return true;
    }
    // console.log("pas de collision");
    return false;
}

function isCollisionWithEnemy(x, y) {
    for (let rat of enemies) {
        if (rat.x == x && rat.y == y) {
            return true;
        }
    }
    return false;
}

function handleInput(key) {
    switch (key) {
        case 'z':
            moveCharacter(playerCharacter, 0, -1);
            pickUpWeapon(playerCharacter);
            pickUpGold(playerCharacter);

            break;
        case 's':
            moveCharacter(playerCharacter, 0, 1);
            pickUpWeapon(playerCharacter);
            pickUpGold(playerCharacter);

            break;
        case 'q':
            moveCharacter(playerCharacter, -1, 0);
            pickUpWeapon(playerCharacter);
            pickUpGold(playerCharacter);

            break;
        case 'd':
            moveCharacter(playerCharacter, 1, 0);
            pickUpWeapon(playerCharacter);
            pickUpGold(playerCharacter);

            break;
    }
    playerCharacter.updateStats();

    for (let rat of enemies) {
        rat.takeTurn();
    }
}


// function pickUpWeapon(character) {
//     if (weapon1 && character.x === weapon1.x && character.y === weapon1.y) {
//         if (!character.weapon) {
//             character.weapon = weapon1;
//             character.weapon.ammo += 4; // Ajoute 4 balles à l'arme
//         } else {
//             character.weapon.ammo += 4; // Ajoute 4 balles à l'arme existante
//         }

//         console.log(character);
//         deleteWeapon(character);
//         weapon1 = null;

//     }
//     else if (weapon2 && character.x === weapon2.x && character.y === weapon2.y) {
//         if (character.weapon) {
//             console.log("character.weapon : " + character.weapon);
//             character.weapon.ammo += 4; // Ajoute 4 balles à l'arme
//         } else {
//             character.weapon = weapon2;
//         }
//         console.log(character);
//         deleteWeapon(character);
//         weapon2 = null;
//     }
// }

function pickUpWeapon(character) {
    for (let i = 0; i < weapons.length; i++) {
        const weapon = weapons[i];
        if (character.x === weapon.x && character.y === weapon.y) {
            if (!character.weapon) {
                character.weapon = weapon;
                character.weapon.ammo += 4;
            } else {
                character.weapon.ammo += 4;
            }

            console.log(character);
            deleteWeapon(character);
            weapons.splice(i, 1);
            break;
        }
    }
}


function deleteWeapon(character) {
    drawCharacter(character)
}

function pickUpGold(character) {
    if (gold && character.x === gold.x && character.y === gold.y) {
        console.log(character.gold)
        character.gold += 1;
        deleteGold(character); // Supprime l'or de la carte
        gold = null;
    }
}


function deleteGold(character) {
    drawCharacter(character);
}



let playerCharacterCoordinates = getRandomWalkableCoordinate();
let playerCharacter = new Character(playerCharacterCoordinates.x, playerCharacterCoordinates.y, '@', 'white', 100, 100, 1, 0, 0);

let goldCoordinates = getRandomWalkableCoordinate();
let gold = new Gold(goldCoordinates.x, goldCoordinates.y, 'G', 'yellow');

var ratCoordinates = getRandomWalkableCoordinate();
var rat = new Enemy(ratCoordinates.x, ratCoordinates.y, 'R', 'red', 5, 5, 10, 10);


// let weapon1Coordinates = getRandomWalkableCoordinate();
// let weapon1 = new Weapon(weapon1Coordinates.x, weapon1Coordinates.y, 'W', 'blue', 5, 5, 0, "Gun");
// weapons.push(weapon1);
// let weapon2Coordinates = getRandomWalkableCoordinate();
// let weapon2 = new Weapon(weapon2Coordinates.x, weapon2Coordinates.y, 'W', 'blue', 5, 5, 0, "Gun");
// weapons.push(weapon2);



let enemies = generateEnemies(level);
let weapons = generateWeapon(level);





for (let rat of enemies) {
    drawCharacter(rat);
}
drawCharacter(playerCharacter);
drawGold(gold);
for (let weapon of weapons) {
    drawWeapon(weapon);

}
console.log(playerCharacter.gold);
window.addEventListener('keydown', function(event) {
    let key = event.key.toLowerCase();
    if (key === 'arrowup' || key === 'z') {
        handleInput('z');
    } else if (key === 'arrowdown' || key === 's') {
        handleInput('s');
    } else if (key === 'arrowleft' || key === 'q') {
        handleInput('q');
    } else if (key === 'arrowright' || key === 'd') {
        handleInput('d');
    }
});

// updateFOV();

window.addEventListener('click', function(event) {
    if (!playerCharacter.weapon) {
        console.log('no weapon');
        return
    };
    const damage = playerCharacter.weapon.attack();
    const bounds = event.target.getBoundingClientRect();
    const x = Math.floor((event.clientX - bounds.left) / displayOptions.fontSize);
    const y = Math.floor((event.clientY - bounds.top) / displayOptions.fontSize);

    for (let rat of enemies) {
        if (x === rat.x && y === rat.y) {
            rat.takeDamage(damage);
            rat.takeTurn();
            if (rat.currentHP === 0) {
                // 75% de chance de drop 1 gold
                if (Math.random() < 0.75) {
                    playerCharacter.gold++;
                    console.log("you found gold on the ragodin")
                } else {
                    console.log("unlucky, you didn't find gold on this racoon")
                }
            }


            console.log('hitted rat for ' + playerCharacter.weapon.damage + ' damage');
            console.log('used one ammo. ' + playerCharacter.weapon.ammo + ' ammo left');
            console.log('rat has ' + rat.currentHP + ' hp left');
            return;
        }
    }
});