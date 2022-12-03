const models = require("../models");
const {sequelize} = require("../models");
const {QueryTypes} = require("sequelize");
const Excel = require('exceljs');
const moment = require('moment');
// 아이템 재고 현황
exports.itemGetAll = async (uid) => {
    const data = await sequelize.query('select i.code, i.name, i.unit_weight,i.safe_weight, B.device_number ,A.data_interval, A.weight, A.created_at from device_raw_data as A left join earlivery_device B on A.earlivery_device_id = B.id left join item i on B.item_id = i.id left join location l on B.location_id = l.id left join user u on l.user_id = u.id where u.id = :uid order by i.name',
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
    const data = await sequelize.query('select i.code, i.name, i.unit_weight,i.safe_weight, B.device_number ,A.data_interval, A.weight, A.created_at from device_raw_data as A left join earlivery_device B on A.earlivery_device_id = B.id left join item i on B.item_id = i.id left join location l on B.location_id = l.id left join user u on l.user_id = u.id ' +
        'where u.id = :uid and l.branch_name = :branch_name order by i.name',
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
    const data = await sequelize.query('select i.code, i.name, i.unit_weight,i.safe_weight, B.device_number ,A.data_interval, A.weight, A.created_at from device_raw_data as A left join earlivery_device B on A.earlivery_device_id = B.id left join item i on B.item_id = i.id left join location l on B.location_id = l.id left join user u on l.user_id = u.id' +
        ' where u.id = :uid and l.layer_name = :layer_name and branch_name = :branch_name order by i.name',
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
    const data = await sequelize.query('select i.code, i.name, i.unit_weight,i.safe_weight, B.device_number ,A.data_interval, A.weight, A.created_at from device_raw_data as A left join earlivery_device B on A.earlivery_device_id = B.id left join item i on B.item_id = i.id left join location l on B.location_id = l.id left join user u on l.user_id = u.id\n' +
        'where u.id = :uid and l.layer_name = :layer_name and branch_name = :branch_name and warehouse_name = warehouse_name order by i.name',
        {replacements: { uid: uid , branch_name: branch_name, layer_name: layer_name, warehouse_name: warehouse_name}, type: QueryTypes.SELECT});
    return {"data": data};
}

exports.itemGetDetail = async (code) => {
    // 연동 디바이스
    const connect_devices = await sequelize.query('select device_number, i.name, drd.weight, drd.created_at from (select earlivery_device_id, max(created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id\n' +
        'where i.code = :code and t2.max_date = drd.created_at',
        {replacements: { code: code}, type: QueryTypes.SELECT});
    // 최근 재고량
    const current_stock = await sequelize.query('select sum(drd.weight) as current_stock from (select earlivery_device_id, max(created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id\n' +
        'where i.code = :code and t2.max_date = drd.created_at',
        {replacements: { code: code}, type: QueryTypes.SELECT});
    const connect_device = {"connect_devices": connect_devices}
    const current_stock2 = {"current_stock": current_stock};
    // 디바이스 상태 이상
    const device_status = await sequelize.query('select device_number, drd.data_interval, drd.created_at from (select earlivery_device_id, max(created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id\n' +
        'where i.code = :code and t2.max_date = drd.created_at',
        {replacements: { code: code}, type: QueryTypes.SELECT});
    let today = new Date();
    const connect_error_device = [];
    device_status.forEach(function (item, index, array) {
        let date = new Date(item.created_at);
        date.setMinutes(date.getMinutes()+ item.data_interval+5);
        if (date < today){
            connect_error_device.push(item.device_number);
        }
    });
    const device_status2 = {"device_status": connect_error_device};
    // 최근 사용량
    const current_using = await sequelize.query('select sum(drd.weight) data from (select earlivery_device_id, max(created_at) as max_date from device_raw_data where device_raw_data.created_at not in (select max(created_at) from device_raw_data group by earlivery_device_id) group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id\n' +
        'where i.code = :code and t2.max_date = drd.created_at',
        {replacements: { code: code}, type: QueryTypes.SELECT});

    const current_using_data = current_stock[0].current_stock - current_using[0].data
    const current_usings = {"current_using": current_using_data}

    return Object.assign(connect_device, current_stock2, current_usings, device_status2);
}
// 재고량 변화
exports.itemStockChange = async (code) => {
    return await sequelize.query('select device_number, weight, device_raw_data.created_at from device_raw_data left join earlivery_device ed on device_raw_data.earlivery_device_id = ed.id left join item i on ed.item_id = i.id where i.code = :code',
        {replacements: { code: code }, type: QueryTypes.SELECT});
}


// 디바이스 재고 현황
exports.deviceGetAll = async (uid) => {
    const data = await sequelize.query('select device_number, i.name, drd.weight, drd.weight, drd.created_at from earlivery_device left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id left join item i on earlivery_device.item_id = i.id left join location l on earlivery_device.location_id = l.id left join user u on l.user_id = u.id where u.id = :uid order by i.name',
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
    const data = await sequelize.query('select device_number, i.name, drd.weight, drd.weight, drd.created_at from earlivery_device left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id left join item i on earlivery_device.item_id = i.id left join location l on earlivery_device.location_id = l.id left join user u on l.user_id = u.id\n' +
        'where u.id = :uid and branch_name = :branch_name order by i.name',
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
    const data = await sequelize.query('select device_number, i.name, drd.weight, drd.weight, drd.created_at from earlivery_device left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id left join item i on earlivery_device.item_id = i.id left join location l on earlivery_device.location_id = l.id left join user u on l.user_id = u.id where u.id = :uid and branch_name = :branch_name order by i.name',
        {replacements: { uid: uid , branch_name: branch_name, layer_name: layer_name}, type: QueryTypes.SELECT});
    const warehouse_list = await sequelize.query('select distinct (warehouse_name) from location left join user u on location.user_id = u.id where u.id = 1 and branch_name = :branch_name and layer_name = :layer_name and warehouse_name is not null',
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
    const data = await sequelize.query('select device_number, i.name, drd.weight, drd.weight, drd.created_at from earlivery_device left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id left join item i on earlivery_device.item_id = i.id left join location l on earlivery_device.location_id = l.id left join user u on l.user_id = u.id\n' +
        'where u.id = 1 and branch_name = :branch_name and layer_name = :layer_name and warehouse_name = :warehouse_name order by i.name',
        {replacements: { uid: uid , branch_name: branch_name, layer_name: layer_name, warehouse_name: warehouse_name}, type: QueryTypes.SELECT});
    return {"data": data};
}

exports.deviceGetDetail = async (device_num) => {
    // 연동 디바이스
    const connect_item = await sequelize.query('select name from item left join earlivery_device ed on item.id = ed.item_id where ed.device_number = :device_num',
        {replacements: { device_num: device_num}, type: QueryTypes.SELECT});
    // 최근 재고량
    const current_stock = await sequelize.query('select sum(drd.weight) as current_stock from (select earlivery_device_id, max(created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id\n' +
        'where earlivery_device.device_number = :device_num and t2.max_date = drd.created_at',
        {replacements: { device_num: device_num}, type: QueryTypes.SELECT});
    const connect_item2 = {"connect_item": connect_item}
    const current_stock2 = {"current_stock": current_stock};
    // 디바이스 상태 이상
    const device_status = await sequelize.query('select device_number, drd.data_interval, drd.created_at from (select earlivery_device_id, max(created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id\n' +
        'where earlivery_device.device_number = :device_num and t2.max_date = drd.created_at',
        {replacements: { device_num: device_num}, type: QueryTypes.SELECT});
    let today = new Date();
    const connect_error_device = [];
    device_status.forEach(function (item, index, array) {
        let date = new Date(item.created_at);
        date.setMinutes(date.getMinutes()+ item.data_interval+5);
        if (date < today){
            connect_error_device.push('통신불량');
        }
    });
    const device_status2 = {"device_status": connect_error_device};

    // 최근 사용량
    const current_using = await sequelize.query('select sum(drd.weight) as data from (select earlivery_device_id, max(created_at) as max_date from device_raw_data where device_raw_data.created_at not in (select max(created_at) from device_raw_data group by earlivery_device_id) group by earlivery_device_id) as t2, earlivery_device left join item i on earlivery_device.item_id = i.id left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id\n' +
        'where earlivery_device.device_number = :device_num and t2.max_date = drd.created_at',
        {replacements: { device_num: device_num}, type: QueryTypes.SELECT});

    const current_using_data = current_stock[0].current_stock - current_using[0].data
    const current_usings = {"current_using": current_using_data}

    return Object.assign(connect_item2, current_stock2, current_usings, device_status2);
}
// 재고량 변화
exports.deviceStockChange = async (device_num) => {
    return await sequelize.query('select device_number, weight, device_raw_data.created_at from device_raw_data left join earlivery_device ed on device_raw_data.earlivery_device_id = ed.id left join item i on ed.item_id = i.id where ed.device_number = :device_num',
        {replacements: { device_num: device_num }, type: QueryTypes.SELECT});
}

exports.ReportSetting = async (uid) => {
    let today = new Date();
    if(today.getHours() < 5 && today.getHours() >= 0){
        const initial = await sequelize.query('insert into summary_option (report_writing_cycle, base_time) values (8, "1999-01-01:05:00:00")',
            {replacements: { uid: uid }, type: QueryTypes.INSERT});
        const get_id = await sequelize.query('select last_insert_id() as last');
        return await sequelize.query('update user set summary_option_id = :get_id where id = :uid',
            {replacements: { uid: uid , get_id: get_id[0][0]['last']}, type: QueryTypes.UPDATE});
    }else if(today.getHours() < 13 && today.getHours() >= 5){
        const initial = await sequelize.query('insert into summary_option (report_writing_cycle, base_time) values (8, "1999-01-01:13:00:00")',
            {replacements: { uid: uid }, type: QueryTypes.INSERT});
        const get_id = await sequelize.query('select last_insert_id() as last');
        return await sequelize.query('update user set summary_option_id = :get_id where id = :uid',
            {replacements: { uid: uid , get_id: get_id[0][0]['last']}, type: QueryTypes.UPDATE});
    }else{
        const initial = await sequelize.query('insert into summary_option (report_writing_cycle, base_time) values (8, "1999-01-01:21:00:00")',
            {replacements: { uid: uid }, type: QueryTypes.INSERT});
        const get_id = await sequelize.query('select last_insert_id() as last');
        return await sequelize.query('update user set summary_option_id = :get_id where id = :uid',
            {replacements: { uid: uid , get_id: get_id[0][0]['last']}, type: QueryTypes.UPDATE});
    }
}

exports.ReportTimeSetting = async (uid, base_time, report_writing_cycle ) => {
    return await sequelize.query('update summary_option left join user u on summary_option.id = u.summary_option_id set base_time = :base_time, report_writing_cycle = :report_writing_cycle where u.id = :uid',
        {replacements: { uid: uid , base_time: base_time, report_writing_cycle: report_writing_cycle}, type: QueryTypes.UPDATE});
}