const { Router } = require("express");
const { traerCommits } = require("../controllers/commitsControllers.js");
const { isAuth } = require("../middlewares/auth.js");
const { validarRepositorio } = require("../controllers/repositoriosControllers.js");

const router = Router();

router.get("/repositorio/:idRepo", isAuth, validarRepositorio, traerCommits);

module.exports = router