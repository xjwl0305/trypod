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
    const data =  await sequelize.query('select A.created_at, name, unit_weight, GROUP_CONCAT(B.device_number order by B.device_number SEPARATOR \',\') as device_numbers from item as A left join earlivery_device as B on A.id = B.item_id left join location as C on B.location_id = C.id left join user as D on D.id = C.user_id where D.id = :uid and A.created_at is not null group by name limit 0,20',
        {replacements: {uid: uid}, type: QueryTypes.SELECT});
    let today = new Date();
    let return_data = data;
    for(let index =0; index<data.length; index++){
        const device_array = data[index].device_numbers.split(",");
        for (let step =0; step < device_array.length; step++){
            const data2 = await sequelize.query('select device_raw_data.created_at as created_at, device_raw_data.data_interval as data_interval from (select earlivery_device_id, max(device_raw_data.created_at) as max_date from device_raw_data group by earlivery_device_id) as t2 ,device_raw_data left join earlivery_device ed on ed.id = device_raw_data.earlivery_device_id\n' +
                '  where device_number = :device_number and device_raw_data.created_at = t2.max_date', {replacements: {device_number: device_array[step]}, type: QueryTypes.SELECT});
            let date = new Date(data2[0].created_at);
            date.setHours(date.getHours()+ data2[0].data_interval);
            if (date < today) {
                data[index].connection = 'warning'
                break;
            }
        }
    }
    const a = 1;
    return data;
}

exports.getWarehouse = async (uid) => {
    const a = 1
    return await sequelize.query('select l.warehouse_name, A.temperature, A.humidity, l.min_temp, l.max_temp, l.min_hum, l.max_hum, A.created_at from (select location_id, max(warehouse_raw_data.created_at) as max_date from warehouse_raw_data group by location_id) as t2, warehouse_raw_data as A left join location l on A.location_id = l.id left join user u on l.user_id = u.id\n' +
        'where u.id = :uid and t2.max_date = A.created_at and t2.location_id = l.id and warehouse_name is not null',
        {replacements: {uid: uid}, type: QueryTypes.SELECT});
}

exports.getStockChange = async (uid) => {
    return await sequelize.query('select summary.id, sum(sc.weight) as total_stock, summary.created_at from (SELECT summary.id, DATE(summary.`created_at`) AS `date`, max(summary.`created_at`) as max_date FROM summary left join user u on u.id = summary.user_id where u.id = 1 GROUP BY `date`) as t2, summary left join summary_content sc on summary.id = sc.summary_id left join user u on u.id = summary.user_id\n' +
        'where u.id = :uid and t2.max_date = summary.created_at and sc.weight is not null group by DATE(summary.created_at)',
        {replacements: {uid: uid}, type: QueryTypes.SELECT});
}

exports.CheckWarehouse = async (uid) => {
    const result = await sequelize.query('select distinct l.branch_name, l.warehouse_name , l.max_temp, l.min_temp, l.max_hum, l.min_hum, A.temperature, A.humidity, A.created_at from (select location_id, id, max(warehouse_raw_data.created_at) as max_date from warehouse_raw_data group by location_id) as t2, warehouse_raw_data as A left join location l on A.location_id = l.id left join user u on l.user_id = u.id\n' +
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


