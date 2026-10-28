const { Router } = require("express");
const {  create,unirseClase } = require("../controllers/clasesController.js");
const { create: createAnuncio, createComment } = require("../controllers/anunciosControllers.js");
const {isAuth} = require("../middlewares/auth.js")
const {authJoinClass} = require("../middlewares/authJoinClass.js")
const router = Router();

router.post('/crear', isAuth,create);
router.post('/unirse',authJoinClass, unirseClase);
router.post('/:idClase/anuncios', isAuth, createAnuncio);
router.post('/anuncios/:idAnuncio/comentarios', isAuth, createComment);

module.exports = router;