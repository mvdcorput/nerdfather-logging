!function(e){var n={};function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)t.d(o,r,function(n){return e[n]}.bind(null,r));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=3)}({3:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o,r=[],i=[],l=[],u=100,s=100,c=100,a=window.top!=window;chrome.runtime.onMessage.addListener(function(e,n,t){"say"===e.method&&(console.log(e.data),t(null))});const d=console.log;document.addEventListener("ErrorToExtension",function(e){var n=e.detail;a?window.top.postMessage({_iframeError:!0,_fromJEN:!0,error:n},"*"):function(e){var n=r[r.length-1],t=n&&n.text==e.text&&n.url==e.url&&n.line==e.line&&n.col==e.col,i=!e.url||-1===e.url.indexOf("://");t||i||(r.push(e),r.length>u&&r.shift(),o||(o=window.setTimeout(function(){o=null,chrome.runtime.sendMessage({method:"log",data:{error:e,url:window.top.location.href}},function(e){})},200)))}(n)}),document.addEventListener("WarningToExtension",function(e){var n=e.detail;a?window.top.postMessage({_iframeError:!0,_fromJEN:!0,warning:n},"*"):function(e){var n=l[l.length-1],t=n&&n.text==e.text&&n.url==e.url&&n.line==e.line&&n.col==e.col,r=!e.url||-1===e.url.indexOf("://");t||r||(l.push(e),l.length>c&&l.shift(),o||(o=window.setTimeout(function(){o=null,chrome.runtime.sendMessage({method:"log",data:{warning:e,url:window.top.location.href}},function(e){})},200)))}(n)}),document.addEventListener("LogToExtension",function(e){var n=e.detail;a?window.top.postMessage({_iframeError:!0,_fromJEN:!0,logMessage:n},"*"):function(e){var n=i[i.length-1],t=n&&n.text==e.text&&n.url==e.url&&n.line==e.line&&n.col==e.col,r=!e.url||-1===e.url.indexOf("://");d("handleNewLogMessage",e),t||r||(i.push(i),i.length>s&&i.shift(),o||(o=window.setTimeout(function(){o=null,chrome.runtime.sendMessage({method:"log",data:{userMessage:e,url:window.top.location.href}},function(e){})},200)))}(n)});var f=document.createElement("script");f.textContent="("+function(){const e=console.log,n=console.warn,t=console.error;function o(e,n=null){n||(n=(new Error).stack.split("\n").splice(2,4).join("\n"));var t=n.split("\n"),o=t.length>1&&(/^.*?\((.*?):(\d+):(\d+)/.exec(t[1])||/(\w+:\/\/.*?):(\d+):(\d+)/.exec(t[1]))||[null,null,null,null];document.dispatchEvent(new CustomEvent("ErrorToExtension",{detail:{stack:t.join("\n"),url:o[1],line:o[2],col:o[3],text:e}}))}window.addEventListener("unhandledrejection",function(e){void 0===e.reason&&(e.reason=e.detail),o(e.reason.message,e.reason.stack)}),console.log=function(){const n=1==arguments.length&&"string"==typeof arguments[0]?arguments[0]:JSON.stringify(1==arguments.length?arguments[0]:arguments);return e("## ",n),e("## ",JSON.stringify(arguments)),function(n){e("###",n),document.dispatchEvent(new CustomEvent("NfLogMessage",{detail:{message:n}}))}(n),e(...arguments)},console.warn=function(){const e=[];for(var t in arguments)e.push(arguments[t]);return function(e,n=null){n||(n=(new Error).stack.split("\n").splice(2,4).join("\n"));var t=n.split("\n"),o=t.length>1&&(/^.*?\((.*?):(\d+):(\d+)/.exec(t[1])||/(\w+:\/\/.*?):(\d+):(\d+)/.exec(t[1]))||[null,null,null,null];document.dispatchEvent(new CustomEvent("WarningToExtension",{detail:{stack:t.join("\n"),url:o[1],line:o[2],col:o[3],text:e}}))}(1==e.length&&"string"==typeof e[0]?e[0]:JSON.stringify(1==e.length?e[0]:e)),n(...arguments)},console.error=function(){const e=[];for(var n in arguments)e.push(arguments[n]);return o(1==e.length&&"string"==typeof e[0]?e[0]:JSON.stringify(1==e.length?e[0]:e)),t(...arguments)},window.addEventListener("error",function(e){console.log("eventlistner error => ",e),document.dispatchEvent(new CustomEvent("ErrorToExtension",{detail:{stack:e.error?e.error.stack:null,url:e.filename,line:e.lineno,col:e.colno,text:e.message}}))}),window.addEventListener("error",function(e){var n=e.target.src||e.target.href,t=e.target.baseURI;n&&t&&n!=t&&document.dispatchEvent(new CustomEvent("ErrorToExtension",{detail:{is404:!0,url:n}}))},!0)}+"())",(document.head||document.documentElement).appendChild(f),f.parentNode.removeChild(f)}});