var express = require('express');
var router = express.Router();

const auth = require('./auth');
const home = require('./home');
// const stock = require('./stock');
// const item = require('./item');
// const env_info = require('./envInfo');
// const profile = require('./profile');
const user = require('./users');
const warehouse = require('./warehouse');
const currentStock = require('./current_stock');
const management = require('./management');
router.use('/users', user);
router.use('/auth', auth);
router.use('/home', home);
router.use('/warehouse', warehouse);
router.use('/currentStock', currentStock);
router.use('/management', management);
// router.use('/stock', stock);
// router.use('/item', item);
// router.use('/envInfo', env_info);
// router.use('/profile', profile);

module.exports = router;
