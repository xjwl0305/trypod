const models = require("../models");
const {Op, QueryTypes, Sequelize, literal} = require("sequelize");
const { sequelize } = require('../models/index')


exports.findWeight = async (uid) => {
    const [result, metadata] = await sequelize.query('select sum(weight) from device_raw_data as A left join earlivery_device as B on A.earlivery_device_id = B.id left join location as C on B.location_id = C.id left join user as D on C.user_id = D.id where D.id = :uid',
        {replacements: { uid: uid }, type: QueryTypes.SELECT});
    return result
}

exports.CheckStock = async (uid) => {
    const result = await sequelize.query('select safe_weight, B.id , A.unit_weight as unit_weight , A.name as name, B.device_number as device_number from item as A left join earlivery_device as B on A.id = B.item_id left join location as C on B.location_id = C.id left join user as D on D.id = C.user_id where D.id = :uid',
        {replacements: {uid: uid}, type: QueryTypes.SELECT});
    const result2 = await sequelize.query('select earlivery_device_id , created_at, sum(weight) as sum_weight from device_raw_data group by earlivery_device_id',
        {type: QueryTypes.SELECT});
    let Out_stock = 0;
    var arrPointHistory = [];
    var total = {};
    result.forEach(function (item, index, array) {
        result2.forEach(function (item2, index, array) {
            if(item.id === item2.earlivery_device_id){
                if(item.safe_weight > item2.sum_weight){
                    const mok = (item.safe_weight - item2.sum_weight)/item.unit_weight;
                    Out_stock = Out_stock + mok;
                    var memberData = {};
                    memberData.device_number = item.device_number;
                    memberData.name = item.name;
                    memberData.current_weight = item2.sum_weight;
                    memberData.latest_date = item2.created_at;
                    arrPointHistory.push(memberData);
                }
            }
        });
    });
    total.count = Out_stock;
    total.list = arrPointHistory;
    console.log(total);
    return total;
}


exports.CheckDevice = async (uid) => {
    return await sequelize.query('select B.device_number, i.name, weight, A.created_at from device_raw_data as A left join earlivery_device B on A.earlivery_device_id = B.id left join item i on B.item_id = i.id left join location l on B.location_id = l.id left join user u on l.user_id = u.id where (data_interval < TIMESTAMPDIFF(MINUTE, A.created_at, current_timestamp) and u.id = :uid)',
        {replacements: {uid: uid}, type: QueryTypes.SELECT});
}

exports.ItemStock = async (uid) => {
    return await sequelize.query('select A.created_at, name, unit_weight, GROUP_CONCAT(B.device_number order by B.device_number SEPARATOR \',\') as device_numbers from item as A left join earlivery_device as B on A.id = B.item_id left join location as C on B.location_id = C.id left join user as D on D.id = C.user_id where D.id = :uid group by unit_weight',
        {replacements: {uid: uid}, type: QueryTypes.SELECT});
}

exports.getWarehouse = async (uid) => {
    const a = 1
    return await sequelize.query('select A.id, A.temperature, A.humidity, l.min_temp, l.max_temp, l.min_hum, l.max_hum  from warehouse_raw_data as A left join location l on A.location_id = l.id left join user u on l.user_id = u.id where u.id = :uid',
        {replacements: {uid: uid}, type: QueryTypes.SELECT});
}

exports.getStockChange = async (uid) => {
    return await sequelize.query('select device_number, d.weight ,earlivery_device.created_at from earlivery_device left join device_raw_data d on earlivery_device.id = d.earlivery_device_id left join location l on earlivery_device.location_id = l.id left join user u on l.user_id = u.id where u.id = 1 order by earlivery_device.created_at',
        {replacements: {uid: uid}, type: QueryTypes.SELECT});
}

exports.CheckWarehouse = async (uid) => {
    return await sequelize.query('select l.warehouse_name, temperature, humidity, A.created_at from warehouse_raw_data as A left join location l on A.location_id = l.id left join user u on l.user_id = u.id where A.temperature < l.min_temp or A.temperature > l.max_temp or A.humidity < l.min_hum or A.humidity > l.max_hum and u.id = :uid',
        {replacements: {uid: uid}, type: QueryTypes.SELECT});
}


