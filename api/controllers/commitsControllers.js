const { Commits, usuarios } = require("../models/index.js");

const traerCommits = async (req, res) => {
    try {
        const idRepo = Number(req.params.idRepo);

        const respuesta = await Commits.findAll({
            where: {
                id_repo: idRepo
            },
            include: [{
                model: usuarios,
                attributes: ["id_usuario", "nombre", "apellido", "foto_perfil"],
            }],
            order: [["id_commit", "DESC"]]
        });

        return res.status(200).json(respuesta);

    } catch (error) {
        console.error("Error al traer commits:", error);

        return res.status(500).json({
            message: "No se pudieron obtener los commits"
        });
    }
};

module.exports = { traerCommits };