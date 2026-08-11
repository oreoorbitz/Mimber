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
  function asyncGeneratorStep(n, t, e, r, o, a, c) {
    try {
      var i = n[a](c),
        u = i.value;
    } catch (n) {
      return void e(n);
    }
    i.done ? t(u) : Promise.resolve(u).then(r, o);
  }
  function _asyncToGenerator(n) {
    return function () {
      var t = this,
        e = arguments;
      return new Promise(function (r, o) {
        var a = n.apply(t, e);
        function _next(n) {
          asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
        }
        function _throw(n) {
          asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
        }
        _next(void 0);
      });
    };
  }
  function _classCallCheck(a, n) {
    if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
  }
  function _defineProperties(e, r) {
    for (var t = 0; t < r.length; t++) {
      var o = r[t];
      o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
    }
  }
  function _createClass(e, r, t) {
    return r && _defineProperties(e.prototype, r), Object.defineProperty(e, "prototype", {
      writable: false
    }), e;
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
  function _regenerator() {
    /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */
    var e,
      t,
      r = "function" == typeof Symbol ? Symbol : {},
      n = r.iterator || "@@iterator",
      o = r.toStringTag || "@@toStringTag";
    function i(r, n, o, i) {
      var c = n && n.prototype instanceof Generator ? n : Generator,
        u = Object.create(c.prototype);
      return _regeneratorDefine(u, "_invoke", function (r, n, o) {
        var i,
          c,
          u,
          f = 0,
          p = o || [],
          y = false,
          G = {
            p: 0,
            n: 0,
            v: e,
            a: d,
            f: d.bind(e, 4),
            d: function (t, r) {
              return i = t, c = 0, u = e, G.n = r, a;
            }
          };
        function d(r, n) {
          for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) {
            var o,
              i = p[t],
              d = G.p,
              l = i[2];
            r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0));
          }
          if (o || r > 1) return a;
          throw y = true, n;
        }
        return function (o, p, l) {
          if (f > 1) throw TypeError("Generator is already running");
          for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) {
            i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u);
            try {
              if (f = 2, i) {
                if (c || (o = "next"), t = i[o]) {
                  if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object");
                  if (!t.done) return t;
                  u = t.value, c < 2 && (c = 0);
                } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1);
                i = e;
              } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break;
            } catch (t) {
              i = e, c = 1, u = t;
            } finally {
              f = 1;
            }
          }
          return {
            value: t,
            done: y
          };
        };
      }(r, o, i), true), u;
    }
    var a = {};
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}
    t = Object.getPrototypeOf;
    var c = [][n] ? t(t([][n]())) : (_regeneratorDefine(t = {}, n, function () {
        return this;
      }), t),
      u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c);
    function f(e) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e;
    }
    return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine(u), _regeneratorDefine(u, o, "Generator"), _regeneratorDefine(u, n, function () {
      return this;
    }), _regeneratorDefine(u, "toString", function () {
      return "[object Generator]";
    }), (_regenerator = function () {
      return {
        w: i,
        m: f
      };
    })();
  }
  function _regeneratorDefine(e, r, n, t) {
    var i = Object.defineProperty;
    try {
      i({}, "", {});
    } catch (e) {
      i = 0;
    }
    _regeneratorDefine = function (e, r, n, t) {
      function o(r, n) {
        _regeneratorDefine(e, r, function (e) {
          return this._invoke(r, n, e);
        });
      }
      r ? i ? i(e, r, {
        value: n,
        enumerable: !t,
        configurable: !t,
        writable: !t
      }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2));
    }, _regeneratorDefine(e, r, n, t);
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

  var q$2 = function q(sel) {
    var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    return root.querySelector(sel);
  };
  var qq$2 = function qq(sel) {
    var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    return _toConsumableArray(root.querySelectorAll(sel));
  };
  var cacheSelectors = function cacheSelectors(timber) {
    // Keep $ prefix for bw compat; values are Mepto collections if mepto present else native arrays/elements
    // Use mepto where available so callers can .on/.toggleClass; fall back to native query.
    var mepto = $ ? window.mepto || window.jQuery : null;
    var useMepto = !!mepto;
    var sel = function sel(s) {
      return useMepto ? mepto(s) : qq$2(s);
    };
    var sel1 = function sel1(s) {
      return useMepto ? mepto(s) : q$2(s);
    };

    // Product thumbs: $('#ProductThumbs').find('a.product-single__thumbnail')
    var thumbRoot = q$2('#ProductThumbs');
    var thumbImages = thumbRoot ? useMepto ? mepto('#ProductThumbs').find('a.product-single__thumbnail') : qq$2('a.product-single__thumbnail', thumbRoot) : sel('a.product-single__thumbnail__empty__');
    timber.cache = {
      // General
      $html: useMepto ? mepto('html') : q$2('html'),
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
  var q$1 = function q(sel) {
    return document.querySelector(sel);
  };
  var qq$1 = function qq(sel) {
    return _toConsumableArray(document.querySelectorAll(sel));
  };
  var productPage = function productPage() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var moneyFormat = options.money_format || window.Shopify && window.Shopify.money_format || '';
    var variant = options.variant;
    var i18n = _objectSpread2(_objectSpread2({}, I18N_DEFAULTS), options.i18n || {});

    // selectors — single query per element (bulk reads)
    var productImage = q$1('#ProductPhotoImg');
    var addToCart = q$1('#AddToCart');
    var productPrice = q$1('#ProductPrice');
    var comparePrice = q$1('#ComparePrice');
    var quantityElements = qq$1('.quantity-selector, label + .js-qty');
    var addToCartText = q$1('#AddToCartText');
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

  // timber.accessibleNav — Slice 4
  // Mepto/native: querySelectorAll, classList, closest, addEventListener; scheduler not needed (no layout thrash).

  var ACTIVE = 'nav-hover';
  var FOCUS = 'nav-focus';
  var unwrap$2 = function unwrap(el) {
    return el && el[0] ? el[0] : el;
  };
  var toArray = function toArray(els) {
    if (!els) return [];
    if (els.nodeType === 1) return [els];
    if (typeof els.length === 'number' && els.tagName === undefined) return _toConsumableArray(els).filter(Boolean).map(unwrap$2).filter(Boolean);
    return [unwrap$2(els)].filter(Boolean);
  };
  var accessibleNav = function accessibleNav(timber) {
    var _timber$cache, _timber$cache2;
    var nav = unwrap$2((_timber$cache = timber.cache) === null || _timber$cache === void 0 ? void 0 : _timber$cache.$navigation);
    if (!nav) return;
    var allLinks = _toConsumableArray(nav.querySelectorAll('a'));
    var topLevel = _toConsumableArray(nav.querySelectorAll(':scope > li a')).length ? _toConsumableArray(nav.querySelectorAll(':scope > li a')) : _toConsumableArray(nav.children).flatMap(function (li) {
      return _toConsumableArray(li.querySelectorAll('a'));
    }).filter(function (a) {
      return a.closest('li') && a.closest('li').parentElement === nav;
    });
    // fallback: children('li').find('a') — use direct children
    var topLevelLinks = topLevel.length ? topLevel : _toConsumableArray(nav.querySelectorAll('a')).filter(function (a) {
      var _a$closest;
      return a.closest('.site-nav--has-dropdown') === null || ((_a$closest = a.closest('li')) === null || _a$closest === void 0 ? void 0 : _a$closest.parentElement) === nav;
    });
    var parents = _toConsumableArray(nav.querySelectorAll('.site-nav--has-dropdown'));
    var subMenuLinks = _toConsumableArray(nav.querySelectorAll('.site-nav__dropdown a'));
    var body = unwrap$2((_timber$cache2 = timber.cache) === null || _timber$cache2 === void 0 ? void 0 : _timber$cache2.$body) || document.body;
    var addFocus = function addFocus(els) {
      return toArray(els).forEach(function (el) {
        return el.classList.add(FOCUS);
      });
    };
    var removeFocus = function removeFocus(els) {
      return toArray(els).forEach(function (el) {
        return el.classList.remove(FOCUS);
      });
    };
    var showDropdown = function showDropdown(el) {
      var node = unwrap$2(el);
      if (!node) return;
      node.classList.add(ACTIVE);
      setTimeout(function () {
        var onTouch = function onTouch() {
          return hideDropdown(node);
        };
        // store handler for removal
        body._mimberHideHandler = onTouch;
        body.addEventListener('touchstart', onTouch);
      }, 250);
    };
    var hideDropdown = function hideDropdown(el) {
      var node = unwrap$2(el);
      if (!node) return;
      node.classList.remove(ACTIVE);
      if (body._mimberHideHandler) {
        body.removeEventListener('touchstart', body._mimberHideHandler);
        body._mimberHideHandler = null;
      }
    };
    var handleFocus = function handleFocus(el) {
      var node = unwrap$2(el);
      if (!node) return;
      var subMenu = node.nextElementSibling && node.nextElementSibling.tagName === 'UL' ? node.nextElementSibling : null;
      !!(subMenu && subMenu.classList.contains('sub-nav'));
      var isSubItem = !!node.closest('.site-nav__dropdown');
      if (!isSubItem) {
        removeFocus(topLevelLinks);
        addFocus(node);
      } else {
        var _node$closest;
        var newFocus = (_node$closest = node.closest('.site-nav--has-dropdown')) === null || _node$closest === void 0 ? void 0 : _node$closest.querySelector('a');
        if (newFocus) addFocus(newFocus);
      }
    };
    parents.forEach(function (el) {
      var enter = function enter(evt) {
        if (!el.classList.contains(ACTIVE)) evt.preventDefault();
        showDropdown(el);
      };
      el.addEventListener('mouseenter', enter);
      el.addEventListener('touchstart', enter, {
        passive: false
      });
      el.addEventListener('mouseleave', function () {
        return hideDropdown(el);
      });
    });
    subMenuLinks.forEach(function (el) {
      el.addEventListener('touchstart', function (evt) {
        return evt.stopImmediatePropagation();
      });
    });
    allLinks.forEach(function (el) {
      el.addEventListener('focus', function () {
        return handleFocus(el);
      });
      el.addEventListener('blur', function () {
        return removeFocus(topLevelLinks);
      });
    });
  };

  var unwrap$1 = function unwrap(el) {
    return el && el[0] ? el[0] : el;
  };
  var trigger$1 = function trigger(target, name, detail) {
    var el = unwrap$1(target) || document.body;
    el.dispatchEvent(new CustomEvent(name, {
      bubbles: true,
      detail: detail
    }));
    // also try mepto trigger if available (for compat with $(document).on('beforeDrawerOpen.timber'))
    try {
      var mepto = window.mepto || window.jQuery;
      if (mepto && mepto(target).trigger) mepto(target).trigger(name, detail);
    } catch (_) {}
  };
  var Drawer = /*#__PURE__*/function () {
    function Drawer(id, position) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      _classCallCheck(this, Drawer);
      var defaults = {
        close: '.js-drawer-close',
        open: '.js-drawer-open-' + position,
        openClass: 'js-drawer-open',
        dirOpenClass: 'js-drawer-open-' + position
      };
      this.config = Object.assign({}, defaults, options);
      this.position = position;

      // $nodes: parent = body,html ; page = #PageContainer ; moved = .is-moved-by-drawer
      this.nodes = {
        parent: [document.body, document.documentElement].filter(Boolean),
        page: document.getElementById('PageContainer'),
        moved: _toConsumableArray(document.querySelectorAll('.is-moved-by-drawer'))
      };
      this.drawer = document.getElementById(id);
      if (!this.drawer) return false;
      this.drawerIsOpen = false;
      this.init();
    }
    return _createClass(Drawer, [{
      key: "init",
      value: function init() {
        var _this = this;
        var openEls = _toConsumableArray(document.querySelectorAll(this.config.open));
        openEls.forEach(function (el) {
          return el.addEventListener('click', _this.open.bind(_this));
        });
        var closeEls = this.drawer ? _toConsumableArray(this.drawer.querySelectorAll(this.config.close)) : [];
        closeEls.forEach(function (el) {
          return el.addEventListener('click', _this.close.bind(_this));
        });
      }
    }, {
      key: "open",
      value: function open(evt) {
        var _this2 = this;
        var externalCall = false;
        if (evt) evt.preventDefault();else externalCall = true;
        if (evt && evt.stopPropagation) {
          evt.stopPropagation();
          this.activeSource = evt.currentTarget;
        }
        if (this.drawerIsOpen && !externalCall) return this.close();
        var body = window.timber && window.timber.cache && unwrap$1(window.timber.cache.$body) || document.body;
        trigger$1(body, 'beforeDrawerOpen.timber', this);
        scheduler.mutate(function () {
          _this2.nodes.moved.forEach(function (el) {
            return el.classList.add('is-transitioning');
          });
          prepareTransition(_this2.drawer);
          _this2.nodes.parent.forEach(function (el) {
            return el.classList.add(_this2.config.openClass, _this2.config.dirOpenClass);
          });
        });
        this.drawerIsOpen = true;
        this.trapFocus(this.drawer, 'drawer_focus');
        if (this.config.onDrawerOpen && typeof this.config.onDrawerOpen === 'function' && !externalCall) {
          this.config.onDrawerOpen();
        }
        if (this.activeSource && this.activeSource.getAttribute && this.activeSource.getAttribute('aria-expanded') !== null) {
          this.activeSource.setAttribute('aria-expanded', 'true');
        }

        // lock scrolling + page click close (namespaced .drawer)
        if (this.nodes.page) {
          this._onTouchMove = function (e) {
            e.preventDefault();
            return false;
          };
          this._onPageClick = function (e) {
            _this2.close();
            e.preventDefault();
            return false;
          };
          this.nodes.page.addEventListener('touchmove', this._onTouchMove, {
            passive: false
          });
          this.nodes.page.addEventListener('click', this._onPageClick);
        }
        trigger$1(body, 'afterDrawerOpen.timber', this);
      }
    }, {
      key: "close",
      value: function close() {
        var _this3 = this;
        if (!this.drawerIsOpen) return;
        var body = window.timber && window.timber.cache && unwrap$1(window.timber.cache.$body) || document.body;
        trigger$1(body, 'beforeDrawerClose.timber', this);
        if (document.activeElement && document.activeElement.blur) {
          try {
            document.activeElement.blur();
          } catch (_) {}
          // also mepto trigger blur for compat
          try {
            var mepto = window.mepto || window.jQuery;
            if (mepto) mepto(document.activeElement).trigger('blur');
          } catch (_) {}
        }
        scheduler.mutate(function () {
          _this3.nodes.moved.forEach(function (el) {
            return prepareTransition(el);
          });
          prepareTransition(_this3.drawer);
          _this3.nodes.parent.forEach(function (el) {
            return el.classList.remove(_this3.config.dirOpenClass, _this3.config.openClass);
          });
        });
        this.drawerIsOpen = false;
        this.removeTrapFocus(this.drawer, 'drawer_focus');
        if (this.nodes.page) {
          if (this._onTouchMove) this.nodes.page.removeEventListener('touchmove', this._onTouchMove);
          if (this._onPageClick) this.nodes.page.removeEventListener('click', this._onPageClick);
          // remove any remaining .drawer handlers (compat: off('.drawer') removed all)
          this._onTouchMove = null;
          this._onPageClick = null;
        }
        trigger$1(body, 'afterDrawerClose.timber', this);
      }
    }, {
      key: "trapFocus",
      value: function trapFocus(container, eventNamespace) {
        var el = unwrap$1(container);
        if (!el) return;
        var eventName = eventNamespace ? 'focusin.' + eventNamespace : 'focusin';
        // store handler for removal
        this._focusHandler = function (evt) {
          if (el !== evt.target && !el.contains(evt.target)) el.focus();
        };
        this._focusEventName = eventName;
        el.setAttribute('tabindex', '-1');
        el.focus();
        document.addEventListener('focusin', this._focusHandler);
        // also namespaced compat via mepto if available
        try {
          var mepto = window.mepto || window.jQuery;
          if (mepto) mepto(document).on(eventName, this._focusHandler);
        } catch (_) {}
      }
    }, {
      key: "removeTrapFocus",
      value: function removeTrapFocus(container, eventNamespace) {
        var el = unwrap$1(container);
        if (!el) return;
        var eventName = eventNamespace ? 'focusin.' + eventNamespace : 'focusin';
        el.removeAttribute('tabindex');
        if (this._focusHandler) {
          document.removeEventListener('focusin', this._focusHandler);
          try {
            var mepto = window.mepto || window.jQuery;
            if (mepto) mepto(document).off(eventName);
          } catch (_) {}
          this._focusHandler = null;
        } else {
          document.removeEventListener('focusin', function () {});
          try {
            var _mepto = window.mepto || window.jQuery;
            if (_mepto) _mepto(document).off(eventName);
          } catch (_) {}
        }
      }
    }]);
  }();
  var drawersInit = function drawersInit(timber) {
    timber.LeftDrawer = new Drawer('NavDrawer', 'left');
    // Preserve Liquid gate: only init RightDrawer if ajaxCart present or setting says drawer
    // Original: {% if settings.ajax_cart_method == "drawer" %} timber.RightDrawer = new timber.Drawers('CartDrawer','right',{onDrawerOpen: ajaxCart.load}); {% endif %}
    // Modern: check window.ajaxCart or window.settings
    var ajaxCart = window.ajaxCart;
    var shouldInitRight = function () {
      // If Liquid already rendered, timber.RightDrawer may be expected; init if CartDrawer exists
      if (document.getElementById('CartDrawer')) return true;
      return !!ajaxCart;
    }();
    if (shouldInitRight) {
      timber.RightDrawer = new Drawer('CartDrawer', 'right', {
        onDrawerOpen: ajaxCart && ajaxCart.load ? ajaxCart.load : undefined
      });
    }
  };

  // ShopifyAPI — Slice 6 (ajax-cart dependency)
  // fetch + mepto CustomEvent vs jQuery.ajax/trigger. Keeps ShopifyAPI global.

  // eslint-disable-next-line no-unused-vars
  var attributeToString = function attributeToString(attr) {
    if (typeof attr !== 'string') {
      attr = String(attr);
      if (attr === 'undefined') attr = '';
    }
    return attr.trim();
  };
  var trigger = function trigger(target, name, detail) {
    var el = target || document.body;
    var node = el && el[0] ? el[0] : el;
    if (!node || !node.dispatchEvent) return;
    node.dispatchEvent(new CustomEvent(name, {
      bubbles: true,
      detail: detail
    }));
    try {
      var mepto = window.mepto || window.jQuery;
      if (mepto && mepto(node).trigger) mepto(node).trigger(name, detail);
    } catch (_) {}
  };
  var jsonFetch = function jsonFetch(url) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return fetch(url, _objectSpread2({
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json'
      }
    }, opts)).then(/*#__PURE__*/function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(res) {
        var text, data, err;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.n = 1;
              return res.text();
            case 1:
              text = _context.v;
              try {
                data = text ? JSON.parse(text) : {};
              } catch (_) {
                data = {
                  responseText: text
                };
                data.responseText = text;
              }
              if (res.ok) {
                _context.n = 2;
                break;
              }
              err = new Error('Shopify API error');
              err.responseText = text;
              err.status = res.status;
              throw err;
            case 2:
              return _context.a(2, data);
          }
        }, _callee);
      }));
      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
  };
  if (typeof window !== 'undefined') {
    window.ShopifyAPI = window.ShopifyAPI || {};
  }
  var ShopifyAPI = typeof window !== 'undefined' ? window.ShopifyAPI : {};
  ShopifyAPI.onCartUpdate = ShopifyAPI.onCartUpdate || function () {};
  ShopifyAPI.onError = ShopifyAPI.onError || function (xhr, _textStatus) {
    var data;
    try {
      data = JSON.parse(xhr.responseText || xhr.message || '{}');
    } catch (_) {
      data = {};
    }
    if (data.message) alert("".concat(data.message, "(").concat(data.status, "): ").concat(data.description));
  };
  ShopifyAPI.updateCartNote = function (note, callback) {
    var body = document.body;
    trigger(body, 'beforeUpdateCartNote.ajaxCart', note);
    fetch('/cart/update.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'note=' + encodeURIComponent(attributeToString(note))
    }).then(function (r) {
      return r.json();
    }).then(function (cart) {
      if (typeof callback === 'function') callback(cart);else ShopifyAPI.onCartUpdate(cart);
      trigger(body, 'afterUpdateCartNote.ajaxCart', [note, cart]);
      trigger(body, 'completeUpdateCartNote.ajaxCart', [null, null, 'success']);
    }).catch(function (err) {
      trigger(body, 'errorUpdateCartNote.ajaxCart', [err, 'error']);
      ShopifyAPI.onError({
        responseText: err.responseText || err.message,
        status: err.status
      }, 'error');
      trigger(body, 'completeUpdateCartNote.ajaxCart', [null, err, 'error']);
    });
  };
  ShopifyAPI.addItemFromForm = function (form, callback, errorCallback) {
    var body = document.body;
    var fd = form instanceof HTMLFormElement ? new FormData(form) : new FormData();
    // If form is a selector/string, try to find it
    var formEl = form;
    if (typeof form === 'string') formEl = document.querySelector(form);
    var bodyStr = formEl instanceof HTMLFormElement ? new URLSearchParams(new FormData(formEl)).toString() : new URLSearchParams(fd).toString();
    trigger(body, 'beforeAddItem.ajaxCart', form);
    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json'
      },
      body: bodyStr
    }).then(/*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(res) {
        var text, err;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              _context2.n = 1;
              return res.text();
            case 1:
              text = _context2.v;
              if (res.ok) {
                _context2.n = 2;
                break;
              }
              err = new Error(text);
              err.responseText = text;
              err.status = res.status;
              throw err;
            case 2:
              return _context2.a(2, text ? JSON.parse(text) : {});
          }
        }, _callee2);
      }));
      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }()).then(function (lineItem) {
      if (typeof callback === 'function') callback(lineItem, form);else if (typeof ShopifyAPI.onItemAdded === 'function') ShopifyAPI.onItemAdded(lineItem, form);
      trigger(body, 'afterAddItem.ajaxCart', [lineItem, form]);
      trigger(body, 'completeAddItem.ajaxCart', [null, null, 'success']);
    }).catch(function (err) {
      if (typeof errorCallback === 'function') errorCallback(err, 'error');else ShopifyAPI.onError(err, 'error');
      trigger(body, 'errorAddItem.ajaxCart', [err, 'error']);
      trigger(body, 'completeAddItem.ajaxCart', [null, err, 'error']);
    });
  };
  ShopifyAPI.getCart = function (callback) {
    trigger(document.body, 'beforeGetCart.ajaxCart');
    jsonFetch('/cart.js').then(function (cart) {
      if (typeof callback === 'function') callback(cart);else ShopifyAPI.onCartUpdate(cart);
      trigger(document.body, 'afterGetCart.ajaxCart', cart);
    }).catch(function (err) {
      return ShopifyAPI.onError(err, 'error');
    });
  };
  ShopifyAPI.changeItem = function (line, quantity, callback) {
    var body = document.body;
    trigger(body, 'beforeChangeItem.ajaxCart', [line, quantity]);
    fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: "quantity=".concat(encodeURIComponent(quantity), "&line=").concat(encodeURIComponent(line))
    }).then(function (r) {
      return r.json();
    }).then(function (cart) {
      if (typeof callback === 'function') callback(cart);else ShopifyAPI.onCartUpdate(cart);
      trigger(body, 'afterChangeItem.ajaxCart', [line, quantity, cart]);
      trigger(body, 'completeChangeItem.ajaxCart', [null, null, 'success']);
    }).catch(function (err) {
      trigger(body, 'errorChangeItem.ajaxCart', [err, 'error']);
      ShopifyAPI.onError(err, 'error');
      trigger(body, 'completeChangeItem.ajaxCart', [null, err, 'error']);
    });
  };

  var q = function q(sel) {
    var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    return root.querySelector(sel);
  };
  var qq = function qq(sel) {
    var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    return _toConsumableArray(root.querySelectorAll(sel));
  };
  var I18N = {
    empty: 'Your cart is empty',
    savingsHtml: 'You save [savings]'
  };
  var settings = {
    formSelector: 'form[action^="/cart/add"]',
    cartContainer: '#CartContainer',
    addToCartSelector: 'input[type="submit"]',
    cartCountSelector: null,
    cartCostSelector: null,
    moneyFormat: '${{amount}}',
    disableAjaxCart: false,
    enableQtySelectors: true,
    i18n: I18N
  };
  var isUpdating = false;
  var bodyEl, formContainer, addToCart, cartContainer, cartCountSelector, cartCostSelector;
  var unwrap = function unwrap(el) {
    return el && el[0] ? el[0] : el;
  };
  var triggerBody = function triggerBody(name, detail) {
    var b = bodyEl || document.body;
    b.dispatchEvent(new CustomEvent(name, {
      bubbles: true,
      detail: detail
    }));
    try {
      var mepto = window.mepto || window.jQuery;
      if (mepto && mepto(b).trigger) mepto(b).trigger(name, detail);
    } catch (_) {}
  };
  var updateCountPrice = function updateCountPrice(cart) {
    scheduler.mutate(function () {
      if (cartCountSelector) {
        unwrap(cartCountSelector) || cartCountSelector;
        // cartCountSelector may be NodeList/array
        var list = cartCountSelector.length !== undefined && cartCountSelector.tagName === undefined ? _toConsumableArray(cartCountSelector) : [cartCountSelector];
        list.forEach(function (node) {
          var n = unwrap(node) || node;
          if (!n || !n.textContent === undefined) return;
          n.textContent = String(cart.item_count);
          n.classList.remove('hidden-count');
          if (cart.item_count === 0) n.classList.add('hidden-count');
          // compat: .html() fallback
          if (n.innerHTML !== undefined && typeof cart.item_count !== 'undefined') n.innerHTML = String(cart.item_count);
        });
      }
      if (cartCostSelector) {
        var fmt = window.Shopify && window.Shopify.formatMoney ? window.Shopify.formatMoney(cart.total_price, settings.moneyFormat) : String(cart.total_price);
        var _list = cartCostSelector.length !== undefined && cartCostSelector.tagName === undefined ? _toConsumableArray(cartCostSelector) : [cartCostSelector];
        _list.forEach(function (node) {
          var n = unwrap(node) || node;
          if (!n) return;
          if (n.innerHTML !== undefined) n.innerHTML = fmt;
        });
      }
    });
  };
  var formOverride = function formOverride() {
    if (!formContainer || !formContainer.length) return;
    var forms = formContainer.length !== undefined && formContainer.tagName === undefined ? _toConsumableArray(formContainer) : [formContainer];
    forms.forEach(function (form) {
      var node = unwrap(form) || form;
      if (!node || !node.addEventListener) return;
      node.addEventListener('submit', function (evt) {
        evt.preventDefault();
        var adds = addToCart ? addToCart.length !== undefined && addToCart.tagName === undefined ? _toConsumableArray(addToCart) : [addToCart] : [];
        adds.forEach(function (a) {
          var n = unwrap(a) || a;
          if (n && n.classList) {
            n.classList.remove('is-added');
            n.classList.add('is-adding');
          }
        });
        qq('.qty-error').forEach(function (el) {
          return el.remove();
        });
        ShopifyAPI.addItemFromForm(evt.target, itemAddedCallback, itemErrorCallback);
      });
    });
  };
  var itemAddedCallback = function itemAddedCallback() {
    var adds = addToCart ? addToCart.length !== undefined && addToCart.tagName === undefined ? _toConsumableArray(addToCart) : [addToCart] : [];
    adds.forEach(function (a) {
      var n = unwrap(a) || a;
      if (n && n.classList) {
        n.classList.remove('is-adding');
        n.classList.add('is-added');
      }
    });
    ShopifyAPI.getCart(cartUpdateCallback);
  };
  var itemErrorCallback = function itemErrorCallback(xhr) {
    var data = {};
    try {
      data = JSON.parse(xhr.responseText || '{}');
    } catch (_) {}
    var adds = addToCart ? addToCart.length !== undefined && addToCart.tagName === undefined ? _toConsumableArray(addToCart) : [addToCart] : [];
    adds.forEach(function (a) {
      var n = unwrap(a) || a;
      if (n && n.classList) n.classList.remove('is-adding', 'is-added');
    });
    if (data.message && data.status == 422) {
      var errDiv = document.createElement('div');
      errDiv.className = 'errors qty-error';
      errDiv.textContent = data.description || data.message;
      var fc = unwrap(formContainer) || (formContainer && formContainer[0] ? formContainer[0] : null);
      var anchor = fc && fc.parentNode ? fc : document.body;
      if (fc && fc.after) fc.after(errDiv);else anchor.appendChild(errDiv);
    }
  };
  var cartUpdateCallback = function cartUpdateCallback(cart) {
    updateCountPrice(cart);
    buildCart(cart);
  };
  var buildCart = function buildCart(cart) {
    var container = unwrap(cartContainer) || cartContainer;
    if (!container) return;
    scheduler.mutate(function () {
      container.innerHTML = '';
      if (cart.item_count === 0) {
        var p = document.createElement('p');
        p.textContent = settings.i18n && settings.i18n.empty || I18N.empty;
        container.appendChild(p);
        cartCallback(cart);
        return;
      }
      var sourceEl = q('#CartTemplate');
      var source = sourceEl ? sourceEl.innerHTML : '';
      var Handlebars = window.Handlebars;
      if (!Handlebars || !source) {
        // fallback: simple list without Handlebars
        var _frag = document.createDocumentFragment();
        cart.items.forEach(function (cartItem, index) {
          var div = document.createElement('div');
          div.textContent = "".concat(cartItem.product_title, " x ").concat(cartItem.quantity);
          _frag.appendChild(div);
        });
        container.appendChild(_frag);
        cartCallback(cart);
        return;
      }
      var template = Handlebars.compile(source);
      var items = cart.items.map(function (cartItem, index) {
        var prodImg = '//cdn.shopify.com/s/assets/admin/no-image-medium-cc9732cb976dd349a0df1d39816fbcc7.gif';
        if (cartItem.image != null) prodImg = cartItem.image.replace(/(\.[^.]*)$/, '_small$1').replace('http:', '');
        var fmt = function fmt(c) {
          return window.Shopify && window.Shopify.formatMoney ? window.Shopify.formatMoney(c, settings.moneyFormat) : String(c);
        };
        return {
          key: cartItem.key,
          line: index + 1,
          url: cartItem.url,
          img: prodImg,
          name: cartItem.product_title,
          variation: cartItem.variant_title,
          properties: cartItem.properties,
          itemAdd: cartItem.quantity + 1,
          itemMinus: cartItem.quantity - 1,
          itemQty: cartItem.quantity,
          price: fmt(cartItem.price),
          vendor: cartItem.vendor,
          linePrice: fmt(cartItem.line_price),
          originalLinePrice: fmt(cartItem.original_line_price),
          discounts: cartItem.discounts,
          discountsApplied: cartItem.line_price !== cartItem.original_line_price
        };
      });
      var savingsTpl = settings.i18n && settings.i18n.savingsHtml || I18N.savingsHtml;
      var totalCartDiscount = cart.total_discount === 0 ? 0 : savingsTpl.replace('[savings]', window.Shopify && window.Shopify.formatMoney ? window.Shopify.formatMoney(cart.total_discount, settings.moneyFormat) : String(cart.total_discount));
      var data = {
        items: items,
        note: cart.note,
        totalPrice: window.Shopify && window.Shopify.formatMoney ? window.Shopify.formatMoney(cart.total_price, settings.moneyFormat) : String(cart.total_price),
        totalCartDiscount: totalCartDiscount,
        totalCartDiscountApplied: cart.total_discount !== 0
      };
      // append via DocumentFragment for single reflow (PERFORMANCE_GUIDE Part I)
      var html = template(data);
      var tmp = document.createElement('div');
      tmp.innerHTML = html;
      var frag = document.createDocumentFragment();
      while (tmp.firstChild) frag.appendChild(tmp.firstChild);
      container.appendChild(frag);
      cartCallback(cart);
    });
  };
  var cartCallback = function cartCallback(cart) {
    scheduler.mutate(function () {
      var b = bodyEl || document.body;
      b.classList.remove('drawer--is-loading');
    });
    triggerBody('afterCartLoad.ajaxCart', cart);
    if (window.Shopify && window.Shopify.StorefrontExpressButtons) window.Shopify.StorefrontExpressButtons.initialize();
  };
  var adjustCart = function adjustCart() {
    var b = bodyEl || document.body;
    b.addEventListener('click', function (e) {
      var target = e.target.closest && e.target.closest('.ajaxcart__qty-adjust');
      if (!target) return;
      if (isUpdating) return;
      var line = target.getAttribute('data-line') || target.dataset.line;
      var qtyEl = target.parentElement ? target.parentElement.querySelector('.ajaxcart__qty-num') : null;
      var qty = qtyEl ? parseInt(qtyEl.value.replace(/\D/g, ''), 10) : 0;
      qty = validateQty(qty);
      if (target.classList.contains('ajaxcart__qty--plus')) qty += 1;else {
        qty -= 1;
        if (qty <= 0) qty = 0;
      }
      if (line) updateQuantity(line, qty);else if (qtyEl) qtyEl.value = String(qty);
    });
    b.addEventListener('change', function (e) {
      var target = e.target.closest && e.target.closest('.ajaxcart__qty-num');
      if (!target) return;
      if (isUpdating) return;
      var line = target.getAttribute('data-line') || target.dataset.line;
      var qty = parseInt(target.value.replace(/\D/g, ''), 10);
      qty = validateQty(qty);
      if (line) updateQuantity(line, qty);
    });
    b.addEventListener('submit', function (e) {
      var form = e.target.closest && e.target.closest('form.ajaxcart');
      if (!form) return;
      if (isUpdating) e.preventDefault();
    });
    b.addEventListener('focusin', function (e) {
      var target = e.target.closest && e.target.closest('.ajaxcart__qty-adjust');
      if (!target) return;
      setTimeout(function () {
        try {
          target.select();
        } catch (_) {}
      }, 50);
    });
    var updateQuantity = function updateQuantity(line, qty) {
      isUpdating = true;
      var row = q(".ajaxcart__row[data-line=\"".concat(line, "\"]"));
      if (row) row.classList.add('is-loading');
      if (qty === 0 && row && row.parentElement) row.parentElement.classList.add('is-removed');
      setTimeout(function () {
        return ShopifyAPI.changeItem(line, qty, adjustCartCallback);
      }, 250);
    };
    b.addEventListener('change', function (e) {
      if (e.target.matches && e.target.matches('textarea[name="note"]')) {
        ShopifyAPI.updateCartNote(e.target.value, function () {});
      }
    });
  };
  var adjustCartCallback = function adjustCartCallback(cart) {
    updateCountPrice(cart);
    setTimeout(function () {
      isUpdating = false;
      ShopifyAPI.getCart(buildCart);
    }, 150);
  };
  var validateQty = function validateQty(qty) {
    if (parseFloat(qty) == parseInt(qty, 10) && !isNaN(qty)) return qty;
    return 1;
  };
  var init = function init() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    settings = Object.assign({}, settings, options);
    // support Liquid i18n passthrough
    if (options.i18n) settings.i18n = Object.assign({}, I18N, options.i18n);

    // selectors — mepto fallback, else native
    var mepto = window.mepto || window.jQuery;
    var sel = function sel(s) {
      if (!s) return null;
      if (mepto) return mepto(s);
      var els = qq(s);
      return els.length === 1 ? els[0] : els;
    };
    formContainer = sel(settings.formSelector);
    // cartContainer is single
    var cc = q(settings.cartContainer);
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
    var adds = addToCart ? addToCart.length !== undefined && addToCart.tagName === undefined ? _toConsumableArray(addToCart) : [addToCart] : [];
    if (!settings.disableAjaxCart && adds.length) formOverride();
    adjustCart();
  };
  var loadCart = function loadCart() {
    var b = bodyEl || document.body;
    b.classList.add('drawer--is-loading');
    ShopifyAPI.getCart(cartUpdateCallback);
  };
  var qtySelectors = function qtySelectors() {
    var numInputs = qq('input[type="number"]');
    if (!numInputs.length) return;
    numInputs.forEach(function (el) {
      var currentQty = el.value;
      var inputName = el.getAttribute('name');
      var inputId = el.getAttribute('id');
      var itemAdd = String(parseInt(currentQty, 10) + 1);
      var itemMinus = String(parseInt(currentQty, 10) - 1);
      var sourceEl = q('#JsQty');
      var Handlebars = window.Handlebars;
      if (!Handlebars || !sourceEl) return;
      var template = Handlebars.compile(sourceEl.innerHTML);
      var data = {
        key: el.getAttribute('data-id'),
        itemQty: currentQty,
        itemAdd: itemAdd,
        itemMinus: itemMinus,
        inputName: inputName,
        inputId: inputId
      };
      var tmp = document.createElement('div');
      tmp.innerHTML = template(data);
      el.after(tmp.firstElementChild || tmp.firstChild);
      el.remove();
    });
    qq('.js-qty__adjust').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var qtyEl = btn.parentElement ? btn.parentElement.querySelector('.js-qty__num') : null;
        if (!qtyEl) return;
        var qty = parseInt(qtyEl.value.replace(/\D/g, ''), 10);
        qty = validateQty(qty);
        if (btn.classList.contains('js-qty__adjust--plus')) qty += 1;else {
          qty -= 1;
          if (qty <= 1) qty = 1;
        }
        qtyEl.value = String(qty);
      });
    });
  };
  var ajaxCartExport = {
    init: init,
    load: loadCart
  };
  if (typeof window !== 'undefined') window.ajaxCart = ajaxCartExport;

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
    window.timber.accessibleNav = function () {
      return accessibleNav(window.timber);
    };
    window.timber.Drawers = Drawer;
    window.timber.drawersInit = function () {
      return drawersInit(window.timber);
    };
    window.ajaxCart = ajaxCartExport;
    window.ShopifyAPI = ShopifyAPI;
    window.timber.init;
    window.timber.init = function () {
      // FastClick removed (evergreen); keep rest
      cacheSelectors(window.timber);
      try {
        accessibleNav(window.timber);
      } catch (_) {}
      try {
        drawersInit(window.timber);
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

  exports.Drawer = Drawer;
  exports.ShopifyAPI = ShopifyAPI;
  exports.ShopifyFormatMoney = ShopifyFormatMoney;
  exports.accessibleNav = accessibleNav;
  exports.ajaxCart = ajaxCartExport;
  exports.cacheSelectors = cacheSelectors;
  exports.collectionViews = collectionViews;
  exports.drawersInit = drawersInit;
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
