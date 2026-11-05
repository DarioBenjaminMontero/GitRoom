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
        const destination = path.join(
            __dirname,
            "../uploads/repos",
            String(req.params.id)
        );
        fs.mkdir(
            destination,
            { recursive: true },
            error => cb(error, destination)
        );
    },
    filename: (req, file, cb) => {
        const nombre = path.basename(file.originalname)
            .replace(/[<>:"/\\|?*\x00-\x1f]/g, "_")
            .slice(0, 120) || "archivo";
        cb(null, `${crypto.randomUUID()}--${nombre}`);
    }
});

const upload = multer({ storage: storage });
const subirArchivos = multer({
    storage: repositoryStorage,
    limits: {
        fileSize: 50 * 1024 * 1024,
        files: 500
    }
}).array("archivos", 500);

const manejarUploadArchivo = (req, res, next) => {
    subirArchivos(req, res, (error) => {
        if (!error) return next();

        if (!(error instanceof multer.MulterError)) {
            console.error("Error al subir archivo:", error);
            return res.status(500).json({
                message: "No se pudo subir el archivo."
            });
        }

        return res.status(
            error.code === "LIMIT_FILE_SIZE" ? 413 : 400
        ).json({
            message: error.code === "LIMIT_FILE_SIZE"
                ? "Cada archivo puede pesar hasta 50 MB."
                : error.code === "LIMIT_FILE_COUNT"
                    ? "Podés subir hasta 500 archivos por carga."
                    : error.message
        });
    });
};

const DIRECTORIO_UPLOADS = path.join(__dirname, "../uploads")

const EXTENSIONES_ENTREGA = new Set([
    // Documentos
    ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".odt", ".ods", ".odp", ".txt", ".md", ".csv",
    // Imágenes
    ".png", ".jpg", ".jpeg", ".gif", ".webp",
    // Comprimidos
    ".zip", ".rar", ".7z",
    // Código fuente
    ".js", ".jsx", ".ts", ".tsx", ".html", ".css", ".json", ".py", ".java", ".c", ".cpp", ".h", ".cs", ".php", ".sql"
])

const entregaStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const destination = path.join(
            DIRECTORIO_UPLOADS,
            "entregas",
            `anuncio-${req.anuncio.id_anuncio}`,
            `alumno-${req.user.id}`
        )
        fs.mkdir(destination, { recursive: true }, (error) => cb(error, destination))
    },
    filename: (req, file, cb) => {
        cb(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`)
    }
})

const subirEntrega = multer({
    storage: entregaStorage,
    defParamCharset: "utf8",
    limits: { fileSize: 25 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (EXTENSIONES_ENTREGA.has(path.extname(file.originalname).toLowerCase())) return cb(null, true)
        const error = new Error(`El tipo de archivo de "${file.originalname}" no está permitido.`)
        error.tipoNoPermitido = true
        cb(error)
    }
}).array("archivos", 10)

const manejarUploadEntrega = (req, res, next) => {
    subirEntrega(req, res, (error) => {
        if (!error) return next()
        if (error.tipoNoPermitido) return res.status(415).json({ message: error.message })
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({ message: "Cada archivo puede pesar hasta 25 MB." })
        }
        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({ message: "Podés subir hasta 10 archivos por entrega." })
        }
        console.error("Error al subir la entrega:", error)
        return res.status(500).json({ message: "No se pudo subir la entrega." })
    })
}

module.exports = { 
    upload, 
    manejarUploadArchivo, 
    manejarUploadEntrega, 
    DIRECTORIO_UPLOADS 
};