const {crearRepositorio, consultarRepositorios, traerRepos} = require("../controllers/repositoriosControllers.js")
const {isAuthConsultaRepo, isAuthNuevoRepo} = require("../middlewares/authNewRepository.js")
const {isAuth} = require("../middlewares/auth.js")
const express = require("express")
const router = express.Router()
router.get("/nombreRepositorioExiste", isAuthConsultaRepo, consultarRepositorios)
router.post("/crearRepositorio", isAuthNuevoRepo, crearRepositorio)
router.get("/traerRepos",  isAuth, traerRepos)

module.exports = router