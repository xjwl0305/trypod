const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'location',
        {
            branch_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            branch_address: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            branch_detailed_address: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            layer_name: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            warehouse_name: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            manager_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            manager_phone: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            manager_email: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            min_temp: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            max_temp: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            min_hum: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            max_hum: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
        },
        {
            timestamps: true,
            tableName: 'location',
            charset: "utf8"

        });
};
