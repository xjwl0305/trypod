const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'item',
        {
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            category: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            code: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            unit_weight: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            safe_weight: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            max_weight: {
                type: Sequelize.FLOAT,
                allowNull: true,
            },
            image_url: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            description: {
                type: Sequelize.STRING(255),
                allowNull: true
            },
            division: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            vaild_date: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            price: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            recommand_order_weight: {
                type: Sequelize.FLOAT,
                allowNull: true,
            },
            volume: {
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
            tableName: 'item',
            charset: "utf8",
            createdAt: false,
            updatedAt: false,
        });
};