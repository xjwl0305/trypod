const models = require("../models");
const {Op} = require("sequelize");

exports.findAll = () => {
    return new Promise(resolve => {
        models.user.findAll()
            .then(data => resolve(data))
            .catch(err => resolve(err))
    });
}

exports.checkExist = (data) => {
    return new Promise(resolve => {
        models.user.count({ where: data})
            .then(count => {
                if (count !== 0) {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            });
    });
}

exports.enroll = (data) => {
    return new Promise(resolve => {
        models.user.create(data)
            .then(resolve(true))
            .catch(err => {
                console.log(err);
                resolve(false);
            });
    });
}

exports.checkPassword = (data) => {
    return new Promise(resolve => {
        models.user.findOne({
            where: {[Op.and]: [{ account: data.account }, { hashed_password: data.password }]}
        })
            .then(data => {resolve(data)})
            .catch(err => resolve(err));
    });
}

exports.changePassword = (password, uid) => {
    return new Promise(resolve => {
        models.user.update({
            hashed_password: password
        },{
            where: {
                id: uid
            },
            returning: true
        })
            .then(data => {resolve(data)})
            .catch(err => resolve(err));
    });
}