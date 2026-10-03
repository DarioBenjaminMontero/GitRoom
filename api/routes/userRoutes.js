const { Router } = require("express");
const {  login, Registro } = require("../controllers/usuarioController.js");
const {isAuth} = require("../middlewares/auth.js")

const router = Router();

router.post('/login', login);
router.post('/register', Registro);

module.exports = router;