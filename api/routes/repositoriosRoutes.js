const {crearRepositorio, consultarRepositorios} = require("../controllers/repositoriosControllers.js")
const {isAuthConsultaRepo, isAuthNuevoRepo} = require("../middlewares/authNewRepository.js")
const express = require("express")
const router = express.Router()
router.get("/nombreRepositorioExiste", isAuthConsultaRepo, consultarRepositorios)
router.post("/crearRepositorio", isAuthNuevoRepo, crearRepositorio)

module.exports = router