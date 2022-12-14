const curStockDB = require("../DB/current_stock");
const {sequelize} = require("../models");
const {QueryTypes} = require("sequelize");
const Excel = require("exceljs");


exports.itemGetAll = (req, res) => {
    const uid = req.query.uid
    curStockDB.itemGetAll(uid).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.itemGetBranch = (req, res) => {
    const uid = req.query.uid;
    const branch_name = req.query.branch_name;
    curStockDB.itemGetBranch(uid, branch_name).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.itemGetLayer = (req, res) => {
    const uid = req.query.uid;
    const branch_name = req.query.branch_name;
    const layer_name = req.query.layer_name;
    curStockDB.itemGetLayer(uid, branch_name, layer_name).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.itemGetHouse = (req, res) => {
    const uid = req.query.uid;
    const branch_name = req.query.branch_name;
    const layer_name = req.query.layer_name;
    const warehouse_name = req.query.warehouse_name;
    curStockDB.itemGetHouse(uid, branch_name, layer_name, warehouse_name).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.itemGetDetail = (req, res) => {
    const item_code = req.query.code;
    curStockDB.itemGetDetail(item_code).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.itemStockChange = (req, res) => {
    const item_code = req.query.code;
    curStockDB.itemStockChange(item_code).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}


exports.deviceGetAll = (req, res) => {
    const uid = req.query.uid
    curStockDB.deviceGetAll(uid).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.deviceGetBranch = (req, res) => {
    const uid = req.query.uid;
    const branch_name = req.query.branch_name;
    curStockDB.deviceGetBranch(uid, branch_name).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.deviceGetLayer = (req, res) => {
    const uid = req.query.uid;
    const branch_name = req.query.branch_name;
    const layer_name = req.query.layer_name;
    curStockDB.deviceGetLayer(uid, branch_name, layer_name).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.deviceGetHouse = (req, res) => {
    const uid = req.query.uid;
    const branch_name = req.query.branch_name;
    const layer_name = req.query.layer_name;
    const warehouse_name = req.query.warehouse_name;
    curStockDB.deviceGetHouse(uid, branch_name, layer_name, warehouse_name).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.deviceGetDetail = (req, res) => {
    const device_num = req.query.device_num;
    curStockDB.deviceGetDetail(device_num).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.deviceStockChange = (req, res) => {
    const device_num = req.query.device_num;
    curStockDB.deviceStockChange(device_num).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}
exports.itemUsage = (req, res) => {
    const code = req.query.code;
    const date_form = req.query.date_form;
    const type = req.query.type;
    curStockDB.itemUsage(code, date_form, type).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}
exports.itemDataInfo = (req, res) => {
    const uid = req.query.uid;
    const item_name = req.query.item_name;
    curStockDB.itemDataInfo(uid, item_name).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.deviceUsage = (req, res) => {
    const uid = req.query.uid;
    const device_num = req.query.device_num;
    const date_form = req.query.date_form;
    const type = req.query.type;
    curStockDB.deviceUsage(uid, device_num, date_form, type).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.reportDownload = async (req, res) => {
    const uid = req.query.uid;
    const date = req.query.date;
    const select = req.query.select;
    const data = req.query.data;
    const currentDate = new Date();
    const currentDayFormat = currentDate.getFullYear()+"-"+
        (currentDate.getMonth()+1)+"-"+
        currentDate.getDate();
    if(select === 1) { // ???????????? ????????? ????????????

    }else{ // ??????????????? ????????? ????????????
        const data = await sequelize.query('select e.device_number, i.name, i.category, i.code, drd.weight, c.weight as container_weight, drd.battery, l.branch_name, l.layer_name, l.warehouse_name, drd.data_interval, drd.created_at from (select earlivery_device_id, max(created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, device_raw_data drd\n' +
            'left join earlivery_device e on drd.earlivery_device_id = e.id left join item i on i.id = e.item_id left join location l on e.location_id = l.id left join container c on c.id = e.container_id left join user u on l.user_id = u.id\n' +
            'where drd.earlivery_device_id = t2.earlivery_device_id and drd.created_at = t2.max_date and u.id = :uid',
            {replacements: { uid: uid}, type: QueryTypes.SELECT});

        const DeviceReport = new Excel.Workbook();
        const worksheet = DeviceReport.addWorksheet('DeviceReport Excel Sheet');
        worksheet.columns = [
            {header: '???????????? ??????', key: 'device_number', width: 20},
            {header: '????????????', key: 'name', width: 20},
            {header: '????????????', key: 'category', width: 20},
            {header: '????????????', key: 'code', width: 20},
            {header: '??????(kg)', key: 'weight', width: 20},
            {header: '???????????? ??????(kg)', key: 'container_weight', width: 20},
            {header: '???????????????(kg)', key: 'N/A weight', width: 20},
            {header: '?????????(kg)', key: 'used', width: 20},
            {header: '?????????(%)', key: 'battery', width: 20},
            {header: '??????', key: 'branch_name', width: 20},
            {header: '??????', key: 'layer_name', width: 20},
            {header: '??????', key: 'warehouse_name', width: 20},
            {header: '????????? ?????? ??????', key: 'data_interval', width: 20},
            {header: '????????????', key: 'N/A', width: 20},
            {header: '????????????', key: 'created_at', width: 20}
        ]
        data.map((item, index)=> {
            worksheet.addRow(item);
        })
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader("Content-Disposition", "attachment; filename=" + "test.xlsx");//menu??? ???????????? ???????????? ???????????? ????????? = ??????+????????????.xlsx ??? ??????
        await DeviceReport.xlsx.write(res)
        // DeviceReport.xlsx.writeBuffer().then((data) => {
        //     const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        //     const url = window.URL.createObjectURL(blob);
        //     const anchor = document.createElement('a');
        //     anchor.href = url;
        //     anchor.download = `?????????.xlsx`;
        //     anchor.click();
        //     window.URL.revokeObjectURL(url);
        // })
    }
}

exports.ReportTimeSetting = (req, res) => {
    const uid = req.query.uid;
    const base_time = req.query.base_time;
    const report_writing_cycle = req.query.report_writing_cycle;
    const account = req.query.account;

    curStockDB.ReportTimeSetting(uid, account, base_time, report_writing_cycle).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}