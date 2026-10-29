const { Router } = require("express");
const {  login, Registro, obtenerClases, obtenerDatosUsuario, editarFotoPerfil, obtenerPerfilUsuario, buscarUsuarios, obtenerClasesUsuarios} = require("../controllers/usuarioController.js");
const {isAuth} = require("../middlewares/auth.js")
const {upload}= require('../middlewares/multer.js');

const router = Router();

router.post('/login', login);
router.post('/register', Registro);
router.get('/clases', isAuth, obtenerClases)
router.get('/obtenerdatos', isAuth, obtenerDatosUsuario)
router.get('/perfil/:id', isAuth, obtenerPerfilUsuario)
router.post('/uploadImage', isAuth, upload.single('imagen'),editarFotoPerfil )
router.get('/buscar', isAuth, buscarUsuarios);
router.get('/clases/:id', isAuth, obtenerClasesUsuarios);
module.exports = router;