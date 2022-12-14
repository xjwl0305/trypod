const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'device_raw_data',
        {
            weight: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            battery: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            data_interval: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            sn: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            sid: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            earlivery_device_id: {
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
            charset: "utf8",
            tableName: 'device_raw_data',
            createdAt: false,
            updatedAt: false
        });
};