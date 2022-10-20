var express = require('express');
var router = express.Router();
const warehouseController = require("../Controller/warehouse");

router.get('/callRawdata', warehouseController.CallRawData);
module.exports = router;