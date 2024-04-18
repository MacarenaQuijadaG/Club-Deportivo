const express = require('express');
const app = express();
const PORT = 3000;



app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});

// Middleware 
app.use(express.json());
app.use(express.static('index.html'));
// Ruta principal para levantar el html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});