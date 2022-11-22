const models = require("../models");
const {sequelize} = require("../models");
const {QueryTypes} = require("sequelize");

exports.itemGetAll = async (id) => {
    return await sequelize.query('select name, category, code, max_weight, unit_weight from item where division = :id order by item.name',
        {replacements: {id: id}, type: QueryTypes.SELECT})
}

exports.itemAdd = async (name, category, code, unit_weight, safe_weight, max_weight, image_url, division) => {
    return await sequelize.query('insert into item (name, category, code, unit_weight, safe_weight, max_weight, image_url, division)\n' +
        'values(:name, :category, :code, :unit_weight, :safe_weight, :max_weight, :image_url, :division)',
        {replacements: { name: name, category: category, code: code, unit_weight: unit_weight, safe_weight: safe_weight, max_weight: max_weight, image_url: image_url, division: division}, type: QueryTypes.INSERT});
}

exports.deviceGetAll = async (uid) => {
    const data = await sequelize.query('select B.device_number, i.name, B.order_weight, l.branch_detailed_address, A.updated_at from device_raw_data as A left join earlivery_device B on A.earlivery_device_id = B.id left join item i on B.item_id = i.id left join location l on B.location_id = l.id left join user u on l.user_id = u.id where u.id = :uid order by i.name',
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
    const data = await sequelize.query('select B.device_number, i.name, B.order_weight, l.branch_detailed_address, A.updated_at from device_raw_data as A left join earlivery_device B on A.earlivery_device_id = B.id left join item i on B.item_id = i.id left join location l on B.location_id = l.id left join user u on l.user_id = u.id\n' +
        '                                                                                        where u.id = :uid and branch_name = :branch_name order by i.name',
        {replacements: { uid: uid , branch_name: branch_name}, type: QueryTypes.SELECT});
    const layer_list = await sequelize.query('select distinct (layer_name) from location left join user u on location.user_id = u.id where u.id = :uid and branch_name = :branch_name;',
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
    const data = await sequelize.query('select B.device_number, i.name, B.order_weight, l.branch_detailed_address, A.updated_at from device_raw_data as A left join earlivery_device B on A.earlivery_device_id = B.id left join item i on B.item_id = i.id left join location l on B.location_id = l.id left join user u on l.user_id = u.id\n' +
        '                                                                                        where u.id = :uid and branch_name = :branch_name and layer_name = :layer_name order by i.name',
        {replacements: { uid: uid , branch_name: branch_name, layer_name: layer_name}, type: QueryTypes.SELECT});
    const warehouse_list = await sequelize.query('select distinct (warehouse_name) from location left join user u on location.user_id = u.id where u.id = :uid and branch_name = :branch_name and layer_name = :layer_name',
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
    const data = await sequelize.query('select B.device_number, i.name, B.order_weight, l.branch_detailed_address, A.updated_at from device_raw_data as A left join earlivery_device B on A.earlivery_device_id = B.id left join item i on B.item_id = i.id left join location l on B.location_id = l.id left join user u on l.user_id = u.id\n' +
        '                                                                                        where u.id = :uid and branch_name = :branch_name and layer_name = :layer_name and warehouse_name = :warehouse_name order by i.name',
        {replacements: { uid: uid , branch_name: branch_name, layer_name: layer_name, warehouse_name: warehouse_name}, type: QueryTypes.SELECT});
    return {"data": data};
}

exports.deviceGetDetail = async (uid, device_num) => {
    const data = await sequelize.query('select A.device_number, A.item_id, drd.battery,drd.updated_at, A.order_weight, o.date_time as order_time,A.created_at, A.description, c.name\n' +
        'from earlivery_device as A left join device_raw_data drd on A.id = drd.earlivery_device_id left join orderlist o on o.device_number = A.device_number left join container c on A.container_id = c.id left join location l on A.location_id = l.id left join user u on l.user_id = u.id\n' +
        'where u.id = :uid and A.device_number = :device_num',
        {replacements: { uid: uid , device_num: device_num }, type: QueryTypes.SELECT});
    return {"data": data};
}

// 지점관리
exports.branchList = async (uid) => {
    return await sequelize.query('select branch_name, branch_address, manager_name, manager_phone, manager_email from location left join user u on location.user_id = u.id where u.id = :uid and layer_name is null',
        {replacements: {uid: uid}, type: QueryTypes.SELECT});
}

exports.layerList = async (uid, branch_name) => {
    return await sequelize.query('select layer_name, manager_name, manager_email, manager_phone from location as l left join warehouse_raw_data w on l.id = w.location_id left join user u on l.user_id = u.id where u.id = :uid and branch_name = :branch_name and warehouse_name is null and layer_name is not null',
        {replacements: {uid: uid, branch_name: branch_name}, type: QueryTypes.SELECT});
}

exports.warehouseList = async (uid, branch_name, layer_name) => {
    return await sequelize.query('select warehouse_name, temperature, max_temp, min_temp, max_hum, min_hum, manager_name, manager_email, manager_phone, w.created_at from (select location_id, max(created_at) as max_date from warehouse_raw_data group by location_id) as t2, location as l left join warehouse_raw_data w on l.id = w.location_id left join user u on l.user_id = u.id\n' +
        'where u.id = :uid and w.location_id = t2.location_id and w.updated_at = t2.max_date and branch_name = :branch_name and layer_name = :layer_name and warehouse_name is not null\n' +
        'union select warehouse_name, temperature, max_temp, min_temp, max_hum, min_hum, manager_name, manager_email, manager_phone, w.created_at from location as l left join warehouse_raw_data w on l.id = w.location_id left join user u on l.user_id = u.id\n' +
        'where u.id = :uid and branch_name = :branch_name and layer_name = :layer_name and warehouse_name is not null and w.created_at is null\n' +
        'order by warehouse_name',
        {replacements: {uid: uid, branch_name: branch_name, layer_name: layer_name}, type: QueryTypes.SELECT});
}

exports.warehouseInfo = async (uid, layer_name, warehouse_name) => {
    return await sequelize.query('select temperature, humidity, w.created_at from warehouse_raw_data as w left join location l on l.id = w.location_id left join user u on l.user_id = u.id where u.id = :uid and l.layer_name = :layer_name and l.warehouse_name = :warehouse_name',
        {replacements: {uid: uid, layer_name: layer_name, warehouse_name: warehouse_name}, type: QueryTypes.SELECT});
}

exports.branchAdd = async (uid, branch_name, branch_address, branch_detailed_address, manager_name, manager_phone, manager_email) => {
    return await sequelize.query('insert into location (branch_name, branch_address, branch_detailed_address, manager_name, manager_phone, manager_email, user_id) values (:branch_name, :branch_address, :branch_detailed_address, :manager_name, :manager_phone, :manager_email, :uid)',
        {replacements: {uid: uid, branch_name: branch_name, branch_address: branch_address, branch_detailed_address: branch_detailed_address, manager_name: manager_name, manager_phone: manager_phone, manager_email: manager_email}, type: QueryTypes.INSERT});
}

exports.layerAdd = async (uid, branch_name, branch_address, branch_detailed_address, layer_name, manager_name, manager_phone, manager_email, min_temp, max_temp) => {
    return await sequelize.query('insert into location (branch_name, branch_address, branch_detailed_address, layer_name, manager_name, manager_phone, manager_email, min_temp, max_temp, user_id)\n' +
        'values (:branch_name, :branch_address, :branch_detailed_address,  :layer_name, :manager_name,:manager_phone, :manager_email, :min_temp, :max_temp, :uid)',
        {replacements: {uid: uid, branch_name: branch_name,branch_address: branch_address,branch_detailed_address: branch_detailed_address, layer_name: layer_name, manager_name: manager_name,manager_phone: manager_phone,manager_email: manager_email, min_temp: min_temp , max_temp: max_temp}, type: QueryTypes.INSERT});
}

exports.warehouseAdd = async (uid, branch_name, branch_address, branch_detailed_address, layer_name, warehouse_name, manager_name, manager_phone, manager_email, min_temp, max_temp, min_hum, max_hum) => {
    return await sequelize.query('insert into location (branch_name, branch_address, branch_detailed_address, layer_name, warehouse_name, manager_name, manager_phone, manager_email, min_temp, min_hum, max_temp, max_hum, user_id)\n' +
        'values (:branch_name, :branch_address, :branch_detailed_address, :layer_name, :warehouse_name, :manager_name, :manager_phone, :manager_email, :min_temp, :min_hum, :max_temp, :min_temp, :uid)',
        {replacements: {uid: uid, branch_name: branch_name,branch_address: branch_address,branch_detailed_address: branch_detailed_address,layer_name: layer_name,warehouse_name: warehouse_name,manager_name: manager_name,manager_phone: manager_phone, manager_email: manager_email,
                min_temp: min_temp, min_hum: min_hum, max_temp: max_temp, max_hum: max_hum}, type: QueryTypes.INSERT});

}

