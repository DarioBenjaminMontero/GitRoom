const { Router } = require("express");
const {  login, Registro, obtenerClases, obtenerDatosUsuario } = require("../controllers/usuarioController.js");
const {isAuth} = require("../middlewares/auth.js")

const router = Router();

router.post('/login', login);
router.post('/register', Registro);
router.get('/clases', isAuth, obtenerClases)
router.get('/obtenerdatos', isAuth, obtenerDatosUsuario)

module.exports = router;