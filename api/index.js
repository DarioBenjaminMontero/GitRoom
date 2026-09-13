const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/db.js');

// 1. importar modelos para que aparescan en dbeaber
const {
    clases,
    Anuncios,
    ArchivosSubidos,
    Chats,
    Mensajes,
    usuarios,
    clasesUsuarios,
    repositorios,
    UsuariosRepositorios,
    chatsUsuarios,
    Archivos,
    versionesArchivos,
    Commits
} = require('./models/index.js');
// 2. importar rutas

const router = require('./routes/userRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 3. Montamos las rutas
app.use('/login', router); 
//app.use('/posts', postRoutes); // Ej: /posts para crear, listar y dar like

const puerto = 3000;

// 4. Sincronización con PostgreSQL y arranque del servidor
// 4. Arranque del servidor y autenticación de la base de datos por separado
sequelize.authenticate()
  .then(() => {
    console.log(' Conexión a la base de datos PostgreSQL establecida con éxito.');
    
    // Opcional: puedes intentar sincronizar sin detener el servidor si falla
    sequelize.sync({ force: false }).catch(err => {
      console.warn(' Advertencia: Algunas tablas no se pudieron sincronizar:', err.message);
    });

    app.listen(puerto, () => {
      console.log(` Servidor backend corriendo en http://localhost:${puerto}`);
    });
  })
  .catch((error) => {
    console.error(' Error al conectar con la base de datos PostgreSQL:', error);
  });