const models = require("../models");
const {Op, QueryTypes, Sequelize, literal} = require("sequelize");
const { sequelize } = require('../models/index')


exports.findItem = async (uid) => {
    const [result, metadata] = await sequelize.query("select *from item as A left join earlivery_device as B on A.id = B.item_id left join location as C on B.location_id = C.id left join user as D on D.id = C.user_id where D.id = :uid order by name LIMIT 20")
    return result
}

