const { usuarios } = require("../models/index.js")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Ranas_Todas_Flacas_Musculosas'; 
const Registro = async(req, res)=>{

const { nombre, contraseña, año_division, apellido, mail } = req.body

const contraseñaHasheada = await bcrypt.hash(contraseña, 10)
try{
const usuario = usuarios.create({
    nombre, 
    mail, 
    apellido,
    contraseña :contraseñaHasheada,
    año_division
})

res.status(201).json({message: "Usuario creado"})
}
catch(error){

res.status(500).json({error: "error en el servidor", detalles: error.message})

}
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Busca el mail del usuario
        const user = await usuarios.findOne({ where: { mail:email } });
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
    login, Registro
};