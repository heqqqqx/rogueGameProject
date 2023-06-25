document.getElementById('file-input').addEventListener('change', loadGame);

function loadGame() {
    console.log('Loading game...');
    const fileInput = document.getElementById('file-input');
    console.log('Waiting for file selection...')

    console.log('File selected.');
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const saveDataJson = event.target.result;
        const saveData = JSON.parse(saveDataJson);
        console.log(saveData.enemies)
        console.log(saveData.playerCharacter)
        console.log(saveData.mapMatrix)
        console.log(saveData.weapons)
        console.log(saveData.stairs)
        console.log(saveData.gold)
        console.log(saveData.level)
        mapMatrix = saveData.mapMatrix;
        playerCharacter = Object.assign(new Character(), saveData.playerCharacter);
        enemies = saveData.enemies.map(enemyData => Object.assign(new Enemy(), enemyData));
        weapons = saveData.weapons.map(weaponData => Object.assign(new Weapon(), weaponData));
        stairs = Object.assign(new Stairs(), saveData.stairs);
        gold = Object.assign(new Gold(), saveData.gold);

        console.log('Game loaded successfully.');

    };
    reader.readAsText(file);
}


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

    PlayerTakeDamage(damage) {
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
        document.getElementById('niveau').textContent = `Niveau: ${level}`;
        //print weapon ammo only when the player pick up a weapon
        if (this.weapon) {
            document.getElementById('ammo').textContent = `Ammo: ${this.weapon.ammo}`;
        } else {
            document.getElementById('ammo').textContent = `Ammo: 0`;
        }
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

class Stairs {
    constructor(x, y, symbol, color) {
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.color = color;
    }
}
class PNJ {
    constructor(x, y, symbol, color, name) {
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.color = color;
        this.name = name;
    }

    exchangeGoldForHP(character) {
        const goldCosts = {
            2: 10,
            5: 20,
            10: 40,
            20: 100
        };

        console.log("How many HP do you want to regain?");
        console.log("1. 10 HP - 2 gold");
        console.log("2. 20 HP - 5 gold");
        console.log("3. 40 HP - 10 gold");
        console.log("4. 100 HP - 20 gold");

        const readline = require("readline");
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question("Enter your choice: ", choice => {
            rl.close();
            const goldCost = goldCosts[choice];

            if (goldCost !== undefined) {
                if (character.gold >= goldCost) {
                    const hpGain = goldCost / 2;
                    character.gold -= goldCost;
                    character.heal(hpGain);

                    console.log(`Exchanged ${goldCost} gold for ${hpGain} HP.`);
                    console.log(`Current HP: ${character.currentHP}`);
                } else {
                    console.log("Not enough gold to perform the exchange.");
                }
            } else {
                console.log("Invalid choice.");
            }
        });
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
            200,
            10,
            0,
            "Gun"
        );
        // console.log(weapon);
        weapons.push(weapon);
    }

    return weapons;
}
function generateGold(level) {
    let golds = [];
    for (let i = 0; i < level * 2; i++) {
        let goldCoordinates = getRandomWalkableCoordinate();
        let gold = new Gold(
            goldCoordinates.x,
            goldCoordinates.y,
            '$',
            'yellow'
        );
        golds.push(gold);
    }
    return golds;
}

