import * as $ from 'jquery';
import { MessageService } from './background/messages.service';

const SeqLogUrl = 'http://localhost:5341/api/events/raw';
//const SeqLogUrl = 'http://localhost:5341/api/events/raw?clef';
const SeqLogApiKey = 'TOUjR9vyDtsqrwOFc8Wo';

const messageService = new MessageService();

// init 
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.active) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      messageService.reset(tab.url);
      chrome.tabs.sendMessage(tabId, { method: 'say', data: 'Javascript informer connected' }, null);
    });
  }
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg) {
    let response: any = 'ok';

    switch (msg.method)
    {
      case 'say':
        console.log(msg.data);
        break;
      case 'initializePopup':
      case 'getMessages':
        response = { messages: messageService.messages }; 
        break;
      case 'log':
        messageService.addMessage(msg);
        break;
    }

    sendResponse(response);
  }

  return true; // remove this line to make the call sync!
});

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

        // const seqqqqError = {
        //   "t": new Date(),
        //   "@l": "Information",
        //   "@mt": "Yo, {@User}, {N:x8} at {Now}",
        //   "@i": `${uuidv4()}`,
        //   "@r": {
        //     "N": [
        //       {
        //         "Format": "x8",
        //         "Rendering": "0000007b"
        //       }
        //     ]
        //   }
        // };
  
        // (async () => {
        //   const rawResponse = await fetch(SeqLogUrl, {
        //     method: 'POST',
        //     headers: {
        //       'Accept': 'application/json',
        //       'Content-Type': 'application/json',
        //       'X-Seq-ApiKey': SeqLogApiKey
        //     },
        //     body: JSON.stringify(seqqqqError)
        //   });
        //   const content = await rawResponse.json();
        // })();