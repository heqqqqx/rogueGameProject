var menuOptions = [
    "[A]. To restart the Game",

];

var gameOverMap = [
    "###################################",
    "#                                 #",
    "#                                 #",
    "#                                 #",
    "#           Game Over             #",
    "#                                 #",
    "#      " + menuOptions[0] + "   #",
    "#                                 #",
    "#                                 #",
    "#                                 #",
    "###################################"
  ];
  

var menuDisplayOptions = {
    width: gameOverMap[0].length,
    height: gameOverMap.length,
    fontSize: 14,
    fontFamily: "Courier New",
    fg: "#fff",
    bg: "#000"
};

var menuDisplay = new ROT.Display(menuDisplayOptions);
var menuContainer = document.getElementById("menu-container");
menuContainer.appendChild(menuDisplay.getContainer());

function drawMenu() {
    menuDisplay.clear();
    for (var y = 0; y < gameOverMap.length; y++) {
        for (var x = 0; x < gameOverMap[y].length; x++) {
            menuDisplay.draw(x, y, gameOverMap[y][x]);
        }
    }
}

drawMenu();

// Handle keypress event in the menu
window.addEventListener("keydown", function(event) {
    if (event.key === "a") {
        // Start New Game
        menuContainer.innerHTML = "a";
        startNewGame();
    }
});

// Define the startNewGame() and loadGame() functions according to your game logic
function startNewGame() {
    window.location.href = "/game";
}