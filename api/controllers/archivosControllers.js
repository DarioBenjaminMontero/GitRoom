const { Archivos } = require("../models/index.js")

const traerTodosLosArchivos = async (req, res) => {
    try {
        const id_repo = Number(req.params.id)
        const archivos = await Archivos.findAll({
            where: { id_repo },
            attributes: ['id_archivo', 'ruta', 'id_repo']
        });
        const prefijoRepositorio = `repos/${id_repo}/`
        const archivosFormateados = archivos
            .map(archivo => {
                const rutaNormalizada = archivo.ruta.replace(/\\/g, "/")
                if (!rutaNormalizada.startsWith(prefijoRepositorio)) return null
                const rutaRelativa = rutaNormalizada.slice(prefijoRepositorio.length)
                const segmentos = rutaRelativa.split("/")
                const nombreGuardado = segmentos.pop()
                const nombre = nombreGuardado.includes("--")
                    ? nombreGuardado.split("--").slice(1).join("--")
                    : nombreGuardado
                const rutaRelativaOriginal = [...segmentos, nombre].join("/")
                return {
                    id_archivo: archivo.id_archivo,
                    id_repo: archivo.id_repo,
                    ruta: rutaNormalizada,
                    rutaRelativa: rutaRelativaOriginal,
                    urlCompleta: `http://localhost:3000/uploads/${rutaNormalizada
                        .split("/")
                        .map(segmento => encodeURIComponent(segmento))
                        .join("/")}`,
                    nombre
                }
            })
            .filter(Boolean)
        return res.status(200).json(archivosFormateados);
    } catch (error) {
        console.error("Error al obtener los archivos:", error);
        return res.status(500).json({ error: "Error en el servidor", details: error.message });
    }
}

module.exports = { traerTodosLosArchivos }