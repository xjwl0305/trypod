var express = require('express');
var router = express.Router();
const managementController = require("../Controller/management");

router.get('/itemGetAll', managementController.itemGetAll);
router.get('/itemAdd', managementController.itemAdd);
router.get('/deviceGetAll', managementController.deviceGetAll);
router.get('/deviceGetBranch', managementController.deviceGetBranch);
router.get('/deviceGetLayer', managementController.deviceGetLayer);
router.get('/deviceGetHouse', managementController.deviceGetHouse);
router.get('/deviceUpdateData', managementController.deviceUpdateData);
router.get('/deviceUpdateApply', managementController.deviceUpdateApply);
router.get('/deviceDelete', managementController.deviceDelete);
router.get('/branchList', managementController.branchList);
router.get('/layerList', managementController.layerList);
router.get('/warehouseList', managementController.warehouseList);
router.get('/warehouseInfo', managementController.warehouseInfo);
router.get('/branchAdd', managementController.branchAdd);
router.get('/layerAdd', managementController.layerAdd);
router.get('/warehouseAdd', managementController.warehouseAdd);
router.get('/branchUpdate', managementController.branchUpdate);
router.get('/layerUpdate', managementController.layerUpdate);
router.get('/warehouseUpdate', managementController.warehouseUpdate);
router.get('/branchDel', managementController.branchDel);
router.get('/layerDel', managementController.layerDel);
router.get('/warehouseDel', managementController.warehouseDel);

module.exports = router;