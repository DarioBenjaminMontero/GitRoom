const { Op } = require("sequelize")
const { usuarios } = require("../models/index.js")
const bcrypt = require('bcrypt')

const buscarUsuariosCrud = async (req, res) => {
    try {
        const encontrados = await usuarios.findAll({
            where: {
                mail: { [Op.iLike]: `%${req.body.mail}%` },
                id_usuario: { [Op.ne]: req.user.id }
            },
            attributes: ['id_usuario', 'nombre', 'mail','apellido','admin'],
            limit: 5
        })
        return res.status(200).json(encontrados)
    }
    catch (error) {
        console.error("Error al buscar usuarios:", error);
        return res.status(500).json({ error: "Error en el servidor", detalles: error.message });
    }
}

const obtenerUsuariosCrud= async (req, res) => {
    try {
        const encontrados = await usuarios.findAll({
            where: {
                
                id_usuario: { [Op.ne]: req.user.id }
            },
            attributes: ['id_usuario', 'nombre', 'mail','apellido','admin'],
            limit: 10
        })
        return res.status(200).json(encontrados)
    }
    catch (error) {
        console.error("Error al buscar usuarios:", error);
        return res.status(500).json({ error: "Error en el servidor", detalles: error.message });
    }
}
const eliminarUsuarioCrud= async (req, res) => {
    try {
       const { id } = req.params;

        // es para no autoborrarte
        if (Number(id) === req.user.id) {
            return res.status(400).json({ message: "No puedes eliminar tu propia cuenta de administrador." });
        }

    
        const eliminado = await usuarios.destroy({
            where: {
                id_usuario: id
            }
        });

        if (!eliminado) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        return res.status(200).json({ message: "Usuario eliminado correctamente." });

    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        return res.status(500).json({ error: "Error en el servidor", detalles: error.message });
    }
}
const actualizarUsuarioCrud = async (req, res) => {
    try {
        const { id } = req.params; 
        const { nombre, mail,apellido, contraseña,año_division, admin, quitar_foto } = req.body; 

        const usuarioAEditar = await usuarios.findByPk(id);

        if (!usuarioAEditar) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }
        
        // Actualizamos los campos de texto y rol
        usuarioAEditar.set({
            nombre: nombre !== undefined ? nombre : usuarioAEditar.nombre,
            mail: mail !== undefined ? mail : usuarioAEditar.mail,
            apellido: apellido !== undefined ? apellido : usuarioAEditar.apellido,
             año_division: año_division !== undefined ? año_division : usuarioAEditar.año_division,
            admin: admin !== undefined ? admin : usuarioAEditar.admin
        });

        // Si el administrador marcó la opción de quitar la foto, la borramos (o ponemos null/vacío)
        if (quitar_foto === true || quitar_foto === 'true') {
            usuarioAEditar.foto_perfil = null; // O puedes dejar un avatar por defecto como 'default.png'
        }

        // Si mandaron contraseña, la hasheamos
        if (contraseña && contraseña.trim() !== "") {
            const contraseñaHasheada = await bcrypt.hash(contraseña, 10);
            usuarioAEditar.contraseña = contraseñaHasheada;
        }

        await usuarioAEditar.save();

        return res.status(200).json({ 
            message: "Usuario actualizado correctamente", 
            usuario: usuarioAEditar 
        });

    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        return res.status(500).json({ error: "Error en el servidor", detalles: error.message });
    }
};



module.exports = { buscarUsuariosCrud, obtenerUsuariosCrud,eliminarUsuarioCrud ,actualizarUsuarioCrud};
