const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'summary_option',
        {
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            report_writing_cycle: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            base_time: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        },
        {
            timestamps: true,
            tableName: 'summary_option',
            charset: "utf8"
        });
};