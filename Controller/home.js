const homeDB = require('../DB/home')


exports.getWeight = (req, res) => {
    const uid = req.body.uid
    homeDB.findWeight(uid).then(result =>
        res.status(200).json(
            {
                "all_weight": result
            })
    );
}

exports.checkStock = (req, res) => {
    const uid = req.body.uid
    homeDB.CheckStock(uid).then(result =>
        res.status(200).json(
            {
                "Out_of_stock": result
            })
    );
}

exports.checkDevice = (req, res) => {
    const uid = req.body.uid
    homeDB.CheckDevice(uid).then(result =>
        res.status(200).json(
            {
                "strange_device": result
            })
);
}
exports.itemStock = (req, res) => {
    const uid = req.body.uid
    homeDB.ItemStock(uid).then(result =>
        res.status(200).json(
            {
                "itemStock": result
            })
    );
}

exports.GetWarehouse = (req, res) => {
    const uid = req.body.uid
    homeDB.getWarehouse(uid).then(result =>
        res.status(200).json(
            {
                "Warehouse": result
            })
    );
}

exports.checkWarehouse = (req, res) => {
    const uid = req.body.uid
    homeDB.CheckWarehouse(uid).then(result =>
        res.status(200).json(
            {
                "strange_warehouse": result
            })
    );
}