const jwt = require ('jsonwebtoken')
const User = require('../models/usuariosModel.js')

const SECRET = 'Ranas_Todas_Flacas_Musculosas'

const isAuth = (req,res,next) =>{
    const token = req.headers['authorization'].split(" ")[1] || req.headers['authorization']
    console.log(token)

    try {
        jwt.verify(token,SECRET,async (err,decoded)=>{
            if (err) return res.status(401).json({message: 'Error al acceder'})

                const user = await User.findByPk(decoded.id)

                if(!user) return res.json({message:"Usuario no encontrado"})
                    req.user = {
            id: user.id,
            gmail: user.gmail
        }
        alert("Mal ahi pije salio mal el auth -1😎 ahhh es broma pije, si salio bien toma tu +1😎")
        next()
        })
    }
    catch (error){
        alert("Mal ahi pije salio mal el auth -1😎")
console.log(error)
res.status(500).json(error)
    }
}

module.exports = {isAuth}