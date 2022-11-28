/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an HTTP starter function.
 * 
 * Before running this sample, please:
 * - create a Durable activity function (default name is "Hello")
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your 
 *    function app in Kudu
 */

const df = require("durable-functions");
const urlHelper = require("../utilities/urlHelper");

module.exports = df.orchestrator(function* (context) {
    let outputs = [];
    let inputBody = context.df.getInput();
    context.log('CrawlerOrchestrator_V1 ', inputBody);
    if(inputBody){
        // Replace "Hello" with the name of your Durable Activity Function.
        let caseDetails = yield context.df.callActivity("Mont_GetCaseNumber_A1", inputBody);
        let filteredDataResponse = [];
        for (let index = 0; index < caseDetails.length; index++) {
            let caseTypeToScrap = caseDetails[index].caseTypeToScrap;
            let caseTypeDetail = caseDetails[index].caseTypeDetail;
            let tablePageURL = caseDetails[index].tablePageURL;
            console.log('caseTypeDetail:', caseTypeDetail);
            console.log('total records ->:', caseTypeDetail.totalRecords);
            console.log('tablePageURL:', tablePageURL);
        
            let recordsForSingleChunk = urlHelper.noOfRecordsInSingleChunk;
            let totalLoopTime = 1;
            if(caseTypeDetail.totalRecords > recordsForSingleChunk){
                totalLoopTime = parseInt(caseTypeDetail.totalRecords / recordsForSingleChunk);
                let res = caseTypeDetail.totalRecords % recordsForSingleChunk;
                if(res > 0){
                totalLoopTime = totalLoopTime + 1;
                }
            }
            
            let skipCount = 0; 
            for (let index = 1; index <= totalLoopTime; index++) {
                //const element = array[index];
                let tablePageURLWithSkip =  tablePageURL + '&Skip='+skipCount;
                console.log('tablePageURLWithSkip:', tablePageURLWithSkip);
                skipCount += recordsForSingleChunk;
                let pageURLInputBody = {
                    "tablePageURLWithSkip" : tablePageURLWithSkip
                };
                filteredDataResponse.push(... yield context.df.callActivity("Mont_GetScrapDataWithPID_A2", pageURLInputBody));
            }  
        }
        outputs = createResponse(200, filteredDataResponse);;
    }else{
        outputs = createResponse(400,'Error! Input Not Defined Correctly : ' + inputBody);
    }
    console.log('CrawlerOrchestrator_V1 outputs', outputs);
    return outputs;
});

function createResponse(statusCode, responseBody) {
    return {
        status: statusCode, /* Defaults to 200 */
        body: JSON.parse(JSON.stringify(responseBody))
    };
  }