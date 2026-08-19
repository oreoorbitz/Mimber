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

// src/mepto.js
var $ = (() => {
  if (typeof window !== "undefined") {
    if (window.mepto) return window.mepto;
    if (window.jQuery) return window.jQuery;
  }
  return null;
})();

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

// src/prepare-transition.js
var TRANSITION_DURATION_PROPS = Object.freeze([
  "transitionDuration",
  "-moz-transition-duration",
  "-webkit-transition-duration",
  "-o-transition-duration"
]);
function getTransitionDuration(el) {
  const cs = getComputedStyle(el);
  let d = 0;
  for (let i = 0; i < TRANSITION_DURATION_PROPS.length; i++) {
    const v = parseFloat(cs.getPropertyValue(TRANSITION_DURATION_PROPS[i]));
    if (!isNaN(v) && v !== 0) d = d || v;
  }
  return d;
}
var prepareTransition = (els) => {
  const list = els instanceof NodeList || Array.isArray(els) ? [...els] : [els];
  list.forEach((el) => {
    if (!el || el.nodeType !== 1) return;
    scheduler.measure(() => {
      const dur = getTransitionDuration(el);
      scheduler.mutate(() => {
        const onEnd = () => el.classList.remove("is-transitioning");
        el.addEventListener("transitionend", onEnd, { once: true });
        el.addEventListener("webkitTransitionEnd", onEnd, { once: true });
        el.addEventListener("TransitionEnd", onEnd, { once: true });
        el.addEventListener("oTransitionEnd", onEnd, { once: true });
        if (dur !== 0) {
          el.classList.add("is-transitioning");
          void el.offsetWidth;
        }
      });
    });
  });
  return els;
};
var attachPrepareTransition = () => {
  try {
    const mepto = $(null);
    const proto = mepto && Object.getPrototypeOf(mepto);
    if (proto && typeof proto.prepareTransition === "undefined") {
      proto.prepareTransition = function() {
        prepareTransition([...this]);
        return this;
      };
    }
  } catch (_) {
  }
};

// src/money-format.js
var PLACEHOLDER_RE = /\{\{\s*(\w+)\s*\}\}/;
var THOUSANDS_RE = /(\d)(?=(\d\d\d)+(?!\d))/g;
var formatWithDelimiters = (number, precision = 2, thousands = ",", decimal = ".") => {
  if (isNaN(number) || number == null) return "0";
  number = (number / 100).toFixed(precision);
  const parts = number.split(".");
  const dollars = parts[0].replace(THOUSANDS_RE, `$1${thousands}`);
  const cents = parts[1] ? decimal + parts[1] : "";
  return dollars + cents;
};
var installFormatMoney = (Shopify) => {
  if (Shopify.formatMoney) return Shopify;
  const ShopifyWithFormat = Shopify;
  ShopifyWithFormat.formatMoney = (cents, format) => {
    let value = "";
    const formatString = format || ShopifyWithFormat.money_format || "";
    if (typeof cents === "string") cents = cents.replace(".", "");
    const ph = formatString.match(PLACEHOLDER_RE);
    if (!ph) return formatString;
    switch (ph[1]) {
      case "amount":
        value = formatWithDelimiters(cents, 2);
        break;
      case "amount_no_decimals":
        value = formatWithDelimiters(cents, 0);
        break;
      case "amount_with_comma_separator":
        value = formatWithDelimiters(cents, 2, ".", ",");
        break;
      case "amount_no_decimals_with_comma_separator":
        value = formatWithDelimiters(cents, 0, ".", ",");
        break;
      default:
        value = formatWithDelimiters(cents, 2);
    }
    return formatString.replace(PLACEHOLDER_RE, value);
  };
  return ShopifyWithFormat;
};

