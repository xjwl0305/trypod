const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'notification',
        {
            content: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            division: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
        },
        {
            timestamps: true,
            charset: "utf8"
        });
};