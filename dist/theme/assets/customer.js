import {
  getHash,
  loginForms,
  resetPasswordSuccess
} from "./chunk-5BJ3D3CN.js";
import "./chunk-R3VCPEU7.js";

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
