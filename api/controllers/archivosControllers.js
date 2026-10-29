const {Archivos} = require("../models/index.js")


const traerTodosLosArchivos = async (req, res) => {
    try {
        const { id_repo } = req.params; // Viene de la URL (:id_repo)
        
        const filtro = id_repo ? { id_repo: Number(id_repo) } : {};

        const archivos = await Archivos.findAll({
            where: filtro,
            attributes: ['id_archivo', 'ruta', 'id_repo']
        });

        const archivosFormateados = archivos.map(archivo => {
            const nombreOriginal = archivo.ruta.includes("--") 
                ? archivo.ruta.split("--").slice(1).join("--") 
                : archivo.ruta;

            return {
                id_archivo: archivo.id_archivo,
                id_repo: archivo.id_repo,
                ruta: archivo.ruta,
                urlCompleta: `http://localhost:3000/uploads/${archivo.ruta}`,
                nombre: nombreOriginal
            };
        });

        return res.status(200).json(archivosFormateados);
    } catch (error) {
        console.error("Error al obtener los archivos:", error);
        return res.status(500).json({ error: "Error en el servidor", details: error.message });
    }
}

module.exports = { traerTodosLosArchivos }


module.exports = { traerTodosLosArchivos }
