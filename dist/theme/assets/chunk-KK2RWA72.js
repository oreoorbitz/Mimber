/*! Mimber Mepto v2.2.2-mepto.1 — Mepto-integrated, jQuery-free (esbuild Go) */

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

// src/scheduler.js
var _raf = typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : (fn) => setTimeout(fn, 16);
var _queueMeasure = [];
var _queueMutate = [];
var _scheduled = false;
var flush = () => {
  _scheduled = false;
  const m = _queueMeasure.slice();
  const mu = _queueMutate.slice();
  _queueMeasure = [];
  _queueMutate = [];
  for (let i = 0; i < m.length; i++) m[i]();
  for (let i = 0; i < mu.length; i++) mu[i]();
};
var schedule = () => {
  if (_scheduled) return;
  _scheduled = true;
  _raf(flush);
};
var scheduler = {
  measure(fn) {
    _queueMeasure.push(fn);
    schedule();
  },
  mutate(fn) {
    _queueMutate.push(fn);
    schedule();
  },
  flush
};

export {
  __spreadValues,
  scheduler
};
