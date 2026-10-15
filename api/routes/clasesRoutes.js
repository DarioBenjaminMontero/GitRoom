const { Router } = require("express");
const { create, unirseClase, obtenerAnunciosClase } = require("../controllers/clasesController.js");
const { create: createAnuncio } = require("../controllers/anunciosControllers.js");
const { isAuth } = require("../middlewares/auth.js");

const router = Router();

router.post('/crear', isAuth, create);
router.post('/unirse', isAuth, unirseClase);
router.post('/:idClase/anuncios', isAuth, createAnuncio);
router.get('/:idClase/anuncios', isAuth, obtenerAnunciosClase);

module.exports = router;
