const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'location',
        {
            company_id: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
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
                unique: true,
            },
            layer_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            warehouse_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            manager_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            manager_phone: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            manager_email: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            min_temp: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            max_temp: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            min_hum: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            max_hum: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            user_id: {
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
