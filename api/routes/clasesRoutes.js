const { Router } = require("express");
const {  create,unirseClase,buscarimagen } = require("../controllers/clasesController.js");
const { create: createAnuncio, createComment, obtenerAnuncio } = require("../controllers/anunciosControllers.js");
const {isAuth} = require("../middlewares/auth.js")
const {authJoinClass} = require("../middlewares/authJoinClass.js")
const router = Router();
router.post('/anun/:idclase',isAuth,buscarimagen);
router.post('/crear', isAuth,create);
router.post('/unirse',authJoinClass, unirseClase);
router.post('/:idClase/anuncios', isAuth, createAnuncio);
router.post('/anuncios/:idAnuncio/comentarios', isAuth, createComment);
router.post('/anuncio/:idclase',isAuth,obtenerAnuncio)
router.post('/anunci/:idAnuncio',isAuth,obtenerAnuncio)
module.exports = router;