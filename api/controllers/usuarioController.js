const { usuarios } = require("../models/index.js")
const { repositorios } = require("../models/index.js")
const { UsuariosRepositorios } = require("../models/index.js")
const { clases } = require("../models/clasesModel.js")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Ranas_Todas_Flacas_Musculosas';
const Registro = async (req, res) => {


    const { nombre, contraseña, año_division, apellido, mail } = req.body


    const existe = await usuarios.findOne({
        where: {
            mail: mail
        }
    })
    if (existe) {
        return;


    }


    const contraseñaHasheada = await bcrypt.hash(contraseña, 10)
    try {
        const usuario = usuarios.create({
            nombre,
            mail,
            apellido,
            contraseña: contraseñaHasheada,
            año_division
        })


        res.status(201).json({ message: "Usuario creado" })
    }
    catch (error) {


        res.status(500).json({ error: "error en el servidor", detalles: error.message })


    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Busca el mail del usuario
        const user = await usuarios.findOne({ where: { mail: email } });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Comparar la contraseña ingresada con la encriptada usando bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.contraseña);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Generar token JWT de 2 horas 
        const token = jwt.sign(
            { id: user.id_usuario, username: user.nombre },
            JWT_SECRET,
            { expiresIn: '5h' }
        );

        res.status(200).json({
            message: "Login exitoso",
            token,
            user: { id: user.id_usuario, username: user.nombre }
        });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor", details: error.message });
    }
};



const obtenerClases = async (req, res) => {
    try {
        const idUsuario = req.user.id;

        const usuarioConClases = await usuarios.findByPk(idUsuario, {
            include: {
                model: clases,
                attributes: ['id_clase', 'nombreClase', 'codigo'],
                through: { attributes: [] }, // Oculta datos intermedios de la relacion del alumno
                include: [
                    {
                        model: usuarios,
                        attributes: ['nombre', 'apellido', 'mail'],
                        through: {
                            where: { esProfesor: true },
                            attributes: []
                        }
                    }
                ]
            }
        });

        if (!usuarioConClases) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }


        return res.status(200).json(usuarioConClases.clases);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener las clases' });
    }
};

const obtenerDatosUsuario = async (req, res) => {
    const id = req.user.id;
    try {
        const usuario = await usuarios.findByPk(id, {
            attributes: ['nombre', 'apellido', 'mail', 'año_division', 'foto_perfil']
        });
        console.log(usuario)
        res.status(200).json(usuario);
    }
    catch (error) {

        return res.status(500).json({ message: 'Error al obtener los datos del usuario' });

    }
}

const editarFotoPerfil = async (req, res) => {

    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No se subió ninguna imagen' });
        }
        const userId = req.user.id; // El ID del usuario
        const filename = req.file.filename;

        const actualizar = await usuarios.update({

            foto_perfil: filename

        }, {

            where: {

                id_usuario: userId

            }

        }
        )

        if (actualizar) {

            return res.status(200).json({
                message: 'Avatar actualizado con éxito',
                filename,
                userId

            })
        }

    } catch (error) {

        return res.status(500).json({ error: error.message });
    }

}


module.exports = {
    login, Registro, obtenerClases, obtenerDatosUsuario, editarFotoPerfil
};