const { clases } = require("../models/index.js")
const { clasesUsuarios } = require("../models/index.js")

const create = async (req, res) => {
    const { nombreClase } = req.body;
    const idUsuario = req.user.id
    let existe = true;
    let codigo;

    try {
        do {
            const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            codigo = '';

            for (let i = 0; i < 6; i++) {
                const aleatorio = Math.floor(Math.random() * caracteres.length);
                codigo += caracteres.charAt(aleatorio);
            }

            const claseExistente = await clases.findOne({ where: { codigo } });
            if (!claseExistente){
                existe = false
            }
        } while (existe == true);

        const nuevaClase = await clases.create({ nombreClase, codigo });
        await clasesUsuarios.create({
            id_clase: nuevaClase.id_clase,
            id_usuario: idUsuario,
            esProfesor: true
        });

        return res.status(201).json({ message: "Clase creada", clase: nuevaClase });
    } catch (error) {
        return res.status(500).json({ error: "Error en el servidor", detalles: error.message });
    }
}
const unirseClase = async (req, res) =>{

try {
const codigo = req.user.codigo
  const claseExistente = await clases.findOne({ where: { codigo } });
  if(!claseExistente){
    return res.status(404).json({message:"no se encontro una clase con ese codigo"})
  }
  else{
    const userId = req.user.id
   
    await clasesUsuarios.create({
            id_clase: claseExistente.id_clase,
            id_usuario: userId,
            esProfesor: false
        });
        return res.status(201).json({ message: "Te uniste con exito a la clase", clase: claseExistente.nombreClase });
  }

}
catch (error) {
    return res.status(500).json({ error: "Error en el servidor", detalles: error.message });
}

}

module.exports = { create, unirseClase };