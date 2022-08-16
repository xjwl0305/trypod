const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'user',
        {
            company_id: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            user_id: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            user_company: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            company_address: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            contact_number: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            email_address: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
        },
        {
            timestamps: true,
        });
};
