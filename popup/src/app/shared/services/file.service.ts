import { Injectable } from '@angular/core';
import { IMessage, MessageCenterService } from './message-center.service';

@Injectable({ providedIn: 'root' })
export class FileService {

    constructor() {
    }

    downloadMessages(messages: IMessage[]) {
        let docContent = '';

        messages.forEach(m => {
            const type = m.data.error ? 'Error' : 'Warning';
            const url = type === 'Error' ? m.data.error.url : m.data.warning.url;
            const text = type === 'Error' ?
                m.data.error.is404 ? '404 Resource not found' : m.data.error.text :
                m.data.warning.text;
            const stack = type === 'Error' ? m.data.error.stack : m.data.warning.stack;

            docContent = docContent.concat(`${m.date} : ${type} (${url})\n${text}\n${stack}\n--------\n\n`);
        });
        let doc = URL.createObjectURL( new Blob([docContent], {type: 'text/plain'}) );
        let filename = 'Javascript messages.txt';
        chrome.downloads.download({ url: doc, filename, conflictAction: 'overwrite', saveAs: true });
    }

    messagesToTab(messages: IMessage[]) {
        const url = `javascript-messages.html`;
        chrome.tabs.create({ url }, (tab: chrome.tabs.Tab) => {});
    }
}
