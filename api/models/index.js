const {clases} = require ('./clasesModel.js');
const { anuncio} = require ('./anuncioModel.js');
const { archivosSubidos} = require ('./archivosSubidosModel.js');
const { Chats} = require ('./ChatsModels.js');
const { mensajes} = require ('./mensajesModel.js');
const { usuarios} = require ('./usuariosModel.js');
const { clasesUsuarios} = require ('./clasesUsuariosModels.js');
const { repositorios} = require ('./repositoriosModels.js');
const { usuariosRepositorios } = require ('./usuariosRepositoriosModels.js');
const { chatsUsuarios} = require('./chatsUsuariosModels.js');
const { versionesArchivos } = require('./versionesArchivos.js');
const { archivosModels} = require('./archivosModels.js');
const { versionesArchivos} = require('./versionesArchivos.js')

clases.belongsToMany(usuarios,{through: clasesUsuarios,
foreignKey:  'id_clase',
otherKey: 'id_usuario'
});
usuarios.belongsToMany(clases, {through: clasesUsuarios,
    foreignKey: 'id_usuario',
    otherKey:'id_clase'
});
usuarios.belongsToMany(repositorios, {through: usuariosRepositorios,
    foreignKey: 'id_usuario',
    otherKey:'id_repo'
});
repositorios.belongsToMany(usuarios, {through: usuariosRepositorios,
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

module.exports ={
    clases,
    anuncio,
    archivosSubidos,
    Chats,
    mensajes,
    usuarios,
    clasesUsuarios,
    repositorios,
    usuariosRepositorios,
    chatsUsuarios,
    archivosModels,
    versionesArchivos
}