const {clases} = require ('./clasesModel.js');
const { Anuncios } = require ('./anuncioModel.js');
const { Chats} = require ('./ChatsModels.js');
const { Mensajes} = require ('./mensajesModel.js');
const { usuarios} = require ('./usuariosModel.js');
const { clasesUsuarios} = require ('./clasesUsuariosModels.js');
const { repositorios} = require ('./repositoriosModels.js');
const { UsuariosRepositorios } = require ('./usuariosRepositoriosModels.js');
const { chatsUsuarios} = require('./chatsUsuariosModels.js');
const { Archivos } = require('./archivosModels.js');
const { versionesArchivos} = require('./versionesArchivos.js');
const { Commits } = require('./commitsModels.js');
const { Comentarios } = require('./comentariosModel.js');
const { Entregas } = require('./entregasModel.js');
const { ArchivosEntrega } = require('./archivosEntregaModel.js');
const {ArchivosAnuncio} = require('./archivosSubidosAnuncio.js')

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
repositorios.hasMany(UsuariosRepositorios, { foreignKey: 'id_repo' });
UsuariosRepositorios.belongsTo(repositorios, { foreignKey: 'id_repo' });

usuarios.hasMany(UsuariosRepositorios, { foreignKey: 'id_usuario' });
UsuariosRepositorios.belongsTo(usuarios, { foreignKey: 'id_usuario' });


Chats.belongsToMany(usuarios, {
    through: chatsUsuarios,
    foreignKey: 'id_chat',
    otherKey: 'id_usuario'
});

usuarios.belongsToMany(Chats, {
    through: chatsUsuarios,
    foreignKey: 'id_usuario',
    otherKey: 'id_chat'
});

Chats.hasMany(Mensajes, { foreignKey: 'id_chat' });
Mensajes.belongsTo(Chats, { foreignKey: 'id_chat' });

usuarios.hasMany(Mensajes, { foreignKey: 'id_emisor' });
Mensajes.belongsTo(usuarios, { foreignKey: 'id_emisor' });

repositorios.hasMany(Commits, {foreignKey: 'id_repo'})
Commits.belongsTo(repositorios, {foreignKey : 'id_repo'})

usuarios.hasMany(Commits, {foreignKey: 'id_usuario'})
Commits.belongsTo(usuarios, {foreignKey: 'id_usuario'})

Commits.belongsTo(Commits,{
    as: 'padre',
    foreignKey: 'id_commit_padre'
});


Commits.hasMany(Commits, {
  as: 'hijos',
  foreignKey: 'id_commit_padre',
});
clases.hasMany(repositorios, { foreignKey: 'id_clase' });
repositorios.belongsTo(clases, { foreignKey: 'id_clase' });

clases.hasMany(Anuncios, { foreignKey: 'id_clase' });
Anuncios.belongsTo(clases, { foreignKey: 'id_clase' });

<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
module.exports ={
=======
usuarios.hasMany(Anuncios, { foreignKey: 'id_usuario' });
Anuncios.belongsTo(usuarios, { foreignKey: 'id_usuario' });

>>>>>>> Stashed changes
Anuncios.hasMany(Comentarios, { foreignKey : 'id_anuncio'})
Comentarios.belongsTo(Anuncios, {foreignKey : 'id_anuncio' })

Anuncios.hasMany(Entregas, { foreignKey: 'id_anuncio' });
Entregas.belongsTo(Anuncios, { foreignKey: 'id_anuncio' });

Anuncios.hasMany(ArchivosAnuncio, {foreignKey: 'id_anuncio'})
ArchivosAnuncio.belongsTo(Anuncios, {foreignKey: 'id_anuncio'})

usuarios.hasMany(Entregas, { foreignKey: 'id_alumno' });
Entregas.belongsTo(usuarios, { foreignKey: 'id_alumno' });

Entregas.hasMany(ArchivosEntrega, { foreignKey: 'id_entrega' });
ArchivosEntrega.belongsTo(Entregas, { foreignKey: 'id_entrega' });

repositorios.hasMany(Archivos, {foreignKey: 'id_repo'})
Archivos.belongsTo(repositorios, {foreignKey : 'id_repo'})

versionesArchivos.belongsTo(Archivos, {foreignKey: 'id_archivo'})
Archivos.hasMany(versionesArchivos, {foreignKey : 'id_archivo'})

versionesArchivos.belongsTo(Commits, {foreignKey : 'id_commit'})
Commits.hasMany(versionesArchivos, {foreignKey: 'id_commit'})
module.exports = {
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    clases,
    Anuncios,
    Chats,
    Mensajes,
    usuarios,
    clasesUsuarios,
    repositorios,
    UsuariosRepositorios,
    chatsUsuarios,
    Archivos,
    versionesArchivos,
    Commits,
    Entregas,       
    ArchivosEntrega 
};