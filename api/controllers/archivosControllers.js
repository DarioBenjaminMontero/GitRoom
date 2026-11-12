
const {
    Archivos,
    versionesArchivos,
    Commits
} = require("../models/index.js");

const traerTodosLosArchivos = async (req, res) => {
    try {
        const id_repo = Number(req.params.idRepo || req.params.id);

        const id_commit = Number(req.query.id_commit);

        if (!Number.isInteger(id_repo) || id_repo < 1 ||
            !Number.isInteger(id_commit) || id_commit < 1) {
            return res.status(400).json({
                message: "Repositorio o commit inválido"
            });
        }

        // Verificamos que el commit pertenezca al repositorio.
        const commit = await Commits.findOne({
            where: {
                id_commit,
                id_repo
            }
        });

        if (!commit) {
            return res.status(404).json({
                message: "Commit no encontrado"
            });
        }

        const carpetaActual = req.query.carpeta
            ? req.query.carpeta.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "")
            : "";

        // Evitamos rutas que intenten salir de la carpeta del repositorio.
        const segmentosCarpeta = carpetaActual.split("/").filter(Boolean);

        if (segmentosCarpeta.some(segmento =>
            segmento === "." || segmento === ".."
        )) {
            return res.status(400).json({
                message: "Ruta de carpeta inválida"
            });
        }

        // Obtenemos los archivos registrados para este commit.
        const versiones = await versionesArchivos.findAll({
            where: {
                id_commit
            },
            include: [{
                model: Archivos,
                as: "Archivo",
                attributes: ["id_archivo", "ruta", "id_repo"],
                where: {
                    id_repo
                }
            }]
        });

        const prefijoBusqueda = carpetaActual
            ? `${carpetaActual}/`
            : "";

        const resultado = [];
        const carpetasAgregadas = new Set();

        for (const version of versiones) {
            const archivo = version.Archivo;

            if (!archivo) continue;

            const rutaNormalizada = archivo.ruta.replace(/\\/g, "/");

            if (!rutaNormalizada.startsWith(prefijoBusqueda)) continue;

            const rutaRestante = rutaNormalizada.slice(prefijoBusqueda.length);
            const segmentos = rutaRestante.split("/");

            if (segmentos.length > 1) {
                const nombreCarpeta = segmentos[0];

                if (!carpetasAgregadas.has(nombreCarpeta)) {
                    carpetasAgregadas.add(nombreCarpeta);

                    resultado.push({
                        tipo: "carpeta",
                        nombre: nombreCarpeta,
                        rutaParaNavegar: carpetaActual
                            ? `${carpetaActual}/${nombreCarpeta}`
                            : nombreCarpeta
                    });
                }
            } else if (segmentos.length === 1 && segmentos[0] !== "") {
                const nombre = segmentos[0];

                const rutaFisica = version.ruta_fisica.replace(/\\/g, "/");

                resultado.push({
                    tipo: "archivo",
                    id_archivo: archivo.id_archivo,
                    id_repo: archivo.id_repo,
                    nombre,
                    ruta: rutaFisica,
                    urlCompleta: `http://localhost:3000/uploads/${rutaFisica}`
                });
            }
        }

        return res.status(200).json(resultado);

    } catch (error) {
        console.error("Error al obtener los archivos:", error);

        return res.status(500).json({
            message: "Error al obtener los archivos"
        });
    }
};

module.exports = { traerTodosLosArchivos };
