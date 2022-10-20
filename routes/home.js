var express = require('express');
var router = express.Router();
const homeController = require("../Controller/home");

router.get('/weight', homeController.getWeight);
router.get('/checkStock', homeController.checkStock);
router.get('/itemStock', homeController.itemStock);
router.get('/getWarehouse', homeController.GetWarehouse);
router.get('/checkDevice', homeController.checkDevice);
router.get('/checkWarehouse', homeController.checkWarehouse);

module.exports = router;