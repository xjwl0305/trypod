const models = require("../models");
const {Op} = require("sequelize");
const {auth} = require("firebase-admin");
const nodemailer = require('nodemailer');
const util = require("util");
const ejs = require('ejs');
const bcrypt = require('bcrypt');
const cookie = require('cookie');
// const app = require('express')();
// const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(cookieParser());
exports.findAll = () => {
    return new Promise(resolve => {
        models.user.findAll()
            .then(data => resolve(data))
            .catch(err => resolve(err))
    });
}
exports.checkExist = (data) => {
    return new Promise(resolve => {
        models.user.count({ where: data})
            .then(count => {
                if (count !== 0) {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            });
    });
}
exports.enroll = (data) => {
    return new Promise(resolve => {
        models.user.create(data)
            .then(resolve(true))
            .catch(err => {
                console.log(err);
                resolve(false);
            });
    });
}
exports.checkPassword = (data) => {
    return new Promise(resolve => {
        models.user.findOne({
            where: {[Op.and]: [{ account: data.account }, { hashed_password: data.password }]}
        })
            .then(data => {resolve(data)})
            .catch(err => resolve(err));
    });
}
exports.changePassword = (password, uid) => {
    return new Promise(resolve => {
        models.user.update({
            hashed_password: password
        },{
            where: {
                id: uid
            },
            returning: true
        })
            .then(data => {resolve(data)})
            .catch(err => resolve(err));
    });
}

exports.sendMail = (mail, res) => {
    return new Promise(resolve => {
        let authNum = Math.random().toString().substr(2,6);
        let emailTemplete;
        res.cookie('hashAuth', authNum,{
            maxAge: 300000
        });
        ejs.renderFile('./public/template/authMail.ejs', {authCode : authNum}, function (err, data) {
            if(err){console.log(err)}
            emailTemplete = data;
        });
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: false,
            auth: {
                user: "tripodlabofficial@gmail.com",
                pass: "crsrkauyojqqkrke",
            },
        });
        let mailOptions = transporter.sendMail({
            from: `트라이포드랩`,
            to: mail,
            subject: '회원가입을 위한 인증번호를 입력해주세요.',
            html: emailTemplete,
        });
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            console.log("Finish sending email");
            transporter.close();
            // res.send({result: 'send'})
        })
    });
}

exports.checkCode = (req) => {
    return new Promise(resolve => {
        const {code} = req.body;
        const hashAuth = req.cookies.hashAuth;
        try {
            if(code === hashAuth) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        } catch(err) {
            resolve(false);
            console.error(err);
        }
    });
}