// src/url.js
var RP_RE_CACHE = /* @__PURE__ */ new Map();
var getRe = (param) => {
  if (!RP_RE_CACHE.has(param)) RP_RE_CACHE.set(param, new RegExp(`(${param}=).*?(&|$)`, "g"));
  return RP_RE_CACHE.get(param);
};
var replaceUrlParam = (url, param, value) => {
  const re = getRe(param);
  const has = url.search(new RegExp(`[?&]${param}=`)) !== -1;
  if (has) return url.replace(getRe(param), `$1${value}$2`);
  return url + (url.indexOf("?") > 0 ? "&" : "?") + param + "=" + value;
};

// src/cache.js
var byId = (id) => document.getElementById(id);
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
var cacheSelectors = (timber) => {
  const mepto = $ ? window.mepto || window.jQuery : null;
  const useMepto = !!mepto;
  const sel = (s) => useMepto ? mepto(s) : qq(s);
  const sel1 = (s) => useMepto ? mepto(s) : q(s);
  const thumbRoot = byId("ProductThumbs");
  const thumbImages = thumbRoot ? useMepto ? mepto("#ProductThumbs").find("a.product-single__thumbnail") : qq("a.product-single__thumbnail", thumbRoot) : sel("a.product-single__thumbnail__empty__");
  timber.cache = {
    // General
    $html: useMepto ? mepto("html") : document.documentElement,
    $body: useMepto ? mepto(document.body) : document.body,
    // Navigation
    $navigation: byId("AccessibleNav"),
    $mobileSubNavToggle: sel(".mobile-nav__toggle"),
    // Collection — simple .class, use getElementsByClassName when native (faster than QSA per bench)
    $changeView: useMepto ? sel(".change-view") : [...document.getElementsByClassName("change-view")],
    // Product — byId for #id (fastest, per bench), avoids QSA parse
    $productImage: byId("ProductPhotoImg"),
    $thumbImages: thumbImages,
    // Customer — byId
    $recoverPasswordLink: byId("RecoverPassword"),
    $hideRecoverPasswordLink: byId("HideRecoverPasswordLink"),
    $recoverPasswordForm: byId("RecoverPasswordForm"),
    $customerLoginForm: byId("CustomerLoginForm"),
    $passwordResetSuccess: byId("ResetSuccess")
  };
  if (!thumbRoot && timber.cache.$thumbImages && timber.cache.$thumbImages.length === 0) {
  }
  return timber.cache;
};

