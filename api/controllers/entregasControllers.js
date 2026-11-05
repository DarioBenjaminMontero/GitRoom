const { Entregas} = require('../models/index.js'); 

// 1. Alumno sube o entrega su tarea
const entregarTarea = async (req, res) => {
    const idAnuncio = Number(req.params.idAnuncio);
    const userId = req.user.id;

    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No se han adjuntado archivos.' });
        }

        const [entrega, created] = await Entregas.findOrCreate({
            where: { id_anuncio: idAnuncio, id_usuario: userId },
            defaults: { estado: 'entregado', fecha_entrega: new Date() }
        });

        if (!created) {
            await entrega.update({ estado: 'entregado', fecha_entrega: new Date() });
        }

        return res.status(201).json({ 
            message: 'Tarea entregada con éxito', 
            archivos: req.files 
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error al entregar la tarea', detalles: error.message });
    }
};

// 2. Alumno anula su entrega
const anularEntrega = async (req, res) => {
    const idAnuncio = Number(req.params.idAnuncio);
    const userId = req.user.id;

    try {
        const entrega = await Entregas.findOne({ where: { id_anuncio: idAnuncio, id_usuario: userId } });
        
        if (!entrega) {
            return res.status(404).json({ message: 'No se encontró una entrega previa.' });
        }

        await entrega.update({ estado: 'anulado' });
        return res.status(200).json({ message: 'Entrega anulada correctamente.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al anular la entrega', detalles: error.message });
    }
};

// 3. Profesor obtiene la lista de alumnos con sus entregas y notas
const obtenerEntregasProfesor = async (req, res) => {
    const idAnuncio = Number(req.params.idAnuncio);

    try {
        const entregas = await Entregas.findAll({
            where: { id_anuncio: idAnuncio },
            include: ['usuario'] // Asegúrate de tener la relación configurada en tus modelos Sequelize
        });

        return res.status(200).json({ entregas });
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener las entregas', detalles: error.message });
    }
};

// 4. Profesor califica a un alumno
const calificarEntrega = async (req, res) => {
    const { idEntrega } = req.params;
    const { nota } = req.body;

    try {
        const entrega = await Entregas.findByPk(idEntrega);
        if (!entrega) {
            return res.status(404).json({ message: 'Entrega no encontrada' });
        }

        await entrega.update({ nota });
        return res.status(200).json({ message: 'Nota guardada exitosamente', entrega });
    } catch (error) {
        return res.status(500).json({ message: 'Error al calificar', detalles: error.message });
    }
};

module.exports = { entregarTarea, anularEntrega, obtenerEntregasProfesor, calificarEntrega };