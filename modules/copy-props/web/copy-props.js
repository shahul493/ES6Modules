!function(r){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=r();else if("function"==typeof define&&define.amd)define([],r);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.copyProps=r()}}(function(){return function r(t,n,e){function o(f,u){if(!n[f]){if(!t[f]){var c="function"==typeof require&&require;if(!u&&c)return c(f,!0);if(i)return i(f,!0);var a=new Error("Cannot find module '"+f+"'");throw a.code="MODULE_NOT_FOUND",a}var s=n[f]={exports:{}};t[f][0].call(s.exports,function(r){var n=t[f][1][r];return o(n||r)},s,s.exports,r,t,n,e)}return n[f].exports}for(var i="function"==typeof require&&require,f=0;f<e.length;f++)o(e[f]);return o}({1:[function(r,t,n){"use strict";function e(r,t,n){if(!b(r)){var e=n.fromto[t];if(e){delete n.fromto[t],Array.isArray(e)||(e=[e]);for(var o=0,i=e.length;o<i;o++)s(n.dest,e[o],function(i,f){return n.convert(r,t,e[o],i,f)})}}}function o(r,t,n){if(b(r)){for(var e in r)return;return void s(n.dest,t,i)}s(n.dest,t,function(e,o){return n.convert(r,t,t,e,o)})}function i(){return{}}function f(r){return r}function u(r){var t={};for(var n in r){var e=r[n];"string"==typeof e&&(t[n]=e)}return t}function c(r){for(var t={},n=0,e=r.length;n<e;n++){var o=r[n];"string"==typeof o&&(t[o]=o)}return t}function a(r){var t={};for(var n in r){var e=r[n];t[e]||(t[e]=[]),t[e].push(n)}return t}function s(r,t,n){p(r,t.split("."),n)}function p(r,t,n){var e=t.shift();if(!t.length){var o=n(r[e],r);return void(void 0!==o&&(r[e]=o))}b(r[e])||(r[e]={}),p(r[e],t,n)}function l(r,t){for(var n in t){var e=t[n];Array.isArray(e)||(e=[e]);for(var o=0,i=e.length;o<i;o++)s(r,e[o],v)}}function v(){}var y=r("each-props"),b=r("is-plain-object");t.exports=function(r,t,n,i,s){if(b(r)||(r={}),b(t)||(t={}),b(n)?n=u(n):Array.isArray(n)?n=c(n):"boolean"==typeof n?(s=n,i=f,n=null):"function"==typeof n?(s=i,i=n,n=null):n=null,"function"!=typeof i&&("boolean"==typeof i?(s=i,i=f):i=f),"boolean"!=typeof s&&(s=!1),s){var p=r;r=t,t=p,n&&(n=a(n))}var v={dest:t,fromto:n,convert:i};return n?(y(r,e,v),l(t,n)):y(r,o,v),t}},{"each-props":2,"is-plain-object":3}],2:[function(r,t,n){"use strict";function e(r,t,n,f,u){var c=Object.keys(r);if("function"==typeof u.sort){var a=u.sort(c);Array.isArray(a)&&(c=a)}f+=1;for(var s=0,p=c.length;s<p;s++){var l=c[s],v=t+"."+l,y=r[l],b=i({},u);b.name=l,b.index=s,b.count=p,b.depth=f,b.parent=r;!n(y,v.slice(1),b)&&o(y)&&e(y,v,n,f,u)}}var o=r("is-plain-object"),i=r("object-assign");t.exports=function(r,t,n){o(r)&&"function"==typeof t&&(o(n)||(n={}),e(r,"",t,0,n))}},{"is-plain-object":3,"object-assign":5}],3:[function(r,t,n){"use strict";function e(r){return o(r)===!0&&"[object Object]"===Object.prototype.toString.call(r)}var o=r("isobject");t.exports=function(r){var t,n;return e(r)!==!1&&("function"==typeof(t=r.constructor)&&(n=t.prototype,e(n)!==!1&&n.hasOwnProperty("isPrototypeOf")!==!1))}},{isobject:4}],4:[function(r,t,n){"use strict";t.exports=function(r){return null!=r&&"object"==typeof r&&!Array.isArray(r)}},{}],5:[function(r,t,n){"use strict";function e(r){if(null===r||void 0===r)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(r)}var o=Object.getOwnPropertySymbols,i=Object.prototype.hasOwnProperty,f=Object.prototype.propertyIsEnumerable;t.exports=function(){try{if(!Object.assign)return!1;var r=new String("abc");if(r[5]="de","5"===Object.getOwnPropertyNames(r)[0])return!1;for(var t={},n=0;n<10;n++)t["_"+String.fromCharCode(n)]=n;if("0123456789"!==Object.getOwnPropertyNames(t).map(function(r){return t[r]}).join(""))return!1;var e={};return"abcdefghijklmnopqrst".split("").forEach(function(r){e[r]=r}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},e)).join("")}catch(r){return!1}}()?Object.assign:function(r,t){for(var n,u,c=e(r),a=1;a<arguments.length;a++){n=Object(arguments[a]);for(var s in n)i.call(n,s)&&(c[s]=n[s]);if(o){u=o(n);for(var p=0;p<u.length;p++)f.call(n,u[p])&&(c[u[p]]=n[u[p]])}}return c}},{}]},{},[1])(1)});