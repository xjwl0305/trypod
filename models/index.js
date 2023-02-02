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
  //sequelize = new Sequelize(process.env[config.use_env_variable], config);
  sequelize = new Sequelize(  process.env.database,
      process.env.username,
      process.env.password,
      {
        host: process.env.host,
        dialect: "mysql",
        //timezone: "+09:00", // DB에 저장할 때 시간 설정
          dialectOptions: {
              charset: 'utf8mb4',
              dateStrings: true,
              typeCast: true
          }
          ,define: {
              timestamps: true
          }
      });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password,       {
      host: config.host,
      dialect: "mysql",
      //timezone: "+09:00", // DB에 저장할 때 시간 설정
      dialectOptions: {
          charset: 'utf8mb4',
          dateStrings: true,
          typeCast: true
      }
      ,define: {
          timestamps: true
      }
  });
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
db.location = require('./location')(sequelize, Sequelize);
db.notification = require('./notification')(sequelize, Sequelize);
db.item = require('./item')(sequelize, Sequelize);
db.earlivery_device = require('./earlivery_device')(sequelize, Sequelize);
db.container = require('./container')(sequelize, Sequelize);
db.company_branch = require('./location')(sequelize, Sequelize);
db.summary = require('./summary')(sequelize, Sequelize);
db.orderlist = require('./orderlist')(sequelize, Sequelize);
db.device_raw_data = require('./device_raw_data')(sequelize, Sequelize);
db.summary_content = require('./summary_content')(sequelize, Sequelize);

// user와 location 1:N
db.user.hasMany(db.location, {foreignKey:'user_id', sourceKey:'id'});
db.location.belongsTo(db.user,{foreignKey:'user_id',targetKey:'id'});
// user와 notification 1:N
db.user.hasMany(db.notification, {foreignKey:'user_id', sourceKey:'id'});
db.notification.belongsTo(db.user, {foreignKey:'user_id', targetKey:'id'});
// user와 summary_option N:1
db.summary_option.hasMany(db.user, {foreignKey:'summary_option_id', sourceKey:'id'});
db.user.belongsTo(db.summary_option, {foreignKey:'summary_option_id', targetKey:'id'});
// user와 summary 1:N
db.user.hasMany(db.summary, {foreignKey: 'user_id', sourceKey: 'id'});
db.summary.belongsTo(db.user, {foreignKey:'user_id', targetKey: 'id'});
// user와 container 1:N
db.user.hasMany(db.container, {foreignKey: 'user_id', sourceKey: 'id'});
db.container.belongsTo(db.user, {foreignKey:'user_id', targetKey: 'id'});

// location과 earlivery_device 1:N
db.location.hasMany(db.earlivery_device, {foreignKey: 'location_id', sourceKey:'id'});
db.earlivery_device.belongsTo(db.location, {foreignKey: 'location_id', targetKey:'id'});
// location과 warehouse_raw_data
db.location.hasMany(db.warehouse_raw_data, {foreignKey: 'location_id', sourceKey:'id'});
db.warehouse_raw_data.belongsTo(db.location, {foreignKey: 'location_id', targetKey:'id'});

// earlivery_device 와 device_raw_data 1:1
db.earlivery_device.hasOne(db.device_raw_data, {foreignKey: 'earlivery_device_id', sourceKey:'id'});
db.device_raw_data.belongsTo(db.earlivery_device, {foreignKey: 'earlivery_device_id', targetKey:'id'});
// earlivery_device 와 device_raw_data N:1
db.item.hasMany(db.earlivery_device, {foreignKey: 'item_id', sourceKey:'id'});
db.earlivery_device.belongsTo(db.earlivery_device, {foreignKey: 'item_id', targetKey:'id'});
// earlivery_device 와 container N:1
db.container.hasMany(db.earlivery_device, {foreignKey: 'container_id', sourceKey:'id'});
db.earlivery_device.belongsTo(db.container, {foreignKey: 'container_id', targetKey:'id'});


// summary 와 summary_content 1:N
db.summary.hasMany(db.summary_content, {foreignKey: 'summary_id', sourceKey:'id'});
db.summary_content.belongsTo(db.earlivery_device, {foreignKey: 'summary_id', targetKey:'id'});
module.exports = db;
