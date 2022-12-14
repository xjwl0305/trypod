const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'user',
        {
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            account: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            phone: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            hashed_password: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            salt: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            company_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            company_address: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            company_detailed_address: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            division: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            summary_option_id: {
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
            tableName: 'user',
            charset: "utf8",
            createdAt: false,
            updatedAt: false
        });
};
