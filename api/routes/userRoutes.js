const { Router } = require("express");
const {  login, Registro, obtenerClases, obtenerDatosUsuario, editarFotoPerfil, obtenerPerfilUsuario } = require("../controllers/usuarioController.js");
const {isAuth} = require("../middlewares/auth.js")
const {upload}= require('../middlewares/multer.js');

const router = Router();

router.post('/login', login);
router.post('/register', Registro);
router.get('/clases', isAuth, obtenerClases)
router.get('/obtenerdatos', isAuth, obtenerDatosUsuario)
router.get('/perfil/:id', isAuth, obtenerPerfilUsuario)
router.post('/uploadImage', isAuth, upload.single('imagen'),editarFotoPerfil )
module.exports = router;