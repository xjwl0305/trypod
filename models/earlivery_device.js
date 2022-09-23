const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'earlivery_device',
        {
            nick_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            device_number: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
            },
            address: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            detailed_address: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            description: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            order_weight: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
            },
            order_state: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            active: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            item_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
            },
            location_id: {
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