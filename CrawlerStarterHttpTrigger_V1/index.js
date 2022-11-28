const df = require("durable-functions");
let urlForCaseSearch = ""; //base url to fetch the caseType
let caseTypeToScrap = ""; //caseType to search
const urlHelper = require("../utilities/urlHelper");
const allSearchURL = urlHelper.searchURLs;
//const scrap = require('./scrap')

module.exports = async function (context, req) {
    const client = df.getClient(context);
    context.log('JavaScript HTTP trigger function processed a request.');
    const searchURL = req.body && req.body.searchURL;
    const caseType = req.body && req.body.caseType;
    console.log('Http Trigger request body ', req.body);
    if(searchURL && allSearchURL.includes(searchURL)){
        urlForCaseSearch = searchURL;
        if(caseType){
            if(caseType.includes(',')){
                let casesTypesFromInput = [];
                let allInputCases = caseType.split(',');
                for (let index = 0; index < allInputCases.length; index++) {
                    const ct = allInputCases[index];
                    if(urlHelper.caseType.includes(ct)){
                        casesTypesFromInput.push(ct);
                    }
                }
                caseTypeToScrap = casesTypesFromInput;
            }else if(urlHelper.caseType.includes(caseType)){
                caseTypeToScrap = [caseType];
            }
        }else{
            caseTypeToScrap = urlHelper.caseType;
        }
    }
    console.log('searchURL ', searchURL);
    console.log('caseTypeToScrap ', caseTypeToScrap);
    if(!(searchURL && caseTypeToScrap))
    {
        createResponse(context, 400, {
         code : 400,
         errorMsg : 'Bad Request! Request body is not correct!', 
         validSearchUrls : allSearchURL
        });
        return JSON.parse(JSON.stringify(context.res));
    }

    let inputBody = {
        'urlForCaseSearch' : searchURL, 
        'caseTypeToScrapArr' : caseTypeToScrap
    }
   const instanceId = await client.startNew('CrawlerOrchestrator_V1', undefined, inputBody);
   context.log(`Started orchestration with ID = '${instanceId}'.`);
   let finalRes = client.createCheckStatusResponse(context.bindingData.req, instanceId);
   context.log('finalRes ',finalRes);
   return finalRes;
}

function createResponse(context, statusCode, responseBody) {
  context.res = {
        status: statusCode, /* Defaults to 200 */
        body: JSON.parse(JSON.stringify(responseBody))
    };
}