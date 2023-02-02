const models = require("../models");
const {sequelize} = require("../models");
const {QueryTypes} = require("sequelize");
const Excel = require('exceljs');
const moment = require('moment');
const schedule = require('node-schedule');
const request = require('request');
const cors = require("cors");
const app = require("../app");
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

exports.itemGetDetail = async (code) => {
    // 연동 디바이스
    const connect_devices = await sequelize.query('select distinct device_number, i.name, drd.weight, drd.created_at from (select earlivery_device_id, max(created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id\n' +
        'where i.code = :code and t2.max_date = drd.created_at',
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
        date.setHours(date.getHours()+ item.data_interval+5);
        if (date < today){
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
}
// 아이템 재고량 변화
exports.itemStockChange = async (code) => {
    return await sequelize.query('select device_number, weight, device_raw_data.created_at from device_raw_data left join earlivery_device ed on device_raw_data.earlivery_device_id = ed.id left join item i on ed.item_id = i.id where i.code = :code',
        {replacements: { code: code }, type: QueryTypes.SELECT});
}
// 아이템 데이터 내역
exports.itemDataInfo = async (uid, item_name) => {
    return await sequelize.query('select summary_content.created_at, item_name, sum(weight) as weight, connection, GROUP_CONCAT(distinct device_number order by device_number SEPARATOR \',\') as device_numbers from summary_content left join summary s on s.id = summary_content.summary_id left join user u on u.id = s.user_id\n' +
        'where u.id = :uid and item_name = :item_name group by s.created_at',
        {replacements: { uid: uid, item_name: item_name }, type: QueryTypes.SELECT});
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
    const current_stock2 = {"current_stock": current_stock[0].weight};
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

    return Object.assign(connect_item2, current_stock2, current_battery, current_usings, device_status2, statement_data);
}
// 재고량 변화
exports.deviceStockChange = async (device_num) => {
    return await sequelize.query('select device_number, weight, device_raw_data.created_at from device_raw_data left join earlivery_device ed on device_raw_data.earlivery_device_id = ed.id left join item i on ed.item_id = i.id where ed.device_number = :device_num',
        {replacements: { device_num: device_num }, type: QueryTypes.SELECT});
}
exports.deviceUsage = async (uid, device_num, date_form, type) => {
    const b = 1;
    if (parseInt(date_form) === 0){
        const data = await sequelize.query('select device_number, item_name, usage_weight, s.created_at as created_at from summary_content left join summary s on s.id = summary_content.summary_id left join user u on s.user_id = u.id where u.id = :uid and device_number = :device_num and s.created_at BETWEEN DATE_ADD(NOW(),INTERVAL -1 WEEK ) AND NOW()',
            {replacements: { uid: uid, device_num: device_num }, type: QueryTypes.SELECT});
        const total_date = [];
        const final_date = [];
        let tp_Date;
        data.forEach((value) => {
           const date = new Date(value.created_at).getDate();
           let sum_usage = 0;
           if(total_date.indexOf(date) === -1){
               total_date.push(date);
               let res = data.filter(find => new Date(find.created_at).getDate() === date);
               res.forEach((weight) => {
                  sum_usage += parseInt(weight.usage_weight);
               });
               if(res.length > 0) {
                   tp_Date = {
                       "device_number": res[0].device_number,
                       "data": sum_usage,
                       "created_at": new Date(res[0].created_at).getFullYear() + "-" + new Date(res[0].created_at).getMonth()+1 + "-" + new Date(res[0].created_at).getDate()
                   }
               }
               final_date.push(tp_Date);
           }
        });
        if (parseInt(type) === 0){
            return final_date;
        }else {
            const unit_weight = await sequelize.query('select distinct (unit_weight) from item left join earlivery_device ed on item.id = ed.item_id left join device_raw_data drd on ed.id = drd.earlivery_device_id\n' +
                'where device_number = :device_num',
                {replacements: { device_num: device_num }, type: QueryTypes.SELECT});
            final_date.forEach((data) => {
               data.data /= unit_weight[0].unit_weight;
            });
            return final_date;
        }
    }else{
        const data = await sequelize.query('select device_number, item_name, usage_weight, s.created_at as created_at from summary_content left join summary s on s.id = summary_content.summary_id left join user u on s.user_id = u.id where u.id = :uid and device_number = :device_num and s.created_at BETWEEN DATE_ADD(NOW(),INTERVAL -1 MONTH ) AND NOW()',
            {replacements: { uid: uid, device_num: device_num }, type: QueryTypes.SELECT});
        const total_date = [];
        const final_date = [];
        let tp_Date;
        // data.forEach((value) => {
        //     const date = value.created_at;
        //     const weekNum_date = weekNumOfMonth(date);
        //     let sum_usage = 0;
        //     if(total_date.indexOf(date) === -1){
        //         total_date.push(date);
        //         let res = data.filter(find => weekNumOfMonth(find.created_at)[0] === weekNum_date[0]);
        //         res.forEach((weight) => {
        //             sum_usage += parseInt(weight.usage_weight);
        //         });
        //         if(res.length > 0) {
        //             tp_Date = {
        //                 "device_number": res[0].device_number,
        //                 "data": sum_usage,
        //                 "created_at": res[0].created_at.getFullYear() + "-" + res[0].created_at.getMonth() + "-" + res[0].created_at.getDate()
        //             }
        //         }
        //         final_date.push(tp_Date);
        //     }
        // });
        data.forEach((value) => {
            const date = new Date(value.created_at).getDate();
            let sum_usage = 0;
            if(total_date.indexOf(date) === -1){
                total_date.push(date);
                let res = data.filter(find => new Date(find.created_at).getDate() === date);
                res.forEach((weight) => {
                    sum_usage += parseInt(weight.usage_weight);
                });
                if(res.length > 0) {
                    tp_Date = {
                        "device_number": res[0].device_number,
                        "data": sum_usage,
                        "created_at": new Date(res[0].created_at).getFullYear() + "-" + new Date(res[0].created_at).getMonth()+1 + "-" + new Date(res[0].created_at).getDate()
                    }
                }
                final_date.push(tp_Date);
            }
        });
        const a = 1;
        if (parseInt(type) === 0){
            return final_date;
        }else {
            const unit_weight = await sequelize.query('select distinct (unit_weight) from item left join earlivery_device ed on item.id = ed.item_id left join device_raw_data drd on ed.id = drd.earlivery_device_id\n' +
                'where device_number = :device_num',
                {replacements: { device_num: device_num }, type: QueryTypes.SELECT});
            final_date.forEach((data) => {
                data.data /= unit_weight[0].unit_weight;
            });
            return final_date;
        }
    }

    const data = await sequelize.query('select device_number, weight, device_raw_data.created_at from device_raw_data left join earlivery_device ed on ed.id = device_raw_data.earlivery_device_id left join location l on ed.location_id = l.id left join user u on l.user_id = u.id\n' +
        'where u.id = :uid and device_number = :device_num and device_raw_data.created_at BETWEEN DATE_ADD(NOW(),INTERVAL -1 MONTH ) AND NOW()',
        {replacements: { uid: uid, device_num: device_num }, type: QueryTypes.SELECT});
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
    let options = {
        uri: 'http://localhost:8000/sched_change',
        method: 'GET',
        body:{
            start_time: '1999-01-01_06:06:06',
            writing_cycle:report_writing_cycle,
            account: account,
            uid: uid
        },
        json:true
    };
    request.get(options, function (error, response, body) {
        const a = 1
        return body
        //callback
    });
}