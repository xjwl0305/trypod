const express = require('express');
const router = express.Router();
const curStockController = require("../Controller/current_stock");
const authMiddleware = require('../middlewares/auth');

router.use('/', authMiddleware);

router.get('/itemGetAll', curStockController.itemGetAll);
router.get('/itemGetBranch', curStockController.itemGetBranch);
router.get('/itemGetLayer', curStockController.itemGetLayer);
router.get('/itemGetHouse', curStockController.itemGetHouse);
router.get('/itemGetDetail', curStockController.itemGetDetail);
router.post('/itemStockChange', curStockController.itemStockChange);
router.get('/itemDataInfo', curStockController.itemDataInfo);
router.get('/deviceGetAll', curStockController.deviceGetAll);
router.get('/deviceGetBranch', curStockController.deviceGetBranch);
router.get('/deviceGetLayer', curStockController.deviceGetLayer);
router.get('/deviceGetHouse', curStockController.deviceGetHouse);
router.get('/deviceGetDetail', curStockController.deviceGetDetail);
router.post('/deviceStockChange', curStockController.deviceStockChange);
router.post('/reportDownload', curStockController.reportDownload);
router.get('/reportTimeSetting', curStockController.ReportTimeSetting);
router.post('/itemUsage', curStockController.itemUsage);
router.post('/deviceUsage', curStockController.deviceUsage);

module.exports = router;