/*! Mimber Mepto v2.2.2-mepto.1 — Mepto-integrated, jQuery-free (esbuild Go) */

import {
  scheduler
} from "./chunk-KK2RWA72.js";

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

export {
  getHash,
  switchImage,
  mobileNavToggle,
  productImageSwitch,
  responsiveVideos,
  collectionViews,
  loginForms,
  resetPasswordSuccess
};
