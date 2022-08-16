const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'company_branch',
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
            branch_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            branch_address: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            address_detail: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            branch_manager_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
        },
        {
            timestamps: true,
        });
};
