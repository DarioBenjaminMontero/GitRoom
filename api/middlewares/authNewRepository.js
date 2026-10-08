const jwt = require ('jsonwebtoken')
const { usuarios } = require('../models/usuariosModel.js')

const SECRET = 'Ranas_Todas_Flacas_Musculosas'

const isAuthConsultaRepo = (req,res,next) =>{
    const token = req.headers['authorization'].split(" ")[1] || req.headers['authorization']
    console.log(token)
    const { nombre } = req.query
if(!nombre){
res.status(400).json({message: "falta el nombre del repositorio"})
return
}
    try {
        jwt.verify(token,SECRET,async (err,decoded)=>{
            if (err) return res.status(401).json({message: 'Error al acceder'})

                const user = await usuarios.findByPk(decoded.id)

                if(!user) return res.json({message:"Usuario no encontrado"})

            req.user = {
            id: user.id_usuario,
            nombreRepositorio: nombre
            }

            
        
        next()
        })
    }
    catch (error){
        return res.status(500).json({ message: "Error interno en la autenticación" });
    }
}

const isAuthNuevoRepo = (req, res, next) =>{

     const token = req.headers['authorization'].split(" ")[1] || req.headers['authorization']
    console.log(token)
    const { nombre, descripcion, visibilidad } = req.body;
if(!nombre){
res.status(400).json({message: "falta el nombre del repositorio"})
return
}
if(!visibilidad){
res.status(400).json({message: "falta la visibilidad"})
return
}
    try {
        jwt.verify(token,SECRET,async (err,decoded)=>{
            if (err) return res.status(401).json({message: 'Error al acceder'})

                const user = await usuarios.findByPk(decoded.id)

                if(!user) return res.json({message:"Usuario no encontrado"})

                    const esPrivadoBooleano = visibilidad === 'private';
            req.user = {
            id: user.id_usuario,
            nombreRepositorio: nombre,
            descripcionRepositorio: descripcion,
            visibilidadRepositorio : esPrivadoBooleano
            }
        next()
        })
    }
    catch (error){
        return res.status(500).json({ message: "Error interno en la autenticación" });
    }

}

module.exports = {isAuthConsultaRepo, isAuthNuevoRepo}