const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'container',
        {
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            weight: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            earlivery_device_id: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
        },
        {
            timestamps: true,
            charset: "utf8",
            tableName: 'container',
        });
};
