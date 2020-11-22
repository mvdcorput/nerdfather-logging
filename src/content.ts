import * as $ from 'jquery';
import { IMessage, IMessageData } from './background/messages.service';

const _log = console.log;
const isIFrame = window.top != window;
const messageLimit = 200;
const messages: IMessage[] = [];

let backgroundConnected: boolean = false;
let timer: any;

// Init / connect to background
chrome.runtime.onMessage.addListener(function (msg: IMessage, sender, sendResponse) {
    if (msg.method === 'say' && msg.data.code === 'jsic') {

        _log(msg.data.message);

        sendResponse({ messages });

        backgroundConnected = true;
    }
});

// Message processing
function handleMessage(messageData: IMessageData) {
    const lastMessage = messages[messages.length - 1];
    
    // Determine if duplicate
    let duplicate = false;
    if (lastMessage)
    {
        if (messageData.error && lastMessage.data.error)
        {
            if (lastMessage.data.error.url === messageData.error.url)
            {
                if ((lastMessage.data.error.is404 === lastMessage.data.error.is404) ||
                    (lastMessage.data.error.text === lastMessage.data.error.text)) {
                    duplicate = true;
                }
            }
        }
        if (messageData.warning && lastMessage.data.warning)
        {
            if (lastMessage.data.warning.url === messageData.warning.url)
            {
                if (lastMessage.data.warning.text === lastMessage.data.warning.text) {
                    duplicate = true;
                }
            }
        }
        if (messageData.message && lastMessage.data.message)
        {
            if (lastMessage.data.message.url === messageData.message.url)
            {
                if (lastMessage.data.message.text === lastMessage.data.message.text) {
                    duplicate = true;
                }
            }
        }
    }
 
    // Store / update / send message
    if (duplicate) {
        lastMessage.occurenceEndDate = new Date();
        lastMessage.occurenceCount++;
    } else {
        const msgDate = new Date();
        const newMessage: IMessage = {
            data: messageData,
            date: msgDate,
            method: 'log',
            occurenceCount: 1,
            occurenceEndDate: msgDate,
            url: document.location.href
        }

        messages.push(newMessage);
        if(messages.length > messageLimit) {
            messages.shift();
        }

        if(!timer) {
            timer = window.setTimeout(function() {
                timer = null;
                if (backgroundConnected)
                {
                    chrome.runtime.sendMessage(messageData, function(response) {});
                }
            }, 200);
        }
    }
}

//#region Message Handlers
document.addEventListener('ErrorToExtension', function(e: any) {
    const error = e.detail;
    if(isIFrame) {
        window.top.postMessage({
            _iframeError: true,
            _fromJEN: true,
            error: error
        }, '*');
    }
    else {
        handleMessage({ error });
    }
});

document.addEventListener('WarningToExtension', function(e: any) {
    const warning = e.detail;
    if(isIFrame) {
        window.top.postMessage({
            _iframeError: true,
            _fromJEN: true,
            warning: warning
        }, '*');
    }
    else {
        handleMessage({ warning });
    }
});

document.addEventListener('LogToExtension', function(e: any) {
    const message = e.detail;
    if(isIFrame) {
        window.top.postMessage({
            _iframeError: true,
            _fromJEN: true,
            userMessage: message
        }, '*');
    }
    else {
        handleMessage({ message });
    }
});

//#endregion

//#region Script injection

// Code inside this function will be injected in web pages for javascript message retrieval
function injectable() {
    const _log = console.log, _warn = console.warn, _error = console.error;

    function handleCustomError(message, stack = null) {
        if (!stack) {
            stack = (new Error()).stack.split("\n").splice(2, 4).join("\n");
        }

        const stackLines = stack.split("\n");
        const callSrc = (stackLines.length > 1 && (/^.*?\((.*?):(\d+):(\d+)/.exec(stackLines[1]) || /(\w+:\/\/.*?):(\d+):(\d+)/.exec(stackLines[1]))) || [null, null, null, null];

        document.dispatchEvent(new CustomEvent('ErrorToExtension', {
            detail: {
                stack: stackLines.join("\n"),
                url: callSrc[1],
                line: callSrc[2],
                col: callSrc[3],
                text: message
            }
        }));
    }

    function handleCustomWarning(message, stack = null) {
        if(!stack) {
            stack = (new Error()).stack.split("\n").splice(2, 4).join("\n");
        }

        var stackLines = stack.split("\n");
        var callSrc = (stackLines.length > 1 && (/^.*?\((.*?):(\d+):(\d+)/.exec(stackLines[1]) || /(\w+:\/\/.*?):(\d+):(\d+)/.exec(stackLines[1]))) || [null, null, null, null];

        document.dispatchEvent(new CustomEvent('WarningToExtension', {
            detail: {
                stack: stackLines.join("\n"),
                url: callSrc[1],
                line: callSrc[2],
                col: callSrc[3],
                text: message
            }
        }));
    }

    function handleCustomLog(message, stack = null) {
        if(!stack) {
            stack = (new Error()).stack.split("\n").splice(2, 4).join("\n");
        }

        const stackLines = stack.split("\n");
        const callSrc = (stackLines.length > 1 && (/^.*?\((.*?):(\d+):(\d+)/.exec(stackLines[1]) || /(\w+:\/\/.*?):(\d+):(\d+)/.exec(stackLines[1]))) || [null, null, null, null];

        document.dispatchEvent(new CustomEvent('LogToExtension', {
            detail: {
                stack: stackLines.join("\n"),
                url: callSrc[1],
                line: callSrc[2],
                col: callSrc[3],
                text: message
            }
        }));
    }

    // handle uncaught promises errors
    window.addEventListener('unhandledrejection', function(e: any) {
        if (typeof e.reason === 'undefined') {
            e.reason = e.detail;
        }
        handleCustomError(e.reason.message, e.reason.stack);
    });

    console.log = function() {
        const param = arguments.length === 1 && typeof arguments[0] === 'string' ? 
                        arguments[0] : JSON.stringify(arguments.length === 1 ? arguments[0] : arguments);
        handleCustomLog(param);
        return _log(...arguments);
    };
    
    console.warn = () => {
        const param = arguments.length === 1 && typeof arguments[0] === 'string' ? 
                        arguments[0] : JSON.stringify(arguments.length === 1 ? arguments[0] : arguments);
        handleCustomWarning(param);
        return _warn(...arguments);
    };
    
    console.error = () => {
        const param = arguments.length === 1 && typeof arguments[0] === 'string' ? 
                        arguments[0] : JSON.stringify(arguments.length === 1 ? arguments[0] : arguments);
        handleCustomError(param);
        return _error(...arguments);
    };

    // handle uncaught errors
    window.addEventListener('error', function(e: ErrorEvent) {
        document.dispatchEvent(new CustomEvent('ErrorToExtension', {
            detail: {
                stack: e.error ? e.error.stack : null,
                url: e.filename,
                line: e.lineno,
                col: e.colno,
                text: e.message
            }
        }));
    });

    // handle 404 errors
    window.addEventListener('error', function(e: any) {
        const src = e.target.src || e.target.href;
        const baseUrl = e.target.baseURI;
        if(src && baseUrl && src != baseUrl) {
            document.dispatchEvent(new CustomEvent('ErrorToExtension', {
                detail: {
                    is404: true,
                    url: src
                }
            }));
        }
    }, true);
}

// Inject script as iife, then remove from page source again
const script = document.createElement('script');
script.textContent = '(' + injectable + '())';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);

//#endregion