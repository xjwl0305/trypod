const models = require("../models");
const {sequelize} = require("../models");
const {QueryTypes} = require("sequelize");
const Excel = require('exceljs');
const moment = require('moment');
const schedule = require('node-schedule');
const request = require('request');
const cors = require("cors");
const app = require("../app");
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const axios = require("axios");
// 아이템 재고 현황
exports.itemGetAll = async (uid) => {
    const data = await sequelize.query('select distinct i.code, i.name, i.safe_weight, i.unit_weight, earlivery_device.device_number ,drd.data_interval, drd.weight, drd.created_at from (select earlivery_device_id, max(created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id\n' +
        'left join location l on l.id = earlivery_device.location_id left join user u on u.id = l.user_id  where t2.max_date = drd.created_at and u.id = :uid order by i.name',
        {replacements: { uid: uid }, type: QueryTypes.SELECT});
    const branch_list = await sequelize.query('select distinct(branch_name) from location left join user u on location.user_id = u.id where u.id = :uid and branch_name is not null',
        {replacements: { uid: uid }, type: QueryTypes.SELECT});
    const Allbranch = [];
    const result = {"data": data};
    branch_list.forEach(function (item, index, array) {
        Allbranch.push(item.branch_name);
    });
    const branch = {"branch_name": Allbranch};
    return Object.assign(result, branch);
}

exports.itemGetBranch = async (uid, branch_name) => {
    const data = await sequelize.query('select distinct i.code, i.name, i.safe_weight, i.unit_weight, earlivery_device.device_number ,drd.data_interval, drd.weight, drd.created_at from (select earlivery_device_id, max(created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id\n' +
        'left join location l on l.id = earlivery_device.location_id left join user u on u.id = l.user_id  where t2.max_date = drd.created_at and u.id = :uid and l.branch_name = :branch_name order by i.name',
        {replacements: { uid: uid , branch_name: branch_name}, type: QueryTypes.SELECT});
    const layer_list = await sequelize.query('select distinct(layer_name) from location left join user u on location.user_id = u.id where u.id = :uid and branch_name = :branch_name and layer_name is not null',
        {replacements: { uid: uid , branch_name: branch_name }, type: QueryTypes.SELECT});
    const Alllayer = [];
    const result = {"data": data};
    layer_list.forEach(function (item, index, array) {
        Alllayer.push(item.layer_name);
    });
    const layer = {"layer_name": Alllayer};
    return Object.assign(result, layer);
}

exports.itemGetLayer = async (uid, branch_name, layer_name) => {
    const data = await sequelize.query('select distinct i.code, i.name, i.safe_weight, i.unit_weight, earlivery_device.device_number ,drd.data_interval, drd.weight, drd.created_at from (select earlivery_device_id, max(created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id\n' +
        'left join location l on l.id = earlivery_device.location_id left join user u on u.id = l.user_id  where t2.max_date = drd.created_at and u.id = :uid and l.layer_name = :layer_name and branch_name = :branch_name order by i.name;',
        {replacements: { uid: uid , branch_name: branch_name, layer_name: layer_name}, type: QueryTypes.SELECT});
    const warehouse_list = await sequelize.query('select distinct(warehouse_name) from location left join user u on location.user_id = u.id where u.id = :uid and branch_name = :branch_name and layer_name = :layer_name and warehouse_name is not null',
        {replacements: { uid: uid , branch_name: branch_name, layer_name: layer_name}, type: QueryTypes.SELECT});
    const AllHouse = [];
    const result = {"data": data};
    warehouse_list.forEach(function (item, index, array) {
        AllHouse.push(item.warehouse_name);
    });
    const warehouse = {"warehouse_name": AllHouse};
    return Object.assign(result, warehouse);
}

