var express = require('express');
var router = express.Router();
const userController = require("../Controller/user");
const authMiddleware = require('../middlewares/auth');

router.use('/', authMiddleware);
router.get('/updateUser', userController.updateUserAPI);
router.get('/getPhone', userController.getPhoneAPI);
router.get('/getEmail', userController.getEmailAPI);
router.get('/getCompanyName', userController.getCompanyNameAPI);
router.get('/getCompanyAddress', userController.getCompanyAddressAPI);
router.get('/getCompanyDetailed', userController.getCompanyDetailedAPI);
router.get('/getTotalInfo', userController.getTotalInfo);

module.exports = router;