// src/utils.js
var getHash = () => window.location.hash;
var switchImage = (src, _imgObject, el) => {
  const target = el && el[0] ? el[0] : el;
  const node = typeof target === "string" ? document.querySelector(target) : target;
  if (!node) return;
  scheduler.mutate(() => {
    node.setAttribute("src", src);
  });
};
var mobileNavToggle = (timber) => {
  var _a;
  const t = (_a = timber.cache) == null ? void 0 : _a.$mobileSubNavToggle;
  if (!t) return;
  const list = t.length !== void 0 ? [...t] : [t];
  if (!list.length || list.length === 1 && !list[0]) return;
  list.forEach((el) => {
    if (!el || !el.addEventListener) return;
    el.addEventListener("click", function() {
      const p = this.parentElement;
      if (!p) return;
      scheduler.mutate(() => p.classList.toggle("mobile-nav--expanded"));
    });
  });
};
var productImageSwitch = (timber) => {
  var _a;
  const thumbs = (_a = timber.cache) == null ? void 0 : _a.$thumbImages;
  if (!thumbs) return;
  const list = thumbs.length !== void 0 ? [...thumbs] : [thumbs];
  if (!list.length || list.length === 1 && !list[0]) return;
  list.forEach((el) => {
    if (!el || !el.addEventListener) return;
    el.addEventListener("click", (evt) => {
      evt.preventDefault();
      const href = el.getAttribute("href");
      switchImage(href, null, timber.cache.$productImage);
    });
  });
};
var responsiveVideos = () => {
  const vids = [
    ...document.querySelectorAll('iframe[src*="youtube.com/embed"], iframe[src*="player.vimeo"]')
  ];
  const resets = [document.getElementById("admin_bar_iframe")].filter(Boolean);
  scheduler.mutate(() => {
    vids.forEach((el) => {
      if (el.parentElement && el.parentElement.classList.contains("video-wrapper")) return;
      const wrap = document.createElement("div");
      wrap.className = "video-wrapper";
      el.parentNode.insertBefore(wrap, el);
      wrap.appendChild(el);
    });
    resets.forEach((el) => {
      el.src = el.src;
    });
  });
};
var collectionViews = (timber) => {
  var _a;
  const c = (_a = timber.cache) == null ? void 0 : _a.$changeView;
  if (!c) return;
  const list = c.length !== void 0 ? [...c] : [c];
  if (!list.length || list.length === 1 && !list[0]) return;
  list.forEach((el) => {
    if (!el || !el.addEventListener) return;
    el.addEventListener("click", function() {
      const view = this.getAttribute("data-view") || this.dataset && this.dataset.view || "";
      const url = document.URL;
      const hasParams = url.indexOf("?") > -1;
      window.location = hasParams ? replaceUrlParam(url, "view", view) : url + "?view=" + view;
    });
  });
};
var loginForms = (timber) => {
  const showRecover = () => {
    scheduler.mutate(() => {
      const a = timber.cache.$recoverPasswordForm;
      const b = timber.cache.$customerLoginForm;
      if (a) {
        const n = a[0] || a;
        if (n.style) n.style.display = "";
        if (n.style && n.style.display === "none") n.style.display = "block";
        if (!a.length) n.style.display = "";
      }
      const af = a && a[0] ? a[0] : a;
      const bf = b && b[0] ? b[0] : b;
      if (af && af.style) af.style.display = "block";
      if (bf && bf.style) bf.style.display = "none";
    });
  };
  const hideRecover = () => {
    scheduler.mutate(() => {
      const af = timber.cache.$recoverPasswordForm && (timber.cache.$recoverPasswordForm[0] || timber.cache.$recoverPasswordForm);
      const bf = timber.cache.$customerLoginForm && (timber.cache.$customerLoginForm[0] || timber.cache.$customerLoginForm);
      if (af && af.style) af.style.display = "none";
      if (bf && bf.style) bf.style.display = "block";
    });
  };
  const aLink = timber.cache.$recoverPasswordLink;
  const hLink = timber.cache.$hideRecoverPasswordLink;
  const aNode = aLink && (aLink[0] || aLink);
  const hNode = hLink && (hLink[0] || hLink);
  if (aNode && aNode.addEventListener)
    aNode.addEventListener("click", (e) => {
      e.preventDefault();
      showRecover();
    });
  if (hNode && hNode.addEventListener)
    hNode.addEventListener("click", (e) => {
      e.preventDefault();
      hideRecover();
    });
  if (getHash() === "#recover") showRecover();
};
var resetPasswordSuccess = (timber) => {
  var _a;
  const el = (_a = timber.cache) == null ? void 0 : _a.$passwordResetSuccess;
  const node = el && (el[0] || el);
  if (!node || !node.style) return;
  scheduler.mutate(() => {
    node.style.display = "block";
  });
};

