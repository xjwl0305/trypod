const homeDB = require('../db/home')


exports.getWeight = (req, res) => {
    const uid = req.body
    homeDB.findWeight(uid).then(result =>
        res.status(200).json(
            {
                "all_weight": result
            })
    );
}