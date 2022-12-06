var express = require('express');
var router = express.Router();

const auth = require('./auth');
const home = require('./home');
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

module.exports = router;
