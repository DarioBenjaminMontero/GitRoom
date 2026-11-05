const fs = require('fs/promises');
const path = require('path');
const { Anuncios, clases, clasesUsuarios, usuarios,ArchivosAnuncio } = require('../models/index.js');
const { Comentarios } = require('../models/comentariosModel.js');
const { sequelize } = require('../config/db.js');
const tiposAnuncio = new Set(['anuncio', 'tarea', 'prueba', 'cuestonario', 'foro']);

const create = async (req, res) => {
    const idClase = Number(req.params.idClase);
    const { tipo, contenido,nombre } = req.body;

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

           const anuncio = await sequelize.transaction(async (transaction) => {
            const nuevoAnuncio = await Anuncios.create({
                id_usuario: req.user.id,
                id_clase: idClase,
                tipo,
                fecha_publicacion: new Date(),
                contenido: contenido.trim(),
                nombre:nombre
            }, { transaction });

            const directorioAnuncio = path.join(
                __dirname,
                '..',
                'uploads',
                'anuncios',
                `anuncio-${nuevoAnuncio.id_anuncio}`
            );
            await fs.mkdir(directorioAnuncio, { recursive: true });
            if (req.file) {
                const rutaDestinoFinal = path.join(directorioAnuncio, req.file.originalname);
                await fs.rename(req.file.path, rutaDestinoFinal);
                await ArchivosAnuncio.create({
                    id_anuncio: nuevoAnuncio.id_anuncio,
                    tipo: nuevoAnuncio.tipo, 
                    url_archivo: `/uploads/anuncios/anuncio-${nuevoAnuncio.id_anuncio}/${req.file.originalname}`
                }, { transaction });
            }

            return nuevoAnuncio;
        });

        return res.status(201).json({ message: 'Anuncio creado', anuncio });
    } catch (error) {
        return res.status(500).json({ message: 'Error al crear el anuncio', detalles: error.message });
    }
};
const obtenerAnuncio=async(req,res)=>{
    const id_clase=Number(req.params.idclase)?Number(req.params.idclase):null
    const id_anuncio=Number(req.params.idAnuncio)?Number(req.params.idAnuncio):null
    if(id_clase!=null){
    try{
         const anuncio = await Anuncios.findAll({where:{id_clase}});
         const profesor = await clasesUsuarios.findOne({
             where: { id_clase, id_usuario: req.user.id, esProfesor: true }
         });
    return res.status(201).json({ message: 'exito al buscar el anunacio', anuncio, esProfesor: Boolean(profesor) });
    }
    catch(error){
        return res.status(500).json({ message: 'Error al buscar el anuncio', detalles: error.message });
    }
    }
    else if(id_anuncio!=null){
         try{
         const anuncio = await Anuncios.findOne({where:{id_anuncio}});
         const profesor = anuncio && await clasesUsuarios.findOne({
             where: { id_clase: anuncio.id_clase, id_usuario: req.user.id, esProfesor: true }
         });
    return res.status(201).json({ message: 'exito al buscar el anunacio', anuncio, esProfesor: Boolean(profesor) });
    }
    catch(error){
        return res.status(500).json({ message: 'Error al buscar el anuncio', detalles: error.message });
    }
    }
    
}

const perteneceALaClase = async (id_clase, id_usuario) => {
    const miembro = await clasesUsuarios.findOne({ where: { id_clase, id_usuario } });
    return Boolean(miembro);
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

        if (!await perteneceALaClase(anuncio.id_clase, req.user.id)) {
            return res.status(403).json({ message: 'Solo los miembros de la clase pueden comentar' });
        }

        const comentario = await Comentarios.create({
            id_anuncio: idAnuncio,
            id_usuario: req.user.id,
            texto: texto.trim()
        });

        return res.status(201).json({ message: 'Comentario creado', comentario });
    } catch (error) {
        return res.status(500).json({ message: 'Error al crear el comentario', detalles: error.message });
    }
};

const obtenerComentarios = async (req, res) => {
    const idAnuncio = Number(req.params.idAnuncio);

    if (!Number.isInteger(idAnuncio) || idAnuncio <= 0) {
        return res.status(400).json({ message: 'El id del anuncio no es válido' });
    }

    try {
        const anuncio = await Anuncios.findByPk(idAnuncio);
        if (!anuncio) {
            return res.status(404).json({ message: 'No se encontró el anuncio' });
        }

        if (!await perteneceALaClase(anuncio.id_clase, req.user.id)) {
            return res.status(403).json({ message: 'Solo los miembros de la clase pueden ver los comentarios' });
        }

        const comentarios = await Comentarios.findAll({
            where: { id_anuncio: idAnuncio },
            include: { model: usuarios, as: 'autor', attributes: ['nombre', 'apellido'] },
            order: [['id_comentario', 'ASC']]
        });

        return res.status(200).json({ comentarios });
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener los comentarios', detalles: error.message });
    }
};

module.exports = { create, createComment, obtenerAnuncio, obtenerComentarios };