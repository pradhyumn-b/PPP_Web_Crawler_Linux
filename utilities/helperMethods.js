// This file will contain all the non async helper methods
const urlHelper = require("../utilities/urlHelper");
const domain = urlHelper.domain; // domain name 

//to keep 2 digits
  function keep2Digits(num) {
    return num.toString().padStart(2, "0");
  }


  // returns a date to use in URL parameter
  function formatDate(date) {
    return [
      keep2Digits(date.getMonth() + 1),
      keep2Digits(date.getDate()),
      date.getFullYear(),
    ].join("%2F");
  }

  function createURLForSecondPage(mainURL,caseTypeNumber, dateDifference){
    var thirtyDaysBefore = new Date();
    thirtyDaysBefore.setDate(new Date().getDate() - dateDifference); //30 days before
    return mainURL + "&CaseType=" + caseTypeNumber + "&DateCommencedFrom=" + formatDate(thirtyDaysBefore); // url for table page
  }

  function filterData(allData){
    let filterdArray = allData.filter((item) => {
        if (item.length >= 5) {
          if (!item[4].includes(",") && item[5].includes(",")) {
            return true;
          }
        }
      });
    return filterdArray;
  }

  // method added by sri to extract link from the first column
  function fetchLinkFromSelect(data){
    if(data != '' && data.includes('href')){
      return domain + data.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "")
    }else {
      return data;
    }
  }



  function getXpathForElement(idForTable, columnNumber){
    return `//*[@id="${idForTable}"]/table/tbody/tr/td[${columnNumber}]`
  }

  function removeHTMLTags(data){
    return data.replace(/<[^>]+>/g, ' ')
  }

  function removeWhiteSpace(data){
      return data.replace(/\s/g, "")
  }

  module.exports = {keep2Digits, formatDate, createURLForSecondPage, filterData, fetchLinkFromSelect, getXpathForElement, removeHTMLTags, removeWhiteSpace}