exports.itemGetHouse = async (uid, branch_name, layer_name, warehouse_name) => {
    const data = await sequelize.query('select distinct i.code, i.name, i.safe_weight, i.unit_weight, earlivery_device.device_number ,drd.data_interval, drd.weight, drd.created_at from (select earlivery_device_id, max(created_at) as max_date from device_raw_data where device_raw_data.created_at not in (select max(created_at) from device_raw_data group by earlivery_device_id) group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id\n' +
        'left join location l on l.id = earlivery_device.location_id left join user u on u.id = l.user_id  where t2.max_date = drd.created_at and u.id = :uid and l.layer_name = :layer_name and branch_name = :branch_name and warehouse_name = :warehouse_name order by i.name;',
        {replacements: { uid: uid , branch_name: branch_name, layer_name: layer_name, warehouse_name: warehouse_name}, type: QueryTypes.SELECT});
    return {"data": data};
}
exports.itemGetDetail = async (code, branch_name, layer_name, warehouse_name) => {

    if(branch_name === '' && layer_name === '' && warehouse_name === '') {
    // 연동 디바이스
    const connect_devices = await sequelize.query('select distinct device_number, i.name, drd.weight, drd.battery, drd.created_at from (select earlivery_device_id, max(created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id\n' +
        'where i.code = :code and t2.max_date = drd.created_at and t2.earlivery_device_id = device_number',
        {replacements: { code: code}, type: QueryTypes.SELECT});
    // 최근 재고량
    const current_stock = await sequelize.query('select drd.id, drd.weight as current_stock from (select earlivery_device_id, max(created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id\n' +
        'where i.code = :code and t2.max_date = drd.created_at group by drd.id',
        {replacements: { code: code}, type: QueryTypes.SELECT});
        let current_stock_total = 0;
        current_stock.forEach(function (item){
            current_stock_total += Number(item.current_stock);
        })
        const connect_device = {"connect_devices": connect_devices};
        const current_stock2 = {"current_stock": current_stock_total};
        // 디바이스 상태 이상
        const device_status = await sequelize.query('select distinct device_number, i.name, drd.weight, drd.battery, drd.created_at, drd.data_interval, drd.created_at from (select earlivery_device_id, max(created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id\n' +
            'where i.code = :code and t2.max_date = drd.created_at',
            {replacements: { code: code}, type: QueryTypes.SELECT});
        let today = new Date();
        const connect_error_device = [];
        device_status.forEach(function (item, index, array) {
            let date = new Date(item.created_at);
            let battery = item.battery;
            date.setHours(date.getHours()+ item.data_interval+5);
            if (date < today){
                let strange = {"device_number": item.device_number,
                    "name": item.name,
                    "weight": item.weight,
                    "battery": item.battery,
                    "created_at": item.created_at}
                connect_error_device.push(strange);
            }else if(battery <= 20){
                let strange = {"device_number": item.device_number,
                    "name": item.name,
                    "weight": item.weight,
                    "battery": item.battery,
                    "created_at": item.created_at}
                connect_error_device.push(strange);
            }
        });
        const device_status2 = {"device_status": connect_error_device};
        // 최근 사용량
        const current_using = await sequelize.query('select sum(drd.weight) data from (select earlivery_device_id, max(created_at) as max_date from device_raw_data where device_raw_data.created_at not in (select max(created_at) from device_raw_data group by earlivery_device_id) group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id\n' +
            'where i.code = :code and t2.max_date = drd.created_at',
            {replacements: { code: code}, type: QueryTypes.SELECT});
        let current_using_data = 0;
        try {
            current_using_data = current_stock[0].current_stock - current_using[0].data
        }catch (e){
            current_using_data = 0;
        }
        const current_usings = {"current_using": current_using_data}

        return Object.assign(connect_device, current_stock2, current_usings, device_status2);
    }else if (branch_name !== '' && layer_name === '' && warehouse_name ===''){
        // 연동 디바이스
        const connect_devices = await sequelize.query('select distinct device_number, i.name, drd.weight, drd.battery, drd.created_at from (select earlivery_device_id, max(created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id left join location l on l.id = earlivery_device.location_id\n'+
        'where i.code = :code and t2.max_date = drd.created_at and t2.earlivery_device_id = device_number and l.branch_name = :branch_name',
            {replacements: { code: code, branch_name: branch_name}, type: QueryTypes.SELECT});
        // 최근 재고량
        const current_stock = await sequelize.query('select drd.id, drd.weight as current_stock from (select earlivery_device_id, max(created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id left join location l on l.id = earlivery_device.location_id\n' +
            'where i.code = :code and t2.max_date = drd.created_at and l.branch_name = :branch_name group by drd.id',
            {replacements: { code: code, branch_name: branch_name}, type: QueryTypes.SELECT});
        let current_stock_total = 0;
        current_stock.forEach(function (item){
            current_stock_total += Number(item.current_stock);
        })
        const connect_device = {"connect_devices": connect_devices};
        const current_stock2 = {"current_stock": current_stock_total};
        // 디바이스 상태 이상
        const device_status = await sequelize.query('select distinct device_number, i.name, drd.weight, drd.battery, drd.created_at, drd.data_interval, drd.created_at from (select earlivery_device_id, max(created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id left join location l on l.id = earlivery_device.location_id\n' +
            'where i.code = :code and t2.max_date = drd.created_at and l.branch_name = :branch_name',
            {replacements: { code: code, branch_name: branch_name}, type: QueryTypes.SELECT});
        let today = new Date();
        const connect_error_device = [];
        device_status.forEach(function (item, index, array) {
            let date = new Date(item.created_at);
            let battery = item.battery;
            date.setHours(date.getHours()+ item.data_interval+5);
            if (date < today){
                let strange = {"device_number": item.device_number,
                    "name": item.name,
                    "weight": item.weight,
                    "battery": item.battery,
                    "created_at": item.created_at}
                connect_error_device.push(strange);
            }else if(battery <= 20){
                let strange = {"device_number": item.device_number,
                    "name": item.name,
                    "weight": item.weight,
                    "battery": item.battery,
                    "created_at": item.created_at}
                connect_error_device.push(strange);
            }
        });
        const device_status2 = {"device_status": connect_error_device};
        // 최근 사용량
        const current_using = await sequelize.query('select sum(drd.weight) data from (select earlivery_device_id, max(created_at) as max_date from device_raw_data where device_raw_data.created_at not in (select max(created_at) from device_raw_data group by earlivery_device_id) group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id left join location l on l.id = earlivery_device.location_id\n' +
            'where i.code = :code and t2.max_date = drd.created_at and l.branch_name = :branch_name',
            {replacements: { code: code, branch_name: branch_name}, type: QueryTypes.SELECT});
        let current_using_data = 0;
        try {
            current_using_data = current_stock[0].current_stock - current_using[0].data
        }catch (e){
            current_using_data = 0;
        }
        const current_usings = {"current_using": current_using_data}

        return Object.assign(connect_device, current_stock2, current_usings, device_status2);
    }else if (branch_name !== '' && layer_name !== '' && warehouse_name === ''){
        // 연동 디바이스
        const connect_devices = await sequelize.query('select distinct device_number, i.name, drd.weight, drd.battery, drd.created_at from (select earlivery_device_id, max(created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id left join location l on l.id = earlivery_device.location_id\n'+
            'where i.code = :code and t2.max_date = drd.created_at and t2.earlivery_device_id = device_number and l.branch_name = :branch_name and l.layer_name = :layer_name',
            {replacements: { code: code, branch_name: branch_name, layer_name: layer_name}, type: QueryTypes.SELECT});
        // 최근 재고량
        const current_stock = await sequelize.query('select drd.id, drd.weight as current_stock from (select earlivery_device_id, max(created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id left join location l on l.id = earlivery_device.location_id\n' +
            'where i.code = :code and t2.max_date = drd.created_at and l.branch_name = :branch_name and l.layer_name = :layer_name group by drd.id ',
            {replacements: { code: code, branch_name: branch_name, layer_name: layer_name}, type: QueryTypes.SELECT});
        let current_stock_total = 0;
        current_stock.forEach(function (item){
            current_stock_total += Number(item.current_stock);
        })
        const connect_device = {"connect_devices": connect_devices};
        const current_stock2 = {"current_stock": current_stock_total};
        // 디바이스 상태 이상
        const device_status = await sequelize.query('select distinct device_number, i.name, drd.weight, drd.battery, drd.created_at, drd.data_interval, drd.created_at from (select earlivery_device_id, max(created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id left join location l on l.id = earlivery_device.location_id\n' +
            'where i.code = :code and t2.max_date = drd.created_at and l.branch_name = :branch_name and l.layer_name = :layer_name',
            {replacements: { code: code, branch_name: branch_name, layer_name: layer_name}, type: QueryTypes.SELECT});
        let today = new Date();
        const connect_error_device = [];
        device_status.forEach(function (item, index, array) {
            let date = new Date(item.created_at);
            let battery = item.battery;
            date.setHours(date.getHours()+ item.data_interval+5);
            if (date < today){
                let strange = {"device_number": item.device_number,
                    "name": item.name,
                    "weight": item.weight,
                    "battery": item.battery,
                    "created_at": item.created_at}
                connect_error_device.push(strange);
            }else if(battery <= 20){
                let strange = {"device_number": item.device_number,
                    "name": item.name,
                    "weight": item.weight,
                    "battery": item.battery,
                    "created_at": item.created_at}
                connect_error_device.push(strange);
            }
        });
        const device_status2 = {"device_status": connect_error_device};
        // 최근 사용량
        const current_using = await sequelize.query('select sum(drd.weight) data from (select earlivery_device_id, max(created_at) as max_date from device_raw_data where device_raw_data.created_at not in (select max(created_at) from device_raw_data group by earlivery_device_id) group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id left join location l on l.id = earlivery_device.location_id\n' +
            'where i.code = :code and t2.max_date = drd.created_at and l.branch_name = :branch_name and l.layer_name = :layer_name',
            {replacements: { code: code, branch_name: branch_name, layer_name: layer_name}, type: QueryTypes.SELECT});
        let current_using_data = 0;
        try {
            current_using_data = current_stock[0].current_stock - current_using[0].data
        }catch (e){
            current_using_data = 0;
        }
        const current_usings = {"current_using": current_using_data}

        return Object.assign(connect_device, current_stock2, current_usings, device_status2);
    }else if (branch_name !== '' && layer_name !== '' && warehouse_name !== ''){
        // 연동 디바이스
        const connect_devices = await sequelize.query('select distinct device_number, i.name, drd.weight, drd.battery, drd.created_at from (select earlivery_device_id, max(created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id left join location l on l.id = earlivery_device.location_id\n'+
            'where i.code = :code and t2.max_date = drd.created_at and t2.earlivery_device_id = device_number and l.branch_name = :branch_name and l.layer_name = :layer_name and l.warehouse_name = :warehouse_name',
            {replacements: { code: code, branch_name: branch_name, layer_name: layer_name, warehouse_name: warehouse_name}, type: QueryTypes.SELECT});
        // 최근 재고량
        const current_stock = await sequelize.query('select drd.id, drd.weight as current_stock from (select earlivery_device_id, max(created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id left join location l on l.id = earlivery_device.location_id\n' +
            'where i.code = :code and t2.max_date = drd.created_at and l.branch_name = :branch_name and l.layer_name = :layer_name and l.warehouse_name = :warehouse_name group by drd.id ',
            {replacements: { code: code, branch_name: branch_name, layer_name: layer_name, warehouse_name: warehouse_name}, type: QueryTypes.SELECT});
        let current_stock_total = 0;
        current_stock.forEach(function (item){
            current_stock_total += Number(item.current_stock);
        })
        const connect_device = {"connect_devices": connect_devices};
        const current_stock2 = {"current_stock": current_stock_total};
        // 디바이스 상태 이상
        const device_status = await sequelize.query('select distinct device_number, i.name, drd.weight, drd.battery, drd.created_at, drd.data_interval, drd.created_at from (select earlivery_device_id, max(created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id left join location l on l.id = earlivery_device.location_id\n' +
            'where i.code = :code and t2.max_date = drd.created_at and l.branch_name = :branch_name and l.layer_name = :layer_name and l.warehouse_name = :warehouse_name',
            {replacements: { code: code, branch_name: branch_name, layer_name: layer_name, warehouse_name: warehouse_name}, type: QueryTypes.SELECT});
        let today = new Date();
        const connect_error_device = [];
        device_status.forEach(function (item, index, array) {
            let date = new Date(item.created_at);
            let battery = item.battery;
            date.setHours(date.getHours()+ item.data_interval+5);
            if (date < today){
                let strange = {"device_number": item.device_number,
                    "name": item.name,
                    "weight": item.weight,
                    "battery": item.battery,
                    "created_at": item.created_at}
                connect_error_device.push(strange);
            }else if(battery <= 20){
                let strange = {"device_number": item.device_number,
                    "name": item.name,
                    "weight": item.weight,
                    "battery": item.battery,
                    "created_at": item.created_at}
                connect_error_device.push(strange);
            }
        });
        const device_status2 = {"device_status": connect_error_device};
        // 최근 사용량
        const current_using = await sequelize.query('select sum(drd.weight) data from (select earlivery_device_id, max(created_at) as max_date from device_raw_data where device_raw_data.created_at not in (select max(created_at) from device_raw_data group by earlivery_device_id) group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id left join location l on l.id = earlivery_device.location_id\n' +
            'where i.code = :code and t2.max_date = drd.created_at and l.branch_name = :branch_name and l.layer_name = :layer_name and l.warehouse_name = :warehouse_name',
            {replacements: { code: code, branch_name: branch_name, layer_name: layer_name, warehouse_name: warehouse_name}, type: QueryTypes.SELECT});
        let current_using_data = 0;
        try {
            current_using_data = current_stock[0].current_stock - current_using[0].data
        }catch (e){
            current_using_data = 0;
        }
        const current_usings = {"current_using": current_using_data}

        return Object.assign(connect_device, current_stock2, current_usings, device_status2);
    }

}
// 아이템 재고량 변화
exports.itemStockChange = async (code, branch_name, layer_name, warehouse_name) => {
    if(branch_name === '' && layer_name === '' && warehouse_name === '') {
        // // 연동 디바이스
        // const connect_devices = await sequelize.query('select distinct device_number, i.name, drd.weight, drd.battery, drd.created_at from (select earlivery_device_id, max(created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id left join location l on l.id = earlivery_device.location_id\n' +
        //     'where i.code = :code and t2.max_date = drd.created_at and l.branch_name = :branch_name and l.layer_name = :layer_name and l.warehouse_name = :warehouse_name',
        //     {replacements: { code: code}, type: QueryTypes.SELECT});
        // // 최근 재고량
        // const current_stock = await sequelize.query('select drd.id, drd.weight as current_stock from (select earlivery_device_id, max(created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id left join location l on l.id = earlivery_device.location_id\n' +
        //     'where i.code = :code and t2.max_date = drd.created_at group by drd.id and l.branch_name = :branch_name and l.layer_name = :layer_name and l.warehouse_name = :warehouse_name',
        //     {replacements: { code: code}, type: QueryTypes.SELECT});
        return await sequelize.query('select device_number, weight, device_raw_data.created_at from device_raw_data left join earlivery_device on device_raw_data.earlivery_device_id = earlivery_device.id left join item i on earlivery_device.item_id = i.id left join location l on l.id = earlivery_device.location_id \n' +
            'where i.code = :code',
            {replacements: { code: code}, type: QueryTypes.SELECT});
    }else if (branch_name !== '' && layer_name === '' && warehouse_name ===''){
        return await sequelize.query('select device_number, weight, device_raw_data.created_at from device_raw_data left join earlivery_device on device_raw_data.earlivery_device_id = earlivery_device.id left join item i on earlivery_device.item_id = i.id left join location l on l.id = earlivery_device.location_id \n' +
            'where i.code = :code and l.branch_name = :branch_name',
            {replacements: { code: code, branch_name: branch_name}, type: QueryTypes.SELECT});
    }else if (branch_name !== '' && layer_name !== '' && warehouse_name === ''){
        return await sequelize.query('select device_number, weight, device_raw_data.created_at from device_raw_data left join earlivery_device on device_raw_data.earlivery_device_id = earlivery_device.id left join item i on earlivery_device.item_id = i.id left join location l on l.id = earlivery_device.location_id \n' +
            'where i.code = :code and l.branch_name = :branch_name and l.layer_name = :layer_name',
            {replacements: { code: code, branch_name: branch_name, layer_name : layer_name}, type: QueryTypes.SELECT});
    }else if (branch_name !== '' && layer_name !== '' && warehouse_name !== ''){
        return await sequelize.query('select device_number, weight, device_raw_data.created_at from device_raw_data left join earlivery_device on device_raw_data.earlivery_device_id = earlivery_device.id left join item i on earlivery_device.item_id = i.id left join location l on l.id = earlivery_device.location_id \n' +
            'where i.code = :code and l.branch_name = :branch_name and l.layer_name = :layer_name and l.warehouse_name = :warehouse_name',
            {replacements: { code: code, branch_name: branch_name, layer_name : layer_name, warehouse_name: warehouse_name}, type: QueryTypes.SELECT});
    }


}
// 아이템 데이터 내역
exports.itemDataInfo = async (uid, item_name, branch_name, layer_name, warehouse_name) => {
    if(branch_name === '' && layer_name === '' && warehouse_name === '') {
        return await sequelize.query('select summary_content.created_at, item_name, sum(weight) as weight, connection, GROUP_CONCAT(distinct device_number order by device_number SEPARATOR \',\') as device_numbers from summary_content left join summary s on s.id = summary_content.summary_id left join user u on u.id = s.user_id\n' +
            'where u.id = :uid and item_name = :item_name group by s.created_at',
            {replacements: { uid: uid, item_name: item_name }, type: QueryTypes.SELECT});
    }else if (branch_name !== '' && layer_name === '' && warehouse_name ===''){
        return await sequelize.query('select summary_content.created_at, item_name, sum(weight) as weight, connection, GROUP_CONCAT(distinct device_number order by device_number SEPARATOR \',\') as device_numbers from summary_content left join summary s on s.id = summary_content.summary_id left join user u on u.id = s.user_id\n' +
            'where u.id = :uid and item_name = :item_name and branch_name = :branch_name group by s.created_at',
            {replacements: { uid: uid, item_name: item_name, branch_name: branch_name }, type: QueryTypes.SELECT});
    }else if (branch_name !== '' && layer_name !== '' && warehouse_name === ''){
        return await sequelize.query('select summary_content.created_at, item_name, sum(weight) as weight, connection, GROUP_CONCAT(distinct device_number order by device_number SEPARATOR \',\') as device_numbers from summary_content left join summary s on s.id = summary_content.summary_id left join user u on u.id = s.user_id\n' +
            'where u.id = :uid and item_name = :item_name and branch_name = :branch_name and layer_name = :layer_name group by s.created_at',
            {replacements: { uid: uid, item_name: item_name, branch_name: branch_name, layer_name: layer_name }, type: QueryTypes.SELECT});
    }else if (branch_name !== '' && layer_name !== '' && warehouse_name !== ''){
        return await sequelize.query('select summary_content.created_at, item_name, sum(weight) as weight, connection, GROUP_CONCAT(distinct device_number order by device_number SEPARATOR \',\') as device_numbers from summary_content left join summary s on s.id = summary_content.summary_id left join user u on u.id = s.user_id\n' +
            'where u.id = :uid and item_name = :item_name and branch_name = :branch_name and layer_name = :layer_name and warehouse_name = :warehouse_name group by s.created_at',
            {replacements: { uid: uid, item_name: item_name, branch_name:branch_name, layer_name:layer_name, warehouse_name:warehouse_name }, type: QueryTypes.SELECT});
    }

}

