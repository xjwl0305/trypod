var express = require('express');
var router = express.Router();
const itemController = require("../Controller/item");

// router.post('/register', userController.registerAPI);
// router.get('/all', userController.getAPI);
// router.post('/checkphone', userController.phone_duplicateAPI);
// router.post('/enroll', userController.enrollAPI);
// router.post('/login', userController.loginAPI);
// router.get('/check', userController.checkAPI);
// router.post('/password', userController.changePWAPI);
router.get('/item', itemController.getItem);

module.exports = router;