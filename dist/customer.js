/*! Mimber Mepto v2.2.2-mepto.1 — Mepto-integrated, jQuery-free (esbuild Go) */

import {
  getHash,
  loginForms,
  resetPasswordSuccess
} from "./chunk-7ONAE77C.js";
import "./chunk-KK2RWA72.js";

// src/entry/customer.js
if (typeof window !== "undefined") {
  window.timber = window.timber || {};
  window.timber.getHash = getHash;
  window.timber.loginForms = () => loginForms(window.timber);
  window.timber.resetPasswordSuccess = () => resetPasswordSuccess(window.timber);
  const initCustomer = () => {
    try {
      loginForms(window.timber);
    } catch (e) {
    }
    try {
      resetPasswordSuccess(window.timber);
    } catch (e) {
    }
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initCustomer);
  else queueMicrotask(initCustomer);
}
