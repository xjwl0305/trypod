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
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
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
            tableName: 'container',
            createdAt: false,
            updatedAt: false
        });
};
