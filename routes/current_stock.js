var express = require('express');
var router = express.Router();
const curStockController = require("../Controller/current_stock");

router.get('/itemGetAll', curStockController.itemGetAll);
router.get('/itemGetBranch', curStockController.itemGetBranch);
router.get('/itemGetLayer', curStockController.itemGetLayer);
router.get('/itemGetHouse', curStockController.itemGetHouse);
router.get('/itemGetDetail', curStockController.itemGetDetail);
router.get('/deviceGetAll', curStockController.deviceGetAll);
router.get('/deviceGetBranch', curStockController.deviceGetBranch);
router.get('/deviceGetLayer', curStockController.deviceGetLayer);
router.get('/deviceGetHouse', curStockController.deviceGetHouse);
//router.get('/deviceGetDetail', curStockController.deviceGetDetail);
router.post('/reportDownload', curStockController.reportDownload);
router.post('/reportSetting', curStockController.ReportSetting);
module.exports = router;