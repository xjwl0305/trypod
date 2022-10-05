const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'summary',
        {
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
            tableName: 'summary',
            charset: "utf8",
            createdAt: false,
            updatedAt: false
        });
};