// 디바이스 재고 현황
exports.deviceGetAll = async (uid) => {
    const data = await sequelize.query('select earlivery_device.device_number, i.name, drd.weight, drd.battery, drd.data_interval, drd.created_at from (select device_number, max(device_raw_data.created_at) as max_date from device_raw_data left join earlivery_device ed on device_raw_data.earlivery_device_id = ed.id group by device_number) as t2, earlivery_device left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id left join item i on earlivery_device.item_id = i.id left join location l on earlivery_device.location_id = l.id left join user u on l.user_id = u.id\n' +
        'where u.id = :uid and t2.max_date = drd.created_at and t2.device_number = earlivery_device.device_number order by drd.id',
        {replacements: { uid: uid }, type: QueryTypes.SELECT});
    const branch_list = await sequelize.query('select distinct(branch_name) from location left join user u on location.user_id = u.id where u.id = :uid and branch_name is not null',
        {replacements: { uid: uid }, type: QueryTypes.SELECT});
    const Allbranch = [];
    const result = {"data": data};
    branch_list.forEach(function (item, index, array) {
        Allbranch.push(item.branch_name);
    });
    const branch = {"branch_name": Allbranch};
    return Object.assign(result, branch);
}

exports.deviceGetBranch = async (uid, branch_name) => {
    const data = await sequelize.query('select earlivery_device.device_number, i.name, drd.weight, drd.battery, drd.data_interval, drd.created_at from (select device_number, max(device_raw_data.created_at) as max_date from device_raw_data left join earlivery_device ed on device_raw_data.earlivery_device_id = ed.id group by device_number) as t2, earlivery_device left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id left join item i on earlivery_device.item_id = i.id left join location l on earlivery_device.location_id = l.id left join user u on l.user_id = u.id\n' +
        'where u.id = :uid and branch_name = :branch_name and t2.max_date = drd.created_at and t2.device_number = earlivery_device.device_number order by earlivery_device.device_number',
        {replacements: { uid: uid , branch_name: branch_name}, type: QueryTypes.SELECT});
    const layer_list = await sequelize.query('select distinct (layer_name) from location left join user u on location.user_id = u.id where u.id = :uid and branch_name = :branch_name and layer_name is not null',
        {replacements: { uid: uid , branch_name: branch_name }, type: QueryTypes.SELECT});
    const Alllayer = [];
    const result = {"data": data};
    layer_list.forEach(function (item, index, array) {
        Alllayer.push(item.layer_name);
    });
    const layer = {"layer_name": Alllayer};
    return Object.assign(result, layer);
}

