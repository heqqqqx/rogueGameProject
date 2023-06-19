const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

// Définir le répertoire statique
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint pour la page principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'test.html'));
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});