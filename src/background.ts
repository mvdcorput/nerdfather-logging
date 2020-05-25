// import * as $ from 'jquery';

// let supportedSearchEngines: Array<SupportedSearchEngine> = [];

// // Get supported search engines
// getSupportedSearchEngines();
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  console.log('onUpdated', changeInfo);
  if (changeInfo.status == 'complete' && tab.active) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const tab = tabs[0];

      // If current tab holds an url
      if (tab.url !== undefined && tab.url !== null && tab.url !== '')
      {
        console.log('Nerdfather knows!!');
        
        setTimeout(() => {
          console.log(chrome.runtime.lastError.message);
        }, 3000);
      }
    });
  }
});

// chrome.runtime.onMessage.addListener(function(message, callback) {
//   console.log("Nerfather knows!");
//   alert("Nerfather knows!");
// });


// chrome.runtime.onMessage.addListener(function (obj, sender, sendResponse) {
//   if (obj) {
//       if (obj.method == 'searchMarkerRefresh') {
//         getSupportedSearchEngines();
//       } 
//   }
//   return true; // remove this line to make the call sync!
// });


// function getSupportedSearchEngines() {
//   $.ajax({
//       url: "https://nf-logging-azure-functions.azurewebsites.net/api/GetSupportedSearchEngines",
//       type: "POST",
//       processData: false,
//       contentType: "application/json",
//       success: (data, type, obj) => {
//         supportedSearchEngines = JSON.parse(data);
//       },
//       error: (data) => {
//           console.error(data);
//       }
//   });
// }