const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'summary_content',
        {
            device_number: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            item_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            item_category: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            item_code: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            weight: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            battery: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            branch_name: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            warehouse_name: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            layer_name: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            connection: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            last_date_time: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            interval: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            usage_weight: {
                type: Sequelize.FLOAT,
                allowNull: true,
            },
            container_weight: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            real_weight: {
                type: Sequelize.FLOAT,
                allowNull: true,
            },
            summary_id: {
                type: Sequelize.INTEGER,
                allowNull: true
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
            tableName: 'summary_content',
            charset: "utf8",
            createdAt: false,
            updatedAt: false
        });
};