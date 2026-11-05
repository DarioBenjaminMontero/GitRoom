const { usuarios } = require("../models/index.js")
const { repositorios } = require("../models/index.js")
const { UsuariosRepositorios } = require("../models/index.js")
const { clases } = require("../models/clasesModel.js")
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isAdmin } = require("../middlewares/esAdmin.js");
const JWT_SECRET = 'Ranas_Todas_Flacas_Musculosas';



const nodemailer = require('nodemailer');
const SECRET = process.env.JWT_SECRET || 'Ranas_Todas_Flacas_Musculosas';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const PURPOSE = 'recuperacion-contraseña';
const MIN_LARGO_CONTRASEÑA = 8;

// Misma respuesta exista o no el correo, para no revelar qué mails están registrados.
const MENSAJE_GENERICO = 'Si el correo está registrado, vas a recibir un enlace para recuperar tu contraseña.';


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});



const solicitarRecuperacion = async (req, res) => {
    //typeof pregunta de que tipo es, trim corta los espacios y tolowercase lo transforma en minuscula,
    //  los '' guardan un espacio vacio si no hay nada
    const mail = typeof req.body?.mail === 'string' ? req.body.mail.trim().toLowerCase() : '';

    if (!mail) {
        return res.status(400).json({ message: 'Ingresá tu correo electrónico.' });
    }

    try {
        // Búsqueda sin distinguir mayúsculas (Registro guarda el mail tal cual lo escribió la persona)
        const usuario = await usuarios.findOne({
            where: {
                mail
            }
        });

        if (usuario) {
            const token = jwt.sign(
                { id: usuario.id_usuario, purpose: PURPOSE },
                SECRET + usuario.contraseña, // ver authRecuperacion: invalida el enlace al cambiar la clave
                { expiresIn: '15m' }
            );


            //es el enlace que se envia al mail para que el usuario pueda cambiar la contraseña,
            //  se le agrega el token generado
            const enlace = `${FRONTEND_URL}/restablecer-contrasena/${token}`;

            try {
                await transporter.sendMail({
                    //
                    from: `"GitRoom" <${process.env.EMAIL_USER}>`,
                    to: usuario.mail,
                    subject: 'Recuperación de contraseña - GitRoom',
                    html: `
                        <h2>Recuperar contraseña</h2>
                        <p>Pediste cambiar tu contraseña de GitRoom. El enlace vence en 15 minutos y sirve una sola vez.</p>
                        <p><a href="${enlace}">Crear nueva contraseña</a></p>
                        <p>Si no fuiste vos, ignorá este correo: tu contraseña no cambia.</p>
                    `
                });
                //error mail se establece aca, y si hay error agarra el valor
            } catch (errorMail) {
                // Si fallara el envío solo para mails existentes, la respuesta delataría cuáles existen.
                // Por eso se registra el error y se responde igual.
                console.error('No se pudo enviar el mail de recuperación:', errorMail.message);
            }
        }

        return res.status(200).json({ message: MENSAJE_GENERICO });
    } catch (error) {
        console.error('Error en solicitarRecuperacion:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};
 
// GET /users/verificar-recuperacion   header: recuperacion = <token>
// Llega acá solo si authRecuperacion aprobó el token. Sirve para que el frontend
// sepa si el enlace sigue vigente antes de mostrar el formulario.
const verificarTokenRecuperacion = (req, res) => {
    return res.status(200).json({ message: 'Enlace válido' });
};
 
// POST /users/restablecer-contrasena   header: recuperacion = <token>   body: { nuevaContraseña }
const restablecerContrasena = async (req, res) => {
    const nuevaContraseña = req.body?.nuevaContraseña;
 
    if (typeof nuevaContraseña !== 'string' || nuevaContraseña.length < MIN_LARGO_CONTRASEÑA) {
        return res.status(400).json({
            message: `La contraseña debe tener al menos ${MIN_LARGO_CONTRASEÑA} caracteres.`
        });
    }
 
    try {
        const contraseñaHasheada = await bcrypt.hash(nuevaContraseña, 10);
 
        await req.usuarioRecuperacion.update({ contraseña: contraseñaHasheada });
 
        return res.status(200).json({ message: 'Contraseña restablecida con éxito.' });
    } catch (error) {
        console.error('Error en restablecerContrasena:', error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};
 


const Registro = async (req, res) => {


    const { nombre, contraseña, año_division, apellido, mail } = req.body
    const mailNormalizado = typeof mail === 'string' ? mail.trim().toLowerCase() : '';

if (!mailNormalizado) {
    return res.status(400).json({
        message: "El correo es obligatorio."
    });
}

const existe = await usuarios.findOne({
    where: {
        mail: mailNormalizado
    }
});

    const contraseñaHasheada = await bcrypt.hash(contraseña, 10)
    try {
        const usuario = await usuarios.create({
            nombre,
            mail: mailNormalizado,
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
        emailNormalizado = typeof email === 'string' ? email.trim().toLowerCase() : '';

        // Busca el mail del usuario
        const user = await usuarios.findOne({ where: { mail: emailNormalizado } });
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
            user: {
                id: user.id_usuario,
                username: user.nombre,
                apellido: user.apellido,
                admin: user.admin
            }
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




const obtenerClasesUsuarios = async (req, res) => {
    try {
        const idUsuario = req.params.id;

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

const obtenerPerfilUsuario = async (req, res) => {
    const id = Number(req.params.id);


    try {
        const usuario = await usuarios.findByPk(id, {
            attributes: ['id_usuario', 'nombre', 'apellido', 'mail', 'año_division', 'foto_perfil']
        });


        if (!usuario) {
            return res.status(404).json({ message: ' usuario no encontrado' });
        }


        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(500).json({ message: 'error al obtener el perfil del usuario' });
    }
};




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

const quiereModificarPerfil = async (req, res) => {
    try {
        const CorreoDeCuenta = req.user.gmail;

        const IdUsuario = req.user.id;

        const tokenPerfil = jwt.sign(
            { id: IdUsuario, Gmail: CorreoDeCuenta },
            JWT_SECRET,
            { expiresIn: '1h' }
        )


        res.status(200).json({ message: 'Token de modificación de perfil generado con éxito', tokenPerfil });



    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const cambiarContraseña = async (req, res) => {
    const { nuevaContraseña } = req.body;

    try {
        const userId = req.user.id;

        const contraseñaHasheada = await bcrypt.hash(nuevaContraseña, 10);

        await usuarios.update(
            { contraseña: contraseñaHasheada },
            { where: { id_usuario: userId } }
        );

        return res.status(200).json({ message: 'Contraseña actualizada con éxito' });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }



}

const cambiarNombre = async (req, res) => {
    const { nuevoNombre, nuevoApellido } = req.body;

    try {
        const userId = req.user.id;
        const datosActualizados = {};

        if (nuevoNombre && nuevoNombre.trim()) {
            datosActualizados.nombre = nuevoNombre.trim();
        }

        if (nuevoApellido && nuevoApellido.trim()) {
            datosActualizados.apellido = nuevoApellido.trim();
        }

        if (Object.keys(datosActualizados).length === 0) {
            return res.status(400).json({
                message: "Debe ingresar un nombre o un apellido nuevo."
            });
        }

        await usuarios.update(
            datosActualizados,
            {
                where: { id_usuario: userId }
            }
        );

        return res.status(200).json({
            message: "Nombre y apellido actualizados con éxito",
            nombre: datosActualizados.nombre,
            apellido: datosActualizados.apellido
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


const buscarUsuarios = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || !q.trim()) {
            return res.status(400).json({ mensaje: 'Ingresá un texto para buscar' });
        }

        // separa por palabras: "juan perez" busca juan Y perez
        const palabras = q.trim().split(/\s+/);

        const resultado = await usuarios.findAll({
            where: {
                [Op.and]: palabras.map((p) => ({
                    [Op.or]: [
                        { nombre: { [Op.like]: `%${p}%` } },
                        { apellido: { [Op.like]: `%${p}%` } },
                        { mail: { [Op.like]: `%${p}%` } },
                    ],
                })),
            },
            attributes: { exclude: ['contraseña'] },
            limit: 20,
        });

        res.json(resultado);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al buscar usuarios', error: error.message });
    }
};


const borrarCuenta = async (req, res) => {

    const userId = req.user.id;
    const contraseñaIngresada = req.body.contraseña;

    try {

        const user = await usuarios.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const contraseñaUsuario = user.contraseña;


        const contraseñaValida = await bcrypt.compare(contraseñaIngresada, contraseñaUsuario);

        if (!contraseñaValida) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Eliminar el usuario de la base de datos
        await usuarios.destroy({ where: { id_usuario: userId } });

        return res.status(200).json({ message: 'Cuenta eliminada con éxito' });

    } catch (error) {
        return res.status(500).json({ error: error.message });


    }

}


module.exports = {
    login, Registro, obtenerClases, obtenerDatosUsuario, editarFotoPerfil, obtenerPerfilUsuario, buscarUsuarios, obtenerClasesUsuarios, quiereModificarPerfil, cambiarContraseña, cambiarNombre, borrarCuenta, verificarTokenRecuperacion, restablecerContrasena, solicitarRecuperacion
};
