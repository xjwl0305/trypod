const models = require("../models");
const {Op, QueryTypes, Sequelize, literal} = require("sequelize");
const { sequelize } = require('../models/index')


exports.findWeight = async (uid) => {
    const [result, metadata] = await sequelize.query("select A.id, A.weight, A.data_interval, A.updatedAt from device_raw_data as A left join earlivery_device as B on A.earlivery_device_id = B.id left join location as C on B.location_id = C.id and C.user_id = 2 left join user as D on D.id = C.user_id where D.id = 2")
    return result
}
