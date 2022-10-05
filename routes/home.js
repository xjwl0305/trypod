var express = require('express');
var router = express.Router();
const homeController = require("../Controller/home");

router.get('/weight', homeController.getWeight);
router.get('/checkStock', homeController.checkStock);
router.get('/itemStock', homeController.itemStock);
module.exports = router;