/*! Mimber Mepto v2.2.2-mepto.1 — Mepto-integrated, jQuery-free */

var TimberMepto = (function (exports) {
  'use strict';

  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }
  function _arrayWithoutHoles(r) {
    if (Array.isArray(r)) return _arrayLikeToArray(r);
  }
  function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
      value: t,
      enumerable: true,
      configurable: true,
      writable: true
    }) : e[r] = t, e;
  }
  function _iterableToArray(r) {
    if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function (r) {
        return Object.getOwnPropertyDescriptor(e, r).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread2(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
        _defineProperty(e, r, t[r]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
      });
    }
    return e;
  }
  function _toConsumableArray(r) {
    return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
  }
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r);
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
  }

  var $ = function () {
    if (typeof window !== 'undefined') {
      if (window.mepto) return window.mepto;
      if (window.jQuery) return window.jQuery;
    }
    return null;
  }();

  var _raf = typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : function (fn) {
    return setTimeout(fn, 16);
  };
  var _queueMeasure = [];
  var _queueMutate = [];
  var _scheduled = false;
  var flush = function flush() {
    _scheduled = false;
    var m = _queueMeasure.slice();
    var mu = _queueMutate.slice();
    _queueMeasure = [];
    _queueMutate = [];
    for (var i = 0; i < m.length; i++) m[i]();
    for (var _i = 0; _i < mu.length; _i++) mu[_i]();
  };
  var schedule = function schedule() {
    if (_scheduled) return;
    _scheduled = true;
    _raf(flush);
  };
  var scheduler = {
    measure: function measure(fn) {
      _queueMeasure.push(fn);
      schedule();
    },
    mutate: function mutate(fn) {
      _queueMutate.push(fn);
      schedule();
    },
    flush: flush
  };

  var TRANSITION_DURATION_PROPS = Object.freeze(['transitionDuration', '-moz-transition-duration', '-webkit-transition-duration', '-o-transition-duration']);
  function getTransitionDuration(el) {
    var cs = getComputedStyle(el);
    var d = 0;
    for (var i = 0; i < TRANSITION_DURATION_PROPS.length; i++) {
      var v = parseFloat(cs.getPropertyValue(TRANSITION_DURATION_PROPS[i]));
      if (!isNaN(v) && v !== 0) d = d || v;
    }
    return d;
  }

  /**
   * Prepare transition on element(s). Adds is-transitioning, triggers reflow via
   * scheduler.mutate so the write is batched, removes on transitionend (once).
   * Mepto fallback: `$(els).prepareTransition()` still bound via bridget.
   */
  var prepareTransition = function prepareTransition(els) {
    var list = els instanceof NodeList || Array.isArray(els) ? _toConsumableArray(els) : [els];
    list.forEach(function (el) {
      if (!el || el.nodeType !== 1) return;
      // read first (measure), then write (mutate)
      scheduler.measure(function () {
        var dur = getTransitionDuration(el);
        scheduler.mutate(function () {
          var onEnd = function onEnd() {
            return el.classList.remove('is-transitioning');
          };
          // Use {once:true} so we don't leak; Mepto also polyfills .one()
          el.addEventListener('transitionend', onEnd, {
            once: true
          });
          el.addEventListener('webkitTransitionEnd', onEnd, {
            once: true
          });
          el.addEventListener('TransitionEnd', onEnd, {
            once: true
          });
          el.addEventListener('oTransitionEnd', onEnd, {
            once: true
          });
          if (dur !== 0) {
            el.classList.add('is-transitioning');
            void el.offsetWidth;
          }
        });
      });
    });
    return els;
  };
  var attachPrepareTransition = function attachPrepareTransition() {
    try {
      var mepto = $(null);
      var proto = mepto && Object.getPrototypeOf(mepto);
      if (proto && typeof proto.prepareTransition === 'undefined') {
        proto.prepareTransition = function () {
          prepareTransition(_toConsumableArray(this));
          return this;
        };
      }
    } catch (_) {}
  };

  // Shopify.formatMoney — Mepto/modern pass
  // Why: hoisted regex, defaultOption inline, formatWithDelimiters hoisted; native Object.assign.
  // Contract preserved: Shopify.formatMoney(cents, format) with {{amount}} placeholders.
  var PLACEHOLDER_RE = /\{\{\s*(\w+)\s*\}\}/;
  var THOUSANDS_RE = /(\d)(?=(\d\d\d)+(?!\d))/g;
  var formatWithDelimiters = function formatWithDelimiters(number) {
    var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
    var thousands = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ',';
    var decimal = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '.';
    if (isNaN(number) || number == null) return '0';
    number = (number / 100.0).toFixed(precision);
    var parts = number.split('.');
    var dollars = parts[0].replace(THOUSANDS_RE, "$1".concat(thousands));
    var cents = parts[1] ? decimal + parts[1] : '';
    return dollars + cents;
  };
  var installFormatMoney = function installFormatMoney(Shopify) {
    if (Shopify.formatMoney) return Shopify;
    var ShopifyWithFormat = Shopify;
    ShopifyWithFormat.formatMoney = function (cents, format) {
      var value = '';
      var formatString = format || ShopifyWithFormat.money_format || '';
      if (typeof cents === 'string') cents = cents.replace('.', '');
      var ph = formatString.match(PLACEHOLDER_RE);
      if (!ph) return formatString;
      switch (ph[1]) {
        case 'amount':
          value = formatWithDelimiters(cents, 2);
          break;
        case 'amount_no_decimals':
          value = formatWithDelimiters(cents, 0);
          break;
        case 'amount_with_comma_separator':
          value = formatWithDelimiters(cents, 2, '.', ',');
          break;
        case 'amount_no_decimals_with_comma_separator':
          value = formatWithDelimiters(cents, 0, '.', ',');
          break;
        default:
          value = formatWithDelimiters(cents, 2);
      }
      return formatString.replace(PLACEHOLDER_RE, value);
    };
    return ShopifyWithFormat;
  };

  // replaceUrlParam — native ESM, hoisted regex
  var RP_RE_CACHE = new Map();
  var getRe = function getRe(param) {
    if (!RP_RE_CACHE.has(param)) RP_RE_CACHE.set(param, new RegExp("(".concat(param, "=).*?(&|$)"), 'g'));
    return RP_RE_CACHE.get(param);
  };
  var replaceUrlParam = function replaceUrlParam(url, param, value) {
    getRe(param);
    // single exec approach: search then replace or append
    var has = url.search(new RegExp("[?&]".concat(param, "="))) !== -1;
    if (has) return url.replace(getRe(param), "$1".concat(value, "$2"));
    return url + (url.indexOf('?') > 0 ? '&' : '?') + param + '=' + value;
  };

  var q$1 = function q(sel) {
    var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    return root.querySelector(sel);
  };
  var qq$1 = function qq(sel) {
    var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    return _toConsumableArray(root.querySelectorAll(sel));
  };
  var cacheSelectors = function cacheSelectors(timber) {
    // Keep $ prefix for bw compat; values are Mepto collections if mepto present else native arrays/elements
    // Use mepto where available so callers can .on/.toggleClass; fall back to native query.
    var mepto = $ ? window.mepto || window.jQuery : null;
    var useMepto = !!mepto;
    var sel = function sel(s) {
      return useMepto ? mepto(s) : qq$1(s);
    };
    var sel1 = function sel1(s) {
      return useMepto ? mepto(s) : q$1(s);
    };

    // Product thumbs: $('#ProductThumbs').find('a.product-single__thumbnail')
    var thumbRoot = q$1('#ProductThumbs');
    var thumbImages = thumbRoot ? useMepto ? mepto('#ProductThumbs').find('a.product-single__thumbnail') : qq$1('a.product-single__thumbnail', thumbRoot) : sel('a.product-single__thumbnail__empty__');
    timber.cache = {
      // General
      $html: useMepto ? mepto('html') : q$1('html'),
      $body: useMepto ? mepto(document.body) : document.body,
      // Navigation
      $navigation: sel1('#AccessibleNav'),
      $mobileSubNavToggle: sel('.mobile-nav__toggle'),
      // Collection
      $changeView: sel('.change-view'),
      // Product
      $productImage: sel1('#ProductPhotoImg'),
      $thumbImages: thumbImages,
      // Customer
      $recoverPasswordLink: sel1('#RecoverPassword'),
      $hideRecoverPasswordLink: sel1('#HideRecoverPasswordLink'),
      $recoverPasswordForm: sel1('#RecoverPasswordForm'),
      $customerLoginForm: sel1('#CustomerLoginForm'),
      $passwordResetSuccess: sel1('#ResetSuccess')
    };
    // Normalize thumbImages empty sentinel: if no root, make empty mepto/array
    if (!thumbRoot && timber.cache.$thumbImages && timber.cache.$thumbImages.length === 0) ;
    return timber.cache;
  };

  var getHash = function getHash() {
    return window.location.hash;
  };
  var switchImage = function switchImage(src, _imgObject, el) {
    // el may be mepto collection, Node, or selector
    var target = el && el[0] ? el[0] : el;
    var node = typeof target === 'string' ? document.querySelector(target) : target;
    if (!node) return;
    // use scheduler mutate to batch src write (avoids layout thrash if many)
    scheduler.mutate(function () {
      node.setAttribute('src', src);
    });
  };
  var mobileNavToggle = function mobileNavToggle(timber) {
    var _timber$cache;
    var t = (_timber$cache = timber.cache) === null || _timber$cache === void 0 ? void 0 : _timber$cache.$mobileSubNavToggle;
    if (!t) return;
    var list = t.length !== undefined ? _toConsumableArray(t) : [t];
    if (!list.length || list.length === 1 && !list[0]) return;
    list.forEach(function (el) {
      if (!el || !el.addEventListener) return;
      el.addEventListener('click', function () {
        var p = this.parentElement;
        if (!p) return;
        scheduler.mutate(function () {
          return p.classList.toggle('mobile-nav--expanded');
        });
      });
    });
  };
  var productImageSwitch = function productImageSwitch(timber) {
    var _timber$cache2;
    var thumbs = (_timber$cache2 = timber.cache) === null || _timber$cache2 === void 0 ? void 0 : _timber$cache2.$thumbImages;
    if (!thumbs) return;
    var list = thumbs.length !== undefined ? _toConsumableArray(thumbs) : [thumbs];
    if (!list.length || list.length === 1 && !list[0]) return;
    list.forEach(function (el) {
      if (!el || !el.addEventListener) return;
      el.addEventListener('click', function (evt) {
        evt.preventDefault();
        var href = el.getAttribute('href');
        switchImage(href, null, timber.cache.$productImage);
      });
    });
  };
  var responsiveVideos = function responsiveVideos() {
    var vids = _toConsumableArray(document.querySelectorAll('iframe[src*="youtube.com/embed"], iframe[src*="player.vimeo"]'));
    var resets = _toConsumableArray(document.querySelectorAll('iframe#admin_bar_iframe'));
    // batch wraps in mutate
    scheduler.mutate(function () {
      vids.forEach(function (el) {
        if (el.parentElement && el.parentElement.classList.contains('video-wrapper')) return;
        var wrap = document.createElement('div');
        wrap.className = 'video-wrapper';
        el.parentNode.insertBefore(wrap, el);
        wrap.appendChild(el);
      });
      // Chrome back-cache iframe src reset — style read then write already batched
      resets.forEach(function (el) {
        el.src = el.src;
      });
    });
  };
  var collectionViews = function collectionViews(timber) {
    var _timber$cache3;
    var c = (_timber$cache3 = timber.cache) === null || _timber$cache3 === void 0 ? void 0 : _timber$cache3.$changeView;
    if (!c) return;
    var list = c.length !== undefined ? _toConsumableArray(c) : [c];
    if (!list.length || list.length === 1 && !list[0]) return;
    list.forEach(function (el) {
      if (!el || !el.addEventListener) return;
      el.addEventListener('click', function () {
        var view = this.getAttribute('data-view') || this.dataset && this.dataset.view || '';
        var url = document.URL;
        var hasParams = url.indexOf('?') > -1;
        window.location = hasParams ? replaceUrlParam(url, 'view', view) : url + '?view=' + view;
      });
    });
  };
  var loginForms = function loginForms(timber) {
    var showRecover = function showRecover() {
      scheduler.mutate(function () {
        var a = timber.cache.$recoverPasswordForm;
        var b = timber.cache.$customerLoginForm;
        if (a) {
          var n = a[0] || a;
          if (n.style) n.style.display = '';
          if (n.style && n.style.display === 'none') n.style.display = 'block';
          if (!a.length) n.style.display = '';
        }
        // normalize: mepto .show() sets display block; native fallback
        var af = a && a[0] ? a[0] : a;
        var bf = b && b[0] ? b[0] : b;
        if (af && af.style) af.style.display = 'block';
        if (bf && bf.style) bf.style.display = 'none';
      });
    };
    var hideRecover = function hideRecover() {
      scheduler.mutate(function () {
        var af = timber.cache.$recoverPasswordForm && (timber.cache.$recoverPasswordForm[0] || timber.cache.$recoverPasswordForm);
        var bf = timber.cache.$customerLoginForm && (timber.cache.$customerLoginForm[0] || timber.cache.$customerLoginForm);
        if (af && af.style) af.style.display = 'none';
        if (bf && bf.style) bf.style.display = 'block';
      });
    };
    var aLink = timber.cache.$recoverPasswordLink;
    var hLink = timber.cache.$hideRecoverPasswordLink;
    var aNode = aLink && (aLink[0] || aLink);
    var hNode = hLink && (hLink[0] || hLink);
    if (aNode && aNode.addEventListener) aNode.addEventListener('click', function (e) {
      e.preventDefault();
      showRecover();
    });
    if (hNode && hNode.addEventListener) hNode.addEventListener('click', function (e) {
      e.preventDefault();
      hideRecover();
    });
    if (getHash() === '#recover') showRecover();
  };
  var resetPasswordSuccess = function resetPasswordSuccess(timber) {
    var _timber$cache4;
    var el = (_timber$cache4 = timber.cache) === null || _timber$cache4 === void 0 ? void 0 : _timber$cache4.$passwordResetSuccess;
    var node = el && (el[0] || el);
    if (!node || !node.style) return;
    scheduler.mutate(function () {
      node.style.display = 'block';
    });
  };

  var I18N_DEFAULTS = {
    addToCart: 'Add to cart',
    soldOut: 'Sold out',
    unavailable: 'Unavailable',
    compareAt: 'Compare at'
  };
  var q = function q(sel) {
    return document.querySelector(sel);
  };
  var qq = function qq(sel) {
    return _toConsumableArray(document.querySelectorAll(sel));
  };
  var productPage = function productPage() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var moneyFormat = options.money_format || window.Shopify && window.Shopify.money_format || '';
    var variant = options.variant;
    var i18n = _objectSpread2(_objectSpread2({}, I18N_DEFAULTS), options.i18n || {});

    // selectors — single query per element (bulk reads)
    var productImage = q('#ProductPhotoImg');
    var addToCart = q('#AddToCart');
    var productPrice = q('#ProductPrice');
    var comparePrice = q('#ComparePrice');
    var quantityElements = qq('.quantity-selector, label + .js-qty');
    var addToCartText = q('#AddToCartText');
    scheduler.mutate(function () {
      if (variant) {
        if (variant.featured_image && productImage) {
          var newImg = variant.featured_image;
          // Shopify.Image.switchImage is legacy CDN helper (shopify_common.js) — keep if present
          if (window.Shopify && window.Shopify.Image && typeof window.Shopify.Image.switchImage === 'function') {
            window.Shopify.Image.switchImage(newImg, productImage, switchImage);
          } else {
            switchImage(newImg && newImg.src ? newImg.src : newImg, null, productImage);
          }
        }
        if (variant.available) {
          if (addToCart) {
            addToCart.classList.remove('disabled');
            addToCart.disabled = false;
          }
          if (addToCartText) addToCartText.textContent = i18n.addToCart;
          quantityElements.forEach(function (el) {
            el.style.display = '';
          });
          // mepto .show() sets display block; keep default
          if (quantityElements.length === 1 && quantityElements[0].style.display === 'none') quantityElements[0].style.display = 'block';
          quantityElements.forEach(function (el) {
            if (el.style.display === 'none') el.style.display = 'block';
          });
        } else {
          if (addToCart) {
            addToCart.classList.add('disabled');
            addToCart.disabled = true;
          }
          if (addToCartText) addToCartText.textContent = i18n.soldOut;
          quantityElements.forEach(function (el) {
            el.style.display = 'none';
          });
        }
        if (productPrice) {
          var fmt = window.Shopify && window.Shopify.formatMoney ? window.Shopify.formatMoney(variant.price, moneyFormat) : String(variant.price);
          productPrice.innerHTML = fmt;
        }
        if (comparePrice) {
          if (variant.compare_at_price > variant.price) {
            var cfmt = window.Shopify && window.Shopify.formatMoney ? window.Shopify.formatMoney(variant.compare_at_price, moneyFormat) : String(variant.compare_at_price);
            comparePrice.innerHTML = "".concat(i18n.compareAt, " ").concat(cfmt);
            comparePrice.style.display = 'block';
          } else {
            comparePrice.style.display = 'none';
          }
        }
      } else {
        if (addToCart) {
          addToCart.classList.add('disabled');
          addToCart.disabled = true;
        }
        if (addToCartText) addToCartText.textContent = i18n.unavailable;
        quantityElements.forEach(function (el) {
          el.style.display = 'none';
        });
      }
    });
  };

  // timber — slice 2: cache + small utils (see utils.js)
  // Slice 1: prepareTransition + formatMoney
  if (typeof window !== 'undefined') {
    window.Shopify = window.Shopify || {};
    installFormatMoney(window.Shopify);
    attachPrepareTransition();
    window.timber = window.timber || {};
    // keep legacy names
    window.timber.cacheSelectors = function () {
      return cacheSelectors(window.timber);
    };
    window.timber.getHash = getHash;
    window.timber.switchImage = switchImage;
    window.timber.mobileNavToggle = function () {
      return mobileNavToggle(window.timber);
    };
    window.timber.productImageSwitch = function () {
      return productImageSwitch(window.timber);
    };
    window.timber.responsiveVideos = responsiveVideos;
    window.timber.collectionViews = function () {
      return collectionViews(window.timber);
    };
    window.timber.loginForms = function () {
      return loginForms(window.timber);
    };
    window.timber.resetPasswordSuccess = function () {
      return resetPasswordSuccess(window.timber);
    };
    window.timber.productPage = productPage;
    window.timber.init;
    window.timber.init = function () {
      // FastClick removed (evergreen); keep rest, defer to present slices
      cacheSelectors(window.timber);
      if (typeof window.timber.accessibleNav === 'function') try {
        window.timber.accessibleNav();
      } catch (_) {}
      if (typeof window.timber.drawersInit === 'function') try {
        window.timber.drawersInit();
      } catch (_) {}
      mobileNavToggle(window.timber);
      productImageSwitch(window.timber);
      responsiveVideos();
      collectionViews(window.timber);
      loginForms(window.timber);
    };
    // auto-init on DOM ready (replaces $(timber.init))
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () {
      return window.timber.init();
    });else queueMicrotask(function () {
      return window.timber.init();
    });
  }
  // eslint-disable-next-line no-undef
  var ShopifyFormatMoney = typeof Shopify !== 'undefined' ? Shopify.formatMoney : undefined;

  exports.ShopifyFormatMoney = ShopifyFormatMoney;
  exports.cacheSelectors = cacheSelectors;
  exports.collectionViews = collectionViews;
  exports.getHash = getHash;
  exports.loginForms = loginForms;
  exports.mobileNavToggle = mobileNavToggle;
  exports.prepareTransition = prepareTransition;
  exports.productImageSwitch = productImageSwitch;
  exports.productPage = productPage;
  exports.replaceUrlParam = replaceUrlParam;
  exports.resetPasswordSuccess = resetPasswordSuccess;
  exports.responsiveVideos = responsiveVideos;
  exports.switchImage = switchImage;

  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

  return exports;

})({});
