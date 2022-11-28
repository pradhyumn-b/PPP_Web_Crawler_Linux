const PCR = require("puppeteer-chromium-resolver");
const puppeteer = require("puppeteer");
const extractAndFilterData = require("./extractAndFilterData")
const extractAddressAndName = require('./extractAddressAndName');


async function scrapeCaseFromURL(urlForScraping){
    const option = {revision: "",detectionPath: "",folderName: ".chromium-browser-snapshots",defaultHosts: ["https://storage.googleapis.com", "https://npm.taobao.org/mirrors"],hosts: [],cacheRevisions: 2,retry: 3,silent: false};
    const stats = await PCR(option);
    const browser = await puppeteer.launch({ headless: true,executablePath: stats.executablePath }); // lauches the browser
    
    let filteredData = await extractAndFilterData.extractAndFilterData(browser, urlForScraping);
    let response = await extractAddressAndName.extractAddressAndName(browser, filteredData);

    return response;

}

module.exports = {scrapeCaseFromURL}