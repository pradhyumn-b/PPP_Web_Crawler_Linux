const { Console } = require('console');
const http = require('http');
const { isContext } = require('vm');
const urlHelper = require('../utilities/urlHelper'); 
const axios = require('axios');

async function getPidAccordingAddress(address){
  let street;
  let zipCode;
  street = address.substring(0, address.indexOf("<br>"));
  let zipCodeWithAdd = address.substring(address.lastIndexOf("<br>"));
  if(zipCodeWithAdd.match(/(\d+)/)){
    zipCode =  zipCodeWithAdd.match(/(\d+)/)[0];
  }
  if(street && zipCode){
    let str = '';
    try{
      str = await makeGetRequest(encodeURI(urlHelper.pppHost+urlHelper.pppEndpointPrefix+'&ADDR='+street+'&ZIP='+zipCode));
      //console.log('str ', str);
      return str;
    }catch(error){
      console.log('error in ppp callout ', error);
      return str;
    }
  }
}

async function pppCallout(filteredData){
  for(let i=0; i<filteredData.length; i++){
    let caseObj = filteredData[i];
    //console.log('caseObj.CaseNumber ', caseObj.CaseNumber);
    
    if(caseObj.hasOwnProperty('PlaintiffData') && caseObj.PlaintiffData){
      for(let j=0; j < caseObj.PlaintiffData.length; j++){
        let obj = caseObj.PlaintiffData[j];
        //console.log('obj PlaintiffData', obj);
        if(obj.hasOwnProperty('Address') && obj.Address
          && obj.Address.includes("<br>") ){
          let PId = await getPidAccordingAddress(obj.Address);
          obj['PlaintiffPid'] = PId;
        }  
      }
    }

    if(caseObj.hasOwnProperty('DefendantData') && caseObj.DefendantData){
      for(let j=0; j < caseObj.DefendantData.length; j++){
        let obj = caseObj.DefendantData[j];
        //console.log('obj DefendantData', obj);
        if(obj.hasOwnProperty('Address') && obj.Address
          && obj.Address.includes("<br>") ){
          let PId = await getPidAccordingAddress(obj.Address);
          obj['DefendentPid'] = PId;
        }  
      }
    }
  };
  return filteredData;
}

function makeGetRequest(path) {
  return new Promise(function (resolve, reject) {
      axios.get(path).then((response) => {
              let str = response.data;
              //console.log('str', str);
              let PId = [];
              if(str.includes('PID') && str.includes('<span id="json">') && str.includes('</span>')){
                str = str.substring(str.indexOf('<span id="json">') + '<span id="json">'.length, str.indexOf('</span>'));
                //console.log('@@@ str ' + str );
                let caseArr = JSON.parse(str);
                caseArr.forEach(caseObj => {
                  if(caseObj.hasOwnProperty('PID')){
                    PId.push(caseObj.PID)
                  }
                });
                
                /*=========== Parse PID according to String response =============
                let endIndex = str.indexOf(",", str.indexOf("PID"));
                endIndex = (endIndex == -1 ? (str.indexOf("}", str.indexOf("PID"))-1) : endIndex);
                //console.log('indexOf', endIndex);
                PId = str.substring(str.indexOf("PID"), endIndex).replace('PID":', '');
                PId = (PId.includes('}') ? PId.replace('}', '') : PId);*/
              }
              resolve(PId);
          },(error) => {
              reject(error);
          }
      );
  });
}

module.exports = {pppCallout}