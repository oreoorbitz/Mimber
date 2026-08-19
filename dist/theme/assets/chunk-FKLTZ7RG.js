/*! Mimber Mepto v2.2.2-mepto.1 — Mepto-integrated, jQuery-free (esbuild Go) */


// src/mepto.js
var $ = (() => {
  if (typeof window !== "undefined") {
    if (window.mepto) return window.mepto;
    if (window.jQuery) return window.jQuery;
  }
  return null;
})();

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

export {
  $,
  cacheSelectors
};
