const express = require('express');
const app = express();
const PORT = 3000;
const fs = require('fs');

// Puerto de salida
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

// Agregar
app.get('/agregar', (req, res) => {
  const { nombre, precio } = req.query;

  // Verificar si tiene nombre y precio
  if (!nombre || !precio) {
      return res.send('Se requiere el nombre y el precio del deporte.');
  }

  // Verificar si el precio es un número
  if (isNaN(parseFloat(precio))) {
      return res.send('El precio debe ser un número.');
  }

  // Lee el archivo de deportes
  fs.readFile('deportes.json', 'utf8', (err, data) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error interno del servidor');
      }
      let deportes = JSON.parse(data);

      // Verifica si el deporte ya existe
      if (deportes.some(deporte => deporte.nombre === nombre)) {
          return res.send('El deporte ya existe.');
      }

      // Agrega el deporte al arreglo
      deportes.push({ nombre, precio });

      // Escribir en el archivo
      fs.writeFile('deportes.json', JSON.stringify(deportes), (err) => {
          if (err) {
              console.error(err);
              return res.status(500).send('Error interno del servidor');
          }
          res.send(`El deporte ${nombre} con un valor de ${precio} se agregó exitosamente.`);
      });
  });
});

// Ruta para obtener la lista de deportes
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
  const { nombre } = req.query;

  fs.readFile('deportes.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.send('Error interno del servidor');
      return;
    }

    let deportes = JSON.parse(data);

    // busqueda de deporte a lemiminar
    const deportesFiltrados = deportes.filter(d => d.nombre !== nombre);

    // verifica si se elimino el deporte
    if (deportes.length !== deportesFiltrados.length) {
      // lo borra de json
      fs.writeFile('deportes.json', JSON.stringify(deportesFiltrados), (err) => {
        if (err) {
          console.error(err);
          res.send('Error interno del servidor');
          return;
        }
        res.send('Deporte eliminado exitosamente');
      });
    } else {
      res.send('Deporte no encontrado');
    }
  });
});

// si la ruta no se encuentra
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});
