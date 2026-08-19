/*! Mimber Mepto v2.2.2-mepto.1 — Mepto-integrated, jQuery-free (esbuild Go) */

import {
  __spreadValues,
  scheduler
} from "./chunk-KK2RWA72.js";

// src/shopify-api.js
var getShopifyRoot = () => {
  const r = typeof window !== "undefined" && window.Shopify && window.Shopify.routes && window.Shopify.routes.root ? window.Shopify.routes.root : "/";
  return r.endsWith("/") ? r : `${r}/`;
};
var cartUrl = (path) => {
  const p = path.replace(/^\//, "");
  return getShopifyRoot() + p;
};
var attributeToString = (attr) => {
  if (typeof attr !== "string") {
    attr = String(attr);
    if (attr === "undefined") attr = "";
  }
  return attr.trim();
};
var trigger = (target, name, detail) => {
  const el = target || document.body;
  const node = el && el[0] ? el[0] : el;
  if (!node || !node.dispatchEvent) return;
  node.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
  try {
    const mepto = window.mepto || window.jQuery;
    if (mepto && mepto(node).trigger) mepto(node).trigger(name, detail);
  } catch (_) {
  }
};
var jsonFetch = (url, opts = {}) => fetch(url, __spreadValues({ credentials: "same-origin", headers: { Accept: "application/json" } }, opts)).then(
  async (res) => {
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (_) {
      data = { responseText: text };
      data.responseText = text;
    }
    if (!res.ok) {
      const err = new Error("Shopify API error");
      err.responseText = text;
      err.status = res.status;
      throw err;
    }
    return data;
  }
);
if (typeof window !== "undefined") {
  window.ShopifyAPI = window.ShopifyAPI || {};
}
var ShopifyAPI = typeof window !== "undefined" ? window.ShopifyAPI : {};
ShopifyAPI.onCartUpdate = ShopifyAPI.onCartUpdate || function() {
};
ShopifyAPI.onError = ShopifyAPI.onError || function(xhr, _textStatus) {
  let data;
  try {
    data = JSON.parse(xhr.responseText || xhr.message || "{}");
  } catch (_) {
    data = {};
  }
  if (data.message) alert(`${data.message}(${data.status}): ${data.description}`);
};
ShopifyAPI.updateCartNote = (note, callback) => {
  const body = document.body;
  trigger(body, "beforeUpdateCartNote.ajaxCart", note);
  fetch(cartUrl("/cart/update.js"), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "note=" + encodeURIComponent(attributeToString(note))
  }).then((r) => r.json()).then((cart) => {
    if (typeof callback === "function") callback(cart);
    else ShopifyAPI.onCartUpdate(cart);
    trigger(body, "afterUpdateCartNote.ajaxCart", [note, cart]);
    trigger(body, "completeUpdateCartNote.ajaxCart", [null, null, "success"]);
  }).catch((err) => {
    trigger(body, "errorUpdateCartNote.ajaxCart", [err, "error"]);
    ShopifyAPI.onError(
      { responseText: err.responseText || err.message, status: err.status },
      "error"
    );
    trigger(body, "completeUpdateCartNote.ajaxCart", [null, err, "error"]);
  });
};
ShopifyAPI.addItemFromForm = (form, callback, errorCallback) => {
  const body = document.body;
  const fd = form instanceof HTMLFormElement ? new FormData(form) : new FormData();
  let formEl = form;
  if (typeof form === "string") formEl = document.querySelector(form);
  const bodyStr = formEl instanceof HTMLFormElement ? new URLSearchParams(new FormData(formEl)).toString() : new URLSearchParams(fd).toString();
  trigger(body, "beforeAddItem.ajaxCart", form);
  fetch(cartUrl("/cart/add.js"), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: bodyStr
  }).then(async (res) => {
    const text = await res.text();
    if (!res.ok) {
      const err = new Error(text);
      err.responseText = text;
      err.status = res.status;
      throw err;
    }
    return text ? JSON.parse(text) : {};
  }).then((lineItem) => {
    if (typeof callback === "function") callback(lineItem, form);
    else if (typeof ShopifyAPI.onItemAdded === "function") ShopifyAPI.onItemAdded(lineItem, form);
    trigger(body, "afterAddItem.ajaxCart", [lineItem, form]);
    trigger(body, "completeAddItem.ajaxCart", [null, null, "success"]);
  }).catch((err) => {
    if (typeof errorCallback === "function") errorCallback(err, "error");
    else ShopifyAPI.onError(err, "error");
    trigger(body, "errorAddItem.ajaxCart", [err, "error"]);
    trigger(body, "completeAddItem.ajaxCart", [null, err, "error"]);
  });
};
ShopifyAPI.getCart = (callback) => {
  trigger(document.body, "beforeGetCart.ajaxCart");
  jsonFetch(cartUrl("/cart.js")).then((cart) => {
    if (typeof callback === "function") callback(cart);
    else ShopifyAPI.onCartUpdate(cart);
    trigger(document.body, "afterGetCart.ajaxCart", cart);
  }).catch((err) => ShopifyAPI.onError(err, "error"));
};
ShopifyAPI.changeItem = (line, quantity, callback) => {
  const body = document.body;
  trigger(body, "beforeChangeItem.ajaxCart", [line, quantity]);
  fetch(cartUrl("/cart/change.js"), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `quantity=${encodeURIComponent(quantity)}&line=${encodeURIComponent(line)}`
  }).then((r) => r.json()).then((cart) => {
    if (typeof callback === "function") callback(cart);
    else ShopifyAPI.onCartUpdate(cart);
    trigger(body, "afterChangeItem.ajaxCart", [line, quantity, cart]);
    trigger(body, "completeChangeItem.ajaxCart", [null, null, "success"]);
  }).catch((err) => {
    trigger(body, "errorChangeItem.ajaxCart", [err, "error"]);
    ShopifyAPI.onError(err, "error");
    trigger(body, "completeChangeItem.ajaxCart", [null, err, "error"]);
  });
};

