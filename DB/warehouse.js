const models = require("../models");

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