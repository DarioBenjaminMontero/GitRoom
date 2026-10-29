const { Chats } = require("../models/index.js")
const { Mensajes } = require("../models/index.js")
const { chatsUsuarios } = require("../models/index.js")
const {usuarios} = require ('../models/index.js')



const crearChat = async (req, res) => {
    try {
        const idUsuario = req.user.id
        const { mail } = req.body
        const otroUsuario = await usuarios.findOne({ where: { mail: mail } })
        
        if (!otroUsuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (otroUsuario.id_usuario === idUsuario) {
            return res.status(400).json({ message: "No podes crear un chat con vos mismo" });
        }

        // Si ya hay un chat privado entre los dos, no se crea otro
        const chatsDelUsuario = await chatsUsuarios.findAll({ where: { id_usuario: idUsuario } })
        const chatsPrivados = await Chats.findAll({
            where: { id_chat: chatsDelUsuario.map(c => c.id_chat), es_privado: true }
        })
        const chatExistente = await chatsUsuarios.findOne({
            where: {
                id_chat: chatsPrivados.map(c => c.id_chat),
                id_usuario: otroUsuario.id_usuario
            }
        })
        if (chatExistente) {
            return res.status(400).json({ message: "Ya tenes un chat con este usuario" });
        }

        const chat = await Chats.create({ es_privado: true })
        await chatsUsuarios.bulkCreate([
            { id_chat: chat.id_chat, id_usuario: idUsuario },
            { id_chat: chat.id_chat, id_usuario: otroUsuario.id_usuario }
        ])

        return res.status(201).json(chat)
    }
    catch (error) {
        console.error("Error al crear el chat:", error);
        return res.status(500).json({ error: "Error en el servidor", detalles: error.message });
    }
}
const cargarChats = async (req, res) => {
    try {
       const idUsuario = req.user.id
   

       
    const relaciones = await chatsUsuarios.findAll({
            where: { id_usuario: idUsuario },
            attributes: ['id_chat']
        });

        const idsChats = relaciones.map(r => r.id_chat);

        if (idsChats.length === 0) {
            return res.status(200).json([]);
        }

        const chatsConUsuarios = await Chats.findAll({
            where: {
                id_chat: idsChats
            },
            include: [
                {
                    model: usuarios,
                    as: 'usuarios',
                    attributes: ['id_usuario', 'nombre', 'mail'],
                    through: { attributes: [] }
                }
            ]
        });
        return res.status(200).json(chatsConUsuarios)
    }
    catch (error) {
        console.error("Error al obtener los chats:", error);
        return res.status(500).json({ error: "Error en el servidor", detalles: error.message });
    }
}
const cargarMensajes = async (req, res) => {
    try {
       const idUsuario = req.user.id
       const id_chat = req.body.id_chat;
   
        const mensajes = await Mensajes.findAll({
          where:{id_chat:id_chat}
        });
        return res.status(200).json(mensajes)
    }
    catch (error) {
        console.error("Error al obtener los mensajes:", error);
        return res.status(500).json({ error: "Error en el servidor", detalles: error.message });
    }
}

const mandarMensaje = async (req, res) => {
    try {
        const { id_chat, mensaje } = req.body
        const id_emisor = req.user.id

        if (!id_chat || !mensaje) {
            return res.status(400).json({ message: "No hay id de chat o mensahe, son obligatorios" });
        }

        const nuevoMensaje = await Mensajes.create({
            id_chat,
            id_emisor,
            mensaje,
            horario_de_publicacion: new Date()
        });

        const io = req.app.get('io');
        if (io) {
            // Se lo enviamos únicamente a los usuarios conectados a la sala "chat_X"
            io.to(`chat_${id_chat}`).emit('recibir_mensaje', nuevoMensaje);
        }

        return res.status(201).json({
            message: "mensaje enviado con éxito",
            nuevoMensaje
        });

    }
    catch (error) {
        console.error("Error al enviar mensaje:", error);
        return res.status(500).json({ error: "Error en el servidor", detalles: error.message });
    }
}


module.exports = { crearChat, mandarMensaje, cargarChats,cargarMensajes };