function generateStairs() {
    let stairsCoordinates = getRandomWalkableCoordinate();
    let stairs = new Stairs(stairsCoordinates.x,
        stairsCoordinates.y, ">", "white");
    return stairs;
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

function drawPNJ(pnj) {
    display.draw(pnj.x, pnj.y, pnj.symbol, pnj.color,pnj.name);
}

function drawStairs(stairs) {
    display.draw(stairs.x, stairs.y, stairs.symbol, stairs.color);
}

var fov = new ROT.FOV.PreciseShadowcasting(function (x, y) {
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
        fov.compute(x, y, visibilityRadius, function (startX, startY, r, visibility) {
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
    if (stairs && visibleCells.has(stairs.x + ',' + stairs.y)) {
        drawStairs(stairs);
    }
    if (visibleCells.has(playerCharacter.x + ',' + playerCharacter.y)) {
        drawCharacter(playerCharacter);
    }
    if (visibleCells.has(pnj.x + ',' + pnj.y)) {
        drawPNJ(pnj);
    }
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
    for (let g of golds) {
        if (visibleCells.has(g.x + ',' + g.y)) {
            drawGold(g);
        }
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
    const newX = character.x + dx;
    const newY = character.y + dy;
    const damage = character.power;

    if (isCollision(newX, newY)) {
        return; // Collision with map boundaries or walls, cannot move
    }

    let rat = getEnemy(newX, newY);

    if (rat && rat.isAlive()) {
        rat.takeDamage(damage);
        console.log(enemies.length)
        if (!rat.isAlive()) {
            const index = enemies.indexOf(rat);
            enemies.splice(index, 1);
            console.log("Rat killed!");
        }

        updateFOV();
        return;
    }

    deleteCharacter(character);
    character.x = newX;
    character.y = newY;
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
        case 'enter':
            if (stairs && playerCharacter.x === stairs.x && playerCharacter.y === stairs.y) {
                generateNewLevel();
            }
            break;
        case 'h':
            saveGame();

    }
    playerCharacter.updateStats();
    for (let rat of enemies) {
        rat.takeTurn();
    }
}


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
    for (let i = 0; i < golds.length; i++) {
        const gold = golds[i];
        if (character.x === gold.x && character.y === gold.y) {
            character.gold += 1;
            console.log(character);
            deleteWeapon(character);
            golds.splice(i, 1);
            break;
        }
    }
}

function deleteGold(character) {
    drawCharacter(character);
}

function deleteRat(character) {
    drawCharacter(character);
}

function saveGame() {
    console.log('Saving game...');
    const saveData = {
        mapMatrix: mapMatrix,
        playerCharacter: playerCharacter,
        enemies: enemies,
        weapons: weapons,
        stairs: stairs,
        gold: gold,
        level: level,
    };

    const saveDataJson = JSON.stringify(saveData);
    const blob = new Blob([saveDataJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game_progression.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log('Game saved successfully.');
}


function generateNewLevel() {
    console.log("generating new level");
    level++;

    map = new ROT.Map.Rogue(mapWidth, mapHeight);
    console.log(display);

    var mapContainer = document.getElementById("map-container");
    mapContainer.innerHTML = "";

    mapContainer.appendChild(display.getContainer());
    mapMatrix = [];

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

    regenerateEntities();
    console.log("regenerating entities");

    displayOptions.width = mapWidth;
    displayOptions.height = mapHeight;
    display.setOptions(displayOptions);

    for (let rat of enemies) {
        // console.log(rat);
        drawCharacter(rat);
    }
    for (let weapon of weapons) {
        // console.log(weapon);
        drawWeapon(weapon);
    }
    for (let gold of golds) {
        // console.log(gold);
        drawGold(gold);
    }

    playerCharacterCoordinates = getRandomWalkableCoordinate();
    playerCharacter.x = playerCharacterCoordinates.x;
    playerCharacter.y = playerCharacterCoordinates.y;
    console.log(playerCharacter);

    stairs = generateStairs();
    drawStairs(stairs);

    drawCharacter(playerCharacter);

    // for (let weapon of weapons) {
    //     drawWeapon(weapon);
    // }
    console.log(playerCharacter.gold);
}


function regenerateEntities() {
    enemies = generateEnemies(level);
    weapons = generateWeapon(level);
    golds = generateGold(level);
}

let playerCharacterCoordinates = getRandomWalkableCoordinate();
let playerCharacter = new Character(playerCharacterCoordinates.x, playerCharacterCoordinates.y, '@', 'white', 100, 100, 1, 100, 0);

let pnjCoordinates = getRandomWalkableCoordinate();
let pnj = new PNJ(pnjCoordinates.x, pnjCoordinates.y, 'P', 'white', "Marchand de coeur");

let enemies = generateEnemies(level);
let weapons = generateWeapon(level);
let golds = generateGold(level);

for (let rat of enemies) {
    drawCharacter(rat);
}
for (let weapon of weapons) {
    drawWeapon(weapon);

}
for (let gold of golds) {
    drawGold(gold);
}

let stairs = generateStairs();
drawStairs(stairs);
drawCharacter(playerCharacter);
drawPNJ(pnj);


console.log(playerCharacter.gold);
window.addEventListener('keydown', function (event) {
    let key = event.key.toLowerCase();
    if (key === 'arrowup' || key === 'z') {
        handleInput('z');
    } else if (key === 'arrowdown' || key === 's') {
        handleInput('s');
    } else if (key === 'arrowleft' || key === 'q') {
        handleInput('q');
    } else if (key === 'arrowright' || key === 'd') {
        handleInput('d');
    } else if (key === 'enter') {
        handleInput('enter');
    } else if (key == "h") {
        handleInput('h');
    }
});

// updateFOV();

window.addEventListener('click', function (event) {

    if (!playerCharacter.weapon) {
        console.log('no weapon');
        return
    };
    const damage = playerCharacter.weapon.attack();
    const bounds = event.target.getBoundingClientRect();
    const x = Math.floor((event.clientX - bounds.left) / displayOptions.fontSize);
    const y = Math.floor((event.clientY - bounds.top) / displayOptions.fontSize);
    // playerCharacter.updateStats();
    for (let rat of enemies) {
        if (x === rat.x && y === rat.y) {
            console.log(enemies.length)

            rat.takeDamage(damage);
            rat.takeTurn();
            if (!rat.isAlive()) {
                enemies.splice(rat, 1);

                if (Math.random() < 0.75) {
                    playerCharacter.gold++;
                    playerCharacter.updateStats();
                    updateFOV();
                    console.log("you found gold on the ragondin")
                } else {
                    console.log("unlucky, you didn't find gold on this racoon")
                }
                console.log(enemies.length)
                console.log("rat mort gun");
            }

            console.log('hitted rat for ' + playerCharacter.weapon.damage + ' damage');
            console.log('used one ammo. ' + playerCharacter.weapon.ammo + ' ammo left');
            console.log('rat has ' + rat.currentHP + ' hp left');
            return;
        }
    }
    updateFOV();


});