exports.deviceGetLayer = async (uid, branch_name, layer_name) => {
    const data = await sequelize.query('select earlivery_device.device_number, i.name, drd.weight, drd.weight, drd.battery, drd.data_interval, drd.created_at from (select device_number, max(device_raw_data.created_at) as max_date from device_raw_data left join earlivery_device ed on device_raw_data.earlivery_device_id = ed.id group by device_number) as t2, earlivery_device left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id left join item i on earlivery_device.item_id = i.id left join location l on earlivery_device.location_id = l.id left join user u on l.user_id = u.id\n'+
    'where u.id = :uid and branch_name = :branch_name and layer_name = :layer_name and t2.max_date = drd.created_at and t2.device_number = earlivery_device.device_number order by earlivery_device.device_number',
        {replacements: { uid: uid , branch_name: branch_name, layer_name: layer_name}, type: QueryTypes.SELECT});
    const warehouse_list = await sequelize.query('select distinct (warehouse_name) from location left join user u on location.user_id = u.id where u.id = :uid and branch_name = :branch_name and layer_name = :layer_name and warehouse_name is not null',
        {replacements: { uid: uid , branch_name: branch_name, layer_name: layer_name}, type: QueryTypes.SELECT});
    const AllHouse = [];
    const result = {"data": data};
    warehouse_list.forEach(function (item, index, array) {
        AllHouse.push(item.warehouse_name);
    });
    const warehouse = {"warehouse_name": AllHouse};
    return Object.assign(result, warehouse);
}

