const {
    repositorios,
    UsuariosRepositorios,
    Archivos,
    usuarios,
    versionesArchivos
} = require("../models/index.js");
const fs = require("fs/promises");
const crypto = require("crypto");
const path = require("path");
const validarRepositorio = async (req, res, next) => {
    try {
        const id_repo = Number(req.params.id || req.params.idRepo || req.params.id_repo)
        if (!Number.isInteger(id_repo) || id_repo < 1) {
            return res.status(400).json({ message: "Repositorio inválido" })
        }
        const acceso = await UsuariosRepositorios.findOne({
            where: { id_usuario: req.user.id, id_repo }
        })
        if (!acceso) {
            return res.status(404).json({ message: "Repositorio no encontrado" })
        }
        req.params.id = String(id_repo)
        return next()
    } catch (error) {
        console.error("Error al validar el repositorio:", error)
        res.status(500).json({ message: "No se pudo acceder al repositorio" })
    }
}

const crearRepositorio = async (req, res) => {
    let id_usuario = req.user.id
    let es_privado = req.user.visibilidadRepositorio
    let descripcion = req.user.descripcionRepositorio
    let nombre_repo = req.user.nombreRepositorio
    let id_clase = ""
    let id_repo = ""
    if (req.user.id_clase) {
        id_clase = req.user.id_clase
    }
    const existeRepo = await UsuariosRepositorios.findOne({
        where: { id_usuario: id_usuario },
        include: [{
            model: repositorios,
            where: { nombre_repo: nombre_repo },
            required: true
        }]
    });
    if (existeRepo) {
        return res.status(400).json({ message: "ya existe" })
    }
    const respuesta = await repositorios.create({
        es_privado: es_privado,
        descripcion: descripcion,
        nombre_repo: nombre_repo,
        id_clase: id_clase || null
    })
    if (respuesta) {
        id_repo = respuesta.id_repo
        const respuesta2 = await UsuariosRepositorios.create({
            id_usuario: id_usuario,
            id_repo: id_repo,
            rol_Colaborador: true
        })
        if (respuesta2) {
            return res.status(201).json({ message: "creado" })
        }
        else {
            return res.status(500).json({ message: "error del servidor" })
        }
    }
}

const consultarRepositorios = async (req, res) => {
    const id = req.user.id
    const nombreRepositorio = req.user.nombreRepositorio
    try {
        const respuesta = await UsuariosRepositorios.findOne({
            where: { id_usuario: id },
            include: [{
                model: repositorios,
                where: { nombre_repo: nombreRepositorio },
                required: true
            }]
        });
        return res.status(200).json({ exists: !!respuesta });
    }
    catch (error) {
        return res.status(500).json({ error: "Error en el servidor", details: error.message });
    }
}

const traerRepos = async (req, res) => {
    const id = req.user.id
    try {
        const respuesta = await repositorios.findAll({
            include: {
                model: UsuariosRepositorios,
                where: { id_usuario: id },
                required: true,
                attributes: []
            },
            order: [["fecha_creacion", "DESC"]]
        })
        return res.status(200).json(respuesta)
    } catch (error) {
        return res.status(500).json({ error: "Error en el servidor", details: error.message })
    }
}

const traerReposUsers = async (req, res) => {
    const id = req.params.id
    try {
        const respuesta = await repositorios.findAll({
            include: {
                model: UsuariosRepositorios,
                where: { id_usuario: id },
                required: true,
                attributes: []
            }
        })
        return res.status(200).json(respuesta)
    } catch (error) {
        return res.status(500).json({ error: "Error en el servidor", details: error.message })
    }
}

const traerInformacionRepositorios = async (req, res) => {
    try {
        const consulta = await repositorios.findByPk(req.params.id)
        if (!consulta) {
            return res.status(404).json({ message: "Repositorio no encontrado" })
        }
        return res.status(200).json({
            id_repo: consulta.id_repo,
            descripcion: consulta.descripcion,
            nombre: consulta.nombre_repo,
            nombre_repo: consulta.nombre_repo,
            fecha: consulta.fecha_creacion,
            fecha_creacion: consulta.fecha_creacion,
            privado: consulta.es_privado,
            es_privado: consulta.es_privado
        })
    }
    catch (error) {
        console.error("Error al obtener la información del repositorio:", error)
        return res.status(500).json({ message: "No se pudo obtener el repositorio" })
    }
}

const traerColaboradores = async (req, res) => {
    try {
        const repoConColaboradores = await repositorios.findByPk(req.params.id, {
            include: {
                model: usuarios,
                attributes: ['id_usuario', 'nombre', 'mail', 'apellido', 'foto_perfil']
            }
        });
        if (!repoConColaboradores) {
            return res.status(404).json({ message: "Repositorio no encontrado" });
        }
        return res.status(200).json(repoConColaboradores.usuarios);
    }
    catch (error) {
        return res.status(500).json({ error: "Error en el servidor", details: error.message });
    }
}

const obtenerArchivosRecursivos = async (directorio) => {
    const elementos = await fs.readdir(directorio, {
        withFileTypes: true
    });

    const archivos = [];

    for (const elemento of elementos) {
        const rutaCompleta = path.join(directorio, elemento.name);

        if (elemento.isDirectory()) {
            const archivosCarpeta = await obtenerArchivosRecursivos(
                rutaCompleta
            );

            archivos.push(...archivosCarpeta);
        } else if (elemento.isFile()) {
            archivos.push(rutaCompleta);
        }
    }

    return archivos;
};


