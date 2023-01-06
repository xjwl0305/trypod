var express = require('express');
var router = express.Router();
const warehouseController = require("../Controller/warehouse");
const authMiddleware = require('../middlewares/auth');

router.use('/', authMiddleware);
router.get('/callRawdata', warehouseController.CallRawData);
module.exports = router;