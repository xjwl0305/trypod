var express = require('express');
var router = express.Router();
const curStockController = require("../Controller/current_stock");

router.get('/itemGetAll', curStockController.itemGetAll);
router.get('/itemGetBranch', curStockController.itemGetBranch);
router.get('/itemGetLayer', curStockController.itemGetLayer);
router.get('/itemGetHouse', curStockController.itemGetHouse);
router.get('/deviceGetAll', curStockController.deviceGetAll);
router.get('/deviceGetBranch', curStockController.deviceGetBranch);
router.get('/deviceGetLayer', curStockController.deviceGetLayer);
router.get('/deviceGetHouse', curStockController.deviceGetHouse);
router.post('/reportDownload', curStockController.reportDownload);
module.exports = router;