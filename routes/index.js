var express = require('express');
var router = express.Router();

const auth = require('./auth');
const home = require('./home');
const stock = require('./stock');
const item = require('./item');
const env_info = require('./envInfo');
const profile = require('./profile');

router.use('/login', auth);
router.use('/home', home);
router.use('/stock', stock);
router.use('/item', item);
router.use('/envInfo', env_info);
router.use('/profile', profile);

module.exports = router;
