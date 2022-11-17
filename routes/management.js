var express = require('express');
var router = express.Router();
const managementController = require("../Controller/management");

router.get('/itemGetAll', managementController.itemGetAll);
router.get('/itemAdd', managementController.itemAdd);
router.get('/deviceGetAll', managementController.deviceGetAll);
router.get('/deviceGetBranch', managementController.deviceGetBranch);
router.get('/deviceGetLayer', managementController.deviceGetLayer);
router.get('/deviceGetHouse', managementController.deviceGetHouse);
router.get('/branchList', managementController.branchList);
router.get('/layerList', managementController.layerList);
router.get('/warehouseList', managementController.warehouseList);
router.get('/warehouseInfo', managementController.warehouseInfo);
router.get('/branchAdd', managementController.branchAdd);
router.get('/layerAdd', managementController.layerAdd);
router.get('/warehouseAdd', managementController.warehouseAdd);

module.exports = router;