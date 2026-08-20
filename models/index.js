const {clases} = require ('./clasesModel.js');
const { anuncio} = require ('./anuncioModel.js');
const { archivosSubidos} = require ('./archivosSubidosModel.js');
const { Chats} = require ('./ChatsModels.js');
const { mensajes} = require ('./mensajesModel.js');
const { usuarios} = require ('./usuariosModel.js');
const {clasesUsuarios} = require ('./clasesUsuariosModels.js');
 

clases.belongsToMany(usuarios,{through: clasesUsuarios});
usuarios.belongsToMany(clases, {through: clasesUsuarios});