// src/product-page.js
var I18N_DEFAULTS = {
  addToCart: "Add to cart",
  soldOut: "Sold out",
  unavailable: "Unavailable",
  compareAt: "Compare at"
};
var byId2 = (id) => document.getElementById(id);
var qq2 = (sel, root = document) => {
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
  const productImage = byId2("ProductPhotoImg");
  const addToCart2 = byId2("AddToCart");
  const productPrice = byId2("ProductPrice");
  const comparePrice = byId2("ComparePrice");
  const quantityElements = qq2(".quantity-selector, label + .js-qty");
  const addToCartText = byId2("AddToCartText");
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
        if (addToCart2) {
          addToCart2.classList.remove("disabled");
          addToCart2.disabled = false;
        }
        if (addToCartText) addToCartText.textContent = i18n.addToCart;
        for (let i = 0, n = quantityElements.length; i < n; i++) quantityElements[i].style.display = "";
        if (quantityElements.length === 1 && quantityElements[0].style.display === "none")
          quantityElements[0].style.display = "block";
        for (let i = 0, n = quantityElements.length; i < n; i++) if (quantityElements[i].style.display === "none") quantityElements[i].style.display = "block";
      } else {
        if (addToCart2) {
          addToCart2.classList.add("disabled");
          addToCart2.disabled = true;
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
      if (addToCart2) {
        addToCart2.classList.add("disabled");
        addToCart2.disabled = true;
      }
      if (addToCartText) addToCartText.textContent = i18n.unavailable;
      for (let i = 0, n = quantityElements.length; i < n; i++) quantityElements[i].style.display = "none";
    }
  });
};

// src/accessible-nav.js
var ACTIVE = "nav-hover";
var FOCUS = "nav-focus";
var unwrap = (el) => el && el[0] ? el[0] : el;
var toArray = (els) => {
  if (!els) return [];
  if (els.nodeType === 1) return [els];
  if (typeof els.length === "number" && els.tagName === void 0)
    return [...els].filter(Boolean).map(unwrap).filter(Boolean);
  return [unwrap(els)].filter(Boolean);
};
var accessibleNav = (timber) => {
  var _a, _b;
  const nav = unwrap((_a = timber.cache) == null ? void 0 : _a.$navigation);
  if (!nav) return;
  const allLinks = [...nav.getElementsByTagName("a")];
  const directLis = [...nav.children].filter((el) => el.tagName === "LI");
  const topLevel = directLis.length ? directLis.flatMap((li) => [...li.querySelectorAll("a")]) : [...nav.querySelectorAll(":scope > li a")];
  const topLevelLinks = topLevel.length ? topLevel : allLinks.filter((a) => {
    const li = a.closest("li");
    return li && li.parentElement === nav;
  });
  const parents = [...nav.getElementsByClassName("site-nav--has-dropdown")];
  const subMenuLinks = [...nav.querySelectorAll(".site-nav__dropdown a")];
  const body = unwrap((_b = timber.cache) == null ? void 0 : _b.$body) || document.body;
  const addFocus = (els) => toArray(els).forEach((el) => el.classList.add(FOCUS));
  const removeFocus = (els) => toArray(els).forEach((el) => el.classList.remove(FOCUS));
  const showDropdown = (el) => {
    const node = unwrap(el);
    if (!node) return;
    node.classList.add(ACTIVE);
    setTimeout(() => {
      const onTouch = () => hideDropdown(node);
      body._mimberHideHandler = onTouch;
      body.addEventListener("touchstart", onTouch);
    }, 250);
  };
  const hideDropdown = (el) => {
    const node = unwrap(el);
    if (!node) return;
    node.classList.remove(ACTIVE);
    if (body._mimberHideHandler) {
      body.removeEventListener("touchstart", body._mimberHideHandler);
      body._mimberHideHandler = null;
    }
  };
  const handleFocus = (el) => {
    var _a2;
    const node = unwrap(el);
    if (!node) return;
    const subMenu = node.nextElementSibling && node.nextElementSibling.tagName === "UL" ? node.nextElementSibling : null;
    const hasSubMenu = !!(subMenu && subMenu.classList.contains("sub-nav"));
    void hasSubMenu;
    const isSubItem = !!node.closest(".site-nav__dropdown");
    if (!isSubItem) {
      removeFocus(topLevelLinks);
      addFocus(node);
    } else {
      const newFocus = (_a2 = node.closest(".site-nav--has-dropdown")) == null ? void 0 : _a2.querySelector("a");
      if (newFocus) addFocus(newFocus);
    }
  };
  parents.forEach((el) => {
    const enter = (evt) => {
      if (!el.classList.contains(ACTIVE)) evt.preventDefault();
      showDropdown(el);
    };
    el.addEventListener("mouseenter", enter);
    el.addEventListener("touchstart", enter, { passive: false });
    el.addEventListener("mouseleave", () => hideDropdown(el));
  });
  subMenuLinks.forEach((el) => {
    el.addEventListener("touchstart", (evt) => evt.stopImmediatePropagation());
  });
  allLinks.forEach((el) => {
    el.addEventListener("focus", () => handleFocus(el));
    el.addEventListener("blur", () => removeFocus(topLevelLinks));
  });
};

