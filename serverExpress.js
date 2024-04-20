// instalacion e importacion de modulos
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
          return res.send(`El deporte ${nombre} ya existe  .`);
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

//app.get('/deportes', (req, res) => {
 // const deportes = readDeportesFromFile();
 // res.json(deportes);
//});

 // Editar
 app.get('/editar', (req, res) => {
  const { nombre, precio } = req.query;

  // Verifica existe un nombre
  if (!nombre || !precio) {
      return res.send('Ingrese nombre del deporte para editar su valor');
  }

  // Leer el archivo de deportes
  fs.readFile('deportes.json', 'utf8', (err, data) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error interno del servidor');
      }
      let deportes = JSON.parse(data);

      // busca el deporte y actualiza
      const index = deportes.findIndex(deporte => deporte.nombre === nombre);
      if (index === -1) {
          return res.send('No se encontró ningún deporte con ese nombre.');
      }
      deportes[index].precio = precio;
      //guarda los cambios en el json
      fs.writeFile('deportes.json', JSON.stringify(deportes), (err) => {
          if (err) {
              console.error(err);
              return res.status(500).send('Error interno del servidor');
          }
          res.send(`El precio del deporte ${nombre} se actualizó a ${precio}.`);
      });
  });
});

 // Eliminar
 app.get('/eliminar/:nombre', (req, res) => {
  //parametro nombre 
  const nombre = req.params.nombre; 

  fs.readFile('deportes.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error interno del servidor');
    }

    let deportes = JSON.parse(data);

    // busca para eliminar
    const deporteIndex = deportes.findIndex(d => d.nombre === nombre);

    // verifica
    if (deporteIndex !== -1) {
  
      deportes.splice(deporteIndex, 1);

      // borra el deporte del json
      fs.writeFile('deportes.json', JSON.stringify(deportes), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error interno del servidor');
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
