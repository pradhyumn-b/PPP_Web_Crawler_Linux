const urlHelper = require("../utilities/urlHelper");
const plaintiffTableId = urlHelper.plaintiffTableId
const defendentTableId = urlHelper.defendentTableId
const helperMethods = require('./helperMethods');

async function createResponse(browser, filteredWholeData){
    let response = [];
     if(filteredWholeData.length > 0){
      header = [];
      filteredWholeData[0].forEach(item => {
        if(item.length == 0){
          header.push(''); 
        }else if(item[0].includes('Case Number')){
          header.push('Case Number');
        }else{
          header.push(item[0]);
        }
      });
      filteredWholeData.splice(0,1); // index, totalItemsforRemove
      for(const item of filteredWholeData){
        let caseLink = helperMethods.fetchLinkFromSelect(item[0]);
        // console.log('caseLink:', caseLink);
        let address = await extractCaseDetailsTable(browser, caseLink);
        response.push({ 
          //"CaseItemLink" : caseLink, 
           [String(header[1]).replace(/\s/g, "")] : item[1], 
           [String(header[2]).replace(/\s/g, "")] : item[2], 
           [String(header[3]).replace(/\s/g, "")] : item[3], 
           [String(header[4]).replace(/\s/g, "")] : item[4], 
           [String(header[5]).replace(/\s/g, "")] : item[5], 
           [String(header[6]).replace(/\s/g, "")] : item[6], 
           [String(header[7]).replace(/\s/g, "")] : item[7], 
           [String(header[8]).replace(/\s/g, "")] : item[8], 
           ...address
        });
      }
     }
     return response
  }
  
async function extractCaseDetailsTable(browser, pageLink){
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto(pageLink, {waitUntil : 'networkidle2'});
  let tableIds = [plaintiffTableId, defendentTableId];
  let caseDetail = {}
  // console.log('pageLink:', pageLink);
  for(const tableId of tableIds){
      let heading = await page.$$eval(`#${tableId} table`, (rows) => {
          return Array.from(rows, (row) => {
            const columns = row.querySelectorAll("tr th") ;
            return Array.from(columns, (column) => column.textContent.trim());
          });
        });
        // console.log('heading:', heading);
        const data = await page.$$eval(`#${tableId} table tr`, (rows) => {
          return Array.from(rows, (row) => {
            const columns = row.querySelectorAll("td") ;
            return Array.from(columns, (column) => column.innerHTML.trim());
          });
        });
      //   console.log('data:', data);
      let tableData = []
      heading = [...heading[0] || heading]
      // console.log('heading:', heading);
      for(const each of data){
          let tempData = {};
          if(each.length > 0){
              for(let i = 1; i<heading.length; i++ ){
                  tempData[heading[i]] = each[i]
              }
              tableData.push(tempData);
          }
      }
      // console.log('tableData:', tableData);
      if(tableId.includes('Plaintiffs')){
          caseDetail['PlaintiffData'] = tableData
      }else if(tableId.includes('Defendants')){
          caseDetail['DefendantData'] = tableData
      }
  }
  await page.close();
  return caseDetail;
}

async function extractAddressAndName(browser, filteredData){
    return createResponse(browser, filteredData)
}

module.exports = {extractAddressAndName}