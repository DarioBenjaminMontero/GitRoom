
const { Archivos } = require("../models/index.js");

const traerTodosLosArchivos = async (req, res) => {
    try {
        const id_repo = Number(req.params.id);

        const carpetaActual = req.query.carpeta
            ? req.query.carpeta.replace(/^\/+|\/+$/g, "")
            : "";

        const archivos = await Archivos.findAll({
            where: { id_repo },
            attributes: ['id_archivo', 'ruta', 'id_repo']
        });

        const prefijoRepositorio = `repos/${id_repo}/`;

        const prefijoBusqueda = carpetaActual
            ? `${prefijoRepositorio}${carpetaActual}/`
            : prefijoRepositorio;

        const resultado = [];
        const carpetasAgregadas = new Set();

        for (const archivo of archivos) {

            const rutaNormalizada = archivo.ruta.replace(/\\/g, "/");

            if (!rutaNormalizada.startsWith(prefijoBusqueda)) continue;

            const rutaRestante = rutaNormalizada.slice(prefijoBusqueda.length);

            const segmentos = rutaRestante.split("/");

            // Si tiene más de un segmento, existe una carpeta
            if (segmentos.length > 1) {

                const nombreCarpeta = segmentos[0];

                if (!carpetasAgregadas.has(nombreCarpeta)) {

                    carpetasAgregadas.add(nombreCarpeta);

                    resultado.push({
                        tipo: 'carpeta',
                        nombre: nombreCarpeta,
                        rutaParaNavegar: carpetaActual
                            ? `${carpetaActual}/${nombreCarpeta}`
                            : nombreCarpeta
                    });
                }

            } else if (segmentos.length === 1 && segmentos[0] !== "") {

                const nombreGuardado = segmentos[0];

                const nombre = nombreGuardado.includes("--")
                    ? nombreGuardado.split("--").slice(1).join("--")
                    : nombreGuardado;

                resultado.push({
                    tipo: "archivo",
                    id_archivo: archivo.id_archivo,
                    id_repo: archivo.id_repo,
                    nombre,
                    ruta: rutaNormalizada,
                    urlCompleta: `http://localhost:3000/uploads/${rutaNormalizada
                        .split("/")
                        .map(segmento => encodeURIComponent(segmento))
                        .join("/")}`
                });
            }
        }

        return res.status(200).json(resultado);

    } catch (error) {
        console.error("Error al obtener los archivos:", error);

        return res.status(500).json({
            error: "Error en el servidor",
            details: error.message
        });
    }
};

module.exports = { traerTodosLosArchivos };