// src/drawers.js
var unwrap2 = (el) => el && el[0] ? el[0] : el;
var trigger = (target, name, detail) => {
  const el = unwrap2(target) || document.body;
  el.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
  try {
    const mepto = window.mepto || window.jQuery;
    if (mepto && mepto(target).trigger) mepto(target).trigger(name, detail);
  } catch (_) {
  }
};
var Drawer = class {
  constructor(id, position, options = {}) {
    const defaults = {
      close: ".js-drawer-close",
      open: ".js-drawer-open-" + position,
      openClass: "js-drawer-open",
      dirOpenClass: "js-drawer-open-" + position
    };
    this.config = Object.assign({}, defaults, options);
    this.position = position;
    this.nodes = {
      parent: [document.body, document.documentElement].filter(Boolean),
      page: document.getElementById("PageContainer"),
      moved: [...document.getElementsByClassName("is-moved-by-drawer")]
    };
    this.drawer = document.getElementById(id);
    if (!this.drawer) return false;
    this.drawerIsOpen = false;
    this.init();
  }
  init() {
    const selAll = (sel, root = document) => {
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
    const openEls = selAll(this.config.open);
    for (let i = 0, n = openEls.length; i < n; i++) openEls[i].addEventListener("click", this.open.bind(this));
    const closeEls = this.drawer ? selAll(this.config.close, this.drawer) : [];
    for (let i = 0, n = closeEls.length; i < n; i++) closeEls[i].addEventListener("click", this.close.bind(this));
  }
  open(evt) {
    let externalCall = false;
    if (evt) evt.preventDefault();
    else externalCall = true;
    if (evt && evt.stopPropagation) {
      evt.stopPropagation();
      this.activeSource = evt.currentTarget;
    }
    if (this.drawerIsOpen && !externalCall) return this.close();
    const body = window.timber && window.timber.cache && unwrap2(window.timber.cache.$body) || document.body;
    trigger(body, "beforeDrawerOpen.timber", this);
    scheduler.mutate(() => {
      for (let i = 0, n = this.nodes.moved.length; i < n; i++) this.nodes.moved[i].classList.add("is-transitioning");
      prepareTransition(this.drawer);
      for (let i = 0, n = this.nodes.parent.length; i < n; i++) this.nodes.parent[i].classList.add(this.config.openClass, this.config.dirOpenClass);
    });
    this.drawerIsOpen = true;
    this.trapFocus(this.drawer, "drawer_focus");
    if (this.config.onDrawerOpen && typeof this.config.onDrawerOpen === "function" && !externalCall) {
      this.config.onDrawerOpen();
    }
    if (this.activeSource && this.activeSource.getAttribute && this.activeSource.getAttribute("aria-expanded") !== null) {
      this.activeSource.setAttribute("aria-expanded", "true");
    }
    if (this.nodes.page) {
      this._onTouchMove = (e) => {
        e.preventDefault();
        return false;
      };
      this._onPageClick = (e) => {
        this.close();
        e.preventDefault();
        return false;
      };
      this.nodes.page.addEventListener("touchmove", this._onTouchMove, { passive: false });
      this.nodes.page.addEventListener("click", this._onPageClick);
    }
    trigger(body, "afterDrawerOpen.timber", this);
  }
  close() {
    if (!this.drawerIsOpen) return;
    const body = window.timber && window.timber.cache && unwrap2(window.timber.cache.$body) || document.body;
    trigger(body, "beforeDrawerClose.timber", this);
    if (document.activeElement && document.activeElement.blur) {
      try {
        document.activeElement.blur();
      } catch (_) {
      }
      try {
        const mepto = window.mepto || window.jQuery;
        if (mepto) mepto(document.activeElement).trigger("blur");
      } catch (_) {
      }
    }
    scheduler.mutate(() => {
      for (let i = 0, n = this.nodes.moved.length; i < n; i++) prepareTransition(this.nodes.moved[i]);
      prepareTransition(this.drawer);
      for (let i = 0, n = this.nodes.parent.length; i < n; i++) this.nodes.parent[i].classList.remove(this.config.dirOpenClass, this.config.openClass);
    });
    this.drawerIsOpen = false;
    this.removeTrapFocus(this.drawer, "drawer_focus");
    if (this.nodes.page) {
      if (this._onTouchMove) this.nodes.page.removeEventListener("touchmove", this._onTouchMove);
      if (this._onPageClick) this.nodes.page.removeEventListener("click", this._onPageClick);
      this._onTouchMove = null;
      this._onPageClick = null;
    }
    trigger(body, "afterDrawerClose.timber", this);
  }
  trapFocus(container, eventNamespace) {
    const el = unwrap2(container);
    if (!el) return;
    const eventName = eventNamespace ? "focusin." + eventNamespace : "focusin";
    this._focusHandler = (evt) => {
      if (el !== evt.target && !el.contains(evt.target)) el.focus();
    };
    this._focusEventName = eventName;
    el.setAttribute("tabindex", "-1");
    el.focus();
    document.addEventListener("focusin", this._focusHandler);
    try {
      const mepto = window.mepto || window.jQuery;
      if (mepto) mepto(document).on(eventName, this._focusHandler);
    } catch (_) {
    }
  }
  removeTrapFocus(container, eventNamespace) {
    const el = unwrap2(container);
    if (!el) return;
    const eventName = eventNamespace ? "focusin." + eventNamespace : "focusin";
    el.removeAttribute("tabindex");
    if (this._focusHandler) {
      document.removeEventListener("focusin", this._focusHandler);
      try {
        const mepto = window.mepto || window.jQuery;
        if (mepto) mepto(document).off(eventName);
      } catch (_) {
      }
      this._focusHandler = null;
    } else {
      document.removeEventListener("focusin", () => {
      });
      try {
        const mepto = window.mepto || window.jQuery;
        if (mepto) mepto(document).off(eventName);
      } catch (_) {
      }
    }
  }
};
var drawersInit = (timber) => {
  timber.LeftDrawer = new Drawer("NavDrawer", "left");
  const ajaxCart = window.ajaxCart;
  const shouldInitRight = (() => {
    if (document.getElementById("CartDrawer")) return true;
    return !!ajaxCart;
  })();
  if (shouldInitRight) {
    timber.RightDrawer = new Drawer("CartDrawer", "right", {
      onDrawerOpen: ajaxCart && ajaxCart.load ? ajaxCart.load : void 0
    });
  }
};

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
var trigger2 = (target, name, detail) => {
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
  trigger2(body, "beforeUpdateCartNote.ajaxCart", note);
  fetch(cartUrl("/cart/update.js"), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "note=" + encodeURIComponent(attributeToString(note))
  }).then((r) => r.json()).then((cart) => {
    if (typeof callback === "function") callback(cart);
    else ShopifyAPI.onCartUpdate(cart);
    trigger2(body, "afterUpdateCartNote.ajaxCart", [note, cart]);
    trigger2(body, "completeUpdateCartNote.ajaxCart", [null, null, "success"]);
  }).catch((err) => {
    trigger2(body, "errorUpdateCartNote.ajaxCart", [err, "error"]);
    ShopifyAPI.onError(
      { responseText: err.responseText || err.message, status: err.status },
      "error"
    );
    trigger2(body, "completeUpdateCartNote.ajaxCart", [null, err, "error"]);
  });
};
ShopifyAPI.addItemFromForm = (form, callback, errorCallback) => {
  const body = document.body;
  const fd = form instanceof HTMLFormElement ? new FormData(form) : new FormData();
  let formEl = form;
  if (typeof form === "string") formEl = document.querySelector(form);
  const bodyStr = formEl instanceof HTMLFormElement ? new URLSearchParams(new FormData(formEl)).toString() : new URLSearchParams(fd).toString();
  trigger2(body, "beforeAddItem.ajaxCart", form);
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
    trigger2(body, "afterAddItem.ajaxCart", [lineItem, form]);
    trigger2(body, "completeAddItem.ajaxCart", [null, null, "success"]);
  }).catch((err) => {
    if (typeof errorCallback === "function") errorCallback(err, "error");
    else ShopifyAPI.onError(err, "error");
    trigger2(body, "errorAddItem.ajaxCart", [err, "error"]);
    trigger2(body, "completeAddItem.ajaxCart", [null, err, "error"]);
  });
};
ShopifyAPI.getCart = (callback) => {
  trigger2(document.body, "beforeGetCart.ajaxCart");
  jsonFetch(cartUrl("/cart.js")).then((cart) => {
    if (typeof callback === "function") callback(cart);
    else ShopifyAPI.onCartUpdate(cart);
    trigger2(document.body, "afterGetCart.ajaxCart", cart);
  }).catch((err) => ShopifyAPI.onError(err, "error"));
};
ShopifyAPI.changeItem = (line, quantity, callback) => {
  const body = document.body;
  trigger2(body, "beforeChangeItem.ajaxCart", [line, quantity]);
  fetch(cartUrl("/cart/change.js"), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `quantity=${encodeURIComponent(quantity)}&line=${encodeURIComponent(line)}`
  }).then((r) => r.json()).then((cart) => {
    if (typeof callback === "function") callback(cart);
    else ShopifyAPI.onCartUpdate(cart);
    trigger2(body, "afterChangeItem.ajaxCart", [line, quantity, cart]);
    trigger2(body, "completeChangeItem.ajaxCart", [null, null, "success"]);
  }).catch((err) => {
    trigger2(body, "errorChangeItem.ajaxCart", [err, "error"]);
    ShopifyAPI.onError(err, "error");
    trigger2(body, "completeChangeItem.ajaxCart", [null, err, "error"]);
  });
};

