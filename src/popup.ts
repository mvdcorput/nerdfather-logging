import * as $ from 'jquery';

// Erase button
function erase() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const tab = tabs[0];
    
    chrome.tabs.sendMessage(tab.id, { text: 'remove-markers' }, null);
  });
}

$('#erase').click(erase);


// Refresh button
function searchMarkerRefresh() {
  callEventPageMethod('searchMarkerRefresh', null, function (response) {});
}

function callEventPageMethod(method, data, callback) {
  chrome.runtime.sendMessage({ method: method, data: data }, function (response) {
      if(typeof callback === "function") callback(response);
  });
}

$('#refresh').click(searchMarkerRefresh);
