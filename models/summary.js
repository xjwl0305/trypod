const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'summary',
        {
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
        },
        {
            timestamps: true,
            tableName: 'summary',
            charset: "utf8"
        });
};