const { Router } = require("express");
const { traerTodosLosArchivos } = require("../controllers/archivosControllers.js")
const { isAuth } = require("../middlewares/auth.js")
const { validarRepositorio } = require("../controllers/repositoriosControllers.js")

const router = Router();

router.get('/repositorio/:id_repo/traerArchivos', isAuth, validarRepositorio, traerTodosLosArchivos)

module.exports = router