var CONFIG = {
    tileSize: 16,
    tileGap: 0,
    debug: false,
    playerRoundDelay: 140,
    enemyRoundDelay: 100,
    playerMoveDuration: 130,
    enemyMoveDuration: 100,
    animFrameDuration: 64,
    touch: (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
};

var SETTINGS = {
    sounds: true,
    vibration: true,
    tileMag: 2
};

var TILES = {
    empty: {
        tileCoords: [0, 23],
        walkable: false,
        transparent: false,
        desc: "Nothing"
    },
    grass_plain: {
        tileCoords: [0, 0],
        walkable: true,
        transparent: true,
        desc: "Grass"
    },
    grass_little: {
        tileCoords: [1, 0],
        walkable: true,
        transparent: true,
        desc: "Grass"
    },
    grass_lots: {
        tileCoords: [2, 0],
        walkable: true,
        transparent: true,
        desc: "Grass"
    },
    grass_dark: {
        tileCoords: [7, 0],
        walkable: true,
        transparent: true,
        desc: "Grass"
    },
    grass_darker: {
        tileCoords: [6, 0],
        walkable: true,
        transparent: true,
        desc: "Grass"
    },
    floor_wood: {
        tileCoords: [0, 1],
        walkable: true,
        transparent: true,
        desc: "Wooden floor"
    },
    floor_wood2: {
        tileCoords: [1, 1],
        walkable: true,
        transparent: true,
        desc: "Wooden floor"
    },
    floor_sand_a: {
        tileCoords: [0, 3],
        walkable: true,
        transparent: true,
        desc: "Sand"
    },
    floor_sand_b: {
        tileCoords: [1, 3],
        walkable: true,
        transparent: true,
        desc: "Sand"
    },
    floor_sand_c: {
        tileCoords: [2, 3],
        walkable: true,
        transparent: true,
        desc: "Sand"
    },
    floor_sand_d: {
        tileCoords: [3, 3],
        walkable: true,
        transparent: true,
        desc: "Sand"
    },
    floor_sand_rock1: {
        tileCoords: [4, 3],
        walkable: true,
        transparent: true,
        desc: "Sand"
    },
    floor_sand_rock2: {
        tileCoords: [5, 3],
        walkable: true,
        transparent: true,
        desc: "Sand"
    },
    floor_sand_rock3: {
        tileCoords: [6, 3],
        walkable: true,
        transparent: true,
        desc: "Sand"
    },
    floor_sand_rock4: {
        tileCoords: [7, 3],
        walkable: true,
        transparent: true,
        desc: "Sand"
    },
    floor_sand_alt: {
        tileCoords: [0, 2],
        walkable: true,
        transparent: true,
        desc: "Sand"
    },
    floor_sand_dunes: {
        tileCoords: [8, 2],
        walkable: true,
        transparent: true,
        desc: "Sand"
    },
    floor_stone: {
        tileCoords: [0, 4],
        walkable: true,
        transparent: true,
        desc: "Stone floor"
    },
    floor_stone2: {
        tileCoords: [1, 4],
        walkable: true,
        transparent: true,
        desc: "Stone floor"
    },
    floor_stone3: {
        tileCoords: [2, 4],
        walkable: true,
        transparent: true,
        desc: "Stone floor"
    },
    floor_stone_cracked: {
        tileCoords: [3, 4],
        walkable: true,
        transparent: true,
        desc: "Cracked stone floor"
    },
    floor_stone_pattern: {
        tileCoords: [4, 4],
        walkable: true,
        transparent: true,
        desc: "Patterned stone floor"
    },
    floor_stone_pattern2: {
        tileCoords: [5, 4],
        walkable: true,
        transparent: true,
        desc: "Patterned stone floor"
    },
    floor_stone_pattern3: {
        tileCoords: [6, 4],
        walkable: true,
        transparent: true,
        desc: "Patterned stone floor"
    },
    wall_stone: {
        tileCoords: [0, 5],
        walkable: false,
        transparent: false,
        desc: "Stone wall"
    },
    wall_stone2: {
        tileCoords: [1, 5],
        walkable: false,
        transparent: false,
        desc: "Stone wall"
    },
    wall_stone3: {
        tileCoords: [2, 5],
        walkable: false,
        transparent: false,
        desc: "Stone wall"
    },
    wall_stone_moss: {
        tileCoords: [3, 5],
        walkable: false,
        transparent: false,
        desc: "Mossy stone wall"
    },
    wall_stone_moss2: {
        tileCoords: [4, 5],
        walkable: false,
        transparent: false,
        desc: "Mossy stone wall"
    },
    wall_stone_moss3: {
        tileCoords: [5, 5],
        walkable: false,
        transparent: false,
        desc: "Mossy stone wall"
    },
    wall_stone_cracked: {
        tileCoords: [6, 5],
        walkable: false,
        transparent: false,
        desc: "Cracked stone wall"
    },
    wall_stone_pattern: {
        tileCoords: [7, 5],
        walkable: false,
        transparent: false,
        desc: "Patterned stone wall"
    }
};

var PLAYER = {
    tileCoords: [4, 0],
    anim: true,
    img: new Image(),
    walkDelay: 5,
    attackedDelay: 20,
    blocking: true
};

var ENEMY = {
    tileCoords: [4, 0],
    anim: true,
    img: new Image(),
    walkDelay: 5,
    blocking: true
};

var SOUND = {
    move: new Audio("sounds/move.wav"),
    attack: new Audio("sounds/attack.wav"),
    hit: new Audio("sounds/hit.wav"),
    levelUp: new Audio("sounds/levelup.wav"),
    gameOver: new Audio("sounds/gameover.wav")
};

var IMAGES = {
    tiles: new Image(),
    player: new Image(),
    enemy: new Image()
};

// Load images
IMAGES.tiles.src = "images/tiles.png";
IMAGES.player.src = "images/player.png";
IMAGES.enemy.src = "images/enemy.png";

// Set up canvas and context
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var tile_size = 32;
var map_width = 10;
var map_height = 10;
canvas.width = tile_size * map_width;
canvas.height = tile_size * map_height;

// Set up game state variables
var map = [];
var player = Object.assign({}, PLAYER);
var enemy = Object.assign({}, ENEMY);
var gameOver = false;
var playerTurn = true;
var level = 1;
var experience = 0;
var levelThresholds = [0, 100, 300, 600, 1000];
var maxLevel = levelThresholds.length - 1;

// Initialize the map with floor tiles
for (var i = 0; i < map_width; i++) {
    map[i] = [];
    for (var j = 0; j < map_height; j++) {
        map[i][j] = TILE.floor_stone;
    }
}

// Set up player and enemy starting positions
map[player.tileCoords[0]][player.tileCoords[1]] = player;
map[enemy.tileCoords[0]][enemy.tileCoords[1]] = enemy;

// Add event listener for keyboard input
document.addEventListener("keydown", handleKeyDown);

// Main game loop
function gameLoop() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the map
    for (var i = 0; i < map_width; i++) {
        for (var j = 0; j < map_height; j++) {
            var tile = map[i][j];
            if (tile !== 0) {
                if (tile.img) {
                    ctx.drawImage(
                        IMAGES.tiles,
                        tile.tileCoords[0] * tile_size,
                        tile.tileCoords[1] * tile_size,
                        tile_size,
                        tile_size,
                        i * tile_size,
                        j * tile_size,
                        tile_size,
                        tile_size
                    );
                } else if (tile.anim) {
                    ctx.drawImage(
                        tile.img,
                        Math.floor(Date.now() / 100) % 2 * tile_size,
                        0,
                        tile_size,
                        tile_size,
                        i * tile_size,
                        j * tile_size,
                        tile_size,
                        tile_size
                    );
                }
            }
        }
    }

    // Draw the player and enemy
    ctx.drawImage(
        IMAGES.player,
        Math.floor(Date.now() / 100) % 2 * tile_size,
        0,
        tile_size,
        tile_size,
        player.tileCoords[0] * tile_size,
        player.tileCoords[1] * tile_size,
        tile_size,
        tile_size
    );
    ctx.drawImage(
        IMAGES.enemy,
        Math.floor(Date.now() / 100) % 2 * tile_size,
        0,
        tile_size,
        tile_size,
        enemy.tileCoords[0] * tile_size,
        enemy.tileCoords[1] * tile_size,
        tile_size,
        tile_size
    );

    // Check for game over condition
    if (gameOver) {
        ctx.fillStyle = "black";
        ctx.font = "48px sans-serif";
        ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
        return;
    }

    // Check for level up condition
    if (experience >= levelThresholds[level] && level < maxLevel) {
        level++;
        player.attack++;
        player.defense++;
        SOUND.levelUp.play();
        showMessage("Level Up! Attack +1, Defense +1");
    }

    // Display player and enemy stats
    ctx.fillStyle = "white";
    ctx.font = "16px sans-serif";
    ctx.fillText("Level: " + level, 10, 20);
    ctx.fillText("Experience: " + experience, 10, 40);
    ctx.fillText("Attack: " + player.attack, 10, 60);
    ctx.fillText("Defense: " + player.defense, 10, 80);

    // Update game state
    if (playerTurn) {
        handlePlayerTurn();
    } else {
        handleEnemyTurn();
    }

    // Request the next animation frame
    requestAnimationFrame(gameLoop);
}

