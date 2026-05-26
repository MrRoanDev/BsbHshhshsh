const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Servir la page principale
app.get('/', (req, res) => {
    const htmlPath = path.join(__dirname, 'public', 'index.html');
    if (fs.existsSync(htmlPath)) {
        res.sendFile(htmlPath);
    } else {
        res.send(`
            <!DOCTYPE html>
            <html>
            <head><title>Yuta Okkotsu - Ban Checker</title></head>
            <body>
                <h1>Yuta Okkotsu - Vérificateur de Bannissement</h1>
                <p>Le fichier index.html n'a pas été trouvé. Assurez-vous qu'il est dans le dossier /public</p>
            </body>
            </html>
        `);
    }
});

// Proxy API pour éviter les problèmes CORS (optionnel)
app.post('/api/check', async (req, res) => {
    try {
        const { number } = req.body;
        const response = await fetch('https://baron0.com/api/external/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ number })
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Erreur API:', error);
        res.status(500).json({ error: 'Erreur de connexion à l\'API' });
    }
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║     🗡️  YUTA OKKOTSU - CURSED BAN CHECKER  🗡️           ║
║                                                          ║
║     Serveur démarré sur http://localhost:${PORT}         ║
║     Domaine d'expansion activé - Rika veille sur vous    ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
    `);
});
