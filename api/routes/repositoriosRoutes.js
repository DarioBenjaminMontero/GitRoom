const {
    crearRepositorio,
    consultarRepositorios,
    traerRepos,
    validarRepositorio,
    guardarArchivoRepositorio,traerColaboradores, traerInformacionRepositorios, traerReposUsers
} = require("../controllers/repositoriosControllers.js")
const {isAuthConsultaRepo, isAuthNuevoRepo} = require("../middlewares/authNewRepository.js")
const {isAuth} = require("../middlewares/auth.js")
const {isAuthRepository} = require("../middlewares/authRepository.js")
const { manejarUploadArchivo } = require("../middlewares/multer.js")
const express = require("express")
const router = express.Router()
router.get("/nombreRepositorioExiste", isAuthConsultaRepo, consultarRepositorios)
router.post("/crearRepositorio", isAuthNuevoRepo, crearRepositorio)
router.get("/traerRepos",  isAuth, traerRepos)
router.get("/conseguirInformacionRepositorio/:idRepo", isAuthRepository, traerInformacionRepositorios)
router.get("/conseguirColaboradores/:idRepo", isAuthRepository,traerColaboradores)
router.get("/traerReposUsers/:id", isAuth, traerReposUsers)
// Valida acceso antes de que Multer escriba los archivos.
router.post("/:id/archivos", isAuth, validarRepositorio, manejarUploadArchivo, guardarArchivoRepositorio)

module.exports = router