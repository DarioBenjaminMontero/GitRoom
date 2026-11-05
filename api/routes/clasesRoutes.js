const { Router } = require("express");
const {  create,unirseClase,buscarimagen } = require("../controllers/clasesController.js");
const { create: createAnuncio, createComment, obtenerAnuncio, obtenerComentarios } = require("../controllers/anunciosControllers.js");
const { validarEntrega, guardarEntrega, obtenerMiEntrega, descargarArchivoEntrega } = require("../controllers/entregasController.js");
const { manejarUploadEntrega } = require("../middlewares/multer.js");
const {isAuth} = require("../middlewares/auth.js")
const{manejarUploadAnuncio}=require("../middlewares/multeranunciocreado.js")
const {authJoinClass} = require("../middlewares/authJoinClass.js")
const router = Router();
router.post('/anun/:idclase',isAuth,buscarimagen);
router.post('/crear', isAuth,create);
router.post('/unirse',authJoinClass, unirseClase);
router.post('/:idClase/anuncios', isAuth, manejarUploadAnuncio, createAnuncio); // Crear publicación
router.post('/anuncios/:idAnuncio/comentarios', isAuth, createComment); // Crear comentario
router.get('/anuncios/:idAnuncio/comentarios', isAuth, obtenerComentarios); // Listar comentarios
router.post('/anuncios/:idAnuncio/entregas', isAuth, validarEntrega, manejarUploadEntrega, guardarEntrega); // Entregar o reemplazar entrega
router.get('/anuncios/:idAnuncio/entregas/mia', isAuth, obtenerMiEntrega); // Ver mi entrega
router.get('/entregas/archivos/:idArchivo', isAuth, descargarArchivoEntrega); // Descargar archivo de entrega
router.post('/anuncio/:idclase',isAuth,obtenerAnuncio)
router.post('/anunci/:idAnuncio',isAuth,obtenerAnuncio) // Ver una publicación
module.exports = router;