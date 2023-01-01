const models = require("../models");
const {Op, QueryTypes, Sequelize, literal} = require("sequelize");
const { sequelize } = require('../models/index')


exports.findWeight = async (uid) => {
    const [result, metadata] = await sequelize.query('select sum(weight) from (select earlivery_device_id, max(device_raw_data.created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, device_raw_data as A left join earlivery_device as B on A.earlivery_device_id = B.id left join location as C on B.location_id = C.id left join user as D on C.user_id = D.id\n' +
        'where D.id = :uid and t2.max_date = A.created_at and t2.earlivery_device_id = A.earlivery_device_id',
        {replacements: { uid: uid }, type: QueryTypes.SELECT});
    return result
}

exports.CheckStock = async (uid) => {
    const result = await sequelize.query('select device_number, i.code, i.name, i.safe_weight, sum(drd.weight) as sum_weight, drd.created_at from (select earlivery_device_id, max(device_raw_data.created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, device_raw_data drd left join earlivery_device ed on ed.id = drd.earlivery_device_id left join item i on i.id = ed.item_id left join location l on l.id = ed.location_id left join user u on u.id = l.user_id\n' +
        'where u.id = :uid and t2.max_date = drd.created_at and t2.earlivery_device_id = drd.earlivery_device_id group by code',
        {replacements: {uid: uid}, type: QueryTypes.SELECT});
    let Out_stock = 0;
    var arrPointHistory = [];
    var total = {};
    result.forEach(function (item, index, array) {
        if(item.safe_weight > item.sum_weight){
                var memberData = {};
                memberData.device_number = item.device_number;
                memberData.name = item.name;
                memberData.current_weight = item.sum_weight;
                memberData.latest_date = item.created_at;
                arrPointHistory.push(memberData);
        }
    });
    total.count = arrPointHistory.length;
    total.list = arrPointHistory;
    return total;
}


exports.CheckDevice = async (uid) => {
    return await sequelize.query('select B.device_number, i.name, weight, A.created_at from (select earlivery_device_id, max(device_raw_data.created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, device_raw_data as A left join earlivery_device B on A.earlivery_device_id = B.id left join item i on B.item_id = i.id left join location l on B.location_id = l.id left join user u on l.user_id = u.id\n' +
        '                                                     where (data_interval < TIMESTAMPDIFF(MINUTE, A.updated_at, current_timestamp) and u.id = :uid and t2.max_date = A.created_at and t2.earlivery_device_id = A.earlivery_device_id)',
        {replacements: {uid: uid}, type: QueryTypes.SELECT});
}

exports.ItemStock = async (uid) => {
    return await sequelize.query('select A.created_at, name, unit_weight, GROUP_CONCAT(B.device_number order by B.device_number SEPARATOR \',\') as device_numbers from item as A left join earlivery_device as B on A.id = B.item_id left join location as C on B.location_id = C.id left join user as D on D.id = C.user_id where D.id = :uid and A.created_at is not null group by name',
        {replacements: {uid: uid}, type: QueryTypes.SELECT});
}

exports.getWarehouse = async (uid) => {
    const a = 1
    return await sequelize.query('select l.warehouse_name, A.temperature, A.humidity, l.min_temp, l.max_temp, l.min_hum, l.max_hum, A.created_at from (select location_id, max(warehouse_raw_data.created_at) as max_date from warehouse_raw_data group by location_id) as t2, warehouse_raw_data as A left join location l on A.location_id = l.id left join user u on l.user_id = u.id\n' +
        'where u.id = :uid and t2.max_date = A.created_at and t2.location_id = l.id and warehouse_name is not null',
        {replacements: {uid: uid}, type: QueryTypes.SELECT});
}

exports.getStockChange = async (uid) => {
    return await sequelize.query('select device_number, d.weight ,earlivery_device.created_at from earlivery_device left join device_raw_data d on earlivery_device.id = d.earlivery_device_id left join location l on earlivery_device.location_id = l.id left join user u on l.user_id = u.id where u.id = :uid order by earlivery_device.created_at',
        {replacements: {uid: uid}, type: QueryTypes.SELECT});
}

exports.CheckWarehouse = async (uid) => {
    const result = await sequelize.query('select l.branch_name, l.warehouse_name , l.max_temp, l.min_temp, l.max_hum, l.min_hum, A.temperature, A.humidity, A.created_at from (select location_id, id, max(warehouse_raw_data.created_at) as max_date from warehouse_raw_data group by location_id) as t2, warehouse_raw_data as A left join location l on A.location_id = l.id left join user u on l.user_id = u.id\n' +
        'where u.id = :uid and t2.max_date = A.created_at and warehouse_name is not null',
        {replacements: {uid: uid}, type: QueryTypes.SELECT});
    var arrPointHistory = [];
    result.forEach(function (item, index, array) {
        if(item.temperature > item.max_temp || item.temperature < item.min_temp || item.humidity > item.max_hum || item.humidity < item.min_hum){
            var memberData = {};
            memberData.branch_name = item.branch_name;
            memberData.warehouse_name = item.warehouse_name;
            memberData.temperature = item.temperature;
            memberData.humidity = item.humidity;
            memberData.created_at = item.created_at;
            arrPointHistory.push(memberData);
        }
    });
    return arrPointHistory;
}


