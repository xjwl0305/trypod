const managementDB = require("../DB/management");

exports.deviceGetAll = (req, res) => {
    const uid = req.query.uid
    const offset = req.query.offset;
    const paging = req.query.paging;
    managementDB.deviceGetAll(uid, offset, paging).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.deviceGetBranch = (req, res) => {
    const uid = req.query.uid;
    const branch_name = req.query.branch_name;
    const offset = req.query.offset;
    const paging = req.query.paging;
    managementDB.deviceGetBranch(uid, branch_name, offset, paging).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.deviceGetLayer = (req, res) => {
    const uid = req.query.uid;
    const branch_name = req.query.branch_name;
    const layer_name = req.query.layer_name;
    const offset = req.query.offset;
    const paging = req.query.paging;
    managementDB.deviceGetLayer(uid, branch_name, layer_name, offset, paging).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.deviceGetHouse = (req, res) => {
    const uid = req.query.uid;
    const branch_name = req.query.branch_name;
    const layer_name = req.query.layer_name;
    const warehouse_name = req.query.warehouse_name;
    const offset = req.query.offset;
    const paging = req.query.paging;
    managementDB.deviceGetHouse(uid, branch_name, layer_name, warehouse_name, offset, paging).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.deviceGetDetail = (req, res) => {
    const uid = req.query.uid;
    const device_num = req.query.device_number;
    managementDB.deviceGetDetail(uid, device_num).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.deviceUpdate = (req, res) => {
    const uid = req.query.uid;
    const device_num = req.query.device_number;
    managementDB.deviceGetDetail(uid, device_num).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.deviceDelete = (req, res) => {
    const uid = req.query.uid;
    const device_num = req.query.device_number;
    managementDB.deviceGetDetail(uid, device_num).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}
// 지점 목록
exports.branchList = (req, res) => {
    const uid = req.query.uid;
    const device_num = req.query.device_number;
    managementDB.branchList(uid).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

// 구역 목록
exports.layerList = (req, res) => {
    const uid = req.query.uid;
    const branch_name = req.query.branch_name;
    managementDB.layerList(uid, branch_name).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}
// 창고 목록
exports.warehouseList = (req, res) => {
    const uid = req.query.uid;
    const branch_name = req.query.branch_name;
    const layer_name = req.query.layer_name;
    managementDB.warehouseList(uid, branch_name, layer_name).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}
// 창고 정보
exports.warehouseInfo = (req, res) => {
    const uid = req.query.uid;
    const warehouse_name = req.query.warehouse_name;
    const layer_name = req.query.layer_name;
    managementDB.warehouseInfo(uid, layer_name, warehouse_name).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}