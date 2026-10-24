const { Anuncios, clases, clasesUsuarios } = require('../models/index.js');
const { Comentarios } = require('../models/comentariosModel.js');
const tiposAnuncio = new Set(['anuncio', 'tarea']);

const create = async (req, res) => {
    const idClase = Number(req.params.idClase);
    const { tipo, contenido } = req.body;

    if (!Number.isInteger(idClase) || idClase <= 0) {
        return res.status(400).json({ message: 'El id de la clase no es válido' });
    }

    if (!tiposAnuncio.has(tipo) || typeof contenido !== 'string' || !contenido.trim()) {
        return res.status(400).json({ message: 'El tipo no es válido y el contenido es obligatorio' });
    }

    try {
        const clase = await clases.findByPk(idClase);
        if (!clase) {
            return res.status(404).json({ message: 'No se encontró la clase' });
        }

        const profesor = await clasesUsuarios.findOne({
            where: {
                id_clase: idClase,
                id_usuario: req.user.id,
                esProfesor: true
            }
        });

        if (!profesor) {
            return res.status(403).json({ message: 'Solo el profesor de la clase puede crear anuncios' });
        }

        const anuncio = await Anuncios.create({
            id_usuario: req.user.id,
            id_clase: idClase,
            tipo,
            fecha_publicacion: new Date(),
            contenido: contenido.trim()
        });

        return res.status(201).json({ message: 'Anuncio creado', anuncio });
    } catch (error) {
        return res.status(500).json({ message: 'Error al crear el anuncio', detalles: error.message });
    }
};

const createComment = async (req, res) => {
    const idAnuncio = Number(req.params.idAnuncio);
    const { texto } = req.body;

    if (!Number.isInteger(idAnuncio) || idAnuncio <= 0) {
        return res.status(400).json({ message: 'El id del anuncio no es válido' });
    }

    if (typeof texto !== 'string' || !texto.trim()) {
        return res.status(400).json({ message: 'El comentario es obligatorio' });
    }

    try {
        const anuncio = await Anuncios.findByPk(idAnuncio);
        if (!anuncio) {
            return res.status(404).json({ message: 'No se encontró el anuncio' });
        }

        const comentario = await Comentarios.create({
            id_anuncio: idAnuncio,
            texto: texto.trim()
        });

        return res.status(201).json({ message: 'Comentario creado', comentario });
    } catch (error) {
        return res.status(500).json({ message: 'Error al crear el comentario', detalles: error.message });
    }
};

module.exports = { create, createComment };