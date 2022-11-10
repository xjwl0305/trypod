var express = require('express');
var router = express.Router();
const managementController = require("../Controller/management");

router.get('/itemGetAll', managementController.itemGetAll);
router.get('/itemGetBranch', managementController.itemGetBranch);
router.get('/itemGetLayer', managementController.itemGetLayer);
router.get('/itemGetHouse', managementController.itemGetHouse);
router.get('/deviceGetAll', managementController.deviceGetAll);
router.get('/deviceGetBranch', managementController.deviceGetBranch);
router.get('/deviceGetLayer', managementController.deviceGetLayer);
router.get('/deviceGetHouse', managementController.deviceGetHouse);
router.get('/branchList', managementController.branchList);
router.get('/layerList', managementController.layerList);
router.get('/warehouseList', managementController.warehouseList);
router.get('/warehouseInfo', managementController.warehouseInfo);

module.exports = router;