const { usuarios } = require("../models/index.js")
const {repositorios} = require("../models/index.js")
const { UsuariosRepositorios } = require("../models/index.js")
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

const crearRepositorio = async(req, res) =>{
let id_usuario= req.user.id_usuario
let es_privado = req.user.es_privado
let descripcion = req.user.descripcion
let nombre_repo = req.user.nombre_repo
let id_clase = ""
let id_repo = ""
if(req.user.id_clase){
id_clase = req.user.id_clase
}
const respuesta = await repositorios.create({
es_privado : es_privado,
descripcion : descripcion,
nombre_repo : nombre_repo,
id_clase : id_clase ? id_clase : ""
})
if(respuesta){
id_repo = respuesta.id_repo
const respuesta2 = await UsuariosRepositorios.create({
id_usuario: id_usuario,
id_repo : id_repo,
rol_Colaborador: true
})
if(respuesta2){
return res.status(201).json({message: "creado"})
}
else {
    return res.status(500).json({message: "error del servidor"})
}
}
}
module.exports = {
    login, Registro, crearRepositorio
};