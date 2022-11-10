var express = require('express');
var router = express.Router();
const userController = require("../Controller/auth");

router.post('/register', userController.registerAPI);
router.get('/all', userController.getAPI);
router.post('/checkphone', userController.phone_duplicateAPI);
router.post('/enroll', userController.enrollAPI);
router.post('/login', userController.loginAPI);
router.get('/check', userController.checkAPI);
router.post('/password', userController.changePWAPI);
router.get('/sendMail', userController.SendMail);
router.get('/checkEmail', userController.checkMailCode);
router.get('/ChecksendEmail', userController.CheckSendMail);

module.exports = router;