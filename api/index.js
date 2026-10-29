const express = require('express');
const http = require('http');//🐸http es necesario para que socket.io funcione con express
const { Server } = require('socket.io');
const cors = require('cors');
const { sequelize } = require('./config/db.js');
const path = require('path');
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


const routerUsuario = require('./routes/userRoutes');
const routerRepositorio = require("./routes/repositoriosRoutes.js")
const routerClases = require ('./routes/clasesRoutes.js')
const routerChats = require ('./routes/chatRoutes.js')
const routerArchivos = require('./routes/archivosRoutes.js')

const app = express();
const server = http.createServer(app);//🐸aca usamos http para crear el servidor
const io = new Server(server,{
  cors:{origin:"http://localhost:5173", methods:["GET","POST"]}//🐸aca cambiamos el puerto del cliente si nos aparece distinto
})

app.set("io",io)//🐸esto lo vamos a usar en los controladores

// Middlewares
app.use(cors());
app.use(express.json());

// 3. Montamos las rutas
app.use('/users', routerUsuario); 
//app.use('/posts', postRoutes); // Ej: /posts para crear, listar y dar like
app.use("/repositorios", routerRepositorio)
app.use('/clases',routerClases)
app.use('/chats', routerChats)
app.use('/archivos', routerArchivos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//🐸esto nos sirve para saber que usuario esta en un chat, si lo esta o esta desconectado
io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);

    // Cuando el usuario abre un chat, se une a su sala correspondiente
    socket.on('unirse_a_chat', (id_chat) => {
        socket.join(`chat_${id_chat}`);
        console.log(`Usuario se unió a la sala: chat_${id_chat}`);
    });

    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`);
    });
});

const puerto = 3000;

// 4. Sincronización con PostgreSQL y arranque del servidor
// 4. Arranque del servidor y autenticación de la base de datos por separado
sequelize.authenticate()
  .then(() => {
    console.log(' Conexión a la base de datos PostgreSQL establecida con éxito.');
    
    // Opcional: puedes intentar sincronizar sin detener el servidor si falla
    sequelize.sync({ force: true }).catch(err => {
      console.warn(' Advertencia: Algunas tablas no se pudieron sincronizar:', err.message);
    });

    server.listen(puerto, () => { //🐸cambie a server porque sino no vamos a poder usar el socket.io
      console.log(` Servidor backend corriendo en http://localhost:${puerto}`);
    });
  })
  .catch((error) => {
    console.error(' Error al conectar con la base de datos PostgreSQL:', error);
  });