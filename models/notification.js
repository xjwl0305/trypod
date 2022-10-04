const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'notification',
        {
            content: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            division: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
            }
        },
        {
            timestamps: true,
            tableName: 'notification',
            charset: "utf8"
        });
};