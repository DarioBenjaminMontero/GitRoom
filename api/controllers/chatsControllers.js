const { Chats } = require("../models/index.js")
const { Mensajes } = require("../models/index.js")
const { chatsUsuarios } = require("../models/index.js")


const crearChat = async (req, res) => {

    try {

    
    }
    catch(err){

    }
}
const unirseChat = async (req, res) => {

    try {

    
    }
    catch(err){

    }
}
const mandarMensaje = async (req, res) => {
      try {
        const {id_chat, mensaje} = req.body
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
    catch(error){
console.error("Error al enviar mensaje:", error);
        return res.status(500).json({ error: "Error en el servidor", detalles: error.message });
    }
}


module.exports = { crearChat,unirseChat,mandarMensaje };