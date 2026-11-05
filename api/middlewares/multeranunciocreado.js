const multer = require("multer")
const path = require("path")
const crypto = require("crypto")
const fs = require("fs")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/anuncios/'))
    },
    filename: (req, file, cb) => {
        const userId = req.user.id
        cb(null, `user-${userId}${path.extname(file.originalname)}`);
    }
})

const repositoryStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const destination = path.join(__dirname, "../uploads/repos", req.params.id)
        fs.mkdir(destination, { recursive: true }, (error) => cb(error, destination))
    },
    filename: (req, file, cb) => {
        const nombre = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "archivo"
        cb(null, `${crypto.randomUUID()}--${nombre}`)
    }
})

// === NUEVO: Configuración para guardar temporalmente el archivo del anuncio antes de moverlo ===
const anuncioTempStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const tempDir = path.join(__dirname, '../uploads/anuncios/');
        fs.mkdir(tempDir, { recursive: true }, (error) => cb(error, tempDir));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploadAnuncioConArchivo = multer({ 
    storage: anuncioTempStorage,
    limits: { fileSize: 25 * 1024 * 1024 } // Opcional: límite de 25MB
}).single('archivo'); // Debe coincidir con formData.append('archivo', archivos) del frontend

const manejarUploadAnuncio = (req, res, next) => {
    uploadAnuncioConArchivo(req, res, (error) => {
        if (!error) return next();
        if (!(error instanceof multer.MulterError)) {
            console.error("Error al subir archivo:", error);
            return res.status(500).json({ message: "No se pudo subir el archivo." });
        }
        return res.status(error.code === "LIMIT_FILE_SIZE" ? 413 : 400).json({ message: error.message });
    });
};
// ===================================================================================

const uploadanuncio = multer({ storage: storage });

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

// No olvides exportar la nueva función al final:
module.exports = { 
    uploadanuncio, 
    manejarUploadArchivo, 
    manejarUploadAnuncio 
}