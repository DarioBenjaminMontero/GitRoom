const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const idAnuncio = req.params.idAnuncio;
        const userId = req.user.id;
        
        const destination = path.join(__dirname, '../uploads/entregas', `anuncio-${idAnuncio}`, `usuario-${userId}`);
        
        fs.mkdir(destination, { recursive: true }, (error) => cb(error, destination));
    },
    filename: (req, file, cb) => {
        const nombreLimpio = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
        cb(null, `${Date.now()}-${nombreLimpio}`);
    }
});

const uploadEntrega = multer({ 
    storage: storage,
    limits: { fileSize: 25 * 1024 * 1024 } // Límite de 25 MB
}).array('archivos', 10);

module.exports = { uploadEntrega };