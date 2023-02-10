const models = require("../models");
const {Op, QueryTypes} = require("sequelize");
const {auth} = require("firebase-admin");
const nodemailer = require('nodemailer');
const util = require("util");
const ejs = require('ejs');
const bcrypt = require('bcrypt');
const cookie = require('cookie');
const {sequelize} = require("../models");
const request = require("request");
const axios = require('axios');
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
        models.user.count({ where: {'phone' : data}
        })
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

exports.checkID = (account) => {
    return new Promise(resolve => {
        models.user.count({ where: {'account' : account}
        })
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
    return enroll_result;
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
exports.changePassword = (password, mail) => {
    return new Promise(resolve => {
        models.user.update({
            hashed_password: password
        },{
            where: {
                email: mail
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
            if(err) {
                return resolve(false);
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
                pass: "dyjcompwdpbxsmai",
            },
        });
        let mailOptions = transporter.sendMail({
            from: `트라이포드랩`,
            to: mail,
            subject: '인증번호를 입력해주세요.',
            html: emailTemplete,
        });
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return resolve(false);
            }else {
                return resolve(true);
            }
        })
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
        res.cookie('hashAuth2', authNum, {
            maxAge: 300000
        });
        ejs.renderFile('./public/template/authMail.ejs', {authCode: authNum}, function (err, data) {
            if (err) {
                return resolve(false);
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
                pass: "dyjcompwdpbxsmai",
            },
        });
        let mailOptions = transporter.sendMail({
            from: `트라이포드랩`,
            to: mail,
            subject: '인증번호를 입력해주세요.',
            html: emailTemplete,
        });
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return resolve(false);
            }else {
                return resolve(true);
            }
        })
    });
}

exports.checkCode = (req) => {
    return new Promise(async resolve => {
        const {code} = req.query;
        const hashAuth = req.cookies.hashAuth;
        const {mail} = req.query;
        try {
            if (code === hashAuth) {
                const result = {
                    message: 'auth complete',
                    status: true,
                }
                console.log(result);
                resolve(result);
            } else {
                resolve(false);
            }
        } catch (err) {
            resolve(false);
            console.error(err);
        }
    });
}

exports.checkIDCode = (req) => {
    return new Promise(async resolve => {
        const {code} = req.query;
        const hashAuth = req.cookies.hashAuth2;
        const {mail} = req.query;
        try {
            if (code === hashAuth) {
                const account = await sequelize.query('select account, id from user where email = :mail',
                    {replacements: {mail: mail}, type: QueryTypes.SELECT});
                const result = {
                    message: 'auth complete',
                    status: true,
                    account: account[0].account,
                    uid: account[0].id
                }
                console.log(result);
                resolve(result);
            } else {
                resolve(false);
            }
        } catch (err) {
            resolve(false);
            console.error(err);
        }
    });
}

exports.ReportSetting = async (uid, account) => {

    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1) + '-' + (today.getDate())
    if(today.getHours() < 5 && today.getHours() >= 0){
        date +=" 05:00:00"
        const initial = await sequelize.query('insert into summary_option (report_writing_cycle, base_time) values (8, :date)',
            {replacements: { uid: uid , date:date}, type: QueryTypes.INSERT});
        const get_id = await sequelize.query('select last_insert_id() as last');
        const a = await sequelize.query('update user set summary_option_id = :get_id where id = :uid',
            {replacements: { uid: uid , get_id: get_id[0][0]['last']}, type: QueryTypes.UPDATE});

    }else if(today.getHours() < 13 && today.getHours() >= 5){
        date +=" 13:00:00"
        const initial = await sequelize.query('insert into summary_option (report_writing_cycle, base_time) values (8, :date)',
            {replacements: { uid: uid ,date:date}, type: QueryTypes.INSERT});
        const get_id = await sequelize.query('select last_insert_id() as last');
        const a = await sequelize.query('update user set summary_option_id = :get_id where id = :uid',
            {replacements: { uid: uid , get_id: get_id[0][0]['last']}, type: QueryTypes.UPDATE});

    }else{
        date +=" 21:00:00"
        const initial = await sequelize.query('insert into summary_option (report_writing_cycle, base_time) values (8, :date)',
            {replacements: { uid: uid , date:date}, type: QueryTypes.INSERT});
        const get_id = await sequelize.query('select last_insert_id() as last');
        const a = await sequelize.query('update user set summary_option_id = :get_id where id = :uid',
            {replacements: { uid: uid , get_id: get_id[0][0]['last']}, type: QueryTypes.UPDATE});

    }

    let result = 0;


    axios.post( 'http://3.34.196.3:8000/sched?uid='+uid+'&start_time='+date+'&writing_cycle='+8+'&account='+account, {
        start_time: date,
        writing_cycle:8,
        account: account,
        uid: uid
    }).then(function (res) {
            console.log(res);
            if (res.status === 200) {
                result = 1;
            }
        })
        .catch(function (error) {
            console.log(error);
            result = 0;
        });
    return result === 1;
}