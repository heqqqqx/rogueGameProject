var menuOptions = [
    "[A]. Start the Game",

];

var menuMap = [
    "###################################",
    "#                                 #",
    "#                                 #",
    "#                                 #",
    "#          Welcome to the         #",
    "#        Cramptés's Dungeon       #",
    "#                                 #",
    "#       " + menuOptions[0] + "       #",
    "#                                 #",
    "#                                 #",
    "#                                 #",
    "###################################"
];

var menuDisplayOptions = {
    width: menuMap[0].length,
    height: menuMap.length,
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
    for (var y = 0; y < menuMap.length; y++) {
        for (var x = 0; x < menuMap[y].length; x++) {
            menuDisplay.draw(x, y, menuMap[y][x]);
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