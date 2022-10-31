const curStockDB = require("../DB/current_stock");


exports.itemGetAll = (req, res) => {
    const uid = req.body.uid
    curStockDB.itemGetAll(uid).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.itemGetBranch = (req, res) => {
    const uid = req.body.uid;
    const branch_name = req.body.branch_name;
    curStockDB.itemGetBranch(uid, branch_name).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.itemGetLayer = (req, res) => {
    const uid = req.body.uid;
    const branch_name = req.body.branch_name;
    const layer_name = req.body.layer_name;
    curStockDB.itemGetLayer(uid, branch_name, layer_name).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.itemGetHouse = (req, res) => {
    const uid = req.body.uid;
    const branch_name = req.body.branch_name;
    const layer_name = req.body.layer_name;
    const warehouse_name = req.body.warehouse_name;
    curStockDB.itemGetHouse(uid, branch_name, layer_name, warehouse_name).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.deviceGetAll = (req, res) => {
    const uid = req.body.uid
    curStockDB.deviceGetAll(uid).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.deviceGetBranch = (req, res) => {
    const uid = req.body.uid;
    const branch_name = req.body.branch_name;
    curStockDB.deviceGetBranch(uid, branch_name).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.deviceGetLayer = (req, res) => {
    const uid = req.body.uid;
    const branch_name = req.body.branch_name;
    const layer_name = req.body.layer_name;
    curStockDB.deviceGetLayer(uid, branch_name, layer_name).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.deviceGetHouse = (req, res) => {
    const uid = req.body.uid;
    const branch_name = req.body.branch_name;
    const layer_name = req.body.layer_name;
    const warehouse_name = req.body.warehouse_name;
    curStockDB.deviceGetHouse(uid, branch_name, layer_name, warehouse_name).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.reportDownload = (req, res) => {
    const uid = req.body.uid;
    const date = req.body.date;
    const select = req.body.select;
    const data = req.body.data;
    curStockDB.reportDownload(uid, date, select, data);
}