const jwt = require ('jsonwebtoken')
const { usuarios } = require('../models/usuariosModel.js')

const SECRET = 'Ranas_Todas_Flacas_Musculosas'

const isAuth = (req,res,next) =>{
    const token = req.headers['authorization'].split(" ")[1] || req.headers['authorization']
    console.log(token)

    try {
        jwt.verify(token,SECRET,async (err,decoded)=>{
            
            if (err){
                 if (err.name === 'TokenExpiredError') {
                    
                    console.log("El token expiro")
                }
                return res.status(401).json({ message: 'Error al acceder', err })
            
             return res.status(401).json({message: 'Error al acceder',err})
            }

                const user = await usuarios.findByPk(decoded.id)

                if(!user) return res.json({message:"Usuario no encontrado"})
                   

            req.user = {
            id: user.id_usuario,
            gmail: user.gmail
            }

            
        
        next()
        })
    }
    catch (error){
        return res.status(500).json({ message: "Error interno en la autenticación" });
    }
}

module.exports = {isAuth}