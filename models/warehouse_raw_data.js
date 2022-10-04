const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'warehouse_raw_data',
        {
            temperature: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true
            },
            humidity: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true
            },
            location_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        },
        {
            timestamps: true,
            tableName: 'warehouse_raw_data',
            charset: "utf8"
        });
};