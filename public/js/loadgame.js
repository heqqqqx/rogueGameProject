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

        // Restore the game state from the loaded data
        mapMatrix = saveData.mapMatrix;
        playerCharacter = Object.assign(new Character(), saveData.playerCharacter);
        enemies = saveData.enemies.map(enemyData => Object.assign(new Enemy(), enemyData));
        weapons = saveData.weapons.map(weaponData => Object.assign(new Weapon(), weaponData));
        gold = Object.assign(new Gold(), saveData.gold);

        console.log('Game loaded successfully.');

        // Redirect to the game page
        window.location.href = '/game'; // Replace 'game.html' with your actual game page URL
    };
    reader.readAsText(file);
}