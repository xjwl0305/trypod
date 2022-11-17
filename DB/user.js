const models = require("../models");
const {sequelize} = require("../models");
const {QueryTypes} = require("sequelize");

exports.getPhone = (uid) => {
    return new Promise(resolve => {
        models.User.findOne({
            attributes: ['phone'],
            where: {
                id: uid
            }
        })
            .then(data => resolve(data))
            .catch(err => resolve(err));
    });
}

exports.getEmail = (uid) => {
    return new Promise(resolve => {
        models.User.findOne({
            attributes: ['email'],
            where: {
                id: uid
            }
        })
            .then(data => resolve(data))
            .catch(err => resolve(err));
    });
}

exports.getCompany_name = (uid) => {
    return new Promise(resolve => {
        models.User.findOne({
            attributes: ['company_name'],
            where: {
                id: uid
            }
        })
            .then(data => resolve(data))
            .catch(err => resolve(err));
    });
}

exports.getCompany_address = (uid) => {
    return new Promise(resolve => {
        models.User.findOne({
            attributes: ['company_address'],
            where: {
                id: uid
            }
        })
            .then(data => resolve(data))
            .catch(err => resolve(err));
    });
}

exports.getCompany_detailed_address = (uid) => {
    return new Promise(resolve => {
        models.User.findOne({
            attributes: ['company_detailed_address'],
            where: {
                id: uid
            }
        })
            .then(data => resolve(data))
            .catch(err => resolve(err));
    });
}

exports.updateUser = async (data) => {
    return await sequelize.query('update user set company_name = :company_name, phone = :phone, email= :email, company_address= :company_address, company_detailed_address = :company_detailed_address\n' +
        'where id = :uid',
        {replacements: {uid: data.uid, company_name: data.company_name, phone: data.phone, email: data.email, company_address: data.company_address, company_detailed_address: data.company_detailed_address}, type: QueryTypes.UPDATE})
}

exports.getTotalInfo = async (uid) => {
    const [result, metadata] = await sequelize.query('select company_name, phone, email, company_address, company_detailed_address from user where id = :uid',
        {replacements: {uid: uid}, type: QueryTypes.SELECT});
    return result
}