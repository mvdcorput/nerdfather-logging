!function(e){var r={};function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:n})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,r){if(1&r&&(e=t(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(t.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var o in e)t.d(n,o,function(r){return e[r]}.bind(null,o));return n},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},t.p="",t(t.s=4)}({4:function(e,r){chrome.runtime.sendMessage({method:"getMessages",data:null},function(e){if(e.messages){let r="";e.messages.sort(function(e,r){return r.date-e.date}).forEach(e=>{const t=e.data.error?"Error":"Warning",n="Error"===t?e.data.error.url:e.data.warning.url,o="Error"===t?e.data.error.is404?"404 Resource not found":e.data.error.text:e.data.warning.text,a="Error"===t?e.data.error.stack:e.data.warning.stack,u=t.toLowerCase();r=r.concat(`<b><p>${e.date} : <span class="${u}">${t}</span> (${n})</b><br/>${o}<br/>${a}<br/></p><br/>`)}),document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend",r)}})}});