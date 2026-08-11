/*! Mimber Mepto v2.2.2-mepto.1 — Mepto-integrated, jQuery-free */

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
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

// timber — first slice: prepareTransition + formatMoney
// Full theme index will re-export subsequent slices; this slice is independently shippable.
if (typeof window !== 'undefined') {
  window.Shopify = window.Shopify || {};
  installFormatMoney(window.Shopify);
  attachPrepareTransition();
}
// eslint-disable-next-line no-undef
var ShopifyFormatMoney = typeof Shopify !== 'undefined' ? Shopify.formatMoney : undefined;

export { ShopifyFormatMoney, prepareTransition, replaceUrlParam };
