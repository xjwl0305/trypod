const models = require("../models");
const {Op, QueryTypes} = require("sequelize");
const {auth} = require("firebase-admin");
const nodemailer = require('nodemailer');
const util = require("util");
const ejs = require('ejs');
const bcrypt = require('bcrypt');
const cookie = require('cookie');
const {sequelize} = require("../models");
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
exports.enroll = async (data) => {
    // return new Promise(resolve => {
    //     models.user.create({account: data.account, hashed_password: data.hashed_password, phone: data.phone, email: data.email, company_name: data.company_name, company_address: data.company_address,
    //         company_detailed_address: data.company_detailed_address, division: data.division})
    //         .then(result => {
    //             resolve(true);
    //         })
    //         .catch(err => {
    //             console.log(err);
    //             resolve(false);
    //         });
    // });
    const {account, phone, hashed_password, email, company_name, company_address, company_detailed_address, division} = data;
    try{
        return await sequelize.query('insert into user (account, phone, hashed_password, email, company_name, company_address, company_detailed_address, division) ' +
            'VALUES (:account, :phone, :hashed_password, :email, :company_name, :company_address, :company_detailed_address, :division);',
            {
                replacements: {
                    account: account,
                    phone: phone,
                    hashed_password: hashed_password,
                    email: email,
                    company_name: company_name,
                    company_address: company_address,
                    company_detailed_address: company_detailed_address,
                    division: division
                }, type: QueryTypes.INSERT
            })
    }catch (err){
        console.log(err);
        return false;
    }
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