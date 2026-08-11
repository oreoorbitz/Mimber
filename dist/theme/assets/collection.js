import {
  cacheSelectors
} from "./chunk-DJ46SEGG.js";
import {
  collectionViews
} from "./chunk-5BJ3D3CN.js";
import "./chunk-R3VCPEU7.js";

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
