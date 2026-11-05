const jwt = require('jsonwebtoken');
const { usuarios } = require('../models/usuariosModel.js');
 
const SECRET = process.env.JWT_SECRET || 'Ranas_Todas_Flacas_Musculosas';
 
// Verifica el token del enlace de recuperación (header "recuperacion").
//
// El token se firma con SECRET + el hash actual de la contraseña del usuario.
// Por eso, apenas la contraseña cambia, el mismo enlace deja de funcionar:
// cada enlace sirve una sola vez.
const authRecuperacion = async (req, res, next) => {
    const token = req.headers['recuperacion'];
 
    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }
 
    try {
        // decode NO valida nada: solo lo usamos para saber de qué usuario es.
        // La validación real es el jwt.verify de más abajo.
        const payload = jwt.decode(token);
 
        if (!payload || payload.purpose !== 'recuperacion-contraseña') {
            return res.status(401).json({ message: 'Token de recuperación inválido.' });
        }
 
        const usuario = await usuarios.findByPk(payload.id);
 
        if (!usuario) {
            return res.status(401).json({ message: 'Token de recuperación inválido.' });
        }
 
        jwt.verify(token, SECRET + usuario.contraseña, { algorithms: ['HS256'] });
        //el algorithms sirve para verificar el token con un secret que solo conoce el sistema, es como una whitelist,
        //  si el token no fue generado con ese algoritmo, no se valida


        req.usuarioRecuperacion = usuario;
        next();
    } catch (error) {
        const errorDeToken = ['TokenExpiredError', 'JsonWebTokenError', 'NotBeforeError'].includes(error.name);
 
        if (errorDeToken) {
            return res.status(401).json({ message: 'El enlace venció o no es válido.' });
        }
 
        console.error('Error en authRecuperacion:', error);
        return res.status(500).json({ message: 'Error interno en la autenticación' });
    }
};
 
module.exports = { authRecuperacion };