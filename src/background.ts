import * as $ from 'jquery';

const SeqLogUrl = 'http://localhost:5341/api/events/raw';
//const SeqLogUrl = 'http://localhost:5341/api/events/raw?clef';
const SeqLogApiKey = 'TOUjR9vyDtsqrwOFc8Wo';

// init 
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.active) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];

      chrome.tabs.sendMessage(tabId, { method: 'say', data: 'yo' }, null);
    });
  }
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg) {
    if (msg.method == 'say') {
      console.log(msg.data);
    } else if (msg.method == 'log') {
      console.log('error received -> ', msg.data.error);

      // const seqError = {
      //   "@t": new Date(),
      //   "@m": msg.data.error.message,
      //   "@i": `${uuidv4()}`,
      //   "User": "nerdfather"
      // };

      const seqqqqError = {
        "t": new Date(),
        "@l": "Information",
        "@mt": "Yo, {@User}, {N:x8} at {Now}",
        "@i": `${uuidv4()}`,
        "@r": {
          "N": [
            {
              "Format": "x8",
              "Rendering": "0000007b"
            }
          ]
        }
      };

      console.log(JSON.stringify(seqqqqError));
      (async () => {
        const rawResponse = await fetch(SeqLogUrl, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Seq-ApiKey': SeqLogApiKey
          },
          body: JSON.stringify(seqqqqError)
        });
        const content = await rawResponse.json();
      })();
    }
  }

  return true; // remove this line to make the call sync!
});

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}