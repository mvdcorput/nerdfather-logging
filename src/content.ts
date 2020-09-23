import * as $ from 'jquery';

var errors = [];
var logMessages = [];
var warnings = [];
var errorsLimit = 100;
var logMessagesLimit = 100;
var warningsLimit = 100;
var timer;
var isIFrame = window.top != window;

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.method === 'say') {
        console.log(msg.data);
        sendResponse(null);
    }
});

//#region Message Handlers
const __log = console.log;

function handleNewError(error) {
    var lastError = errors[errors.length - 1];
    var isSameAsLast = lastError && lastError.text == error.text && lastError.url == error.url && lastError.line == error.line && lastError.col == error.col;
    var isWrongUrl = !error.url || error.url.indexOf('://') === -1;

    if(!isSameAsLast && !isWrongUrl) {
        errors.push(error);
        if(errors.length > errorsLimit) {
            errors.shift();
        }
        if(!timer) {
            timer = window.setTimeout(function() {
                timer = null;
                chrome.runtime.sendMessage({
                    method: 'log',
                    date: new Date(),
                    data: { error: error, url: window.top.location.href }
                }, function(response) {});
            }, 200);
        }
    }
}
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
        handleNewError(error);
    }
});

function handleNewWarning(warning) {
    var lastWarning = warnings[warnings.length - 1];
    var isSameAsLast = lastWarning && lastWarning.text == warning.text && lastWarning.url == warning.url && lastWarning.line == warning.line && lastWarning.col == warning.col;
    var isWrongUrl = !warning.url || warning.url.indexOf('://') === -1;

    if(!isSameAsLast && !isWrongUrl) {
        warnings.push(warning);
        if(warnings.length > warningsLimit) {
            warnings.shift();
        }
        if(!timer) {
            timer = window.setTimeout(function() {
                timer = null;
                chrome.runtime.sendMessage({
                    method: 'log',
                    date: new Date(),
                    data: { warning: warning, url: window.top.location.href }
                }, function(response) {});
            }, 200);
        }
    }
}
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
        handleNewWarning(warning);
    }
});

function handleNewLogMessage(logMessage) {
    var lastLogMessage = logMessages[logMessages.length - 1];
    var isSameAsLast = lastLogMessage && lastLogMessage.text == logMessage.text && lastLogMessage.url == logMessage.url && lastLogMessage.line == logMessage.line && lastLogMessage.col == logMessage.col;
    var isWrongUrl = !logMessage.url || logMessage.url.indexOf('://') === -1;

    __log('handleNewLogMessage', logMessage);

    if(!isSameAsLast && !isWrongUrl) {
        logMessages.push(logMessages);
        if(logMessages.length > logMessagesLimit) {
            logMessages.shift();
        }
        if(!timer) {
            timer = window.setTimeout(function() {
                timer = null;
                chrome.runtime.sendMessage({
                    method: 'log',
                    date: new Date(),
                    data: { userMessage: logMessage, url: window.top.location.href }
                }, function(response) {});
            }, 200);
        }
    }
}
document.addEventListener('LogToExtension', function(e: any) {
    var logMessage = e.detail;
    if(isIFrame) {
        window.top.postMessage({
            _iframeError: true,
            _fromJEN: true,
            logMessage: logMessage
        }, '*');
    }
    else {
        handleNewLogMessage(logMessage);
    }
});
//#endregion

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

    function handleNfLog(value: string) {
        _log('###', value);
        document.dispatchEvent(new CustomEvent('NfLogMessage', {
            detail: {
                message: value
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

        _log('## ', args)
        _log('## ', JSON.stringify(arguments))

        handleNfLog(args);
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
        console.log('eventlistner error => ', e);
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