const { repositorios, UsuariosRepositorios, Archivos } = require("../models/index.js")
const fs = require("fs/promises")

const validarRepositorio = async (req, res, next) => {
    try {
        const id_repo = Number(req.params.id)
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
        next()
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


        if(existeRepo){
return res.status(400).json({message: "ya existe"})
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



const consultarRepositorios = async(req, res) =>{
const id = req.user.id
const nombreRepositorio = req.user.nombreRepositorio
try{
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
catch(error){


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
            }
        })
        return res.status(200).json(respuesta)
    } catch (error) {
        return res.status(500).json({ error: "Error en el servidor", details: error.message })
    }
}

const guardarArchivoRepositorio = async (req, res) => {
    if (!req.files?.length) {
        return res.status(400).json({ message: "Seleccioná al menos un archivo para subir" })
    }

    try {
        // Registra juntos los archivos que Multer ya guardó en disco.
        const archivos = await Archivos.bulkCreate(req.files.map((file) => ({
            ruta: file.filename,
            id_repo: Number(req.params.id)
        })))
        return res.status(201).json({
            archivos: archivos.map((archivo, index) => ({
                id_archivo: archivo.id_archivo,
                nombre: req.files[index].filename.split("--").slice(1).join("--")
            }))
        })
    } catch (error) {
        // Borra los archivos del disco si no se pudieron registrar en la base.
        await Promise.all(req.files.map((file) =>
            fs.unlink(file.path).catch((cleanupError) => {
                if (cleanupError.code !== "ENOENT") {
                    console.error("No se pudo limpiar el archivo subido:", cleanupError)
                }
            })
        ))
        console.error("Error al guardar archivo del repositorio:", error)
        return res.status(500).json({ message: "No se pudo guardar el archivo" })
    }
}

module.exports = {
    crearRepositorio,
    consultarRepositorios,
    traerRepos,
    validarRepositorio,
    guardarArchivoRepositorio
}