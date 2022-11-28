const puppeteer = require("puppeteer");
const extractAndFilter = require('./extractAndFilterData');
const PCR = require("puppeteer-chromium-resolver");
const helperMethods = require('./helperMethods')
const urlHelper = require("../utilities/urlHelper");


async function getCaseNumber(caseType, mainPageURL){
    const option = {revision: "",detectionPath: "",folderName: ".chromium-browser-snapshots",defaultHosts: ["https://storage.googleapis.com", "https://npm.taobao.org/mirrors"],hosts: [],cacheRevisions: 2,retry: 3,silent: false};
    const stats = await PCR(option);
    const browser = await puppeteer.launch({ headless: true,executablePath: stats.executablePath }); // lauches the browser
    let caseTypeNumber = await extractAndFilter.getCaseTypeNumber(browser, caseType, mainPageURL);
    let tablePageURL = helperMethods.createURLForSecondPage(urlHelper.urlForSecondPage, caseTypeNumber, 30);
    let totalRecords = await getTotalRecordsForCaseType(browser, tablePageURL)
    if(caseTypeNumber != undefined && caseTypeNumber != '' && totalRecords != undefined && totalRecords != '' ){
        return {caseTypeNumber, totalRecords};
    }else {
        return 'Case Type Cannot Be Found';
    }
}


async function getTotalRecordsForCaseType(browser, pageLink){

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto(pageLink, {waitUntil : 'networkidle2'});
    let searchResults = `//span[contains(text(), 'Results')]`
    const element = (await page.$x(searchResults))
    for(const each of element){
        const src = await each.getProperty("textContent")
        let raw = await src.jsonValue();
        if(raw != undefined && raw !=''){
            // console.log('raw ->',parseInt(raw))
            if(raw.includes(' Results')){
                raw = raw.replace(" Results","");
            }
            return raw;
        }
    }
}


module.exports = {getCaseNumber}

