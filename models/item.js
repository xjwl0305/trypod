const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'item',
        {
            name: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            category: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            code: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            unit_weight: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            alarm_weight: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            max_weight: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            image_url: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            description: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            division: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            vaild_date: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            price: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            recommand_order_weight: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            volume: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
        },
        {
            timestamps: true,
            charset: "utf8"
        });
};