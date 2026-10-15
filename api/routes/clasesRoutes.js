const { Router } = require("express");
const {  create,unirseClase } = require("../controllers/clasesController.js");
const { create: createAnuncio } = require("../controllers/anunciosController.js");
const {isAuth} = require("../middlewares/auth.js")

const router = Router();

router.post('/crear', isAuth,create);
router.post('/unirse',isAuth, unirseClase);
router.post('/:idClase/anuncios', isAuth, createAnuncio);


module.exports = router;