// src/ajax-cart.js
var q2 = (sel, root = document) => root.querySelector(sel);
var qq3 = (sel, root = document) => {
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
var unwrap3 = (el) => el && el[0] ? el[0] : el;
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
      const el = unwrap3(cartCountSelector) || cartCountSelector;
      const list = cartCountSelector.length !== void 0 && cartCountSelector.tagName === void 0 ? [...cartCountSelector] : [cartCountSelector];
      list.forEach((node) => {
        const n = unwrap3(node) || node;
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
        const n = unwrap3(node) || node;
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
    const node = unwrap3(form) || form;
    if (!node || !node.addEventListener) return;
    node.addEventListener("submit", (evt) => {
      evt.preventDefault();
      const adds = addToCart ? addToCart.length !== void 0 && addToCart.tagName === void 0 ? [...addToCart] : [addToCart] : [];
      adds.forEach((a) => {
        const n = unwrap3(a) || a;
        if (n && n.classList) {
          n.classList.remove("is-added");
          n.classList.add("is-adding");
        }
      });
      qq3(".qty-error").forEach((el) => el.remove());
      ShopifyAPI.addItemFromForm(evt.target, itemAddedCallback, itemErrorCallback);
    });
  });
};
var itemAddedCallback = () => {
  const adds = addToCart ? addToCart.length !== void 0 && addToCart.tagName === void 0 ? [...addToCart] : [addToCart] : [];
  adds.forEach((a) => {
    const n = unwrap3(a) || a;
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
    const n = unwrap3(a) || a;
    if (n && n.classList) n.classList.remove("is-adding", "is-added");
  });
  if (data.message && data.status == 422) {
    const errDiv = document.createElement("div");
    errDiv.className = "errors qty-error";
    errDiv.textContent = data.description || data.message;
    const fc = unwrap3(formContainer) || (formContainer && formContainer[0] ? formContainer[0] : null);
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
  const container = unwrap3(cartContainer) || cartContainer;
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
    const els = qq3(s);
    return els.length === 1 ? els[0] : els;
  };
  formContainer = sel(settings.formSelector);
  const cc = q2(settings.cartContainer);
  cartContainer = cc || sel(settings.cartContainer);
  addToCart = formContainer ? mepto ? formContainer.find ? formContainer.find(settings.addToCartSelector) : qq3(settings.addToCartSelector, unwrap3(formContainer) || document) : qq3(settings.addToCartSelector, unwrap3(formContainer) || document) : null;
  if (mepto) {
    cartCountSelector = settings.cartCountSelector ? mepto(settings.cartCountSelector) : null;
    cartCostSelector = settings.cartCostSelector ? mepto(settings.cartCostSelector) : null;
  } else {
    cartCountSelector = settings.cartCountSelector ? qq3(settings.cartCountSelector) : null;
    cartCostSelector = settings.cartCostSelector ? qq3(settings.cartCostSelector) : null;
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
  const numInputs = qq3('input[type="number"]');
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
  qq3(".js-qty__adjust").forEach((btn) => {
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

// src/index.js
if (typeof window !== "undefined") {
  window.Shopify = window.Shopify || {};
  installFormatMoney(window.Shopify);
  attachPrepareTransition();
  window.timber = window.timber || {};
  window.timber.cacheSelectors = () => cacheSelectors(window.timber);
  window.timber.getHash = getHash;
  window.timber.switchImage = switchImage;
  window.timber.mobileNavToggle = () => mobileNavToggle(window.timber);
  window.timber.productImageSwitch = () => productImageSwitch(window.timber);
  window.timber.responsiveVideos = responsiveVideos;
  window.timber.collectionViews = () => collectionViews(window.timber);
  window.timber.loginForms = () => loginForms(window.timber);
  window.timber.resetPasswordSuccess = () => resetPasswordSuccess(window.timber);
  window.timber.productPage = productPage;
  window.timber.accessibleNav = () => accessibleNav(window.timber);
  window.timber.Drawers = Drawer;
  window.timber.drawersInit = () => drawersInit(window.timber);
  window.ajaxCart = ajaxCartExport;
  window.ShopifyAPI = ShopifyAPI;
  const _origInit = window.timber.init;
  window.timber.init = () => {
    cacheSelectors(window.timber);
    try {
      accessibleNav(window.timber);
    } catch (_) {
    }
    try {
      drawersInit(window.timber);
    } catch (_) {
    }
    mobileNavToggle(window.timber);
    productImageSwitch(window.timber);
    responsiveVideos();
    collectionViews(window.timber);
    loginForms(window.timber);
  };
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", () => window.timber.init());
  else queueMicrotask(() => window.timber.init());
}
var ShopifyFormatMoney = typeof window !== "undefined" && typeof window.Shopify !== "undefined" ? window.Shopify.formatMoney : void 0;
export {
  Drawer,
  ShopifyAPI,
  ShopifyFormatMoney,
  accessibleNav,
  ajaxCartExport as ajaxCart,
  cacheSelectors,
  collectionViews,
  drawersInit,
  getHash,
  loginForms,
  mobileNavToggle,
  prepareTransition,
  productImageSwitch,
  productPage,
  replaceUrlParam,
  resetPasswordSuccess,
  responsiveVideos,
  switchImage
};
