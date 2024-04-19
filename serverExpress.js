const express = require('express');
const app = express();
const PORT = 3000;
const fs = require('fs');

// Puerto de salida
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});

// Middleware 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('index.html'));

// Ruta principal para levantar el html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Agregar
app.get('/agregar', (req, res) => {
    const { nombre, precio } = req.query;
  
    // Verificar si se proporcionarón nombre y precio
    if (!nombre || !precio) {
      return res.send('Se requiere el nombre y el precio del deporte.');
    }
  
    // Verificar si el precio es un número
    if (isNaN(parseFloat(precio))) {
      return res.send('El precio debe ser un número.');
    }
  
    // Leer el archivo de deportes
    fs.readFile('deportes.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error interno del servidor');
      }
      let deportes = JSON.parse(data);
  
      // Verificar si el deporte ya existe
      //if (deportes.some(deporte => deporte.nombre === nombre)) {
      //  return res.status(400).send('El deporte ya existe.');
      //}
      if (deportes.some(deporte => deporte.nombre === nombre)) {
        res.send('El deporte ya existe.');
    } else {
        res.send(`El deporte ${nombre} con un valor de ${precio} se agregó exitosamente.`);
    }
  
    // Escribir en el archivo
      deportes.push({ nombre, precio });
      fs.writeFile('deportes.json', JSON.stringify(deportes), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error interno del servidor');
        }
        res.send('Deporte agregado exitosamente');
      });
    });
  });
  
  // Ruta de la lista de deportes agregados se muestra en el html
  app.get('/deportes', (req, res) => {
    fs.readFile('deportes.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.send('Error interno del servidor');
      }
      res.json({ deportes: JSON.parse(data) });
    });
  });


 // Editar
 app.get('/editar', (req, res) => {
   
  });
 
 // Eliminar
 app.get('/eliminar', (req, res) => {
   
 });


// Manejador de ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});
