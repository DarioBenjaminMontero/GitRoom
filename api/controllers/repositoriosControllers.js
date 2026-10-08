const { repositorios } = require("../models/index.js")
const { UsuariosRepositorios } = require("../models/index.js")

const crearRepositorio = async (req, res) => {
    let id_usuario = req.user.id
    let es_privado = req.user.visibilidadRepositorio
    let descripcion = req.user.descripcionRepositorio
    let nombre_repo = req.user.nombreRepositorio
    let id_clase = ""
    let id_repo = ""
    if (req.user.id_clase) {
        id_clase = req.user.id_clase
    }
    const respuesta = await repositorios.create({
        es_privado: es_privado,
        descripcion: descripcion,
        nombre_repo: nombre_repo,
        id_clase: id_clase || null
    })
    if (respuesta) {
        id_repo = respuesta.id_repo
        const respuesta2 = await UsuariosRepositorios.create({
            id_usuario: id_usuario,
            id_repo: id_repo,
            rol_Colaborador: true
        })
        if (respuesta2) {
            return res.status(201).json({ message: "creado" })
        }
        else {
            return res.status(500).json({ message: "error del servidor" })
        }
    }
}


const consultarRepositorios = async(req, res) =>{
const id = req.user.id
const nombreRepositorio = req.user.nombreRepositorio
try{
const respuesta = await repositorios.findOne({
where:{
nombre_repo : nombreRepositorio
}, include : {
model : UsuariosRepositorios, 
where : {
id_usuario : id
},
required : true
}

})
return res.status(200).json({ exists: !!respuesta });
}
catch(error){

return res.status(500).json({ error: "Error en el servidor", details: error.message });
}
}

module.exports = { crearRepositorio, consultarRepositorios }