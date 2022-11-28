/**
 * This files contains all the static references of code.
 */
 const searchURLs = ['https://courtsapp.montcopa.org/psi/v/search/case'];
 const caseType = ['Complaint In Mortgage Foreclosure','Municipal Lien','Municipal Lien Govt'];
 //const caseType = ['Complaint In Mortgage Foreclosure','Municipal Lien'];
 //const caseType = ['Municipal Lien'];
 //const numberOfDaysBefore = 10;
 const numberOfDaysBefore = 30;
 const noOfRecordsInSingleChunk = 20;
 const urlForSecondPage =  "https://courtsapp.montcopa.org/psi/v/search/case?Q=&IncludeSoundsLike=false&fromAdv=1&CaseNumber=&ParcelNumber=&Grid=true&Count="+noOfRecordsInSingleChunk;
 //const urlForSecondPage =  "https://courtsapp.montcopa.org/psi/v/search/case?Q=&IncludeSoundsLike=false&fromAdv=1&CaseNumber=&ParcelNumber=&Grid=true&Count=1";
 //const urlForCaseTablePage = "https://courtsapp.montcopa.org/psi/v/search/case?Q=&IncludeSoundsLike=false&fromAdv=1&CaseNumber=&ParcelNumber=&Grid=true";
 const domain = 'https://courtsapp.montcopa.org';
 const plaintiffTableId = 'table_Plaintiffs'
 const defendentTableId = 'table_Defendants'

 // Salesforce Authentication Details
 const username = 'pradhyumn.b@partnercommunity.com';
 const password = 'Bansal@1998';
 const requestURL = '/services/apexrest/WebScraping';

 //PPP Site Callout Settings  
 const pppHost = 'https://www.propertypalsdata.com';
 const pppKey = 'ar1000&ID2=c45_2irr!y3'; 
 const pppEndpointPrefix = "/SF/?ID1="+pppKey;
 
 module.exports = {  	searchURLs,
                      caseType,
                      numberOfDaysBefore,
                      urlForSecondPage,
                      domain,
                      plaintiffTableId,
                      defendentTableId,
                      username,
                      password,
                      requestURL, 
                      pppHost,
                      pppKey,
                      pppEndpointPrefix,
                      noOfRecordsInSingleChunk
                  };
 