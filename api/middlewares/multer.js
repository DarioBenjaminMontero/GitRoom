const multer = require("multer")
const path = require("path")
const crypto = require("crypto")
const fs = require("fs")

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, path.join(__dirname, '../uploads'))

    },
    filename: (req, file, cb) => {

        const userId = req.user.id
        
        cb(null, `user-${userId}${path.extname(file.originalname)}`);

    }

})

const repositoryStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const destination = path.join(__dirname, "../uploads/repos", req.params.id)
        // Crea el directorio del repositorio si todavía no existe.
        fs.mkdir(destination, { recursive: true }, (error) => cb(error, destination))
    },
    filename: (req, file, cb) => {
        const nombre = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "archivo"
        // El identificador evita colisiones entre archivos con el mismo nombre.
        cb(null, `${crypto.randomUUID()}--${nombre}`)
    }
})

const upload = multer({ storage: storage });
// Recibe hasta 10 archivos en el campo "archivos", con un máximo de 25 MB cada uno.
const subirArchivos = multer({
    storage: repositoryStorage,
    limits: { fileSize: 25 * 1024 * 1024 }
}).array("archivos", 10)

const manejarUploadArchivo = (req, res, next) => {
    subirArchivos(req, res, (error) => {
        if (!error) return next()
        if (!(error instanceof multer.MulterError)) {
            console.error("Error al subir archivo:", error)
            return res.status(500).json({ message: "No se pudo subir el archivo." })
        }
        return res.status(error.code === "LIMIT_FILE_SIZE" ? 413 : 400).json({ message: error.message })
    })
}

module.exports = { upload, manejarUploadArchivo }