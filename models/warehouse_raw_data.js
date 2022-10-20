const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'warehouse_raw_data',
        {
            temperature: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            humidity: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            location_id: {
                type: Sequelize.INTEGER,
                allowNull: false
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
            tableName: 'warehouse_raw_data',
            charset: "utf8",
            createdAt: false,
            updatedAt: false
        });
};