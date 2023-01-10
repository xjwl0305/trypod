const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const config = require('../config')
const authDB = require('../DB/auth')
const {sendMail} = require("../DB/auth");
const curStockDB = require("../DB/current_stock");

exports.registerAPI = (req, res) => {
    const {id, password} = req.query
    authDB.checkPassword({id, password}).then(result =>
        res.status(200).json(
            {
                "check_password": result
            })
    );
}

exports.getAPI = (req, res) => {
    authDB.findAll()
        .then(all => res.status(200).json(
            {
                "all": all
            }
        ));
}

exports.phone_duplicateAPI = (req, res) => {
    const {phone} = req.query
    authDB.checkExist({phone})
        .then(result => {
            if (result) {
                res.status(200).json(
                    {
                        "exist": false
                    }
                )
            } else {
                res.status(200).json(
                    {
                        "exist": true
                    }
                )
            }
        })
}

exports.enrollAPI = (req, res) => {
    let {account, phone, hashed_password, email, company_name, company_address, company_detailed_address, division} = req.query
    hashed_password = crypto.createHmac('sha1', config.secret)
        .update(hashed_password)
        .digest('base64')
    authDB.enroll({account, phone, hashed_password, email, company_name, company_address, company_detailed_address, division})
        .then(result => {
            if (result[1] === 1) {
                res.status(200).json(
                    {
                        "success": true,
                        "uid": result[0]
                    }
                )
            } else {
                res.status(403).json(
                    {
                        "success": false
                    }
                )
            }
        });
}

exports.loginAPI = (req, res) => {
    let {account, password} = req.query
    password = crypto.createHmac('sha1', config.secret)
        .update(password)
        .digest('base64')
    const secret = req.app.get('jwt-secret')
    const check = (user) => {
        if (user === null) {
            throw new Error('login failed')
        } else {
            return new Promise((resolve, reject) => {
                jwt.sign(
                    {
                        phone: user.phone,
                        account: user.account,
                        uid: user.id
                    },
                    secret,
                    {
                        expiresIn: '60m'
                    }, (err, token) => {
                        if (err) reject(err)
                        resolve([token, user.id])
                    })
            })
        }
    }

    const respond = (user_data) => {
        res.status(200).json({
            message: 'logged in successfully',
            success: true,
            token: user_data[0],
            uid : user_data[1]
        })
    }

    const onError = (error) => {
        res.status(403).json({
            message: error.message,
            success: false
        })
    }

    authDB.checkPassword({account, password})
        .then(check)
        .then(respond)
        .catch(onError)
}

exports.checkID = (req, res) => {
    const account = req.query.account;
    authDB.checkID(account)
        .then(result => {
            if(result) {
                res.status(200).json(
                    {
                        message: 'checkID',
                        duplicate: true
                    });
            }else{
                res.status(200).json(
                    {
                        message: 'checkID',
                        duplicate: false
                    }
                )
            }
        })
}



exports.changePWAPI = (req, res) => {
    const respond = () => {
        res.status(200).json({
            success: true
        })
    }

    const onError = (error) => {
        res.status(403).json({
            success: false,
            error
        })
    }

    let password = req.query.password;
    password = crypto.createHmac('sha1', config.secret)
        .update(password)
        .digest('base64')
    authDB.changePassword(password, req.query.uid)
        .then(respond)
        .catch(onError)
}

exports.SendMail = (req, res) => {
    const {mail} = req.query;
    authDB.sendMail(mail, res)
        .then(res.status(200).json(
            {
                message: 'send in succe ssfully',
                success: true,
            })
        )
        .catch(res.status(500).json(
            {
                message: 'Email not exist',
                success: false
            }
        ))
}
exports.CheckSendMail = (req, res) => {
    const {mail} = req.query;
    const onError = (error) => {
        res.status(500).json({
            message: error.message,
            success: false
        })
    }
    authDB.CheckSendMail(mail, res)
        .then(result => {
            if(result) {
                res.status(200).json(
                    {
                        message: 'send_success',
                        success: result
                    });
            }else{
                res.status(403).json(
                    {
                        "message": 'invalid_mail',
                        "success": result
                    }
                )
            }
            })
        .catch(onError)
}


exports.checkMailCode = (req, res) => {
    authDB.checkCode(req)
        .then(result => {
            res.status(200).json(
                {
                    message: 'auth complete',
                    success: result
                });
        });
}

exports.ReportSetting = (req, res) => {
    const uid = req.query.uid;
    const account = req.query.account;
    curStockDB.ReportSetting(uid, account).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}