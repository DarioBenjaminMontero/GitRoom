const { Op } = require("sequelize")
const { Chats, chatsUsuarios, usuarios } = require("../models/index.js")

// 🍪 Busca usuarios cuyo mail contenga lo que se va escribiendo
const buscarUsuarios = async (req, res) => {
    try {
        const encontrados = await usuarios.findAll({
            where: {
                mail: { [Op.iLike]: `%${req.query.mail}%` },
                id_usuario: { [Op.ne]: req.user.id }
            },
            attributes: ['id_usuario', 'nombre', 'mail'],
            limit: 5
        })
        return res.status(200).json(encontrados)
    }
    catch (error) {
        console.error("Error al buscar usuarios:", error);
        return res.status(500).json({ error: "Error en el servidor", detalles: error.message });
    }
}

// 🍪 Crea un chat grupal
const crearGrupo = async (req, res) => {
    try {
        const ids = [req.user.id, ...req.body.ids_usuarios]
        const grupo = await Chats.create({ es_privado: false, nombre: req.body.nombre })
        await chatsUsuarios.bulkCreate(ids.map(id => ({ id_chat: grupo.id_chat, id_usuario: id })))
        return res.status(201).json(grupo)
    }
    catch (error) {
        console.error("Error al crear el grupo:", error);
        return res.status(500).json({ error: "Error en el servidor", detalles: error.message });
    }
}

// 🍪 Trae los integrantes de un chat, para mostrar quien mando cada mensaje
const cargarMiembros = async (req, res) => {
    try {
        const chat = await Chats.findByPk(req.body.id_chat, {
            include: { model: usuarios, attributes: ['id_usuario', 'nombre'], through: { attributes: [] } }
        })
        return res.status(200).json(chat.usuarios)
    }
    catch (error) {
        console.error("Error al cargar los miembros:", error);
        return res.status(500).json({ error: "Error en el servidor", detalles: error.message });
    }
}


module.exports = { buscarUsuarios, crearGrupo, cargarMiembros };
