const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const config = require('../config')
const authDB = require('../db/auth')

exports.registerAPI = (req, res) => {
    const {id, password} = req.body
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
    const {phone} = req.body
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
    let {account, phone, hashed_password, email, company_name, company_address, company_detailed_address, division} = req.body
    hashed_password = crypto.createHmac('sha1', config.secret)
        .update(hashed_password)
        .digest('base64')
    authDB.enroll({account, phone, hashed_password, email, company_name, company_address, company_detailed_address, division})
        .then(result => {
            if (result) {
                res.status(200).json(
                    {
                        "success": result
                    }
                )
            } else {
                res.status(403).json(
                    {
                        "success": result
                    }
                )
            }
        });
}

exports.loginAPI = (req, res) => {
    let {account, password} = req.body
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
                        expiresIn: '7d'
                    }, (err, token) => {
                        if (err) reject(err)
                        resolve(token)
                    })
            })
        }
    }

    const respond = (token) => {
        res.status(200).json({
            message: 'logged in successfully',
            success: true,
            token
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

exports.checkAPI = (req, res) => {
    res.json({
        success: true,
        info: req.decoded
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

    let password = req.body.password;
    password = crypto.createHmac('sha1', config.secret)
        .update(password)
        .digest('base64')
    authDB.changePassword(password, req.decoded.uid)
        .then(respond)
        .catch(onError)
}