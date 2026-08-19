/*! Mimber Mepto v2.2.2-mepto.1 — Mepto-integrated, jQuery-free (esbuild Go) */

import {
  cacheSelectors
} from "./chunk-FKLTZ7RG.js";
import {
  collectionViews
} from "./chunk-7ONAE77C.js";
import "./chunk-KK2RWA72.js";

// src/entry/collection.js
if (typeof window !== "undefined") {
  window.timber = window.timber || {};
  window.timber.collectionViews = () => collectionViews(window.timber);
  const initCollection = () => {
    try {
      cacheSelectors(window.timber);
    } catch (e) {
    }
    try {
      collectionViews(window.timber);
    } catch (e) {
    }
  };
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", initCollection);
  else queueMicrotask(initCollection);
}
