// https://github.com/ded/reqwest
// https://stackoverflow.com/questions/52235641/how-to-save-data-in-json-file/52236204
// https://nodejs.org/docs/latest/api/fs.html#fs_fs_writefile_file_data_options_callback
// https://www.timestampconvert.com/?go1=true&m=01&d=01&y=2015&hours=000&min=000&sec=000&Submit=++++++Convert+to+timestamp+++++&offset=-9

const reqwest = require("reqwest");
const fs = require('fs');
require('./test.js')

function timestamp(date) {
    return date ? Math.floor(new Date(date).getTime()/1000) : Math.floor(new Date().getTime()/1000);
}

function getTimestampUnit(reqTimeType){
    switch(reqTimeType){
        case 'histohour': return 3600;
        case 'histominute': return 60;
        case 'histoday': return 86400;
        default: return 86400;
    }
}

function getTimestampList(timestampUnit, numberPerStep, startTime, endTime){
    var timestampStep = timestampUnit * numberPerStep;
    var timestampStart = timestamp(startTime);
    var timestampEnd = endTime ? timestamp(endTime) : timestamp();
    var reqNum = Math.floor((timestampEnd - timestampStart) / timestampStep);
    return Array(reqNum).fill().map((v,i)=>(timestampStart + i * timestampStep));
}

// json-server --watch db.json
function writeListToFile(path, data) {
    fs.writeFile(path, JSON.stringify({data:data}), function(err){
        err ? console.log(err) : null;
    })
}

async function main(){

    // Initialize params
    // request trade pair
    const reqPair = ['BTC', 'USD'];
    // request type of days, hours, minutes
    const reqTimeType = 'histominute';
    // limit number per request
    const numberPerStep = 2000;
    // request start time
    const startTime = '2019/08/01';
    // request end time
    const endTime = '2019/08/05';
    // list index of data
    const indexOfData = 'time';
    // local DB json output path
    const outputPath = './data/'
        + reqPair[0] + reqPair[1] + '-'
        + reqTimeType + '-'
        + startTime.replace(/[^0-9\.]+/g,'') + '-'
        + endTime.replace(/[^0-9\.]+/g,'') + '.json';
    // get delta timestamp per step
    var timestampUnit = getTimestampUnit(reqTimeType);
    // Get the data, check and combine to list
    var timestampList = getTimestampList(timestampUnit, numberPerStep, startTime, endTime);

    // Request
    var resultList = []
    for (var [index, timestamp] of timestampList.entries()){
        await reqwest({
            url:'https://min-api.cryptocompare.com/data/' + reqTimeType,
            type:'json',
            method:'get',
            data:{
                fsym: reqPair[0],
                tsym: reqPair[1],
                limit: numberPerStep,
                toTs: timestamp,
            },
            success:function(resp) {
                usedDataList = resp.Data;
                resultList = resultList.concat(usedDataList);
                console.log("Got " + (index + 1).toString() + "/" + timestampList.length.toString());
            },
            error:function(err){
                err ? console.log("Error getting data from min-api. " + err.toString()) : null;
            }
        });
    }

    // Remove duplicate data
    resultList = resultList.makeUniq(JSON.stringify);
    // Check if continous by index
    resultList.isDense(indexOfData, timestampUnit) ? null : console.log("Warning, result data not dense.");
    // Sort by index
    resultList.sortBy(indexOfData);
    // Write to the output json file
    writeListToFile(outputPath, resultList);
}

main();




