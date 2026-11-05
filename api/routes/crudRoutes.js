const { Router } = require("express");
const {  buscarUsuariosCrud, obtenerUsuariosCrud,eliminarUsuarioCrud ,actualizarUsuarioCrud} = require("../controllers/crudControllers.js");
const {isAuth} = require("../middlewares/auth.js")
const {isAdmin} = require("../middlewares/esAdmin.js")

const router = Router();

router.post('/buscarUsuarios',isAuth,isAdmin,buscarUsuariosCrud)
router.get('/obtenerUsuarios',isAuth,isAdmin,obtenerUsuariosCrud)
router.delete('/eliminarUsuario/:id', isAuth,isAdmin, eliminarUsuarioCrud);
router.put('/actualizarUsuario/:id', isAuth,isAdmin, actualizarUsuarioCrud);

module.exports = router;