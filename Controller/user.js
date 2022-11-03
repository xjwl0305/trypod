const userDB = require('../DB/user')
const admin = require('firebase-admin')

exports.updateUserAPI = (req, res) => {
    userDB.updateUser(req.query, req.decoded.uid)
        .then(() => {
            res.status(200).json({
                success: true
            });
        })
        .catch((err => {
            res.status(403).json({
                success: false,
                err
            });
        }));
}

exports.getPhoneAPI = (req, res) => {
    userDB.getPhone()
        .then(phone => {
            res.status(200).json({
                phone: phone
            })
        })
}

exports.getEmailAPI = (req, res) => {
    userDB.getEmail()
        .then(email => {
            res.status(200).json({
                email: email
            })
        })
}

exports.getCompanyNameAPI = (req, res) => {
    userDB.getCompany_name()
        .then(company_name => {
            res.status(200).json({
                company_name: company_name
            })
        })
}

exports.getCompanyAddressAPI = (req, res) => {
    userDB.getCompany_address()
        .then(company_address => {
            res.status(200).json({
                company_address: company_address
            })
        })
}

exports.getCompanyDetailedAPI = (req, res) => {
    userDB.getCompany_detailed_address()
        .then(company_detailed_address => {
            res.status(200).json({
                company_detailed_address: company_detailed_address
            })
        })
}

exports.getTotalInfo = (req, res) => {
    const uid = req.query.uid;
    userDB.getTotalInfo(uid)
        .then(result => {
            res.status(200).json({
                info: result
            })
        })
}