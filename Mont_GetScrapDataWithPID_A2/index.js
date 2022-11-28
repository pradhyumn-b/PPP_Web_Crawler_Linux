/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an orchestrator function.
 * 
 * Before running this sample, please:
 * - create a Durable orchestration function
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your
 *   function app in Kudu
 */
const pppDBCallout = require("../utilities/pppDBCallout");
const scrapeCaseFromURL = require('../utilities/scrapeCaseFromURL')

module.exports = async function (context) {
    let inputBody = context.bindings.name;
    console.log('Mont_GetScrapDataWithPID_A2 inputObj', inputBody);
    let {tablePageURLWithSkip} = inputBody; 
    //console.log('caseTypeToScrapArr:', caseTypeToScrapArr);
    let outputs = [];
    if(tablePageURLWithSkip){
        let response = await scrapeCaseFromURL.scrapeCaseFromURL(tablePageURLWithSkip);
        outputs.push(... await pppDBCallout.pppCallout(response));
    }
    console.log('Mont_GetCaseNumber_A1 outputs', outputs);
    return outputs;
};