exports.deviceGetHouse = async (uid, branch_name, layer_name, warehouse_name) => {
    const data = await sequelize.query('select earlivery_device.device_number, i.name, drd.weight, drd.battery, drd.data_interval, drd.created_at from (select device_number, max(device_raw_data.created_at) as max_date from device_raw_data left join earlivery_device ed on device_raw_data.earlivery_device_id = ed.id group by device_number) as t2, earlivery_device left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id left join item i on earlivery_device.item_id = i.id left join location l on earlivery_device.location_id = l.id left join user u on l.user_id = u.id\n'+
    'where u.id = :uid and branch_name = :branch_name and layer_name = :layer_name and warehouse_name = :warehouse_name and t2.max_date = drd.created_at and t2.device_number = earlivery_device.device_number order by earlivery_device.device_number',
        {replacements: { uid: uid , branch_name: branch_name, layer_name: layer_name, warehouse_name: warehouse_name}, type: QueryTypes.SELECT});
    return {"data": data};
}

exports.deviceGetDetail = async (device_num) => {
    // 연동 디바이스
    const connect_item = await sequelize.query('select name from item left join earlivery_device ed on item.id = ed.item_id where ed.device_number = :device_num',
        {replacements: { device_num: device_num}, type: QueryTypes.SELECT});
    // 최근 재고량
    const current_stock = await sequelize.query('select drd.battery, drd.weight as current_stock from (select earlivery_device_id, max(created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id\n' +
        'where earlivery_device.device_number = :device_num and t2.max_date = drd.created_at and t2.earlivery_device_id = drd.earlivery_device_id',
        {replacements: { device_num: device_num}, type: QueryTypes.SELECT});
    const connect_item2 = {"connect_item": connect_item}
    const current_stock2 = {"current_stock": current_stock[0].current_stock};
    const current_battery = {"battery": current_stock[0].battery};
    // 디바이스 상태 이상
    const device_status = await sequelize.query('select device_number,  drd.data_interval, drd.created_at from (select earlivery_device_id, max(created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id\n' +
        'where earlivery_device.device_number = :device_num and t2.max_date = drd.created_at',
        {replacements: { device_num: device_num}, type: QueryTypes.SELECT});
    let today = new Date();
    const connect_error_device = [];
    device_status.forEach(function (item, index, array) {
        let date = new Date(item.created_at);
        date.setHours(date.getHours()+ item.data_interval+5);
        if (date < today){
            connect_error_device.push('통신불량');
        }
    });
    const device_status2 = {"device_status": connect_error_device};

    // 최근 사용량
    const current_using = await sequelize.query('select earlivery_device_id as device_number, weight, battery, created_at from device_raw_data where earlivery_device_id = :device_num limit 0,21',
        {replacements: { device_num: device_num}, type: QueryTypes.SELECT});

    // 사용 내역
    const usage_data = await sequelize.query('select distinct device_number, sum(usage_weight) as usage_weight, summary_content.created_at, date_format(summary_content.created_at, \'%Y-%m-%d\') as date from summary_content left join summary s on s.id = summary_content.summary_id left join user u on u.id = s.user_id\n' +
        'where device_number = :device_num and summary_content.created_at BETWEEN DATE_ADD(NOW(),INTERVAL -1 MONTH ) AND NOW() group by date',
        {replacements: { device_num: device_num}, type: QueryTypes.SELECT});

    // unit weight
    const unit_weight = await sequelize.query('select unit_weight from item left join earlivery_device ed on item.id = ed.item_id\n' +
        'where ed.device_number = :device_num',
        {replacements: { device_num: device_num}, type: QueryTypes.SELECT});

    // 데이터 내역
    const statement = await sequelize.query('select earlivery_device_id as device_number, i.name, weight, battery, device_raw_data.created_at from device_raw_data left join earlivery_device ed on device_raw_data.earlivery_device_id = ed.id left join item i on ed.item_id = i.id\n' +
        '                                                                                         where earlivery_device_id = :device_num order by device_raw_data.created_at DESC limit 0,21',
        {replacements: { device_num: device_num}, type: QueryTypes.SELECT});


    let current_using_data = 0;
    try {
        current_using_data = current_stock[0].current_stock - current_using[0].data
    }catch (e){
        current_using_data = 0;
    }
    const current_usings = {"current_using": current_using_data}
    const statement_data = {"statement": statement}
    const usage_datas = {"usage_data": usage_data}
    const unit_weights = {"unit_weight": unit_weight}
    return Object.assign(connect_item2, current_stock2, current_battery, current_usings, device_status2, usage_datas, unit_weights, statement_data);
}
// 재고량 변화
exports.deviceStockChange = async (device_num) => {
    return await sequelize.query('select device_number, weight, device_raw_data.created_at from device_raw_data left join earlivery_device ed on device_raw_data.earlivery_device_id = ed.id left join item i on ed.item_id = i.id where ed.device_number = :device_num',
        {replacements: { device_num: device_num }, type: QueryTypes.SELECT});
}

