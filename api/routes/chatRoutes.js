const { Router } = require("express");
const {  unirseChat,crearChat,mandarMensaje ,cargarChats,cargarMensajes} = require("../controllers/chatsControllers.js");
const {isAuth} = require("../middlewares/auth.js")

const router = Router();

router.get('/cargarChats',isAuth,cargarChats)
router.post('/cargarMensajes',isAuth,cargarMensajes)
router.post('/mensaje', isAuth, mandarMensaje);

module.exports = router;