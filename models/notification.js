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
            tableName: 'notification',
            charset: "utf8",
            createdAt: false,
            updatedAt: false
        });
};