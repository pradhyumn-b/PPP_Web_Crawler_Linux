const urlHelper = require("../utilities/urlHelper");
const urlForDownloadingData = urlHelper.urlForSecondPage
const numberOfDaysBefore = urlHelper.numberOfDaysBefore
const helperMethods = require('./helperMethods');

async function extractAndFilter(browser, caseType, urlForCaseSearch){
  let caseTypeNumber = await getCaseTypeNumber(browser, caseType, urlForCaseSearch);
  console.log("caseTypeNumber ->", caseTypeNumber);
  let urlForNextPage = helperMethods.createURLForSecondPage(urlForDownloadingData, caseTypeNumber, numberOfDaysBefore);
  console.log("urlForNextPage -->", urlForNextPage);
  let filteredWholeData = await extractAndFilterData(browser, urlForNextPage);
  return filteredWholeData;
}

async function getCaseTypeNumber(browser, caseType, urlForCaseSearch){
    const page1 = await browser.newPage(); //creates a page
    await page1.setDefaultNavigationTimeout(0);
    await page1.goto(urlForCaseSearch, { waitUntil: "networkidle0" });
    let xpathForCaseTypeSearch = `//*[text()='${caseType}']`
    const element = await page1.$x( xpathForCaseTypeSearch ); //searches the whole page for the text
    for (const each of element) {
      const src = await each.getProperty("value");
      const raw = await src.jsonValue();
      if (raw != undefined) {
        await page1.close();
        return raw;
      }
    }
  }

  async function extractAndFilterData(browser, urlForPage){
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto(urlForPage, { waitUntil: "networkidle2" });
    let heading = await extractHeading(page);
    let allData = await extractWholeData(page);
    let filteredData = helperMethods.filterData(allData);
    let wholeData = [];
    wholeData.push(heading); 
    wholeData.push(...allData);
    return [heading, ...filteredData];
  }


  async function extractHeading(page){
    const heading = await page.$$eval(".ViewerSummary th", (rows) => {
      return Array.from(rows, (row) => {
        const columns = row.querySelectorAll("th a");
        return Array.from(columns, (column) => column.innerHTML);
      });
    });
    return heading;
  }

  async function extractWholeData(page){
    let results = await page.$eval(".ViewerSummary tbody", (tbody) => [...tbody.rows].map((r) => [...r.cells].map((c) => c.innerHTML)));
    return results;
  }

  module.exports = {extractAndFilter, getCaseTypeNumber, extractAndFilterData}