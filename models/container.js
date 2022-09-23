const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'container',
        {
            name: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            weight: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            earlivery_device_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
            },
        },
        {
            timestamps: true,
            charset: "utf8"
        });
};