const guardarArchivoRepositorio = async (req, res) => {
    const archivosSubidos = req.files || [];

    const limpiarTemporales = async () => {
        await Promise.all(
            archivosSubidos.map(async (archivo) => {
                try {
                    await fs.unlink(archivo.path);
                } catch (error) {
                    if (error.code !== "ENOENT") {
                        console.error("Error limpiando temporal:", error);
                    }
                }
            })
        );
    };

    if (archivosSubidos.length === 0) {
        return res.status(400).json({
            message: "Seleccioná al menos un archivo para subir"
        });
    }

    try {
        const idRepo = Number(req.params.id);

        const idCommit = req.commit.id_commit;
        const idCommitPadre = req.commit.id_commit_padre;

        const directorioRepo = path.join(
            __dirname,
            "../uploads/repos",
            String(idRepo)
        );

        const directorioNuevo = path.join(
            directorioRepo,
            String(idCommit)
        );

        // 1. Creamos la carpeta del nuevo commit.
        await fs.mkdir(directorioNuevo, {
            recursive: true
        });

        // 2. Copiamos todos los archivos del commit anterior.
        if (idCommitPadre) {
            const directorioPadre = path.join(
                directorioRepo,
                String(idCommitPadre)
            );

            await fs.cp(directorioPadre, directorioNuevo, {
                recursive: true,
                force: true
            });
        }

        // 3. Validamos las rutas recibidas desde el frontend.
        const rutas = Array.isArray(req.body.rutas)
            ? req.body.rutas
            : [req.body.rutas];

        if (
            rutas.length !== archivosSubidos.length ||
            rutas.some(ruta => typeof ruta !== "string")
        ) {
            await limpiarTemporales();

            return res.status(400).json({
                message: "La estructura de archivos recibida no es válida"
            });
        }

        // 4. Reemplazamos o agregamos los archivos subidos.
        for (let i = 0; i < archivosSubidos.length; i++) {
            const archivo = archivosSubidos[i];

            const rutaNormalizada = rutas[i].replace(/\\/g, "/");

            const segmentos = rutaNormalizada.split("/");

            if (
                !rutaNormalizada ||
                rutaNormalizada.startsWith("/") ||
                /^[a-zA-Z]:/.test(rutaNormalizada) ||
                segmentos.some(segmento =>
                    !segmento ||
                    segmento === "." ||
                    segmento === ".."
                )
            ) {
                throw new Error(
                    "La ruta relativa de uno de los archivos no es válida"
                );
            }

            const directorios = segmentos
                .slice(0, -1)
                .map(segmento =>
                    segmento.replace(/[<>:"|?*\x00-\x1f]/g, "_")
                );

            const nombreOriginal = segmentos[segmentos.length - 1]
                .replace(/[<>:"/\\|?*\x00-\x1f]/g, "_")
                .slice(0, 120) || "archivo";

            const rutaLogica = [
                ...directorios,
                nombreOriginal
            ].join("/");

            const destinoFinal = path.join(
                directorioNuevo,
                ...rutaLogica.split("/")
            );

            await fs.mkdir(path.dirname(destinoFinal), {
                recursive: true
            });

            // Si ya existía, lo reemplazamos.
            await fs.copyFile(archivo.path, destinoFinal);

            // Eliminamos el archivo temporal de Multer.
            await fs.unlink(archivo.path);
        }

        // 5. Buscamos TODOS los archivos del nuevo commit.
        const archivosFisicos = await obtenerArchivosRecursivos(
            directorioNuevo
        );

        const versionesParaGuardar = [];

        // 6. Registramos todos los archivos en la base de datos.
        for (const rutaCompleta of archivosFisicos) {

            // Convertimos la ruta física en una ruta relativa.
            const rutaLogica = path.relative(
                directorioNuevo,
                rutaCompleta
            ).split(path.sep).join("/");

            // Buscamos si este archivo ya existe en el repositorio.
            const [registro] = await Archivos.findOrCreate({
                where: {
                    id_repo: idRepo,
                    ruta: rutaLogica
                },
                defaults: {
                    id_repo: idRepo,
                    ruta: rutaLogica
                }
            });

            // Preparamos su versión para este commit.
            versionesParaGuardar.push({
                id_commit: idCommit,
                id_archivo: registro.id_archivo,
                tipo: path.extname(rutaLogica).toLowerCase(),
                ruta_fisica: `repos/${idRepo}/${idCommit}/${rutaLogica}`
            });
        }

        // 7. Guardamos todas las versiones juntas.
        if (versionesParaGuardar.length > 0) {
            await versionesArchivos.bulkCreate(versionesParaGuardar);
        }

        return res.status(201).json({
            message: "Archivos guardados correctamente",
            cantidad: versionesParaGuardar.length,
            id_commit: idCommit
        });

    } catch (error) {
        await limpiarTemporales();

        console.error(
            "Error al guardar archivos del repositorio:",
            error
        );

        const esRutaInvalida =
            error.message ===
            "La ruta relativa de uno de los archivos no es válida";

        return res.status(esRutaInvalida ? 400 : 500).json({
            message: esRutaInvalida
                ? error.message
                : "No se pudieron guardar los archivos"
        });
    }
};



module.exports = {
    crearRepositorio,
    consultarRepositorios,
    traerRepos,
    validarRepositorio,
    guardarArchivoRepositorio,
    traerColaboradores,
    traerInformacionRepositorios,
    traerReposUsers
}