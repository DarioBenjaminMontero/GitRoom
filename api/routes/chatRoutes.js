const { Router } = require("express");
const {  unirseChat,crearChat,mandarMensaje ,cargarChats,cargarMensajes} = require("../controllers/chatsControllers.js");
const {isAuth} = require("../middlewares/auth.js")
const { buscarUsuarios, crearGrupo, cargarMiembros } = require("../controllers/gruposControllers.js");

const router = Router();

router.get('/cargarChats',isAuth,cargarChats)
router.post('/cargarMensajes',isAuth,cargarMensajes)
router.post('/mensaje', isAuth, mandarMensaje);
router.post('/crear', isAuth, crearChat);
router.get('/buscarUsuarios', isAuth, buscarUsuarios);
router.post('/crearGrupo', isAuth, crearGrupo);
router.post('/cargarMiembros', isAuth, cargarMiembros);

module.exports = router;