// Handle player turn
function handlePlayerTurn() {
    if (player.attackedDelay > 0) {
        player.attackedDelay--;
        return;
    }

    if (player.walkDelay > 0) {
        player.walkDelay--;
        return;
    }

    if (player.target) {
        handlePlayerAttack();
    } else {
        handlePlayerMove();
    }
}

// Handle enemy turn
function handleEnemyTurn() {
    if (enemy.walkDelay > 0) {
        enemy.walkDelay--;
        return;
    }

    handleEnemyMove();
}

// Handle player movement
function handlePlayerMove() {
    // Get the player's current position
    var x = player.tileCoords[0];
    var y = player.tileCoords[1];

    // Check for movement input
    if (keys.ArrowUp && isValidMove(x, y - 1)) {
        movePlayer(x, y - 1);
    } else if (keys.ArrowDown && isValidMove(x, y + 1)) {
        movePlayer(x, y + 1);
    } else if (keys.ArrowLeft && isValidMove(x - 1, y)) {
        movePlayer(x - 1, y);
    } else if (keys.ArrowRight && isValidMove(x + 1, y)) {
        movePlayer(x + 1, y);
    }
}

// Handle player attack
function handlePlayerAttack() {
    var target = player.target;
    var damage = calculateDamage(player.attack, target.defense);
    target.hp -= damage;
    SOUND.attack.play();
    showMessage("Player attacked Enemy for " + damage + " damage");

    if (target.hp <= 0) {
        handleEnemyDefeated();
    } else {
        player.attackedDelay = 20;
        player.target = null;
        playerTurn = false;
    }
}

