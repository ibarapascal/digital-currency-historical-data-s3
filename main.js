// https://github.com/ded/reqwest
// https://stackoverflow.com/questions/52235641/how-to-save-data-in-json-file/52236204
// https://nodejs.org/docs/latest/api/fs.html#fs_fs_writefile_file_data_options_callback
// https://www.timestampconvert.com/?go1=true&m=01&d=01&y=2015&hours=000&min=000&sec=000&Submit=++++++Convert+to+timestamp+++++&offset=-9

const reqwest = require("reqwest");
const fs = require('fs');

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

function checkIfContinous(checkedList, indexOfData, timestampUnit){
    // TODO
    // var len = checkedList.length - 1;
    // var inx = indexOfData;
    // return timestampUnit * len == checkedList[len].inx - checkedList[0].inx;
    return true;
}

function combineList(resultList, tempList, indexOfData){
    // TODO
    // if (!checkIfContinous(tempList, indexOfData)){
    //     console.log("Error combine list, data got uncontinous.");
        
    //     result = [];
    // };

    // TODO
    result = resultList.concat(tempList);
    
    // TODO
    // if (!checkIfContinous(result, indexOfData)){
    //     console.log("Error combine list, data combined uncontinous.");
    //     result = [];
    // }
    return result;
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
    const reqTimeType = 'histohour';
    // limit number per request
    const numberPerStep = 2000;
    // request start time
    const startTime = '2019/01/01';
    // list index of data
    const indexOfData = 'time';
    // local DB json output path
    const outputPath = './db.json';

    // get delta timestamp per step
    var timestampUnit = getTimestampUnit(reqTimeType);
    // Get the data, check and combine to list
    var timestampList = getTimestampList(timestampUnit, numberPerStep, startTime);

    var resultList = []
    for (var [index, timestamp] of timestampList.entries()){
        // request
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
                resultList = combineList(resultList, usedDataList, indexOfData);
                if (resultList) console.log("Got " + (index + 1).toString() + "/" + timestampList.length.toString());
            },
            error:function(err){
                err ? console.log("Error getting data from min-api. " + err.toString()) : null;
            }
        });
    }
    // Write to DB json file
    resultList ? writeListToFile(outputPath, resultList) : null;
}

main();




