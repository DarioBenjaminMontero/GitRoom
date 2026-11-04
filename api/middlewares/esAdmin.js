

const isAdmin = (req,res,next) =>{

    try {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
        }
        
        
        
    }
    catch (error){
        return res.status(500).json({ message: "Error interno en la autenticación" });
    }
}

module.exports = {isAdmin}