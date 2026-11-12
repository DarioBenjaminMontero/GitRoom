const {
    crearRepositorio,
    consultarRepositorios,
    traerRepos,
    validarRepositorio,
    guardarArchivoRepositorio,traerColaboradores, traerInformacionRepositorios, traerReposUsers
} = require("../controllers/repositoriosControllers.js")
const {isAuthConsultaRepo, isAuthNuevoRepo} = require("../middlewares/authNewRepository.js")
const {isAuth} = require("../middlewares/auth.js")
const { manejarUploadArchivo, crearCommit } = require("../middlewares/multer.js")
const express = require("express")
const router = express.Router()
router.get("/nombreRepositorioExiste", isAuthConsultaRepo, consultarRepositorios)
router.post("/crearRepositorio", isAuthNuevoRepo, crearRepositorio)
router.get("/traerRepos",  isAuth, traerRepos)
router.get("/conseguirInformacionRepositorio/:idRepo", isAuth, validarRepositorio, traerInformacionRepositorios)
router.get("/conseguirColaboradores/:idRepo", isAuth, validarRepositorio, traerColaboradores)
router.get("/traerReposUsers/:id", isAuth, traerReposUsers)

router.post(
    "/:id/archivos",
    isAuth,
    validarRepositorio,
    crearCommit,
    manejarUploadArchivo,
    guardarArchivoRepositorio
);

module.exports = router