import * as $ from 'jquery';
import { IMessage, MessageService } from './background/messages.service';

const messageService = new MessageService();
const activeTabUrlsHistory = [];

// Init / connect to content script 
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) {
  if (changeInfo.status == 'complete' && tab.active && tab.url.indexOf('chrome-extension://') === -1) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      activeTabUrlsHistory.push(tab.url);
      messageService.reset(tab.url);

      chrome.tabs.sendMessage(tabId, {
        method: 'say', data: { code: 'jsic', message: 'Javascript informer connected.' }
      }, (response) => {
        if (response && response.messages) {
          console.log('Content script connected', response.messages);

          messageService.addMessages(response.messages);
        }
      });
    });
  }
});

// Handle messages
chrome.runtime.onMessage.addListener(function (msg: IMessage, sender, sendResponse) {
  if (msg) {
    let response: any = 'ok';

    switch (msg.method) {
      case 'say':
        console.trace('Someone is saying : ', msg.data.code, msg.data.message);
        break;
      case 'initializePopup':
        const currentUrl = activeTabUrlsHistory[activeTabUrlsHistory.length - 1]; 
        response = {
          messages: messageService.messages.filter(m => m.url === currentUrl)
        };
        break;
      case 'getMessages':
        const previousUrl = activeTabUrlsHistory[activeTabUrlsHistory.length - 1]; 
        response = {
          url: previousUrl,
          messages: messageService.messages.filter(m => m.url === previousUrl)
        };
        console.trace('Replying messages : ', msg.method, response);
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