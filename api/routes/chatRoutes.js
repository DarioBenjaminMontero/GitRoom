const { Router } = require("express");
const {  unirseChat,crearChat,mandarMensaje } = require("../controllers/chatsControllers.js");
const {isAuth} = require("../middlewares/auth.js")

const router = Router();

router.post('/mensaje', isAuth, mandarMensaje);

module.exports = router;