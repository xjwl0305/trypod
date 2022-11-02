const curStockDB = require("../DB/current_stock");
const {sequelize} = require("../models");
const {QueryTypes} = require("sequelize");
const Excel = require("exceljs");


exports.itemGetAll = (req, res) => {
    const uid = req.body.uid
    curStockDB.itemGetAll(uid).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.itemGetBranch = (req, res) => {
    const uid = req.body.uid;
    const branch_name = req.body.branch_name;
    curStockDB.itemGetBranch(uid, branch_name).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.itemGetLayer = (req, res) => {
    const uid = req.body.uid;
    const branch_name = req.body.branch_name;
    const layer_name = req.body.layer_name;
    curStockDB.itemGetLayer(uid, branch_name, layer_name).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.itemGetHouse = (req, res) => {
    const uid = req.body.uid;
    const branch_name = req.body.branch_name;
    const layer_name = req.body.layer_name;
    const warehouse_name = req.body.warehouse_name;
    curStockDB.itemGetHouse(uid, branch_name, layer_name, warehouse_name).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.deviceGetAll = (req, res) => {
    const uid = req.body.uid
    curStockDB.deviceGetAll(uid).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.deviceGetBranch = (req, res) => {
    const uid = req.body.uid;
    const branch_name = req.body.branch_name;
    curStockDB.deviceGetBranch(uid, branch_name).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.deviceGetLayer = (req, res) => {
    const uid = req.body.uid;
    const branch_name = req.body.branch_name;
    const layer_name = req.body.layer_name;
    curStockDB.deviceGetLayer(uid, branch_name, layer_name).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.deviceGetHouse = (req, res) => {
    const uid = req.body.uid;
    const branch_name = req.body.branch_name;
    const layer_name = req.body.layer_name;
    const warehouse_name = req.body.warehouse_name;
    curStockDB.deviceGetHouse(uid, branch_name, layer_name, warehouse_name).then(result =>
        res.status(200).json(
            {
                result
            })
    );
}

exports.reportDownload = async (req, res) => {
    const uid = req.body.uid;
    const date = req.body.date;
    const select = req.body.select;
    const data = req.body.data;
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
// exports.reportDownload = (req, res) => {
//     const uid = req.body.uid;
//     const date = req.body.date;
//     const select = req.body.select;
//     const data = req.body.data;
//     curStockDB.reportDownload(uid, date, select, data).then(result =>
//     res.status(200)1);
// }