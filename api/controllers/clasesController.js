const {
    clases,
    clasesUsuarios,
    repositorios,
    UsuariosRepositorios
} = require("../models/index.js");
const { sequelize } = require("../config/db.js");

const sincronizarRepositorioClase = async (clase, transaction) => {
    let repositorioClase = await repositorios.findOne({
        where: { id_clase: clase.id_clase },
        transaction
    });

    if (!repositorioClase) {
        repositorioClase = await repositorios.create({
            nombre_repo: `${clase.nombreClase} (clase)`,
            descripcion: `Repositorio compartido de la clase ${clase.nombreClase}`,
            es_privado: true,
            id_clase: clase.id_clase
        }, { transaction });
    }

    const miembros = await clasesUsuarios.findAll({
        where: { id_clase: clase.id_clase },
        transaction
    });

    for (const miembro of miembros) {
        const [relacion, creada] = await UsuariosRepositorios.findOrCreate({
            where: {
                id_usuario: miembro.id_usuario,
                id_repo: repositorioClase.id_repo
            },
            defaults: {
                rol_Colaborador: miembro.esProfesor
            },
            transaction
        });

        if (!creada && relacion.rol_Colaborador !== miembro.esProfesor) {
            await relacion.update({
                rol_Colaborador: miembro.esProfesor
            }, { transaction });
        }
    }

    return repositorioClase;
};

const create = async (req, res) => {
    const nombreClase = typeof req.body.nombreClase === "string"
        ? req.body.nombreClase.trim()
        : "";

    try {
        if (!nombreClase) {
            return res.status(400).json({
                message: "El nombre de la clase es obligatorio"
            });
        }

        const resultado = await sequelize.transaction(async (transaction) => {
            let codigo;
            let codigoDisponible = false;

            while (!codigoDisponible) {
                const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                codigo = Array.from({ length: 6 }, () =>
                    caracteres.charAt(Math.floor(Math.random() * caracteres.length))
                ).join("");

                const claseExistente = await clases.findOne({
                    where: { codigo },
                    transaction
                });
                codigoDisponible = !claseExistente;
            }

            const nuevaClase = await clases.create(
                { nombreClase, codigo },
                { transaction }
            );
            await clasesUsuarios.create({
                id_clase: nuevaClase.id_clase,
                id_usuario: req.user.id,
                esProfesor: true
            }, { transaction });

            const repositorioClase = await sincronizarRepositorioClase(
                nuevaClase,
                transaction
            );

            return { clase: nuevaClase, repositorio: repositorioClase };
        });

        return res.status(201).json({
            message: "Clase y repositorio compartido creados",
            ...resultado
        });
    } catch (error) {
        console.error("Error al crear la clase y su repositorio:", error);
        return res.status(500).json({
            message: "No se pudo crear la clase y su repositorio"
        });
    }
}
const buscarimagen=async(req,res)=>{
    const id_clase=req.params.idclase
    try{
        const imagen=await clases.findOne({where:{id_clase}})
        return res.status(201).json({ message: "imagen encontrada", imagen });
    }
    catch(error){
        return res.status(500).json({ error: "Error en el servidor", detalles: error.message });
    }
    
}
const unirseClase = async (req, res) =>{
    const codigo = typeof req.user.codigo === "string"
        ? req.user.codigo.trim()
        : "";

    try {
        if (!codigo) {
            return res.status(400).json({
                message: "El código de la clase es obligatorio"
            });
        }

        const resultado = await sequelize.transaction(async (transaction) => {
            const claseExistente = await clases.findOne({
                where: { codigo },
                transaction
            });

            if (!claseExistente) return null;

            const [, creada] = await clasesUsuarios.findOrCreate({
                where: {
                    id_clase: claseExistente.id_clase,
                    id_usuario: req.user.id
                },
                defaults: {
                    esProfesor: false
                },
                transaction
            });

            const repositorioClase = await sincronizarRepositorioClase(
                claseExistente,
                transaction
            );

            return {
                clase: claseExistente,
                repositorio: repositorioClase,
                yaEraMiembro: !creada
            };
        });

        if (!resultado) {
            return res.status(404).json({
                message: "No se encontró una clase con ese código"
            });
        }

        return res.status(resultado.yaEraMiembro ? 200 : 201).json({
            message: resultado.yaEraMiembro
                ? "Ya pertenecías a esta clase"
                : "Te uniste con éxito a la clase",
            clase: resultado.clase.nombreClase,
            id_clase: resultado.clase.id_clase,
            repositorio: {
                id_repo: resultado.repositorio.id_repo,
                nombre_repo: resultado.repositorio.nombre_repo
            }
        });
    } catch (error) {
        console.error("Error al unirse a la clase y su repositorio:", error);
        return res.status(500).json({
            message: "No se pudo completar la inscripción a la clase"
        });
    }
}

module.exports = { create, unirseClase,buscarimagen };