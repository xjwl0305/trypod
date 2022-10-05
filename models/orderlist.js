const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'orderlist',
        {
            date_time: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            device_number: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            item_name: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            item_price: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            item_count: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            total_price: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            desc: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            created_at:{
                type: 'TIMESTAMP',
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
                allowNull: false
            },
            updated_at:{
                type: 'TIMESTAMP',
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
                allowNull: false
            }
        },
        {
            timestamps: true,
            tableName: 'orderlist',
            charset: "utf8",
            createdAt: false,
            updatedAt: false
        });
};