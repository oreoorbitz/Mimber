/*! Mimber Mepto v2.2.2-mepto.1 — Mepto-integrated, jQuery-free (esbuild Go) */

import {
  $,
  cacheSelectors
} from "./chunk-FKLTZ7RG.js";
import {
  mobileNavToggle,
  responsiveVideos
} from "./chunk-7ONAE77C.js";
import {
  scheduler
} from "./chunk-KK2RWA72.js";

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

// src/entry/global.js
if (typeof window !== "undefined") {
  window.Shopify = window.Shopify || {};
  installFormatMoney(window.Shopify);
  attachPrepareTransition();
  window.timber = window.timber || {};
  window.timber.cacheSelectors = () => cacheSelectors(window.timber);
  window.timber.accessibleNav = () => accessibleNav(window.timber);
  window.timber.drawersInit = () => drawersInit(window.timber);
  const initGlobal = () => {
    cacheSelectors(window.timber);
    try {
      accessibleNav(window.timber);
    } catch (e) {
    }
    try {
      drawersInit(window.timber);
    } catch (e) {
    }
    try {
      mobileNavToggle(window.timber);
    } catch (e) {
    }
    try {
      responsiveVideos();
    } catch (e) {
    }
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initGlobal);
  else queueMicrotask(initGlobal);
}
