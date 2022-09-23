const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'summary_option',
        {
            report_writing_cycle: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
            },
            base_time: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        },
        {
            timestamps: true,
            charset: "utf8"
        });
};