exports.itemUsage = async (uid, device_num) => {
    let data_list = [];
    let total_data = {};
    const tempToArray = device_num.split(',')
    for (let i =0; i<tempToArray.length; i++){
        const data = await sequelize.query('select distinct device_number, sum(usage_weight) as usage_weight, summary_content.created_at, date_format(summary_content.created_at, \'%Y-%m-%d\') as date from summary_content left join summary s on s.id = summary_content.summary_id left join user u on u.id = s.user_id\n' +
            'where u.id = :uid and device_number = :device_num and summary_content.created_at BETWEEN DATE_ADD(NOW(),INTERVAL -1 MONTH ) AND NOW() group by date',
            {replacements: { uid: uid, device_num: tempToArray[i] }, type: QueryTypes.SELECT});
        data_list.push(data);
    }
    const unit_weight = await sequelize.query('select unit_weight from item left join earlivery_device ed on item.id = ed.item_id\n' +
        'where ed.device_number = :device_num',
        {replacements: { device_num: tempToArray[0]}, type: QueryTypes.SELECT});
    total_data.data = data_list;
    total_data.unit_weight = unit_weight ;
    return total_data;
}

var weekNumOfMonth = function(date){
    var WEEK_KOR = ["첫째주", "둘째주", "셋째주", "넷째주", "다섯째주"];
    var THURSDAY_NUM = 4;	// 첫째주의 기준은 목요일(4)이다. (https://info.singident.com/60)
    console.log(date);

    var firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
    var firstDayOfWeek = firstDate.getDay();

    var firstThursday = 1 + THURSDAY_NUM - firstDayOfWeek;	// 첫째주 목요일
    if(firstThursday <= 0){
        firstThursday = firstThursday + 7;	// 한주는 7일
    }
    var untilDateOfFirstWeek = firstThursday-7+3;	// 월요일기준으로 계산 (월요일부터 한주의 시작)
    var weekNum = Math.ceil((date.getDate()-untilDateOfFirstWeek) / 7) - 1;

    if(weekNum < 0){	// 첫째주 이하일 경우 전월 마지막주 계산
        var lastDateOfMonth = new Date(date.getFullYear(), date.getMonth(), 0);
        var result = Util.Date.weekNumOfMonth(lastDateOfMonth);
        return result;
    }
    return [WEEK_KOR[weekNum], (date.getMonth()+1)+'월'];
}


