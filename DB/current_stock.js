const models = require("../models");
const {sequelize} = require("../models");
const {QueryTypes} = require("sequelize");
const Excel = require('exceljs');
const moment = require('moment');
// 아이템 재고 현황
exports.itemGetAll = async (uid) => {
    const data = await sequelize.query('select i.code, i.name, i.unit_weight, B.device_number ,A.data_interval, A.weight from device_raw_data as A left join earlivery_device B on A.earlivery_device_id = B.id left join item i on B.item_id = i.id left join location l on B.location_id = l.id left join user u on l.user_id = u.id where u.id = :uid order by i.name',
        {replacements: { uid: uid }, type: QueryTypes.SELECT});
    const branch_list = await sequelize.query('select distinct(branch_name) from location left join user u on location.user_id = u.id where u.id = :uid',
        {replacements: { uid: uid }, type: QueryTypes.SELECT});
    const Allbranch = [];
    const result = {"data": data};
    branch_list.forEach(function (item, index, array) {
        Allbranch.push(item.branch_name);
    });
    const branch = {"branch_name": Allbranch};
    return Object.assign(result, branch);
}

exports.itemGetBranch = async (uid, branch_name) => {
    const data = await sequelize.query('select i.code, i.name, i.unit_weight, B.device_number ,A.data_interval, A.weight from device_raw_data as A left join earlivery_device B on A.earlivery_device_id = B.id left join item i on B.item_id = i.id left join location l on B.location_id = l.id left join user u on l.user_id = u.id ' +
        'where u.id = :uid and l.branch_name = :branch_name order by i.name',
        {replacements: { uid: uid , branch_name: branch_name}, type: QueryTypes.SELECT});
    const layer_list = await sequelize.query('select layer_name from location left join user u on location.user_id = u.id where u.id = :uid and branch_name = :branch_name',
        {replacements: { uid: uid , branch_name: branch_name }, type: QueryTypes.SELECT});
    const Alllayer = [];
    const result = {"data": data};
    layer_list.forEach(function (item, index, array) {e
        Alllayer.push(item.layer_name);
    });
    const layer = {"layer_name": Alllayer};
    return Object.assign(result, layer);
}

exports.itemGetLayer = async (uid, branch_name, layer_name) => {
    const data = await sequelize.query('select i.code, i.name, i.unit_weight, B.device_number ,A.data_interval, A.weight from device_raw_data as A left join earlivery_device B on A.earlivery_device_id = B.id left join item i on B.item_id = i.id left join location l on B.location_id = l.id left join user u on l.user_id = u.id' +
        ' where u.id = :uid and l.layer_name = :layer_name and branch_name = :branch_name order by i.name',
        {replacements: { uid: uid , branch_name: branch_name, layer_name: layer_name}, type: QueryTypes.SELECT});
    const warehouse_list = await sequelize.query('select warehouse_name from location left join user u on location.user_id = u.id where u.id = :uid and branch_name = :branch_name and layer_name = :layer_name',
        {replacements: { uid: uid , branch_name: branch_name, layer_name: layer_name}, type: QueryTypes.SELECT});
    const AllHouse = [];
    const result = {"data": data};
    warehouse_list.forEach(function (item, index, array) {
        AllHouse.push(item.warehouse_name);
    });
    const warehouse = {"warehouse_name": AllHouse};
    return Object.assign(result, warehouse);
}

