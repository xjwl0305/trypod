const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'earlivery_device',
        {
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            nick_name: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            device_number: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            address: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            detailed_address: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            description: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            order_weight: {
                type: Sequelize.FLOAT,
                allowNull: true,
            },
            order_state: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            active: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            container_max_weight: {
                type: Sequelize.FLOAT,
                allowNull: true,
            },
            item_id: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            container_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            location_id: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
        },
        {
            timestamps: true,
            tableName: 'earlivery_device',
            charset: "utf8"
        });
};