// src/ajax-cart.js
var q = (sel, root = document) => root.querySelector(sel);
var qq = (sel, root = document) => {
  const bare = sel.trim();
  if (root === document) {
    if (/^#[\w-]+$/.test(bare)) {
      const el = document.getElementById(bare.slice(1));
      return el ? [el] : [];
    }
    if (/^\.[\w-]+$/.test(bare)) return [...document.getElementsByClassName(bare.slice(1))];
    if (/^[a-zA-Z][\w-]*$/.test(bare)) return [...document.getElementsByTagName(bare)];
  } else if (root && root.nodeType === 1) {
    if (/^\.[\w-]+$/.test(bare)) return [...root.getElementsByClassName(bare.slice(1))];
    if (/^[a-zA-Z][\w-]*$/.test(bare)) return [...root.getElementsByTagName(bare)];
  }
  return [...root.querySelectorAll(sel)];
};
var I18N = {
  empty: "Your cart is empty",
  savingsHtml: "You save [savings]"
};
var settings = {
  formSelector: 'form[action*="/cart/add"]',
  cartContainer: "#CartContainer",
  addToCartSelector: 'input[type="submit"]',
  cartCountSelector: null,
  cartCostSelector: null,
  moneyFormat: "${{amount}}",
  disableAjaxCart: false,
  enableQtySelectors: true,
  i18n: I18N
};
var isUpdating = false;
var bodyEl;
var formContainer;
var addToCart;
var cartContainer;
var cartCountSelector;
var cartCostSelector;
var unwrap = (el) => el && el[0] ? el[0] : el;
var triggerBody = (name, detail) => {
  const b = bodyEl || document.body;
  b.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
  try {
    const mepto = window.mepto || window.jQuery;
    if (mepto && mepto(b).trigger) mepto(b).trigger(name, detail);
  } catch (_) {
  }
};
var updateCountPrice = (cart) => {
  scheduler.mutate(() => {
    if (cartCountSelector) {
      const el = unwrap(cartCountSelector) || cartCountSelector;
      const list = cartCountSelector.length !== void 0 && cartCountSelector.tagName === void 0 ? [...cartCountSelector] : [cartCountSelector];
      list.forEach((node) => {
        const n = unwrap(node) || node;
        if (!n || !n.textContent === void 0) return;
        n.textContent = String(cart.item_count);
        n.classList.remove("hidden-count");
        if (cart.item_count === 0) n.classList.add("hidden-count");
        if (n.innerHTML !== void 0 && typeof cart.item_count !== "undefined")
          n.innerHTML = String(cart.item_count);
      });
      void el;
    }
    if (cartCostSelector) {
      const fmt = window.Shopify && window.Shopify.formatMoney ? window.Shopify.formatMoney(cart.total_price, settings.moneyFormat) : String(cart.total_price);
      const list = cartCostSelector.length !== void 0 && cartCostSelector.tagName === void 0 ? [...cartCostSelector] : [cartCostSelector];
      list.forEach((node) => {
        const n = unwrap(node) || node;
        if (!n) return;
        if (n.innerHTML !== void 0) n.innerHTML = fmt;
      });
    }
  });
};
var formOverride = () => {
  if (!formContainer || !formContainer.length) return;
  const forms = formContainer.length !== void 0 && formContainer.tagName === void 0 ? [...formContainer] : [formContainer];
  forms.forEach((form) => {
    const node = unwrap(form) || form;
    if (!node || !node.addEventListener) return;
    node.addEventListener("submit", (evt) => {
      evt.preventDefault();
      const adds = addToCart ? addToCart.length !== void 0 && addToCart.tagName === void 0 ? [...addToCart] : [addToCart] : [];
      adds.forEach((a) => {
        const n = unwrap(a) || a;
        if (n && n.classList) {
          n.classList.remove("is-added");
          n.classList.add("is-adding");
        }
      });
      qq(".qty-error").forEach((el) => el.remove());
      ShopifyAPI.addItemFromForm(evt.target, itemAddedCallback, itemErrorCallback);
    });
  });
};
var itemAddedCallback = () => {
  const adds = addToCart ? addToCart.length !== void 0 && addToCart.tagName === void 0 ? [...addToCart] : [addToCart] : [];
  adds.forEach((a) => {
    const n = unwrap(a) || a;
    if (n && n.classList) {
      n.classList.remove("is-adding");
      n.classList.add("is-added");
    }
  });
  ShopifyAPI.getCart(cartUpdateCallback);
};
var itemErrorCallback = (xhr) => {
  let data = {};
  try {
    data = JSON.parse(xhr.responseText || "{}");
  } catch (_) {
  }
  const adds = addToCart ? addToCart.length !== void 0 && addToCart.tagName === void 0 ? [...addToCart] : [addToCart] : [];
  adds.forEach((a) => {
    const n = unwrap(a) || a;
    if (n && n.classList) n.classList.remove("is-adding", "is-added");
  });
  if (data.message && data.status == 422) {
    const errDiv = document.createElement("div");
    errDiv.className = "errors qty-error";
    errDiv.textContent = data.description || data.message;
    const fc = unwrap(formContainer) || (formContainer && formContainer[0] ? formContainer[0] : null);
    const anchor = fc && fc.parentNode ? fc : document.body;
    if (fc && fc.after) fc.after(errDiv);
    else anchor.appendChild(errDiv);
  }
};
var cartUpdateCallback = (cart) => {
  updateCountPrice(cart);
  buildCart(cart);
};
var buildCart = (cart) => {
  const container = unwrap(cartContainer) || cartContainer;
  if (!container) return;
  scheduler.mutate(() => {
    container.innerHTML = "";
    if (cart.item_count === 0) {
      const p = document.createElement("p");
      p.textContent = settings.i18n && settings.i18n.empty || I18N.empty;
      container.appendChild(p);
      cartCallback(cart);
      return;
    }
    const tmpl = document.getElementById("CartTemplate");
    if (!tmpl || !tmpl.content) {
      const frag2 = document.createDocumentFragment();
      cart.items.forEach((cartItem, index) => {
        const div = document.createElement("div");
        div.textContent = `${cartItem.product_title} x ${cartItem.quantity}`;
        void index;
        frag2.appendChild(div);
      });
      container.appendChild(frag2);
      cartCallback(cart);
      return;
    }
    const fmt = (c) => window.Shopify && window.Shopify.formatMoney ? window.Shopify.formatMoney(c, settings.moneyFormat) : String(c);
    const frag = document.createDocumentFragment();
    const shell = tmpl.content.cloneNode(true);
    const itemsRoot = shell.querySelector("[data-ajaxcart-items]") || shell;
    const priceEl = shell.querySelector("[data-ajaxcart-totalPrice]");
    const savingsEl = shell.querySelector("[data-ajaxcart-savings]");
    const noteEl = shell.querySelector("[data-ajaxcart-note]");
    if (priceEl) priceEl.textContent = fmt(cart.total_price);
    if (savingsEl) {
      if (cart.total_discount === 0) savingsEl.style.display = "none";
      else {
        const tpl = settings.i18n && settings.i18n.savingsHtml || I18N.savingsHtml;
        savingsEl.querySelector("em").textContent = tpl.replace(
          "[savings]",
          fmt(cart.total_discount)
        );
        savingsEl.style.display = "";
      }
    }
    if (noteEl) noteEl.value = cart.note || "";
    cart.items.forEach((cartItem, idx) => {
      let prodImg = "//cdn.shopify.com/s/assets/admin/no-image-medium-cc9732cb976dd349a0df1d39816fbcc7.gif";
      if (cartItem.image != null)
        prodImg = cartItem.image.replace(/(\.[^.]*)$/, "_small$1").replace("http:", "");
      const line = idx + 1;
      const row = document.createElement("div");
      row.className = "ajaxcart__product";
      const discountsApplied = cartItem.line_price !== cartItem.original_line_price;
      const propsHtml = cartItem.properties ? Object.entries(cartItem.properties).map(([k, v]) => v ? `<span class="ajaxcart__product-meta">${k}: ${v}</span>` : "").join("") : "";
      const discountsHtml = discountsApplied ? `<small class="ajaxcart-item__price-strikethrough"><s>${fmt(cartItem.original_line_price)}</s></small><br><span>${fmt(cartItem.line_price)}</span>` : `<span>${fmt(cartItem.line_price)}</span>`;
      const eachDiscounts = discountsApplied && cartItem.discounts && cartItem.discounts.length ? `<div class="grid--full display-table"><div class="grid__item text-right">${cartItem.discounts.map((d) => `<small class="ajaxcart-item__discount">${d.title}</small><br>`).join("")}</div></div>` : "";
      const vendorHtml = cartItem.vendor ? `<span class="ajaxcart__product-meta">${cartItem.vendor}</span>` : "";
      const variationHtml = cartItem.variant_title ? `<span class="ajaxcart__product-meta">${cartItem.variant_title}</span>` : "";
      row.innerHTML = `<div class="ajaxcart__row" data-line="${line}"><div class="grid"><div class="grid__item one-quarter"><a href="${cartItem.url}" class="ajaxcart__product-image"><img src="${prodImg}" alt=""></a></div><div class="grid__item three-quarters"><p><a href="${cartItem.url}" class="ajaxcart__product-name">${cartItem.product_title}</a>${variationHtml}${propsHtml}${vendorHtml}</p><div class="grid--full display-table"><div class="grid__item display-table-cell one-half"><div class="ajaxcart__qty"><button type="button" class="ajaxcart__qty-adjust ajaxcart__qty--minus icon-fallback-text" data-id="${cartItem.key}" data-qty="${cartItem.quantity - 1}" data-line="${line}"><span class="icon icon-minus" aria-hidden="true"></span><span class="visually-hidden">Reduce</span></button><input type="text" name="updates[]" class="ajaxcart__qty-num" value="${cartItem.quantity}" min="0" data-id="${cartItem.key}" data-line="${line}" aria-label="quantity" pattern="[0-9]*"><button type="button" class="ajaxcart__qty-adjust ajaxcart__qty--plus icon-fallback-text" data-id="${cartItem.key}" data-line="${line}" data-qty="${cartItem.quantity + 1}"><span class="icon icon-plus" aria-hidden="true"></span><span class="visually-hidden">Increase</span></button></div></div><div class="grid__item display-table-cell one-half text-right">${discountsHtml}</div>${eachDiscounts}</div></div></div></div>`;
      itemsRoot.appendChild(row);
    });
    container.appendChild(shell);
    cartCallback(cart);
  });
};
var cartCallback = (cart) => {
  scheduler.mutate(() => {
    const b = bodyEl || document.body;
    b.classList.remove("drawer--is-loading");
  });
  triggerBody("afterCartLoad.ajaxCart", cart);
  if (window.Shopify && window.Shopify.StorefrontExpressButtons)
    window.Shopify.StorefrontExpressButtons.initialize();
};
var adjustCart = () => {
  const b = bodyEl || document.body;
  b.addEventListener("click", (e) => {
    const target = e.target.closest && e.target.closest(".ajaxcart__qty-adjust");
    if (!target) return;
    if (isUpdating) return;
    const line = target.getAttribute("data-line") || target.dataset.line;
    const qtyEl = target.parentElement ? target.parentElement.querySelector(".ajaxcart__qty-num") : null;
    let qty = qtyEl ? parseInt(qtyEl.value.replace(/\D/g, ""), 10) : 0;
    qty = validateQty(qty);
    if (target.classList.contains("ajaxcart__qty--plus")) qty += 1;
    else {
      qty -= 1;
      if (qty <= 0) qty = 0;
    }
    if (line) updateQuantity(line, qty);
    else if (qtyEl) qtyEl.value = String(qty);
  });
  b.addEventListener("change", (e) => {
    const target = e.target.closest && e.target.closest(".ajaxcart__qty-num");
    if (!target) return;
    if (isUpdating) return;
    const line = target.getAttribute("data-line") || target.dataset.line;
    let qty = parseInt(target.value.replace(/\D/g, ""), 10);
    qty = validateQty(qty);
    if (line) updateQuantity(line, qty);
  });
  b.addEventListener("submit", (e) => {
    const form = e.target.closest && e.target.closest("form.ajaxcart");
    if (!form) return;
    if (isUpdating) e.preventDefault();
  });
  b.addEventListener("focusin", (e) => {
    const target = e.target.closest && e.target.closest(".ajaxcart__qty-adjust");
    if (!target) return;
    setTimeout(() => {
      try {
        target.select();
      } catch (_) {
      }
    }, 50);
  });
  const updateQuantity = (line, qty) => {
    isUpdating = true;
    const row = document.querySelector(`.ajaxcart__row[data-line="${line}"]`);
    if (row) row.classList.add("is-loading");
    if (qty === 0 && row && row.parentElement) row.parentElement.classList.add("is-removed");
    setTimeout(() => ShopifyAPI.changeItem(line, qty, adjustCartCallback), 250);
  };
  b.addEventListener("change", (e) => {
    if (e.target.matches && e.target.matches('textarea[name="note"]')) {
      ShopifyAPI.updateCartNote(e.target.value, () => {
      });
    }
  });
};
var adjustCartCallback = (cart) => {
  updateCountPrice(cart);
  setTimeout(() => {
    isUpdating = false;
    ShopifyAPI.getCart(buildCart);
  }, 150);
};
var validateQty = (qty) => {
  if (parseFloat(qty) == parseInt(qty, 10) && !isNaN(qty)) return qty;
  return 1;
};
var init = (options = {}) => {
  settings = Object.assign({}, settings, options);
  if (options.i18n) settings.i18n = Object.assign({}, I18N, options.i18n);
  const mepto = window.mepto || window.jQuery;
  const sel = (s) => {
    if (!s) return null;
    if (mepto) return mepto(s);
    const els = qq(s);
    return els.length === 1 ? els[0] : els;
  };
  formContainer = sel(settings.formSelector);
  const cc = q(settings.cartContainer);
  cartContainer = cc || sel(settings.cartContainer);
  addToCart = formContainer ? mepto ? formContainer.find ? formContainer.find(settings.addToCartSelector) : qq(settings.addToCartSelector, unwrap(formContainer) || document) : qq(settings.addToCartSelector, unwrap(formContainer) || document) : null;
  if (mepto) {
    cartCountSelector = settings.cartCountSelector ? mepto(settings.cartCountSelector) : null;
    cartCostSelector = settings.cartCostSelector ? mepto(settings.cartCostSelector) : null;
  } else {
    cartCountSelector = settings.cartCountSelector ? qq(settings.cartCountSelector) : null;
    cartCostSelector = settings.cartCostSelector ? qq(settings.cartCostSelector) : null;
  }
  bodyEl = document.body;
  isUpdating = false;
  if (settings.enableQtySelectors) qtySelectors();
  const adds = addToCart ? addToCart.length !== void 0 && addToCart.tagName === void 0 ? [...addToCart] : [addToCart] : [];
  if (!settings.disableAjaxCart && adds.length) formOverride();
  adjustCart();
};
var loadCart = () => {
  const b = bodyEl || document.body;
  b.classList.add("drawer--is-loading");
  ShopifyAPI.getCart(cartUpdateCallback);
};
var qtySelectors = () => {
  const numInputs = qq('input[type="number"]');
  if (!numInputs.length) return;
  const tmpl = document.getElementById("JsQty");
  if (!tmpl || !tmpl.content) return;
  numInputs.forEach((el) => {
    const currentQty = el.value;
    const inputName = el.getAttribute("name");
    const inputId = el.getAttribute("id");
    const clone = tmpl.content.cloneNode(true);
    const qtyInput = clone.querySelector("[data-js-qty-num]");
    if (qtyInput) {
      qtyInput.value = currentQty;
      qtyInput.setAttribute("data-id", el.getAttribute("data-id") || "");
      if (inputName) qtyInput.setAttribute("name", inputName);
      if (inputId) qtyInput.setAttribute("id", inputId);
    }
    clone.querySelectorAll("[data-js-qty-minus],[data-js-qty-plus]").forEach((btn) => btn.setAttribute("data-id", el.getAttribute("data-id") || ""));
    el.after(clone);
    el.remove();
  });
  qq(".js-qty__adjust").forEach((btn) => {
    btn.addEventListener("click", () => {
      const qtyEl = btn.parentElement ? btn.parentElement.querySelector(".js-qty__num") : null;
      if (!qtyEl) return;
      let qty = parseInt(qtyEl.value.replace(/\D/g, ""), 10);
      qty = validateQty(qty);
      if (btn.classList.contains("js-qty__adjust--plus")) qty += 1;
      else {
        qty -= 1;
        if (qty <= 1) qty = 1;
      }
      qtyEl.value = String(qty);
    });
  });
};
var ajaxCartExport = { init, load: loadCart };
if (typeof window !== "undefined") window.ajaxCart = ajaxCartExport;

// src/entry/cart.js
if (typeof window !== "undefined") {
  window.ajaxCart = ajaxCartExport;
  window.ShopifyAPI = ShopifyAPI;
}
