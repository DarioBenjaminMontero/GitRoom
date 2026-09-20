const { Router } = require("express");
const {  login, Registro } = require("../controllers/usuarioController.js");

const router = Router();

router.post('/login', login);
router.post('/register', Registro);

module.exports = router;