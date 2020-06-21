import * as $ from 'jquery';

var errors = [];
var errorsLimit = 100;
var timer;
var isIFrame = window.top != window;

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.method === 'say') {

        console.log(msg.data);

        sendResponse(null);
    }
});


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

function codeToInject() {

    function handleCustomError(message, stack = null) {
        if(!stack) {
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

    // handle uncaught promises errors
    window.addEventListener('unhandledrejection', function(e: any) {
        if (typeof e.reason === 'undefined') {
            e.reason = e.detail;
        }
        handleCustomError(e.reason.message, e.reason.stack);
    });

    // handle console.error()
    var consoleErrorFunc = window.console.error;
    window.console.error = function() {
        var argsArray = [];
        for(var i in arguments) { // because arguments.join() not working! oO
            argsArray.push(arguments[i]);
        }
        consoleErrorFunc.apply(console, argsArray);

        handleCustomError(argsArray.length == 1 && typeof argsArray[0] == 'string' ? argsArray[0] : JSON.stringify(argsArray.length == 1 ? argsArray[0] : argsArray));
    };

    // handle uncaught errors
    window.addEventListener('error', function(e) {

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

var script = document.createElement('script');
script.textContent = '(' + codeToInject + '())';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);