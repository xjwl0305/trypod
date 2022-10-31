const models = require("../models");
const {sequelize} = require("../models");
const {QueryTypes} = require("sequelize");
const Excel = require('exceljs');
const moment = require('moment');
// 아이템 재고 현황
exports.itemGetAll = async (uid) => {
    const data = await sequelize.query('select i.code, i.name, i.unit_weight, B.device_number ,A.data_interval, A.weight from device_raw_data as A left join earlivery_device B on A.earlivery_device_id = B.id left join item i on B.item_id = i.id left join location l on B.location_id = l.id left join user u on l.user_id = u.id where u.id = :uid order by i.name',
        {replacements: { uid: uid }, type: QueryTypes.SELECT});
    const branch_list = await sequelize.query('select distinct(branch_name) from location left join user u on location.user_id = u.id where u.id = :uid',
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
    const data = await sequelize.query('select i.code, i.name, i.unit_weight, B.device_number ,A.data_interval, A.weight from device_raw_data as A left join earlivery_device B on A.earlivery_device_id = B.id left join item i on B.item_id = i.id left join location l on B.location_id = l.id left join user u on l.user_id = u.id ' +
        'where u.id = :uid and l.branch_name = :branch_name order by i.name',
        {replacements: { uid: uid , branch_name: branch_name}, type: QueryTypes.SELECT});
    const layer_list = await sequelize.query('select layer_name from location left join user u on location.user_id = u.id where u.id = :uid and branch_name = :branch_name;',
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
    const data = await sequelize.query('select i.code, i.name, i.unit_weight, B.device_number ,A.data_interval, A.weight from device_raw_data as A left join earlivery_device B on A.earlivery_device_id = B.id left join item i on B.item_id = i.id left join location l on B.location_id = l.id left join user u on l.user_id = u.id' +
        ' where u.id = :uid and l.layer_name = :layer_name and branch_name = :branch_name order by i.name',
        {replacements: { uid: uid , branch_name: branch_name, layer_name: layer_name}, type: QueryTypes.SELECT});
    const warehouse_list = await sequelize.query('select warehouse_name from location left join user u on location.user_id = u.id where u.id = :uid and branch_name = :branch_name and layer_name = :layer_name',
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
    const data = await sequelize.query('select i.code, i.name, i.unit_weight, B.device_number ,A.data_interval, A.weight from device_raw_data as A left join earlivery_device B on A.earlivery_device_id = B.id left join item i on B.item_id = i.id left join location l on B.location_id = l.id left join user u on l.user_id = u.id\n' +
        'where u.id = :uid and l.layer_name = :layer_name and branch_name = :branch_name and warehouse_name = warehouse_name order by i.name',
        {replacements: { uid: uid , branch_name: branch_name, layer_name: layer_name, warehouse_name: warehouse_name}, type: QueryTypes.SELECT});
    return {"data": data};
}
// 디바이스 재고 현황
exports.deviceGetAll = async (uid) => {
    const data = await sequelize.query('select device_number, i.name, drd.weight, drd.weight, drd.created_at from earlivery_device left join device_raw_data drd on earlivery_device.id = drd.earlivery_device_id left join item i on earlivery_device.item_id = i.id left join location l on earlivery_device.location_id = l.id left join user u on l.user_id = u.id where u.id = :uid order by i.name',
        {replacements: { uid: uid }, type: QueryTypes.SELECT});
    const branch_list = await sequelize.query('select distinct(branch_name) from location left join user u on location.user_id = u.id where u.id = :uid',
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
    const data = await sequelize.query('select i.code, i.name, i.unit_weight, B.device_number ,A.data_interval, A.weight from device_raw_data as A left join earlivery_device B on A.earlivery_device_id = B.id left join item i on B.item_id = i.id left join location l on B.location_id = l.id left join user u on l.user_id = u.id ' +
        'where u.id = :uid and l.branch_name = :branch_name order by i.name',
        {replacements: { uid: uid , branch_name: branch_name}, type: QueryTypes.SELECT});
    const layer_list = await sequelize.query('select layer_name from location left join user u on location.user_id = u.id where u.id = :uid and branch_name = :branch_name;',
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
    const warehouse_list = await sequelize.query('select warehouse_name from location left join user u on location.user_id = u.id where u.id = 1 and branch_name = :branch_name and layer_name = :layer_name',
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

exports.reportDownload = async (uid, date, select, data) => {
    const currentDate = new Date();
    const currentDayFormat = currentDate.getFullYear()+"-"+
        (currentDate.getMonth()+1)+"-"+
        currentDate.getDate();
    if(select === 1) { // 아이템별 보고서 다운로드

    }else{ // 디바이스별 보고서 다운로드
        const data = await sequelize.query('select e.device_number, i.name, i.category, i.code, drd.weight, c.weight as container_weight, drd.battery, l.branch_name, l.layer_name, l.warehouse_name, drd.data_interval, drd.updated_at from (select earlivery_device_id, max(updated_at) as max_date from device_raw_data group by earlivery_device_id) as t2, device_raw_data drd\n' +
            'left join earlivery_device e on drd.earlivery_device_id = e.id left join item i on i.id = e.item_id left join location l on e.location_id = l.id left join container c on c.id = e.container_id left join user u on l.user_id = u.id\n' +
            'where drd.earlivery_device_id = t2.earlivery_device_id and drd.updated_at = t2.max_date and u.id = :uid',
            {replacements: { uid: uid}, type: QueryTypes.SELECT});

        const DeviceReport = new Excel.Workbook();
        const worksheet = DeviceReport.addWorksheet('DeviceReport Excel Sheet');
        worksheet.columns = [
            {header: '디바이스 넘버', key: 'device_number', width: 60},
            {header: '아이템명', key: 'name', width: 60},
            {header: '카테고리', key: 'category', width: 60},
            {header: '제품코드', key: 'code', width: 60},
            {header: '무게(kg)', key: 'weight', width: 60},
            {header: '컨테이너 무게(kg)', key: 'container_weight', width: 60},
            {header: '순재고무게(kg)', key: 'N/A weight', width: 60},
            {header: '사용량(kg)', key: 'used', width: 60},
            {header: '배터리(%)', key: 'battery', width: 60},
            {header: '지점', key: 'branch_name', width: 60},
            {header: '구역', key: 'layer_name', width: 60},
            {header: '창고', key: 'warehouse_name', width: 60},
            {header: '데이터 전송 간격', key: 'data_interval', width: 60},
            {header: '연결상태', key: 'N/A', width: 60},
            {header: '최근접속', key: 'created_at', width: 60}
        ]
        data.map((item, index)=> {
            worksheet.addRow(item);

        })
        DeviceReport.xlsx.writeBuffer().then((data) => {
            const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = `테스트.xlsx`;
            anchor.click();
            window.URL.revokeObjectURL(url);
        })
    }
}