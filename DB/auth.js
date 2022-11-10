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


        const enroll_result =  await sequelize.query('insert into user (account, phone, hashed_password, email, company_name, company_address, company_detailed_address, division) ' +
            'VALUES (:account, :phone, :hashed_password, :email, :company_name, :company_address, :company_detailed_address, :division)',
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

    const find_enroll = await sequelize.query('select id from user where account = :account and hashed_password = :hashed_password',
        {
            replacements: {
                account: account,
                hashed_password: hashed_password
            }, type: QueryTypes.SELECT
        })
    const create_default_location = await sequelize.query('insert into location(branch_name, branch_address, branch_detailed_address, manager_name, manager_phone, manager_email, user_id) values (:company_name, :company_address, :company_detailed_address, :company_name, :phone, :email, :user_id) ',
        {
            replacements: {
                company_name: company_name,
                company_address: company_address,
                company_detailed_address: company_detailed_address,
                phone: phone,
                email: email,
                user_id: find_enroll[0].id
            }, type: QueryTypes.INSERT
        })
    return enroll_result
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
            if(err){resolve(false);
                return false;}
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
                resolve(false);
                return false;
            }
            resolve(true);
        })
        resolve(true);
    });
}

exports.CheckSendMail = async (mail, res) => {
    const result = await sequelize.query('select count(id) as count from user where email = :mail',
        {replacements: {mail: mail}, type: QueryTypes.SELECT});


    return new Promise(resolve => {
        if(result[0].count === 0) {
            resolve(false);
            return false;
        }
        let authNum = Math.random().toString().substr(2, 6);
        let emailTemplete;
        res.cookie('hashAuth', authNum, {
            maxAge: 300000
        });
        ejs.renderFile('./public/template/authMail.ejs', {authCode: authNum}, function (err, data) {
            if (err) {
                resolve(false);
                return false;
            }
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
                resolve(false);
                return false;
            }
            resolve(true);
        })
        resolve(true);
    });
}
exports.checkCode = (req) => {
    return new Promise(resolve => {
        const {code} = req.query;
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