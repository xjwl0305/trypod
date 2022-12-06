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
    const data = await sequelize.query('select distinct A.id, B.device_number, i.name, B.order_weight, l.branch_detailed_address, B.created_at from (select earlivery_device_id, max(device_raw_data.created_at) as max_date from device_raw_data) as t2, device_raw_data as A left join earlivery_device B on A.earlivery_device_id = B.id left join item i on B.item_id = i.id left join location l on B.location_id = l.id left join user u on l.user_id = u.id where u.id = :uid and t2.earlivery_device_id = A.earlivery_device_id and t2.max_date = A.created_at order by i.name',
        {replacements: { uid: uid }, type: QueryTypes.SELECT});
    const branch_list = await sequelize.query('select distinct(branch_name) from location left join user u on location.user_id = u.id where u.id = :uid and branch_name is not null',
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
    const data = await sequelize.query('select A.id, B.device_number, i.name, B.order_weight, l.branch_detailed_address, B.created_at from (select earlivery_device_id, max(device_raw_data.created_at) as max_date from device_raw_data) as t2, device_raw_data as A\n' +
        'left join earlivery_device B on A.earlivery_device_id = B.id left join item i on B.item_id = i.id left join location l on B.location_id = l.id left join user u on l.user_id = u.id\n' +
        'where u.id = :uid and branch_name = :branch_name and t2.earlivery_device_id = A.earlivery_device_id and t2.max_date = A.created_at order by i.name',
        {replacements: { uid: uid , branch_name: branch_name}, type: QueryTypes.SELECT});
    const layer_list = await sequelize.query('select distinct (layer_name) from location left join user u on location.user_id = u.id where u.id = :uid and branch_name = :branch_name and layer_name is not null',
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
    const data = await sequelize.query('select A.id, B.device_number, i.name, B.order_weight, l.branch_detailed_address, B.created_at from (select earlivery_device_id, max(device_raw_data.created_at) as max_date from device_raw_data) as t2, device_raw_data as A\n' +
        'left join earlivery_device B on A.earlivery_device_id = B.id left join item i on B.item_id = i.id left join location l on B.location_id = l.id left join user u on l.user_id = u.id\n' +
        'where u.id = :uid and branch_name = :branch_name and layer_name = :layer_name and t2.earlivery_device_id = A.earlivery_device_id and t2.max_date = A.created_at order by i.name',
        {replacements: { uid: uid , branch_name: branch_name, layer_name: layer_name}, type: QueryTypes.SELECT});
    const warehouse_list = await sequelize.query('select distinct (warehouse_name) from location left join user u on location.user_id = u.id where u.id = :uid and branch_name = :branch_name and layer_name = :layer_name and warehouse_name is not null',
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
    const data = await sequelize.query('select A.id, B.device_number, i.name, B.order_weight, l.branch_detailed_address, B.created_at from (select earlivery_device_id, max(device_raw_data.created_at) as max_date from device_raw_data) as t2, device_raw_data as A\n' +
        'left join earlivery_device B on A.earlivery_device_id = B.id left join item i on B.item_id = i.id left join location l on B.location_id = l.id left join user u on l.user_id = u.id\n' +
        'where u.id = :uid and branch_name = :branch_name and layer_name = :layer_name and warehouse_name = :warehouse_name and t2.earlivery_device_id = A.earlivery_device_id and t2.max_date = A.created_at order by i.name',
        {replacements: { uid: uid , branch_name: branch_name, layer_name: layer_name, warehouse_name: warehouse_name}, type: QueryTypes.SELECT});
    return {"data": data};
}

exports.deviceGetDetail = async (uid, device_id) => {
    const data = await sequelize.query('select A.device_number, i.name as item_name , drd.battery, drd.created_at, drd.data_interval, A.order_weight, o.date_time as order_time, o.created_at as order_create_time, A.description, c.name as container_name from earlivery_device as A left join device_raw_data drd on A.id = drd.earlivery_device_id left join orderlist o on o.device_number = A.device_number left join item i on item_id = i.id left join container c on A.container_id = c.id left join location l on A.location_id = l.id left join user u on l.user_id = u.id where u.id = :uid and drd.id = :device_id',
        {replacements: { uid: uid , device_id: device_id }, type: QueryTypes.SELECT});
    let today = new Date();
    let date = new Date(data[0].created_at);
    date.setMinutes(date.getMinutes()+ data[0].data_interval+5);
    if (date < today){
        data[0].connection = '통신불량';
    }else{
        data[0].connection = '통신양호';
    }
    delete data[0].data_interval
    return {"data": data[0]};
}

exports.deviceUpdateData = async (uid, device_num) => {
    const data = await sequelize.query('select distinct A.id as item_id, A.name as item_name from item as A left join earlivery_device ed on A.id = ed.item_id left join container c on c.id = ed.container_id = c.id left join device_raw_data drd on ed.id = drd.earlivery_device_id left join location l on ed.location_id = l.id left join user u on l.user_id = u.id where u.id = :uid',
        {replacements: { uid: uid }, type: QueryTypes.SELECT});
    const item_list = {"item_list": data};
    const data2 = await sequelize.query('select c.name as conatiner_name from item as A left join earlivery_device ed on A.id = ed.item_id left join container c on c.id = ed.container_id = c.id left join location l on ed.location_id = l.id left join user u on l.user_id = u.id where u.id = 1 and ed.device_number = :device_num',
        {replacements: { uid: uid , device_num: device_num}, type: QueryTypes.SELECT});
    const container_name = {"container_name": data2};
    const data3 = await sequelize.query('select container.id as container_id, name as container_list from container left join user u on container.user_id = u.id where u.id = :uid',
        {replacements: { uid: uid }, type: QueryTypes.SELECT});
    const container_list = {"container_list": data3};
    const data4 = await sequelize.query('select branch_name, layer_name, warehouse_name from location as l left join user u on l.user_id = u.id where u.id = :uid order by branch_name',
        {replacements: { uid: uid }, type: QueryTypes.SELECT});
    const where = {"branches": data4};
    return Object.assign(item_list, container_name, container_list, where);
}

exports.deviceUpdateApply = async (uid, item_id, location_id, container_id, order_weight, description, device_num) => {
    return await sequelize.query('update earlivery_device set item_id = :item_id , location_id= :location_id, container_id = :container_id, order_weight = :order_weight, description = :description where device_number = :device_num',
        {replacements: { uid: uid, item_id: item_id, location_id: location_id, container_id: container_id, order_weight: order_weight, description: description, device_num: device_num}, type: QueryTypes.UPDATE});
}

exports.deviceDelete = async (device_num) => {
    return await sequelize.query('delete from earlivery_device where device_number = :device_num',
        {replacements: { device_num: device_num}, type: QueryTypes.DELETE});
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
    return await sequelize.query('select warehouse_name, temperature, humidity, max_temp, min_temp, max_hum, min_hum, manager_name, manager_email, manager_phone, w.created_at from (select location_id, max(created_at) as max_date from warehouse_raw_data group by location_id) as t2, location as l left join warehouse_raw_data w on l.id = w.location_id left join user u on l.user_id = u.id\n' +
        'where u.id = :uid and w.location_id = t2.location_id and w.created_at = t2.max_date and branch_name = :branch_name and layer_name = :layer_name and warehouse_name is not null\n' +
        'union select warehouse_name, temperature, humidity, max_temp, min_temp, max_hum, min_hum, manager_name, manager_email, manager_phone, w.created_at from location as l left join warehouse_raw_data w on l.id = w.location_id left join user u on l.user_id = u.id\n' +
        'where u.id = :uid and branch_name = :branch_name and layer_name = :layer_name and warehouse_name is not null and w.created_at is null\n' +
        'order by warehouse_name',
        {replacements: {uid: uid, branch_name: branch_name, layer_name: layer_name}, type: QueryTypes.SELECT});
}

exports.warehouseInfo = async (uid, layer_name, warehouse_name) => {
    return await sequelize.query('select w.temperature, w.humidity, w.created_at from warehouse_raw_data w left join location l on w.location_id = l.id left join user u on l.user_id = u.id where u.id = :uid and layer_name = :layer_name and warehouse_name = :warehouse_name;',
        {replacements: {uid: uid, layer_name: layer_name, warehouse_name: warehouse_name}, type: QueryTypes.SELECT});
}

exports.branchAdd = async (uid, branch_name, branch_address, manager_name, manager_phone, manager_email) => {
    return await sequelize.query('insert into location (branch_name, branch_address, manager_name, manager_phone, manager_email, user_id) values (:branch_name, :branch_address, :manager_name, :manager_phone, :manager_email, :uid)',
        {replacements: {uid: uid, branch_name: branch_name, branch_address: branch_address, manager_name: manager_name, manager_phone: manager_phone, manager_email: manager_email}, type: QueryTypes.INSERT});
}

exports.layerAdd = async (uid, branch_name, branch_address, layer_name, manager_name, manager_phone, manager_email) => {
    return await sequelize.query('insert into location (branch_name, branch_address, layer_name, manager_name, manager_phone, manager_email, user_id)\n' +
        'values (:branch_name, :branch_address, :layer_name, :manager_name, :manager_phone, :manager_email, :uid)',
        {replacements: {uid: uid, branch_name: branch_name, branch_address: branch_address, layer_name: layer_name, manager_name: manager_name, manager_phone: manager_phone,manager_email: manager_email}, type: QueryTypes.INSERT});
}

exports.warehouseAdd = async (uid, branch_name, branch_address, branch_detailed_address, layer_name, warehouse_name, manager_name, manager_phone, manager_email, min_temp, max_temp, min_hum, max_hum) => {
    return await sequelize.query('insert into location (branch_name, branch_address, branch_detailed_address, layer_name, warehouse_name, manager_name, manager_phone, manager_email, min_temp, min_hum, max_temp, max_hum, user_id)\n' +
        'values (:branch_name, :branch_address, :branch_detailed_address, :layer_name, :warehouse_name, :manager_name, :manager_phone, :manager_email, :min_temp, :min_hum, :max_temp, :min_temp, :uid)',
        {replacements: {uid: uid, branch_name: branch_name,branch_address: branch_address,branch_detailed_address: branch_detailed_address,layer_name: layer_name,warehouse_name: warehouse_name,manager_name: manager_name,manager_phone: manager_phone, manager_email: manager_email,
                min_temp: min_temp, min_hum: min_hum, max_temp: max_temp, max_hum: max_hum}, type: QueryTypes.INSERT});

}
exports.branchUpdate = async (uid, branch_name, branch_address, manager_name, manager_phone, manager_email, pre_branch_name, pre_manager_name, pre_manager_phone) => {
    return await sequelize.query('update location l left join user u on l.user_id = u.id set branch_name = :branch_name, branch_address = :branch_address, manager_name = :manager_name, manager_phone = :manager_phone, manager_email = :manager_email\n' +
        'where u.id = :uid and branch_name = :pre_branch_name and manager_name = :pre_manager_name and manager_phone = :pre_manager_phone and layer_name is null',
        {replacements: {uid: uid, branch_name: branch_name, branch_address: branch_address, manager_name: manager_name, manager_phone: manager_phone, manager_email: manager_email, pre_branch_name: pre_branch_name,
            pre_manager_name: pre_manager_name, pre_manager_phone: pre_manager_phone}, type: QueryTypes.UPDATE});
}

exports.layerUpdate = async (uid, layer_name, manager_name, manager_phone, manager_email, pre_layer_name, pre_manager_name, pre_manager_phone) => {
    return await sequelize.query('update location l left join user u on l.user_id = u.id set layer_name = :layer_name, manager_name = :manager_name, manager_phone = :manager_phone, manager_email = :manager_email\n' +
        'where u.id = :uid and layer_name = :pre_layer_name and manager_name = :pre_manager_name and manager_phone = :pre_manager_phone and warehouse_name is null',
        {replacements: {uid: uid, layer_name: layer_name, manager_name: manager_name, manager_phone: manager_phone, manager_email: manager_email, pre_layer_name: pre_layer_name,
                pre_manager_name: pre_manager_name, pre_manager_phone: pre_manager_phone}, type: QueryTypes.UPDATE});
}

exports.warehouseUpdate = async (uid, warehouse_name, manager_name, manager_phone, manager_email, max_temp, min_temp, max_hum, min_hum, pre_warehouse_name, pre_manager_name, pre_manager_phone) => {
    return await sequelize.query('update location l left join user u on l.user_id = u.id set warehouse_name = :warehouse_name, manager_name = :manager_name, manager_phone = :manager_phone, manager_email = :manager_email, max_temp = :max_temp, min_temp = :min_temp, max_hum = :max_hum, min_hum = :min_hum\n' +
        'where u.id = :uid and warehouse_name = :pre_warehouse_name and manager_name = :pre_manager_name and manager_phone = :pre_manager_phone',
        {replacements: {uid: uid, warehouse_name: warehouse_name, manager_name: manager_name, manager_phone: manager_phone, manager_email: manager_email, pre_warehouse_name: pre_warehouse_name,
                pre_manager_name: pre_manager_name, pre_manager_phone: pre_manager_phone, max_temp: max_temp, min_temp: min_temp, max_hum: max_hum, min_hum: min_hum}, type: QueryTypes.UPDATE});
}
exports.branchDel = async (uid, branch_name, manager_name, manager_phone) => {
    return await sequelize.query('delete from location l where user_id = :uid and branch_name = :branch_name and manager_name = :manager_name and manager_phone = :manager_phone and layer_name is null',
        {replacements: {uid: uid, branch_name: branch_name, manager_name: manager_name, manager_phone: manager_phone}, type: QueryTypes.DELETE});
}

exports.layerDel = async (uid, layer_name, manager_name, manager_phone) => {
    return await sequelize.query('delete from location l where user_id = :uid and layer_name = :layer_name and manager_name = :manager_name and manager_phone = :manager_phone and warehouse_name is null',
        {replacements: {uid: uid, layer_name: layer_name, manager_name: manager_name, manager_phone: manager_phone}, type: QueryTypes.DELETE});
}

exports.warehouseDel = async (uid, warehouse_name, manager_name, manager_phone, max_temp, min_temp, max_hum, min_hum) => {
    return await sequelize.query('delete from location l where user_id = :uid and warehouse_name = :warehouse_name and manager_name = :manager_name and manager_phone = :manager_phone and max_temp = :max_temp and min_temp = :min_temp and max_hum = :max_hum and min_hum = :min_hum',
        {replacements: {uid: uid, warehouse_name: warehouse_name, manager_name: manager_name, manager_phone: manager_phone, max_temp: max_temp, min_temp: min_temp, max_hum: max_hum, min_hum: min_hum}, type: QueryTypes.DELETE});
}