exports.itemGetHouse = async (uid, branch_name, layer_name, warehouse_name) => {
    const data = await sequelize.query('select i.code, i.name, i.unit_weight, B.device_number ,A.data_interval, A.weight from device_raw_data as A left join earlivery_device B on A.earlivery_device_id = B.id left join item i on B.item_id = i.id left join location l on B.location_id = l.id left join user u on l.user_id = u.id\n' +
        'where u.id = :uid and l.layer_name = :layer_name and branch_name = :branch_name and warehouse_name = warehouse_name order by i.name',
        {replacements: { uid: uid , branch_name: branch_name, layer_name: layer_name, warehouse_name: warehouse_name}, type: QueryTypes.SELECT});
    return {"data": data};
}
// 디바이스 재고 현황
exports.deviceGetAll = async (uid) => {
    const data = await sequelize.query('select device_number, i.name, drd.weight, drd.weight, drd.created_at from earlivery_device left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id left join item i on earlivery_device.item_id = i.id left join location l on earlivery_device.location_id = l.id left join user u on l.user_id = u.id where u.id = :uid order by i.name',
        {replacements: { uid: uid }, type: QueryTypes.SELECT});
    const branch_list = await sequelize.query('select distinct(branch_name) from location left join user u on location.user_id = u.id where u.id = :uid',
        {replacements: { uid: uid }, type: QueryTypes.SELECT});
    const Allbranch = [];
    const result = {"data": data};
    branch_list.forEach(function (item, index, array) {
        Allbranch.push(item.branch_name);
    });
    const branch = {"branch_name": Allbranch};
    return Object.assign(result, branch);
}

exports.deviceGetBranch = async (uid, branch_name) => {
    const data = await sequelize.query('select i.code, i.name, i.unit_weight, B.device_number ,A.data_interval, A.weight from device_raw_data as A left join earlivery_device B on A.earlivery_device_id = B.id left join item i on B.item_id = i.id left join location l on B.location_id = l.id left join user u on l.user_id = u.id ' +
        'where u.id = :uid and l.branch_name = :branch_name order by i.name',
        {replacements: { uid: uid , branch_name: branch_name}, type: QueryTypes.SELECT});
    const layer_list = await sequelize.query('select layer_name from location left join user u on location.user_id = u.id where u.id = :uid and branch_name = :branch_name;',
        {replacements: { uid: uid , branch_name: branch_name }, type: QueryTypes.SELECT});
    const Alllayer = [];
    const result = {"data": data};
    layer_list.forEach(function (item, index, array) {
        Alllayer.push(item.layer_name);
    });
    const layer = {"layer_name": Alllayer};
    return Object.assign(result, layer);
}

exports.deviceGetLayer = async (uid, branch_name, layer_name) => {
    const data = await sequelize.query('select device_number, i.name, drd.weight, drd.weight, drd.created_at from earlivery_device left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id left join item i on earlivery_device.item_id = i.id left join location l on earlivery_device.location_id = l.id left join user u on l.user_id = u.id where u.id = :uid and branch_name = :branch_name order by i.name',
        {replacements: { uid: uid , branch_name: branch_name, layer_name: layer_name}, type: QueryTypes.SELECT});
    const warehouse_list = await sequelize.query('select warehouse_name from location left join user u on location.user_id = u.id where u.id = 1 and branch_name = :branch_name and layer_name = :layer_name',
        {replacements: { uid: uid , branch_name: branch_name, layer_name: layer_name}, type: QueryTypes.SELECT});
    const AllHouse = [];
    const result = {"data": data};
    warehouse_list.forEach(function (item, index, array) {
        AllHouse.push(item.warehouse_name);
    });
    const warehouse = {"warehouse_name": AllHouse};
    return Object.assign(result, warehouse);
}

exports.deviceGetHouse = async (uid, branch_name, layer_name, warehouse_name) => {
    const data = await sequelize.query('select device_number, i.name, drd.weight, drd.weight, drd.created_at from earlivery_device left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id left join item i on earlivery_device.item_id = i.id left join location l on earlivery_device.location_id = l.id left join user u on l.user_id = u.id\n' +
        'where u.id = 1 and branch_name = :branch_name and layer_name = :layer_name and warehouse_name = :warehouse_name order by i.name',
        {replacements: { uid: uid , branch_name: branch_name, layer_name: layer_name, warehouse_name: warehouse_name}, type: QueryTypes.SELECT});
    return {"data": data};
}

exports.ReportSetting = async (uid, base_time, cycle_time) => {
    const data = await sequelize.query('',
        {replacements: { uid: uid , base_time: base_time, cycle_time: cycle_time}, type: QueryTypes.INSERT});
    return {"data": data};
}