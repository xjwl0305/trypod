const request = require('request-promise-native');
const warehouseDB = require('../DB/warehouse');
const models = require("../models");

exports.CallRawData = async (req, res) => {

        const options = {
            uri: 'http://api.wim-x.kr:89/api/swb/row-data',
            method: 'GET',
            qs: {
                deviceCodes: 'UD-1653,UD-1654'
            }
        }

        const result = await request(options).then((value) => {
            const obj = JSON.parse(value);
            const total_data = obj.list
            total_data.forEach(function (item, index, array){
                const warehouse_code = item.wdCode;
                const temperature = item.temperature.avg;
                const humidity = item.humidity.avg;

                warehouseDB.callRawData(warehouse_code, temperature, humidity);
            });
            res.status(200).json({
                sensor_result: 'update_success'
            })
            }
        ).catch(err => res.error(err));

}