exports.ReportTimeSetting = async (uid, account, base_time, report_writing_cycle ) => {

    const data =  await sequelize.query('update summary_option left join user u on summary_option.id = u.summary_option_id set base_time = :base_time, report_writing_cycle = :report_writing_cycle where u.id = :uid',
        {replacements: { uid: uid , base_time: base_time, report_writing_cycle: report_writing_cycle}, type: QueryTypes.UPDATE});

    const result = {};

    await axios.post('http://3.34.196.3:8000/sched_change?uid='+uid+'&start_time='+base_time+'&writing_cycle='+report_writing_cycle+'&account='+account, {
        start_time: base_time,
        writing_cycle:report_writing_cycle,
        account: account,
        uid: uid
    },{
        headers: {'Content-Type' : 'application/json'}
    }
    ).then(function (res) {

        if (res.status === 200) {
            result.status = "success";
            console.log(result);

        }
    })
        .catch(function (error) {
            result.status = error;
            console.log(result);
        });

    return result;

//     axios({
//         method: 'post',
//         url: `http://localhost:8000/sched_change`,
//         headers: {
//             'Content-Type': 'application/json; charset=utf-8',
//         },
//         data: {
//             start_time: base_time,
//             writing_cycle:report_writing_cycle,
//             account: account,
//             uid: uid
//         }
//     })
//         .then((response) => {
//             result.status = "success";
//             return result;
//         })
//         .catch((err) => {
//             result.status = err;
//             return result;
//         });
}