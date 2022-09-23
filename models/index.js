'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.user = require('./user')(sequelize, Sequelize);
db.warehouse_raw_data = require('./warehouse_raw_data')(sequelize, Sequelize);
db.summary_option = require('./summary_option')(sequelize, Sequelize);
//db.item_raw_data = require('./item_raw_data')(sequelize, Sequelize);
db.location = require('./location')(sequelize, Sequelize);
db.notification = require('./notification')(sequelize, Sequelize);
db.item = require('./item')(sequelize, Sequelize);
db.earlivery_device = require('./earlivery_device')(sequelize, Sequelize);
db.container = require('./container')(sequelize, Sequelize);
db.company_branch = require('./location')(sequelize, Sequelize);

// user와 company_branch 1:N
db.user.hasMany(db.location, {foreignKey:'user_id', sourceKey:'id'});
db.location.belongsTo(db.user,{foreignKey:'user_id',targetKey:'id'});
module.exports = db;
