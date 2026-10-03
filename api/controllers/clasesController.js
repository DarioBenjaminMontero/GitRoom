
const { clases } = require("../models/index.js")
const { clasesUsuarios } = require("../models/index.js")

const create = async (req, res) => {
    const { idUsuario, nombreClase } = req.body;
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

module.exports = { create };

