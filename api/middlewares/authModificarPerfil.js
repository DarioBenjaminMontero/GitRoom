const jwt = require ('jsonwebtoken')
const SECRET = 'Ranas_Todas_Flacas_Musculosas'


const authModificarPerfil = (req,res,next) =>{
    const tokenPerfil = req.headers['modificar']
    if(!tokenPerfil){
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {
            jwt.verify(tokenPerfil,SECRET,async (err,decoded)=>{
                
                if (err){
                     if (err.name === 'TokenExpiredError') {
                        
                        console.log("El token expiro")
                    }


                    return res.status(401).json({ message: 'Error al querer modificar el perfil', err })
                }

            next()

            })
        }
        catch (error){
            return res.status(500).json({ message: "Error interno en la autenticación" });
        }
};

module.exports = {authModificarPerfil}