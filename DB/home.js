const models = require("../models");
const {Op, QueryTypes, Sequelize, literal} = require("sequelize");
const { sequelize } = require('../models/index')


exports.findWeight = async (uid) => {
    const [result, metadata] = await sequelize.query('select sum(weight) from device_raw_data as A left join earlivery_device as B on A.earlivery_device_id = B.id left join location as C on B.location_id = C.id left join user as D on C.user_id = D.id where D.id = :uid',
        {replacements: { uid: uid }, type: QueryTypes.SELECT});
    return result
}

exports.CheckStock = async (uid) => {
    const result = await sequelize.query('select safe_weight, B.id , A.unit_weight as unit_weight from item as A left join earlivery_device as B on A.id = B.item_id left join location as C on B.location_id = C.id left join user as D on D.id = C.user_id where D.id = :uid',
        {replacements: {uid: uid}, type: QueryTypes.SELECT});
    const result2 = await sequelize.query('select earlivery_device_id, sum(weight) as sum_weight from device_raw_data group by earlivery_device_id',
        {type: QueryTypes.SELECT});
    let Out_stock = 0;
    result.forEach(function (item, index, array) {
        result2.forEach(function (item2, index, array) {
            if(item.id === item2.earlivery_device_id){
                if(item.safe_weight > item2.sum_weight){
                    const mok = (item.safe_weight - item2.sum_weight)/item.unit_weight;
                    Out_stock = Out_stock + mok;
                }
            }
        })
    })
    return Out_stock;
}

exports.ItemStock = async (uid) => {
    return await sequelize.query('select A.updated_at, name, unit_weight, GROUP_CONCAT(B.device_number order by B.device_number SEPARATOR \',\') as device_numbers from item as A left join earlivery_device as B on A.id = B.item_id left join location as C on B.location_id = C.id left join user as D on D.id = C.user_id where D.id = :uid group by unit_weight',
        {replacements: {uid: uid}, type: QueryTypes.SELECT});
}