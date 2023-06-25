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

app.get('/menu', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'menu.html'));
});
app.get('/load', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'load.html'));
});
// Démarrer le serveur
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}/menu`);
});