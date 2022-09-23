const models = require("../models");

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

exports.updateUser = (data, uid) => {
    return new Promise((resolve, reject) => {
        models.User.update({
            phone: data.phone,
            email: data.email,
            company_name: data.company_name,
            company_address: data.company_address,
            company_detailed_address: data.company_detailed_address
        },{
            where: {
                id: uid
            }
        })
            .then(resolve)
            .catch(reject);
    });
}
