const { Commits } = require('../models/commitsModels')


const traerCommits = async (req, res) => {
    try {
        const idRepo = Number(req.params.idRepo);

        const respuesta = await Commits.findAll({
            where: {
                id_repo: idRepo
            },
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

module.exports = { traerCommits };module.exports = { traerCommits }