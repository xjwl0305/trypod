const managementDB = require("../DB/management");

exports.itemGetAll = (req, res) => {
    const id = req.query.id
    managementDB.itemGetAll(id).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.itemAdd = (req, res) => {
    const name = req.query.name;
    const category = req.query.category;
    const code = req.query.code;
    const unit_weight = req.query.unit_weight;
    const safe_weight = req.query.safe_weight;
    const max_weight = req.query.max_weight;
    const image_url = req.query.image_url;
    const division = req.query.division;

    managementDB.itemAdd(name, category, code, unit_weight, safe_weight, max_weight, image_url, division).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}
exports.deviceGetAll = (req, res) => {
    const uid = req.query.uid
    managementDB.deviceGetAll(uid).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}


exports.deviceGetBranch = (req, res) => {
    const uid = req.query.uid;
    const branch_name = req.query.branch_name;
    managementDB.deviceGetBranch(uid, branch_name).then(result =>
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
    managementDB.deviceGetLayer(uid, branch_name, layer_name).then(result =>
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
    managementDB.deviceGetHouse(uid, branch_name, layer_name, warehouse_name).then(result =>
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

exports.deviceUpdateData = (req, res) => {
    const uid = req.query.uid;
    const device_num = req.query.device_number;
    managementDB.deviceUpdateData(uid, device_num).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.deviceUpdateApply = (req, res) => {
    const uid = req.query.uid;
    const item_id = req.query.item_id;
    const location_id = req.query.location_id;
    const container_id = req.query.container_id;
    const order_weight = req.query.order_weight;
    const description = req.query.description;
    const device_num = req.query.device_number;
    managementDB.deviceUpdateApply(uid, item_id, location_id, container_id, order_weight, description, device_num).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.deviceDelete = (req, res) => {
    const device_num = req.query.device_number;
    managementDB.deviceDelete(uid, device_num).then(result =>
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
// 지점 추가
exports.branchAdd = (req, res) => {
    const uid = req.query.uid;
    const branch_name = req.query.branch_name;
    const branch_address = req.query.branch_address;
    const manager_name = req.query.manager_name;
    const manager_phone = req.query.manager_phone;
    const manager_email = req.query.manager_email;
    managementDB.branchAdd(uid, branch_name, branch_address, manager_name, manager_phone, manager_email).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}
//지점 수정
exports.branchUpdate = (req, res) => {
    const uid = req.query.uid;
    const branch_name = req.query.branch_name;
    const branch_address = req.query.branch_address;
    const manager_name = req.query.manager_name;
    const manager_phone = req.query.manager_phone;
    const manager_email = req.query.manager_email;
    const pre_branch_name = req.query.pre_branch_name;
    const pre_manager_name = req.query.pre_manager_name;
    const pre_manager_phone = req.query.pre_manager_phone;
    managementDB.branchUpdate(uid, branch_name, branch_address, manager_name, manager_phone, manager_email, pre_branch_name, pre_manager_name, pre_manager_phone).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}
//지점 삭제
exports.branchDel = (req, res) => {
    const uid = req.query.uid;
    const branch_name = req.query.branch_name;
    const manager_name = req.query.manager_name;
    const manager_phone = req.query.manager_phone;
    managementDB.branchDel(uid, branch_name, manager_name, manager_phone).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}
// 층별 추가
exports.layerAdd = (req, res) => {
    const uid = req.query.uid;
    const branch_name = req.query.branch_name;
    const branch_address = req.query.branch_address;
    const layer_name = req.query.layer_name;
    const manager_name = req.query.manager_name;
    const manager_phone = req.query.manager_phone;
    const manager_email = req.query.manager_email;
    managementDB.layerAdd(uid, branch_name, branch_address, layer_name, manager_name, manager_phone, manager_email).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}
// 층별 수정
exports.layerUpdate = (req, res) => {
    const uid = req.query.uid;
    const layer_name = req.query.layer_name;
    const manager_name = req.query.manager_name;
    const manager_phone = req.query.manager_phone;
    const manager_email = req.query.manager_email;
    const pre_layer_name = req.query.pre_layer_name;
    const pre_manager_name = req.query.pre_manager_name;
    const pre_manager_phone = req.query.pre_manager_phone;
    managementDB.layerUpdate(uid, layer_name, manager_name, manager_phone, manager_email, pre_layer_name, pre_manager_name, pre_manager_phone).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}
// 층별 삭제
exports.layerDel = (req, res) => {
    const uid = req.query.uid;
    const layer_name = req.query.layer_name;
    const manager_name = req.query.manager_name;
    const manager_phone = req.query.manager_phone;
    managementDB.layerDel(uid, layer_name, manager_name, manager_phone).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}
// 창고 추가
exports.warehouseAdd = (req, res) => {
    const uid = req.query.uid;
    const branch_name = req.query.branch_name;
    const branch_address = req.query.branch_address;
    const branch_detailed_address = req.query.branch_detailed_address;
    const layer_name = req.query.layer_name;
    const warehouse_name = req.query.warehouse_name;
    const manager_name = req.query.manager_name;
    const manager_phone = req.query.manager_phone;
    const manager_email = req.query.manager_email;
    const min_temp = req.query.min_temp;
    const max_temp = req.query.max_temp;
    const min_hum = req.query.min_hum;
    const max_hum = req.query.max_hum;
    managementDB.warehouseAdd(uid, branch_name, branch_address, branch_detailed_address, layer_name, warehouse_name, manager_name, manager_phone, manager_email, min_temp, max_temp, min_hum, max_hum).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

// 창고 수정
exports.warehouseUpdate = (req, res) => {
    const uid = req.query.uid;
    const warehouse_name = req.query.warehouse_name;
    const manager_name = req.query.manager_name;
    const manager_phone = req.query.manager_phone;
    const manager_email = req.query.manager_email;
    const min_temp = req.query.min_temp;
    const max_temp = req.query.max_temp;
    const min_hum = req.query.min_hum;
    const max_hum = req.query.max_hum;
    const pre_warehouse_name = req.query.pre_warehouse_name;
    const pre_manager_name = req.query.pre_manager_name;
    const pre_manager_phone = req.query.pre_manager_phone;
    managementDB.warehouseUpdate(uid, warehouse_name, manager_name, manager_phone, manager_email, max_temp, min_temp, max_hum, min_hum, pre_warehouse_name, pre_manager_name, pre_manager_phone).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}
// 창고 삭제
exports.warehouseDel = (req, res) => {
    const uid = req.query.uid;
    const warehouse_name = req.query.warehouse_name;
    const manager_name = req.query.manager_name;
    const manager_phone = req.query.manager_phone;
    const min_temp = req.query.min_temp;
    const max_temp = req.query.max_temp;
    const min_hum = req.query.min_hum;
    const max_hum = req.query.max_hum;

    managementDB.warehouseDel(uid, warehouse_name, manager_name, manager_phone, max_temp, min_temp, max_hum, min_hum).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}