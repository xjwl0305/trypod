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
    const currentDate = new Date();
    const currentDayFormat = currentDate.getFullYear()+"-"+
        (currentDate.getMonth()+1)+"-"+
        currentDate.getDate();
    if(Number(select) === 1) { // 아이템별 보고서 다운로드
        const standard = await sequelize.query('select summary.id as summary_id from (select max(summary.created_at) as standard_date from summary left join user u on u.id = summary.user_id where u.id = :uid and DATE(summary.created_at) = :date) as t2, summary left join user u on u.id = summary.user_id\n'+
        'where u.id = :uid and DATE(summary.created_at) = :date and t2.standard_date = summary.created_at', {replacements: { uid: uid, date:date}, type: QueryTypes.SELECT});

        const data = await sequelize.query("select item_name, item_category, item_code, sum(weight), sum(usage_weight), branch_name, layer_name, warehouse_name, GROUP_CONCAT(device_number order by device_number SEPARATOR ',') as device_numbers\n"+
        "from summary_content left join summary s on s.id = summary_content.summary_id where s.id = :id group by item_name", {replacements: {id:standard[0].summary_id}, type: QueryTypes.SELECT});

        const connection = await sequelize.query("select GROUP_CONCAT(device_number) as device_number, item_name from summary_content where summary_id = 361 and connection = 'warning' group by item_name", {replacements: {id:standard[0].summary_id}, type: QueryTypes.SELECT});

        const a = 1;
    }else{ // 디바이스별 보고서 다운로드
        const data = await sequelize.query('select e.device_number, i.name, i.category, i.code, drd.weight, c.weight as container_weight, drd.battery, l.branch_name, l.layer_name, l.warehouse_name, drd.data_interval, drd.created_at from (select earlivery_device_id, max(created_at) as max_date from device_raw_data group by earlivery_device_id) as t2, device_raw_data drd\n' +
            'left join earlivery_device e on drd.earlivery_device_id = e.id left join item i on i.id = e.item_id left join location l on e.location_id = l.id left join container c on c.id = e.container_id left join user u on l.user_id = u.id\n' +
            'where drd.earlivery_device_id = t2.earlivery_device_id and drd.created_at = t2.max_date and u.id = :uid',
            {replacements: { uid: uid}, type: QueryTypes.SELECT});

        const DeviceReport = new Excel.Workbook();
        const worksheet = DeviceReport.addWorksheet('DeviceReport Excel Sheet');
        worksheet.columns = [
            {header: '디바이스 넘버', key: 'device_number', width: 20},
            {header: '아이템명', key: 'name', width: 20},
            {header: '카테고리', key: 'category', width: 20},
            {header: '제품코드', key: 'code', width: 20},
            {header: '무게(kg)', key: 'weight', width: 20},
            {header: '컨테이너 무게(kg)', key: 'container_weight', width: 20},
            {header: '순재고무게(kg)', key: 'N/A weight', width: 20},
            {header: '사용량(kg)', key: 'used', width: 20},
            {header: '배터리(%)', key: 'battery', width: 20},
            {header: '지점', key: 'branch_name', width: 20},
            {header: '구역', key: 'layer_name', width: 20},
            {header: '창고', key: 'warehouse_name', width: 20},
            {header: '데이터 전송 간격', key: 'data_interval', width: 20},
            {header: '연결상태', key: 'N/A', width: 20},
            {header: '최근접속', key: 'created_at', width: 20}
        ]
        data.map((item, index)=> {
            worksheet.addRow(item);
        })
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader("Content-Disposition", "attachment; filename=" + "test.xlsx");//menu와 파일명을 동일하게 취급하여 파일명 = 메뉴+오늘날짜.xlsx 로 셋팅
        await DeviceReport.xlsx.write(res)
        // DeviceReport.xlsx.writeBuffer().then((data) => {
        //     const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        //     const url = window.URL.createObjectURL(blob);
        //     const anchor = document.createElement('a');
        //     anchor.href = url;
        //     anchor.download = `테스트.xlsx`;
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