const { clases, clasesUsuarios, Anuncios, usuarios } = require("../models/index.js");

const create = async (req, res) => {
    const { idUsuario, nombreClase } = req.body;

    if (!idUsuario || !nombreClase || !String(nombreClase).trim()) {
        return res.status(400).json({ message: "Faltan datos requeridos para crear la clase" });
    }

    let existe = true;
    let codigo;

    try {
        do {
            const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            codigo = '';

            for (let i = 0; i < 6; i++) {
                const aleatorio = Math.floor(Math.random() * caracteres.length);
                codigo += caracteres.charAt(aleatorio);
            }

            const claseExistente = await clases.findOne({ where: { codigo } });
            if (!claseExistente) {
                existe = false;
            }
        } while (existe);

        const nuevaClase = await clases.create({ nombreClase: nombreClase.trim(), codigo });
        await clasesUsuarios.create({
            id_clase: nuevaClase.id_clase,
            id_usuario: idUsuario,
            esProfesor: true
        });

        return res.status(201).json({ message: "Clase creada", clase: nuevaClase });
    } catch (error) {
        return res.status(500).json({ error: "Error en el servidor", detalles: error.message });
    }
};

const unirseClase = async (req, res) => {
    const { codigo } = req.body;

    if (!codigo || !String(codigo).trim()) {
        return res.status(400).json({ message: "Se requiere el código de la clase" });
    }

    try {
        const claseExistente = await clases.findOne({
            where: { codigo: String(codigo).trim().toUpperCase() }
        });

        if (!claseExistente) {
            return res.status(404).json({ message: "No se encontró una clase con ese código" });
        }

        const userId = req.user.id;
        const yaEsMiembro = await clasesUsuarios.findOne({
            where: {
                id_clase: claseExistente.id_clase,
                id_usuario: userId
            }
        });

        if (yaEsMiembro) {
            return res.status(409).json({ message: "Ya estás unido a esta clase" });
        }

        await clasesUsuarios.create({
            id_clase: claseExistente.id_clase,
            id_usuario: userId,
            esProfesor: false
        });

        return res.status(201).json({
            message: "Te uniste con éxito a la clase",
            clase: claseExistente.nombreClase
        });
    } catch (error) {
        return res.status(500).json({ error: "Error en el servidor", detalles: error.message });
    }
};

const obtenerAnunciosClase = async (req, res) => {
    const idClase = Number(req.params.idClase);

    if (!Number.isInteger(idClase) || idClase <= 0) {
        return res.status(400).json({ message: "El id de la clase no es válido" });
    }

    try {
        const clase = await clases.findByPk(idClase, {
            attributes: ['id_clase', 'nombreClase']
        });

        if (!clase) {
            return res.status(404).json({ message: "No se encontró la clase con ese id" });
        }

        const miembro = await clasesUsuarios.findOne({
            where: {
                id_clase: idClase,
                id_usuario: req.user.id
            }
        });

        if (!miembro) {
            return res.status(403).json({ message: "No tienes acceso a los anuncios de esta clase" });
        }

        const anuncios = await Anuncios.findAll({
            where: { id_clase: idClase },
            order: [['fecha_publicacion', 'DESC']],
            include: [{
                model: usuarios,
                attributes: ['id_usuario', 'nombre', 'apellido', 'mail']
            }]
        });

        return res.status(200).json({
            clase: {
                id_clase: clase.id_clase,
                nombreClase: clase.nombreClase
            },
            anuncios
        });
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener los anuncios", detalles: error.message });
    }
};

module.exports = { create, unirseClase, obtenerAnunciosClase };
