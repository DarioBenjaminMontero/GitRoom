const fs = require('fs/promises');
const path = require('path');
const { Anuncios, clasesUsuarios, Entregas, ArchivosEntrega } = require('../models/index.js');
const { sequelize } = require('../config/db.js');
const { DIRECTORIO_UPLOADS } = require('../middlewares/multer.js');

const tiposConEntrega = new Set(['tarea', 'prueba', 'cuestonario']);

const esIdValido = (id) => Number.isInteger(id) && id > 0;

const borrarDelDisco = (rutas) => Promise.all(rutas.map((ruta) =>
    fs.unlink(ruta).catch((error) => {
        if (error.code !== 'ENOENT') {
            console.error('No se pudo borrar el archivo de la entrega:', error);
        }
    })
));

// Valida el permiso antes de que Multer escriba los archivos en el disco.
const validarEntrega = async (req, res, next) => {
    const idAnuncio = Number(req.params.idAnuncio);

    if (!esIdValido(idAnuncio)) {
        return res.status(400).json({ message: 'El id del anuncio no es válido' });
    }

    try {
        const anuncio = await Anuncios.findByPk(idAnuncio);
        if (!anuncio) {
            return res.status(404).json({ message: 'No se encontró el anuncio' });
        }

        if (!tiposConEntrega.has(anuncio.tipo)) {
            return res.status(400).json({ message: 'Esta publicación no admite entregas' });
        }

        const miembro = await clasesUsuarios.findOne({
            where: { id_clase: anuncio.id_clase, id_usuario: req.user.id }
        });
        if (!miembro || miembro.esProfesor) {
            return res.status(403).json({ message: 'Solo los alumnos de la clase pueden hacer entregas' });
        }

        const entrega = await Entregas.findOne({ where: { id_anuncio: idAnuncio, id_alumno: req.user.id } });
        if (entrega && entrega.calificacion !== null) {
            return res.status(409).json({ message: 'La entrega ya fue calificada y no se puede reemplazar' });
        }

        req.anuncio = anuncio;
        return next();
    } catch (error) {
        console.error('Error al validar la entrega:', error);
        return res.status(500).json({ message: 'No se pudo validar la entrega' });
    }
};

const guardarEntrega = async (req, res) => {
    if (!req.files?.length) {
        return res.status(400).json({ message: 'Seleccioná al menos un archivo para entregar' });
    }

    const idAnuncio = req.anuncio.id_anuncio;
    const idAlumno = req.user.id;
    const rutasNuevas = req.files.map((file) => file.path);
    let rutasAnteriores = [];
    let yaCalificada = false;

    try {
        await sequelize.transaction(async (transaction) => {
            // El bloqueo ordena dos envíos simultáneos del mismo alumno.
            let entrega = await Entregas.findOne({
                where: { id_anuncio: idAnuncio, id_alumno: idAlumno },
                transaction,
                lock: transaction.LOCK.UPDATE
            });

            // Se vuelve a comprobar porque el profesor pudo calificar durante la subida.
            if (entrega && entrega.calificacion !== null) {
                yaCalificada = true;
                return;
            }

            if (entrega) {
                const anteriores = await ArchivosEntrega.findAll({
                    where: { id_entrega: entrega.id_entrega },
                    transaction
                });
                rutasAnteriores = anteriores.map((archivo) => path.join(DIRECTORIO_UPLOADS, archivo.ruta_archivo));
                await ArchivosEntrega.destroy({ where: { id_entrega: entrega.id_entrega }, transaction });
                await entrega.update({ fecha_entrega: new Date() }, { transaction });
            } else {
                entrega = await Entregas.create({ id_anuncio: idAnuncio, id_alumno: idAlumno }, { transaction });
            }

            await ArchivosEntrega.bulkCreate(req.files.map((file) => ({
                id_entrega: entrega.id_entrega,
                ruta_archivo: `entregas/anuncio-${idAnuncio}/alumno-${idAlumno}/${file.filename}`,
                nombre_original: path.basename(file.originalname).slice(-255),
                tipo_contenido: file.mimetype
            })), { transaction });
        });
    } catch (error) {
        await borrarDelDisco(rutasNuevas);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Ya hay otra entrega en proceso. Volvé a intentarlo.' });
        }
        console.error('Error al guardar la entrega:', error);
        return res.status(500).json({ message: 'No se pudo guardar la entrega' });
    }

    if (yaCalificada) {
        await borrarDelDisco(rutasNuevas);
        return res.status(409).json({ message: 'La entrega ya fue calificada y no se puede reemplazar' });
    }

    // Los archivos anteriores se borran recién cuando la base de datos ya confirmó los nuevos.
    await borrarDelDisco(rutasAnteriores);
    return res.status(201).json({ message: 'Entrega guardada' });
};

const obtenerMiEntrega = async (req, res) => {
    const idAnuncio = Number(req.params.idAnuncio);

    if (!esIdValido(idAnuncio)) {
        return res.status(400).json({ message: 'El id del anuncio no es válido' });
    }

    try {
        const entrega = await Entregas.findOne({
            where: { id_anuncio: idAnuncio, id_alumno: req.user.id },
            attributes: ['id_entrega', 'fecha_entrega', 'calificacion'],
            include: {
                model: ArchivosEntrega,
                as: 'archivos',
                attributes: ['id_archivo_entrega', 'nombre_original']
            },
            order: [[{ model: ArchivosEntrega, as: 'archivos' }, 'id_archivo_entrega', 'ASC']]
        });

        return res.status(200).json({ entrega });
    } catch (error) {
        console.error('Error al obtener la entrega:', error);
        return res.status(500).json({ message: 'No se pudo obtener la entrega' });
    }
};

const descargarArchivoEntrega = async (req, res) => {
    const idArchivo = Number(req.params.idArchivo);

    if (!esIdValido(idArchivo)) {
        return res.status(400).json({ message: 'El id del archivo no es válido' });
    }

    try {
        const archivo = await ArchivosEntrega.findByPk(idArchivo);
        const entrega = archivo && await Entregas.findByPk(archivo.id_entrega);
        if (!entrega) {
            return res.status(404).json({ message: 'No se encontró el archivo' });
        }

        if (entrega.id_alumno !== req.user.id) {
            const anuncio = await Anuncios.findByPk(entrega.id_anuncio);
            const profesor = await clasesUsuarios.findOne({
                where: { id_clase: anuncio.id_clase, id_usuario: req.user.id, esProfesor: true }
            });
            if (!profesor) {
                return res.status(403).json({ message: 'No tenés permiso para descargar este archivo' });
            }
        }

        // res.download lo envía como adjunto, para que un HTML subido no se ejecute en el navegador.
        return res.download(
            path.join(DIRECTORIO_UPLOADS, archivo.ruta_archivo),
            archivo.nombre_original,
            { headers: { 'X-Content-Type-Options': 'nosniff' } },
            (error) => {
                if (error && !res.headersSent) {
                    res.status(404).json({ message: 'No se encontró el archivo' });
                }
            }
        );
    } catch (error) {
        console.error('Error al descargar el archivo de la entrega:', error);
        return res.status(500).json({ message: 'No se pudo descargar el archivo' });
    }
};

module.exports = { validarEntrega, guardarEntrega, obtenerMiEntrega, descargarArchivoEntrega };