// Handle enemy movement
function handleEnemyMove() {
    // Get the enemy's current position
    var x = enemy.tileCoords[0];
    var y = enemy.tileCoords[1];

    // Generate a random movement direction
    var dx = Math.floor(Math.random() * 3) - 1;
    var dy = Math.floor(Math.random() * 3) - 1;

    // Check if the new position is valid
    if (isValidMove(x + dx, y + dy)) {
        moveEnemy(x + dx, y + dy);
    }
}

// Move the player to the specified position
function movePlayer(x, y) {
    if (map[x][y] === enemy) {
        player.target = enemy;
    }

    map[player.tileCoords[0]][player.tileCoords[1]] = TILE.floor_stone;
    player.tileCoords[0] = x;
    player.tileCoords[1] = y;
    map[x][y] = player;
    player.walkDelay = 5;
    SOUND.move.play();

    if (player.target) {
        playerTurn = true;
    } else {
        playerTurn = false;
    }
}

// Move the enemy to the specified position
function moveEnemy(x, y) {
    if (map[x][y] === player) {
        enemy.target = player;
    }

    map[enemy.tileCoords[0]][enemy.tileCoords[1]] = TILE.floor_stone;
    enemy.tileCoords[0] = x;
    enemy.tileCoords[1] = y;
    map[x][y] = enemy;
    enemy.walkDelay = 5;
    SOUND.move.play();

    if (enemy.target) {
        handleEnemyAttack();
    } else {
        playerTurn = true;
    }
}

// Handle enemy attack
function handleEnemyAttack() {
    var target = enemy.target;
    var damage = calculateDamage(enemy.attack, target.defense);
    target.hp -= damage;
    SOUND.attack.play();
    showMessage("Enemy attacked Player for " + damage + " damage");

    if (target.hp <= 0) {
        handlePlayerDefeated();
    } else {
        enemy.target = null;
        playerTurn = true;
    }
}

// Handle player defeated
function handlePlayerDefeated() {
    gameOver = true;
    SOUND.gameOver.play();
    showMessage("Game Over - Player Defeated");
}

// Handle enemy defeated
function handleEnemyDefeated() {
    experience += 50;
    map[enemy.tileCoords[0]][enemy.tileCoords[1]] = TILE.floor_stone;
    enemy.tileCoords[0] = -1;
    enemy.tileCoords[1] = -1;
    enemy.hp = 0;
    enemy.defense = 0;
    enemy.attack = 0;
    enemy.target = null;
    playerTurn = true;
    showMessage("Enemy Defeated! +50 Experience");

    if (experience >= levelThresholds[level] && level < maxLevel) {
        level++;
        player.attack++;
        player.defense++;
        SOUND.levelUp.play();
        showMessage("Level Up! Attack +1, Defense +1");
    }
}

// Check if a move is valid
function isValidMove(x, y) {
    if (x >= 0 && x < map_width && y >= 0 && y < map_height) {
        var tile = map[x][y];
        return tile.walkable && !tile.blocking;
    }
    return false;
}

// Calculate damage based on attack and defense values
function calculateDamage(attack, defense) {
    var baseDamage = Math.max(1, attack - defense);
    var randomFactor = Math.random() * 0.2 + 0.9;
    return Math.floor(baseDamage * randomFactor);
}

// Show a message in the message box
function showMessage(message) {
    var messageBox = document.getElementById("messageBox");
    messageBox.innerText = message;
}

// Event handler for keyboard input
function handleKeyDown(event) {
    keys[event.key] = true;
}

// Event handler for keyboard input
function handleKeyUp(event) {
    keys[event.key] = false;
}

// Start the game loop
gameLoop();