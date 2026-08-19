/*! Mimber Mepto v2.2.2-mepto.1 — Mepto-integrated, jQuery-free (esbuild Go) */

import {
  cacheSelectors
} from "./chunk-FKLTZ7RG.js";
import {
  productImageSwitch,
  switchImage
} from "./chunk-7ONAE77C.js";
import {
  __spreadValues,
  scheduler
} from "./chunk-KK2RWA72.js";

// src/product-page.js
var I18N_DEFAULTS = {
  addToCart: "Add to cart",
  soldOut: "Sold out",
  unavailable: "Unavailable",
  compareAt: "Compare at"
};
var byId = (id) => document.getElementById(id);
var qq = (sel, root = document) => {
  const bare = sel.trim();
  if (root === document) {
    if (/^\.[\w-]+$/.test(bare)) return [...document.getElementsByClassName(bare.slice(1))];
    if (/^[a-zA-Z][\w-]*$/.test(bare)) return [...document.getElementsByTagName(bare)];
  } else if (root && root.nodeType === 1) {
    if (/^\.[\w-]+$/.test(bare)) return [...root.getElementsByClassName(bare.slice(1))];
    if (/^[a-zA-Z][\w-]*$/.test(bare)) return [...root.getElementsByTagName(bare)];
  }
  return [...root.querySelectorAll(sel)];
};
var productPage = (options = {}) => {
  const moneyFormat = options.money_format || window.Shopify && window.Shopify.money_format || "";
  const variant = options.variant;
  const i18n = __spreadValues(__spreadValues({}, I18N_DEFAULTS), options.i18n || {});
  const productImage = byId("ProductPhotoImg");
  const addToCart = byId("AddToCart");
  const productPrice = byId("ProductPrice");
  const comparePrice = byId("ComparePrice");
  const quantityElements = qq(".quantity-selector, label + .js-qty");
  const addToCartText = byId("AddToCartText");
  scheduler.mutate(() => {
    if (variant) {
      if (variant.featured_image && productImage) {
        const newImg = variant.featured_image;
        if (window.Shopify && window.Shopify.Image && typeof window.Shopify.Image.switchImage === "function") {
          window.Shopify.Image.switchImage(newImg, productImage, switchImage);
        } else {
          switchImage(newImg && newImg.src ? newImg.src : newImg, null, productImage);
        }
      }
      if (variant.available) {
        if (addToCart) {
          addToCart.classList.remove("disabled");
          addToCart.disabled = false;
        }
        if (addToCartText) addToCartText.textContent = i18n.addToCart;
        for (let i = 0, n = quantityElements.length; i < n; i++) quantityElements[i].style.display = "";
        if (quantityElements.length === 1 && quantityElements[0].style.display === "none")
          quantityElements[0].style.display = "block";
        for (let i = 0, n = quantityElements.length; i < n; i++) if (quantityElements[i].style.display === "none") quantityElements[i].style.display = "block";
      } else {
        if (addToCart) {
          addToCart.classList.add("disabled");
          addToCart.disabled = true;
        }
        if (addToCartText) addToCartText.textContent = i18n.soldOut;
        for (let i = 0, n = quantityElements.length; i < n; i++) quantityElements[i].style.display = "none";
      }
      if (productPrice) {
        const fmt = window.Shopify && window.Shopify.formatMoney ? window.Shopify.formatMoney(variant.price, moneyFormat) : String(variant.price);
        productPrice.innerHTML = fmt;
      }
      if (comparePrice) {
        if (variant.compare_at_price > variant.price) {
          const cfmt = window.Shopify && window.Shopify.formatMoney ? window.Shopify.formatMoney(variant.compare_at_price, moneyFormat) : String(variant.compare_at_price);
          comparePrice.innerHTML = `${i18n.compareAt} ${cfmt}`;
          comparePrice.style.display = "block";
        } else {
          comparePrice.style.display = "none";
        }
      }
    } else {
      if (addToCart) {
        addToCart.classList.add("disabled");
        addToCart.disabled = true;
      }
      if (addToCartText) addToCartText.textContent = i18n.unavailable;
      for (let i = 0, n = quantityElements.length; i < n; i++) quantityElements[i].style.display = "none";
    }
  });
};

// src/entry/product.js
if (typeof window !== "undefined") {
  window.timber = window.timber || {};
  window.timber.productPage = productPage;
  window.timber.productImageSwitch = () => productImageSwitch(window.timber);
  window.timber.switchImage = switchImage;
  const initProduct = () => {
    try {
      cacheSelectors(window.timber);
    } catch (e) {
    }
    try {
      productImageSwitch(window.timber);
    } catch (e) {
    }
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initProduct);
  else queueMicrotask(initProduct);
}
