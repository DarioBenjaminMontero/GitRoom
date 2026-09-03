const {clases} = require ('./clasesModel.js');
const { Anuncios } = require ('./anuncioModel.js');
const { ArchivosSubidos} = require ('./archivosSubidosModel.js');
const { Chats} = require ('./ChatsModels.js');
const { Mensajes} = require ('./mensajesModel.js');
const { usuarios} = require ('./usuariosModel.js');
const { clasesUsuarios} = require ('./clasesUsuariosModels.js');
const { repositorios} = require ('./repositoriosModels.js');
const { UsuariosRepositorios } = require ('./usuariosRepositoriosModels.js');
const { chatsUsuarios} = require('./chatsUsuariosModels.js');
const { versionesArchivos } = require('./versionesArchivos.js');
const { Archivos } = require('./archivosModels.js');
const { versionesArchivos} = require('./versionesArchivos.js');
const { Commits } = require('./commitsModels.js');

clases.belongsToMany(usuarios,{through: clasesUsuarios,
foreignKey:  'id_clase',
otherKey: 'id_usuario'
});
usuarios.belongsToMany(clases, {through: clasesUsuarios,
    foreignKey: 'id_usuario',
    otherKey:'id_clase'
});
usuarios.belongsToMany(repositorios, {through: UsuariosRepositorios,
    foreignKey: 'id_usuario',
    otherKey:'id_repo'
});
repositorios.belongsToMany(usuarios, {through: UsuariosRepositorios,
    foreignKey: 'id_repo',
    otherKey:'id_usuario'
})
Chats.belongsToMany(usuarios,{through: chatsUsuarios,
    foreignKey: 'id_chat',
    otherKey:'id_usuario'
});
usuarios.belongsToMany(Chats, {through: chatsUsuarios,
    foreignKey: 'id_usuario',
    otherKey:'id_chat'
});


Commits.belongsTo(Commits,{
    as: 'padre',
    foreignKey: 'id_commit_padre'
});


Commits.hasMany(Commits, {
  as: 'hijos',
  foreignKey: 'id_commit_padre',
});


module.exports ={
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
}