const { usuarios } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'Ranas_Todas_Flacas_Musculosas'; 

const login = async (req, res) => {
    try {
        const { mail, password } = req.body;

        // Busca el mail del usuario
        const user = await usuarios.findOne({ where: { mail } });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Comparar la contraseña ingresada con la encriptada usando bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.contraseña);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Generar token JWT de 2 horas
        const token = jwt.sign(
            { id: user.id_usuario, username: user.nombre },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(200).json({
            message: "Login exitoso",
            token,
            user: { id: user.id_usuario, username: user.nombre }
        });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor", details: error.message });
    }
};

module.exports = {
    login
};