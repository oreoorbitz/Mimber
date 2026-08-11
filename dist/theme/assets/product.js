import {
  cacheSelectors
} from "./chunk-DJ46SEGG.js";
import {
  productImageSwitch,
  switchImage
} from "./chunk-5BJ3D3CN.js";
import {
  __spreadValues,
  scheduler
} from "./chunk-R3VCPEU7.js";

// src/product-page.js
var I18N_DEFAULTS = {
  addToCart: "Add to cart",
  soldOut: "Sold out",
  unavailable: "Unavailable",
  compareAt: "Compare at"
};
var byId = (id) => document.getElementById(id);
var qq = (sel) => [...document.querySelectorAll(sel)];
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
        quantityElements.forEach((el) => {
          el.style.display = "";
        });
        if (quantityElements.length === 1 && quantityElements[0].style.display === "none")
          quantityElements[0].style.display = "block";
        quantityElements.forEach((el) => {
          if (el.style.display === "none") el.style.display = "block";
        });
      } else {
        if (addToCart) {
          addToCart.classList.add("disabled");
          addToCart.disabled = true;
        }
        if (addToCartText) addToCartText.textContent = i18n.soldOut;
        quantityElements.forEach((el) => {
          el.style.display = "none";
        });
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
      quantityElements.forEach((el) => {
        el.style.display = "none";
      });
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
