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
const urlHelper = require("../utilities/urlHelper");
const getCaseNumber = require('../utilities/getCaseNumber')
const helperMethods = require('../utilities/helperMethods')

module.exports = async function (context) {
    let inputBody = context.bindings.name;
    console.log('Mont_GetCaseNumber_A1 inputObj', inputBody);
    let {urlForCaseSearch, caseTypeToScrapArr} = inputBody; 
    //console.log('caseTypeToScrapArr:', caseTypeToScrapArr);
    let outputs = [];
    for (let index = 0; index < caseTypeToScrapArr.length; index++) {
      let caseTypeToScrap = caseTypeToScrapArr[index];
      let caseTypeDetail = await getCaseNumber.getCaseNumber(caseTypeToScrap, urlForCaseSearch);
      //console.log('caseTypeDetail:', caseTypeDetail);
      //console.log('total records ->:', caseTypeDetail.totalRecords);
      let tablePageURL = helperMethods.createURLForSecondPage(urlHelper.urlForSecondPage, caseTypeDetail.caseTypeNumber, urlHelper.numberOfDaysBefore);
      //console.log('tablePageURL:', tablePageURL);
      outputs.push({
        "caseTypeToScrap" : caseTypeToScrap,
        "caseTypeDetail" : caseTypeDetail,
        "tablePageURL" : tablePageURL
      });
    }
    console.log('Mont_GetCaseNumber_A1 outputs', outputs);
    return outputs;
};