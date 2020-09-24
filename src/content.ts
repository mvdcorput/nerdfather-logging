import * as $ from 'jquery';
import { IMessage, IMessageData } from './background/messages.service';

const _log = console.log;
const isIFrame = window.top != window;
const messageLimit = 100;
const messages: IMessage[] = [];

let backgroundConnected: boolean = false;
let timer: any;

var logMessages = [];

// Init / connect to background
chrome.runtime.onMessage.addListener(function (msg: IMessage, sender, sendResponse) {
    if (msg.method === 'say' && msg.data.code === 'jsic') {

        _log(msg.data.message);

        sendResponse({ messages });

        backgroundConnected = true;
    }
});

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
            method: 'log',
            date: msgDate,
            occurenceCount: 1,
            occurenceEndDate: msgDate,
            data: messageData
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
    var error = e.detail;
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
    var warning = e.detail;
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
    var message = e.detail;
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


// Code inside this function will be injected in web pages for javascript message retrieval
function codeToInject() {
    const _log = console.log, _warn = console.warn, _error = console.error;

    function handleCustomError(message, stack = null) {
        if (!stack) {
            stack = (new Error()).stack.split("\n").splice(2, 4).join("\n");
        }

        var stackLines = stack.split("\n");
        var callSrc = (stackLines.length > 1 && (/^.*?\((.*?):(\d+):(\d+)/.exec(stackLines[1]) || /(\w+:\/\/.*?):(\d+):(\d+)/.exec(stackLines[1]))) || [null, null, null, null];

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

        var stackLines = stack.split("\n");
        var callSrc = (stackLines.length > 1 && (/^.*?\((.*?):(\d+):(\d+)/.exec(stackLines[1]) || /(\w+:\/\/.*?):(\d+):(\d+)/.exec(stackLines[1]))) || [null, null, null, null];

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
        const args = arguments.length == 1 && typeof arguments[0] == 'string' ? 
            arguments[0] : JSON.stringify(arguments.length == 1 ? 
                arguments[0] : arguments);

        handleCustomLog(args);
        return _log(...arguments);
    };
    
    console.warn = function() {
        const argsArray = [];
        for(var i in arguments) { // because arguments.join() not working! oO
            argsArray.push(arguments[i]);
        }
        handleCustomWarning(argsArray.length == 1 && typeof argsArray[0] == 'string' ? argsArray[0] : JSON.stringify(argsArray.length == 1 ? argsArray[0] : argsArray));
        return _warn(...arguments);
    };
    
    console.error = function() {
        const argsArray = [];
        for(var i in arguments) { // because arguments.join() not working! oO
            argsArray.push(arguments[i]);
        }
        handleCustomError(argsArray.length == 1 && typeof argsArray[0] == 'string' ? argsArray[0] : JSON.stringify(argsArray.length == 1 ? argsArray[0] : argsArray));
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
        var src = e.target.src || e.target.href;
        var baseUrl = e.target.baseURI;
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

// Inject script so it is executed, then remove
var script = document.createElement('script');
script.textContent = '(' + codeToInject + '())';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);