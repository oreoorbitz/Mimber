const Lt = function() {
  let n = {};
  const N = [], y = Array.prototype.filter, C = Array.prototype.slice, T = Array.prototype.reduce, v = window.document, j = /* @__PURE__ */ new Map(), M = {
    "column-count": 1,
    columns: 1,
    "font-weight": 1,
    "line-height": 1,
    opacity: 1,
    "z-index": 1,
    zoom: 1
  }, p = /^\s*<(\w+|!)[^>]*>/, a = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, h = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, d = /^(?:body|html)$/i, E = /([A-Z])/g, L = /::/g, S = /([A-Z]+)([A-Z][a-z])/g, P = /([a-z\d])([A-Z])/g, k = /_/g, F = ["val", "css", "html", "text", "data", "width", "height", "offset"], B = new Set(F), z = ["after", "prepend", "before", "append"], Z = v.createElement("table"), J = v.createElement("tr"), W = {
    tr: v.createElement("tbody"),
    tbody: Z,
    thead: Z,
    tfoot: Z,
    td: J,
    th: J,
    "*": v.createElement("div")
  }, g = /^[\w-]*$/, w = Object.prototype.toString, r = {}, u = {
    tabindex: "tabIndex",
    readonly: "readOnly",
    for: "htmlFor",
    class: "className",
    maxlength: "maxLength",
    cellspacing: "cellSpacing",
    cellpadding: "cellPadding",
    rowspan: "rowSpan",
    colspan: "colSpan",
    usemap: "useMap",
    frameborder: "frameBorder",
    contenteditable: "contentEditable"
  }, f = Array.isArray;
  r.matches = function(t, e) {
    if (!e || !t || t.nodeType !== 1) return !1;
    try {
      return t.matches(e);
    } catch {
      return !1;
    }
  };
  function l(t) {
    if (t === null) return "null";
    if (typeof t > "u") return "undefined";
    const e = typeof t, i = e === "object", o = w.call(t), s = typeof o == "string" ? o.slice(8, -1).toLowerCase() : "object";
    return i ? s : e;
  }
  function b(t) {
    return typeof t == "function";
  }
  function x(t) {
    return t instanceof Window;
  }
  function D(t) {
    return t instanceof Document;
  }
  function H(t) {
    return typeof t == "object" && t !== null && !Array.isArray(t);
  }
  function I(t) {
    if (!H(t) || x(t)) return !1;
    const e = Object.getPrototypeOf(t);
    return e === null || e === Object.prototype;
  }
  function q(t) {
    if (f(t)) return !0;
    if (!t || typeof t != "object" || x(t)) return !1;
    const e = t.length;
    return e === 0 ? !0 : typeof e == "number" && e > 0 && e - 1 in t;
  }
  function Y(t) {
    const e = [];
    for (let i = 0; i < t.length; i++) {
      const o = t[i];
      o != null && e.push(o);
    }
    return e;
  }
  function V(t) {
    if (!t || t.length === 0) return [];
    const e = [];
    for (let i = 0; i < t.length; i++) {
      const o = t[i];
      if (f(o))
        for (let s = 0; s < o.length; s++) e.push(o[s]);
      else if (r.isZ(o)) {
        const s = o;
        for (let c = 0; c < s.length; c++) e.push(s[c]);
      } else
        e.push(o);
    }
    return e;
  }
  function $(t) {
    return t.replace(
      /-+(.)?/g,
      (e, i) => i ? i.toUpperCase() : ""
    );
  }
  const X = /* @__PURE__ */ new Map();
  function nt(t) {
    let e = X.get(t);
    return e === void 0 && (e = $(t), X.set(t, e)), e;
  }
  function wt(t) {
    return t && t.replace(L, "/").replace(S, "$1_$2").replace(P, "$1_$2").replace(k, "-").toLowerCase();
  }
  const rt = /* @__PURE__ */ new Map();
  function et(t) {
    let e = rt.get(t);
    return e === void 0 && (e = wt(t), rt.set(t, e)), e;
  }
  const mt = function(t) {
    if (!t || t.length === 0) return [];
    const e = /* @__PURE__ */ new Set(), i = [];
    for (let o = 0; o < t.length; o++) {
      const s = t[o];
      e.has(s) || (e.add(s), i.push(s));
    }
    return i;
  };
  function it(t, e) {
    const i = t.split(/\s+/);
    for (let o = 0; o < i.length; o++) {
      const s = i[o];
      s && e(s);
    }
  }
  function st(t, e) {
    return typeof e == "number" && !M[et(t)] ? e + "px" : e;
  }
  function ft(t) {
    let e = j.get(t);
    if (e === void 0) {
      const i = v.createElement(t);
      v.body.appendChild(i), e = getComputedStyle(i, "").getPropertyValue("display");
      const o = i.parentNode;
      o && o.removeChild(i), e === "none" && (e = "block"), j.set(t, e);
    }
    return e;
  }
  function ut(t, e) {
    t.innerHTML = e;
  }
  function ct(t) {
    const e = t !== void 0 && t in W ? t : "*";
    return W[e];
  }
  function ht(t) {
    return t instanceof Element ? C.call(t.children) : [];
  }
  const G = function(t, e) {
    const i = t ? t.length : 0;
    for (let o = 0; o < i; o++)
      t && (this[o] = t[o]);
    this.length = i, this.selector = e || "";
  };
  r.fragment = function(t, e, i) {
    let o, s = t, c = e;
    const m = a.exec(s);
    if (m)
      o = [v.createElement(m[1])];
    else {
      if (s = s.replace(h, "<$1></$2>"), c === void 0) {
        const R = p.exec(s);
        c = R ? R[1] : void 0;
      }
      const A = ct(c);
      ut(A, s);
      const O = C.call(A.childNodes);
      o = n.each(O, function() {
        A.removeChild(this);
      });
    }
    if (I(i)) {
      const A = n(o), O = Object.keys(i);
      for (let R = 0; R < O.length; R++) {
        const K = O[R], Q = i[K];
        B.has(K) ? A[K].call(A, Q) : A.attr(K, Q);
      }
    }
    return o;
  }, r.Z = function(t, e) {
    return new G(t, e);
  }, r.isZ = function(t) {
    return t instanceof r.Z;
  }, r.init = function(t, e) {
    let i, o = t;
    if (t)
      if (typeof t == "string") {
        const s = t.trim();
        o = s;
        const c = s[0] === "<" ? p.exec(s) : null;
        if (c)
          i = r.fragment(
            s,
            c[1],
            e
          ), o = null;
        else {
          if (e !== void 0)
            return n(e).find(s);
          i = r.qsa(v, s);
        }
      } else {
        if (b(t))
          return n(v).ready(t);
        if (r.isZ(t))
          return t;
        if (f(t))
          i = Y(t);
        else if (H(t))
          i = [t], o = null;
        else {
          const s = p.exec(String(t));
          if (s)
            i = r.fragment(
              String(t).trim(),
              s[1],
              e
            ), o = null;
          else {
            if (e !== void 0)
              return n(e).find(t);
            i = r.qsa(v, String(t));
          }
        }
      }
    else return r.Z();
    return r.Z(i, o);
  }, n = function(t, e) {
    return r.init(t, e);
  };
  function lt(t, e, i) {
    const o = Object.keys(e);
    for (let s = 0; s < o.length; s++) {
      const c = o[s], m = e[c];
      i && (I(m) || f(m)) ? (I(m) && !I(t[c]) && (t[c] = {}), f(m) && !f(t[c]) && (t[c] = []), lt(t[c], m, i)) : m !== void 0 && (t[c] = m);
    }
  }
  n.extend = function(t, ...e) {
    let i = !1, o;
    return typeof t == "boolean" ? (i = t, o = e.shift()) : o = t, e.forEach((s) => {
      s && lt(o, s, i);
    }), o;
  }, r.qsa = function(t, e) {
    const i = e[0] === "#", o = !i && e[0] === ".", s = i || o ? e.slice(1) : e, c = g.test(s);
    if (i && c && "getElementById" in t) {
      const A = t.getElementById(s);
      return A && t instanceof Element && !t.contains(A) ? [] : A ? [A] : [];
    }
    const m = t.nodeType;
    if (m !== 1 && m !== 9 && m !== 11)
      return [];
    if (c && !i) {
      if (o && "getElementsByClassName" in t) {
        const A = t.getElementsByClassName(s);
        return C.call(A);
      }
      if (!o && "getElementsByTagName" in t) {
        const A = t.getElementsByTagName(e);
        return C.call(A);
      }
    }
    return C.call(t.querySelectorAll(e));
  }, r.getElementsByClassName = function(t, e) {
    const i = e || v;
    if (!("getElementsByClassName" in i)) return n();
    const o = i.getElementsByClassName(t);
    return n(C.call(o));
  }, r.getElementsByTagName = function(t, e) {
    const o = (e || v).getElementsByTagName(t);
    return n(C.call(o));
  }, r.getElementById = function(t, e) {
    const i = e || v;
    if (!("getElementById" in i)) return n();
    const o = i.getElementById(t);
    return o && i instanceof Element && !i.contains(o) ? n() : o ? n([o]) : n();
  }, r.findFast = function(t, e) {
    const i = e || v, o = t.trim();
    if (/^#[\w-]+$/.test(o) && "getElementById" in i) {
      const s = i.getElementById(o.slice(1));
      return s && i instanceof Element && !i.contains(s) ? n() : s ? n([s]) : n();
    }
    if (/^\.[\w-]+$/.test(o) && "getElementsByClassName" in i) {
      const s = i.getElementsByClassName(o.slice(1));
      return n(C.call(s));
    }
    if (/^[a-zA-Z][\w-]*$/.test(o) && "getElementsByTagName" in i) {
      const s = i.getElementsByTagName(o);
      return n(C.call(s));
    }
    return n(C.call(i.querySelectorAll(o)));
  };
  function _(t, e) {
    return e == null ? n(t) : n(t).filter(e);
  }
  n.contains = function(t, e) {
    return t !== e && t.contains(e);
  };
  function U(t, e, i) {
    i == null ? t.removeAttribute(e) : t.setAttribute(e, i);
  }
  function tt(t, e) {
    const i = t == null ? void 0 : t.className, o = !!i && typeof i == "object" && "baseVal" in i;
    if (e === void 0)
      return o ? i.baseVal : i;
    o ? i.baseVal = e : t.className = e;
  }
  function pt(t) {
    if (!t) return t;
    if (t === "true") return !0;
    if (t === "false") return !1;
    if (t === "null") return null;
    const e = +t;
    if ("" + e === t) return e;
    const i = t.charCodeAt(0);
    if (i === 91 || i === 123)
      try {
        return n.parseJSON(t);
      } catch {
        return t;
      }
    return t;
  }
  n.type = l, n.isFunction = b, n.isWindow = x, n.isArray = f, n.isPlainObject = I, n.isEmptyObject = function(t) {
    for (const e in t) return !1;
    return !0;
  }, n.isNumeric = function(t) {
    const e = Number(t), i = typeof t;
    return t != null && i !== "boolean" && (i !== "string" || t.length > 0) && !isNaN(e) && isFinite(e) || !1;
  }, n.inArray = function(t, e, i) {
    return N.indexOf.call(e, t, i);
  }, n.camelCase = nt, n.trim = function(t) {
    return t == null ? "" : String.prototype.trim.call(t);
  }, n.uuid = 0, n.support = {}, n.expr = {}, n.noop = function() {
  }, n.map = function(t, e) {
    const i = [];
    if (q(t))
      for (let o = 0; o < t.length; o++) {
        const s = e(t[o], o);
        s != null && i.push(s);
      }
    else {
      const o = t;
      for (const s in o) {
        const c = e(o[s], s);
        c != null && i.push(c);
      }
    }
    return V(i);
  }, n.each = function(t, e) {
    if (q(t))
      for (let i = 0, o = t.length; i < o; i++) {
        const s = t[i];
        if (e.call(s, i, s) === !1) return t;
      }
    else {
      const i = t;
      for (const o in i) {
        const s = i[o];
        if (e.call(s, o, s) === !1) return t;
      }
    }
    return t;
  }, n.grep = function(t, e) {
    return y.call(t, e);
  }, n.parseJSON = JSON.parse;
  function yt(t) {
    this.scrollTop = t;
  }
  function dt(t) {
    this.scrollTo(this.scrollX, t);
  }
  function bt(t) {
    this.scrollLeft = t;
  }
  function kt(t) {
    this.scrollTo(t, this.scrollY);
  }
  function gt(t, e, i) {
    return t.style[e] || getComputedStyle(t, "").getPropertyValue(i);
  }
  n.fn = {
    constructor: r.Z,
    length: 0,
    // Because a collection acts like an array,
    // copy over these useful native array methods.
    // Explicit functions are used over emptyArray.* to satisfy unbound-method linter rules
    // while preserving the dynamic `this` binding required for array-like operations.
    forEach(t, e) {
      return N.forEach.call(this, t, e);
    },
    reduce(t, e) {
      return arguments.length > 1 ? T.call(this, t, e) : T.call(this, t);
    },
    push(...t) {
      return N.push.apply(this, t);
    },
    sort(t) {
      return N.sort.call(this, t);
    },
    splice(...t) {
      return N.splice.apply(this, t);
    },
    indexOf(t, e) {
      return N.indexOf.call(this, t, e);
    },
    /**
     * Merges the collection with additional elements, arrays, or MeptoCollections.
     * MeptoCollection arguments are flattened to their underlying element arrays
     * before merging, matching `Array.prototype.concat` semantics.
     *
     * @param args - Elements, arrays, or MeptoCollections to concatenate.
     * @returns A new plain array containing all merged elements.
     */
    concat(...t) {
      const e = t.map(
        (i) => r.isZ(i) ? i.toArray() : i
      );
      return N.concat(r.isZ(this) ? this.toArray() : this, ...e);
    },
    // `map` and `slice` follow jQuery conventions, not Array.prototype:
    // - `map` invokes the callback as `(index, element)` with `this` bound to
    //   the element, and excludes null/undefined results from the output.
    // - `slice` wraps the result in a new Mepto collection instead of a plain array.
    map(t) {
      return n(n.map(this, (e, i) => t.call(e, i, e)));
    },
    slice(t, e) {
      return n(C.call(this, t, e));
    },
    /**
     * Executes `callback` when the DOM is ready (DOMContentLoaded).
     * If the DOM is already loaded, the callback is scheduled via `setTimeout`.
     *
     * @param callback - Function receiving the `$` factory.
     * @returns The collection for chaining.
     */
    ready(t) {
      return v.readyState !== "loading" ? setTimeout(() => t(n), 0) : v.addEventListener("DOMContentLoaded", () => t(n), { once: !0 }), this;
    },
    /**
     * Retrieves an element by index, or the entire collection as an array.
     * Negative indices count from the end (`-1` is the last element).
     *
     * @param idx - Zero-based index, or `undefined` for the full array.
     * @returns A single DOM element, or an array of all elements.
     */
    get(t) {
      return t === void 0 ? C.call(this) : this[t >= 0 ? t : t + this.length];
    },
    toArray() {
      return this.get();
    },
    size() {
      return this.length;
    },
    remove() {
      return this.each(function() {
        this.parentNode != null && this.parentNode.removeChild(this);
      });
    },
    /**
     * Iterates over the collection, calling `callback` for each element.
     * Returning `false` from the callback breaks the loop.
     *
     * @param callback - Function called with `(index, element)`, `this` bound to the element.
     * @returns The collection for chaining.
     */
    each(t) {
      for (let e = 0, i = this.length; e < i; e++) {
        const o = this[e];
        if (t.call(o, e, o) === !1) break;
      }
      return this;
    },
    /**
     * Filters the collection by a CSS selector or predicate function.
     * When a function is provided, keeps elements for which it returns `true`.
     * When a string is provided, keeps elements matching the selector.
     *
     * @param selector - CSS selector string or predicate function.
     * @returns A new Mepto collection of matching elements.
     */
    filter(t) {
      if (t == null) return n();
      let e;
      if (b(t))
        e = (o, s) => t.call(o, s, o);
      else if (t[0] === "." && g.test(t.slice(1))) {
        const o = t.slice(1);
        e = (s) => s.classList.contains(o);
      } else if (g.test(t) && /^[a-zA-Z][\w-]*$/.test(t)) {
        const o = t.toUpperCase();
        e = (s) => s.tagName === o;
      } else
        e = (o) => r.matches(o, t);
      const i = [];
      for (let o = 0, s = this.length; o < s; o++) {
        const c = this[o];
        e(c, o) && i.push(c);
      }
      return n(i);
    },
    add(t, e) {
      return n(
        mt(
          this.concat(n(t, e))
        )
      );
    },
    /**
     * Checks whether the first element matches the given CSS selector,
     * or compares `selector` properties when passed a Mepto collection.
     *
     * @param selector - CSS selector string or Mepto collection to compare.
     * @returns `true` if the first element matches.
     */
    is(t) {
      return typeof t == "string" ? this.length > 0 && r.matches(this[0], t) : !!(t && this.selector == t.selector);
    },
    /**
     * Returns a new collection excluding elements matched by the selector,
     * element(s), or predicate function.
     *
     * @param selector - CSS selector string, element(s), or predicate function.
     * @returns A new Mepto collection of non-matching elements.
     */
    not(t) {
      if (b(t)) {
        const s = [];
        for (let c = 0, m = this.length; c < m; c++) {
          const A = this[c];
          t.call(A, c) || s.push(A);
        }
        return n(s);
      }
      const e = typeof t == "string" ? this.filter(t) : q(t) && b(t.item) ? C.call(t) : n(t), i = /* @__PURE__ */ new Set();
      for (let s = 0, c = e.length; s < c; s++)
        i.add(e[s]);
      const o = [];
      for (let s = 0, c = this.length; s < c; s++) {
        const m = this[s];
        i.has(m) || o.push(m);
      }
      return n(o);
    },
    /**
     * Filters elements to those that contain a descendant matching the
     * given selector, or that contain the given DOM node.
     *
     * @param selector - CSS selector string or DOM node.
     * @returns A new Mepto collection of matching elements.
     */
    has(t) {
      return this.filter(function() {
        return H(t) ? n.contains(this, t) : n(this).find(t).length > 0;
      });
    },
    /**
     * Returns the element at the given index as a Mepto collection.
     * Negative indices count from the end.
     *
     * @param idx - Zero-based index (negative counts from end).
     * @returns A new Mepto collection containing the single element.
     */
    eq(t) {
      return t === -1 ? this.slice(t) : this.slice(t, +t + 1);
    },
    first() {
      return n(this[0]);
    },
    last() {
      return n(this[this.length - 1]);
    },
    /**
     * Finds descendant elements matching the given CSS selector,
     * or filters for elements containing the given element(s).
     *
     * @param selector - CSS selector string, element, or array-like of elements.
     * @returns A new Mepto collection of matched descendants.
     */
    find(t) {
      if (!t) return n();
      if (typeof t == "object") {
        const o = n(t), s = [], c = this;
        for (let m = 0, A = o.length; m < A; m++) {
          const O = o[m];
          if (O instanceof Element) {
            for (let R = 0, K = c.length; R < K; R++)
              if (n.contains(c[R], O)) {
                s.push(O);
                break;
              }
          }
        }
        return n(s);
      }
      if (this.length == 1) return n(r.qsa(this[0], t));
      const e = /* @__PURE__ */ new Set(), i = [];
      for (let o = 0, s = this.length; o < s; o++) {
        const c = r.qsa(this[o], t);
        for (let m = 0, A = c.length; m < A; m++) {
          const O = c[m];
          e.has(O) || (e.add(O), i.push(O));
        }
      }
      return n(i);
    },
    /**
     * Traverses ancestors of each element, returning the first that matches
     * `selector`. Stops at `context` or the document root.
     *
     * @param selector - CSS selector string, element, or array-like of elements to match.
     * @param context  - Optional boundary element; traversal stops here.
     * @returns A new Mepto collection of closest matching ancestors.
     */
    closest(t, e) {
      const i = [], o = typeof t == "object" && n(t), s = /* @__PURE__ */ new Set();
      if (o) {
        const c = /* @__PURE__ */ new Set();
        for (let m = 0, A = o.length; m < A; m++) {
          const O = o[m];
          O instanceof Element && c.add(O);
        }
        for (let m = 0, A = this.length; m < A; m++) {
          const O = this[m];
          if (!(O instanceof Element)) continue;
          let R = O;
          for (; R; ) {
            if (c.has(R)) {
              s.has(R) || (s.add(R), i.push(R));
              break;
            }
            if (R === e || D(R)) break;
            R = R.parentNode;
          }
        }
        return n(i);
      }
      for (let c = 0, m = this.length; c < m; c++) {
        const A = this[c];
        if (!(A instanceof Element)) continue;
        const O = A.closest(t);
        O && (!e || e.contains(O)) && !s.has(O) && (s.add(O), i.push(O));
      }
      return n(i);
    },
    /**
     * Like {@link closest}, but returns **only the first match** from the
     * first element in the collection — mirroring the native
     * `Element.closest()` semantics.
     *
     * This is the preferred bridge toward vanilla JS: an LLM or developer
     * reading `singleClosest` knows the result is always either a
     * single-element collection or an empty one.
     *
     * @param selector - CSS selector string to match.
     * @param context  - Optional boundary element; traversal stops here.
     * @returns A Mepto collection containing at most one element.
     */
    singleClosest(t, e) {
      if (this.length === 0) return n();
      const i = this[0];
      if (typeof t == "string") {
        const m = i.closest(t);
        return !m || e && !e.contains(m) ? n() : n(m);
      }
      const o = n(t), s = /* @__PURE__ */ new Set();
      for (let m = 0, A = o.length; m < A; m++) {
        const O = o[m];
        O instanceof Element && s.add(O);
      }
      let c = i;
      for (; c; ) {
        if (c instanceof Element && s.has(c))
          return n(c);
        if (c === e || D(c)) break;
        c = c.parentNode;
      }
      return n();
    },
    parents(t) {
      const e = [], i = /* @__PURE__ */ new Set();
      let o = this;
      for (; o.length > 0; )
        o = n.map(o, (s) => {
          const c = s.parentNode;
          return c && !D(c) && c instanceof Element && !i.has(c) ? (i.add(c), e.push(c), c) : null;
        });
      return _(e, t);
    },
    parent(t) {
      const e = [], i = /* @__PURE__ */ new Set();
      for (let o = 0, s = this.length; o < s; o++) {
        const c = this[o].parentNode;
        c && !i.has(c) && (i.add(c), e.push(c));
      }
      return _(e, t);
    },
    children(t) {
      return _(
        // the map callback returns plain arrays, which $.map flattens
        this.map(function() {
          return ht(this);
        }),
        t
      );
    },
    contents() {
      return this.map(function() {
        return this.contentDocument || C.call(this.childNodes);
      });
    },
    siblings(t) {
      return _(
        this.map((e, i) => {
          const o = i.parentNode;
          if (!o) return [];
          const s = [];
          for (let c = o.firstElementChild; c; c = c.nextElementSibling)
            c !== i && s.push(c);
          return s;
        }),
        t
      );
    },
    empty() {
      return this.each(function() {
        ut(this, "");
      });
    },
    // `pluck` is borrowed from Prototype.js
    pluck(t) {
      return n.map(this, (e) => e[t]);
    },
    show() {
      return this.each(function() {
        this.style.display == "none" && (this.style.display = ""), getComputedStyle(this, "").getPropertyValue("display") == "none" && (this.style.display = ft(this.nodeName));
      });
    },
    /**
     * Replaces each element in the collection with `newContent`.
     *
     * @param newContent - HTML string, element, or Mepto collection to insert.
     * @returns The original (now detached) collection.
     */
    replaceWith(t) {
      return this.before(t).remove();
    },
    /**
     * Wraps `structure` around each element in the collection.
     * `structure` can be an HTML string, DOM element, or a function
     * returning one.
     *
     * @param structure - Wrapper element, HTML string, or function.
     * @returns The original collection for chaining.
     */
    wrap(t) {
      const e = b(t);
      let i, o = !1;
      return this[0] && !e && (i = n(t).get(0), o = !!i && (!!i.parentNode || this.length > 1)), this.each(function(s) {
        const c = e ? t.call(this, s) : o ? i.cloneNode(!0) : i;
        n(this).wrapAll(c);
      });
    },
    /**
     * Wraps `structure` around the entire collection as a single group,
     * inserting it before the first element and moving all elements inside.
     *
     * @param structure - Wrapper element, HTML string, or Mepto collection.
     * @returns The original collection for chaining.
     */
    wrapAll(t) {
      if (!this[0]) return this;
      const e = n(t);
      n(this[0]).before(e);
      let i = e, o = i.children();
      for (; o.length; )
        i = o.first(), o = i.children();
      return n(i).append(this), this;
    },
    /**
     * Wraps the inner contents of each element with `structure`.
     * Pass `null` to skip wrapping.
     *
     * @param structure - Wrapper element, HTML string, or function returning one.
     * @returns The original collection for chaining.
     */
    wrapInner(t) {
      if (t == null) return this;
      const e = b(t);
      return this.each(function(i) {
        const o = n(this), s = o.contents(), c = e ? t.call(this, i) : t;
        s.length ? s.wrapAll(c) : o.append(c);
      });
    },
    unwrap() {
      return this.parent().each(function() {
        n(this).replaceWith(n(this).children());
      }), this;
    },
    clone() {
      return this.map(function() {
        return this.cloneNode(!0);
      });
    },
    hide() {
      return this.css("display", "none");
    },
    toggle(t) {
      return this.each(function() {
        const e = n(this);
        (t === void 0 ? e.css("display") == "none" : t) ? e.show() : e.hide();
      });
    },
    prev(t) {
      return n(this.pluck("previousElementSibling")).filter(t || "*");
    },
    next(t) {
      return n(this.pluck("nextElementSibling")).filter(t || "*");
    },
    /**
     * Gets or sets the `innerHTML` of elements.
     * When called without arguments, returns the HTML of the first element.
     * Accepts a function receiving `(index, currentHtml)`.
     *
     * @param html - HTML string or function returning HTML.
     * @returns HTML string (getter) or the collection (setter).
     */
    html(t) {
      return arguments.length > 0 ? this.each(function(e) {
        const i = this.innerHTML;
        n(this).empty().append(b(t) ? t.call(this, e, i) : t);
      }) : 0 in this ? this[0].innerHTML : null;
    },
    /**
     * Gets or sets the `textContent` of elements.
     * When called without arguments, returns the concatenated text of all elements.
     * Accepts a function receiving `(index, currentText)`.
     *
     * @param text - Text string, number, or function returning text.
     * @returns Text string (getter) or the collection (setter).
     */
    text(t) {
      return arguments.length > 0 ? this.each(function(e) {
        const i = b(t) ? t.call(this, e, this.textContent) : t;
        this.textContent = i == null ? "" : "" + i;
      }) : 0 in this ? this.pluck("textContent").join("") : null;
    },
    /**
     * Gets or sets HTML attributes on elements.
     * - `.attr(name)` — get attribute of first element.
     * - `.attr(name, value)` — set attribute on all elements.
     * - `.attr({ name: value, ... })` — set multiple attributes.
     * - `.attr(name, fn)` — set via function receiving `(index, oldValue)`.
     *
     * @param name  - Attribute name, or object of name/value pairs.
     * @param value - Attribute value, function, or `null` to remove.
     * @returns Attribute value (getter) or the collection (setter).
     */
    attr(t, e) {
      if (typeof t == "string" && arguments.length < 2) {
        if (this.length > 0 && this[0].nodeType === 1) {
          const s = this[0].getAttribute(t);
          return s ?? void 0;
        }
        return;
      }
      const i = H(t), o = b(e);
      for (let s = 0, c = this.length; s < c; s++) {
        const m = this[s];
        if (m.nodeType === 1)
          if (i) {
            const A = t;
            for (const O in A) U(m, O, A[O]);
          } else
            U(m, t, o ? e.call(m, s, m.getAttribute(t)) : e);
      }
      return this;
    },
    /**
     * Removes one or more space-separated attributes from every element.
     *
     * @param name - Space-separated attribute names to remove.
     * @returns The collection for chaining.
     */
    removeAttr(t) {
      const e = t.split(" ");
      return this.each(function() {
        if (this.nodeType === 1)
          for (let i = 0; i < e.length; i++)
            U(this, e[i]);
      });
    },
    /**
     * Gets or sets DOM properties on elements. Normalises property names
     * via `propMap` (e.g. `"for"` → `"htmlFor"`, `"class"` → `"className"`).
     *
     * - `.prop(name)` — get property of first element.
     * - `.prop(name, value)` — set property on all elements.
     * - `.prop({ name: value })` — set multiple properties.
     *
     * @param name  - Property name or object of name/value pairs.
     * @param value - Property value or function receiving `(index, oldValue)`.
     * @returns Property value (getter) or the collection (setter).
     */
    prop(t, e) {
      const i = typeof t == "string" && u[t] || t;
      if (typeof i == "string" && arguments.length < 2)
        return this[0] && this[0][i];
      const o = H(i), s = b(e);
      return this.each(function(c) {
        const m = this;
        if (o) {
          const A = i;
          for (const O in A) m[u[O] || O] = A[O];
        } else {
          const A = i;
          m[A] = s ? e.call(this, c, m[A]) : e;
        }
      });
    },
    /**
     * Deletes a DOM property from every element. Normalises via `propMap`.
     *
     * @param name - Property name to delete.
     * @returns The collection for chaining.
     */
    removeProp(t) {
      const e = u[t] || t;
      return this.each(function() {
        delete this[e];
      });
    },
    /**
     * Reads or writes a `data-*` attribute. The attribute name is
     * dasherized automatically (e.g. `data("myVal")` reads `data-my-val`).
     * Values are deserialized via `deserializeValue`.
     *
     * @param name  - Data key name.
     * @param value - Value to set (omitted for getter).
     * @returns Deserialized value (getter) or the collection (setter).
     */
    data(t, e) {
      const i = "data-" + t.replace(E, "-$1").toLowerCase();
      if (arguments.length > 1)
        return this.attr(i, e);
      const o = this.attr(i);
      return o !== void 0 ? pt(o) : void 0;
    },
    /**
     * Gets or sets the value of form elements.
     * For `<select multiple>`, returns an array of selected values.
     * Accepts a function receiving `(index, currentValue)`.
     *
     * @param value - Value string, array, or function.
     * @returns Value (getter) or the collection (setter).
     */
    val(t) {
      if (arguments.length > 0) {
        const i = t ?? "";
        for (let o = 0, s = this.length; o < s; o++) {
          const c = this[o];
          c.value = b(i) ? i.call(c, o, c.value) : i;
        }
        return this;
      }
      const e = this[0];
      if (e) {
        if (e.multiple) {
          const i = [], o = e.selectedOptions;
          for (let s = 0, c = o.length; s < c; s++)
            i.push(o[s].value);
          return i;
        }
        return e.value;
      }
    },
    /**
     * Gets or sets the position of the first element relative to the document.
     * As a setter, positions elements relative to their offset parent.
     * Accepts a function receiving `(index, currentOffset)`.
     *
     * @param coordinates - `{ top, left }` object or function returning one.
     * @returns Object with `top`, `left`, `width`, `height` (getter) or the collection (setter).
     */
    offset(t) {
      if (t)
        return this.each(function(i) {
          const o = n(this), s = b(t) ? t.call(this, i, o.offset()) : t, c = o.offsetParent().offset(), m = {
            top: s.top - c.top,
            left: s.left - c.left
          };
          o.css("position") == "static" && (m.position = "relative"), o.css(m);
        });
      if (!this.length) return null;
      if (v.documentElement !== this[0] && !n.contains(v.documentElement, this[0]))
        return { top: 0, left: 0 };
      const e = this[0].getBoundingClientRect();
      return {
        left: e.left + window.pageXOffset,
        top: e.top + window.pageYOffset,
        width: Math.round(e.width),
        height: Math.round(e.height)
      };
    },
    /**
     * Gets or sets CSS properties on elements.
     * - `.css(prop)` — get computed value of a single property.
     * - `.css([prop, ...])` — get multiple properties as an object.
     * - `.css(prop, value)` — set a single property (omit value to remove).
     * - `.css({ prop: value })` — set multiple properties.
     *
     * @param property - CSS property name(s) or an object of name/value pairs.
     * @param value    - CSS value, or omitted/`null` to remove the property.
     * @returns CSS value (getter) or the collection (setter).
     */
    css(t, e) {
      if (arguments.length < 2) {
        const c = this[0];
        if (typeof t == "string")
          return c ? c.style[nt(t)] || getComputedStyle(c, "").getPropertyValue(t) : void 0;
        if (f(t)) {
          if (!c) return;
          const m = {}, A = getComputedStyle(c, "");
          return n.each(t, (O, R) => {
            m[R] = c.style[nt(R)] || A.getPropertyValue(R);
          }), m;
        }
      }
      if (l(t) == "string") {
        const c = et(t);
        if (!e && e !== 0)
          return this.each(function() {
            this.style.removeProperty(c);
          });
        const m = String(st(t, e));
        return this.each(function() {
          this.style.setProperty(c, m);
        });
      }
      const i = t, o = [], s = Object.keys(i);
      for (let c = 0; c < s.length; c++) {
        const m = s[c], A = i[m];
        o.push(
          !A && A !== 0 ? [et(m), null] : [et(m), String(st(m, A))]
        );
      }
      return this.each(function() {
        const c = this.style;
        for (let m = 0; m < o.length; m++) {
          const A = o[m];
          A[1] === null ? c.removeProperty(A[0]) : c.setProperty(A[0], A[1]);
        }
      });
    },
    /**
     * Returns the index of the first element among its siblings,
     * or the index of `element` within this collection.
     *
     * @param element - Optional selector or element to locate.
     * @returns Zero-based index.
     */
    index(t) {
      return t ? this.indexOf(n(t)[0]) : this.parent().children().indexOf(this[0]);
    },
    /**
     * Checks whether any element in the collection has the given CSS class.
     * For space-separated names, every listed class must be present.
     *
     * @param name - CSS class name to check for.
     * @returns `true` if at least one element has the class.
     */
    hasClass(t) {
      if (!t) return !1;
      const e = t.split(/\s+/);
      for (let i = 0, o = this.length; i < o; i++) {
        const s = this[i];
        if (!(s instanceof Element)) continue;
        let c = !1, m = !0;
        for (let A = 0; A < e.length; A++) {
          const O = e[A];
          if (O && (c = !0, !s.classList.contains(O))) {
            m = !1;
            break;
          }
        }
        if (c && m) return !0;
      }
      return !1;
    },
    /**
     * Adds one or more CSS classes to every element. Duplicates are skipped.
     * Accepts a function receiving `(index, currentClass)`.
     *
     * @param name - Space-separated class names, or function returning them.
     * @returns The collection for chaining.
     */
    addClass(t) {
      return t ? this.each(function(e) {
        if (!("className" in this)) return;
        const i = b(t) ? t.call(this, e, tt(this) || "") : t, o = this.classList;
        it(i, (s) => {
          o.add(s);
        });
      }) : this;
    },
    /**
     * Removes one or more CSS classes from every element.
     * With no arguments, removes all classes. Accepts a function
     * receiving `(index, currentClass)`.
     *
     * @param name - Space-separated class names, or function returning them.
     * @returns The collection for chaining.
     */
    removeClass(t) {
      return this.each(function(e) {
        if (!("className" in this)) return;
        if (t === void 0) {
          tt(this, "");
          return;
        }
        const i = b(t) ? t.call(this, e, tt(this) || "") : t, o = this.classList;
        it(i, (s) => {
          o.remove(s);
        });
      });
    },
    /**
     * Toggles one or more CSS classes on every element.
     * Pass `true`/`false` as `when` to force add/remove.
     * Accepts a function receiving `(index, currentClass)`.
     *
     * @param name - Space-separated class names, or function returning them.
     * @param when - `true` to add, `false` to remove; omit to toggle.
     * @returns The collection for chaining.
     */
    toggleClass(t, e) {
      return t ? this.each(function(i) {
        if (!("className" in this)) return;
        const o = b(t) ? t.call(this, i, tt(this) || "") : t, s = this.classList;
        it(o, (c) => {
          s.toggle(c, e);
        });
      }) : this;
    },
    /**
     * Gets or sets the vertical scroll position of the first element.
     *
     * @param value - Scroll position in pixels (omit to get).
     * @returns Current scroll position (getter) or the collection (setter).
     */
    scrollTop(t) {
      if (!this.length) return;
      const e = this[0], i = "scrollTop" in e;
      if (t === void 0) return i ? e.scrollTop : e.pageYOffset;
      const o = i ? yt : dt;
      return this.each(function() {
        o.call(this, t);
      });
    },
    /**
     * Gets or sets the horizontal scroll position of the first element.
     *
     * @param value - Scroll position in pixels (omit to get).
     * @returns Current scroll position (getter) or the collection (setter).
     */
    scrollLeft(t) {
      if (!this.length) return;
      const e = this[0], i = "scrollLeft" in e;
      if (t === void 0) return i ? e.scrollLeft : e.pageXOffset;
      const o = i ? bt : kt;
      return this.each(function() {
        o.call(this, t);
      });
    },
    position() {
      if (!this.length) return;
      const t = this[0], e = this.offsetParent(), i = this.offset(), o = d.test(e[0].nodeName) ? { top: 0, left: 0 } : e.offset();
      i.top -= parseFloat(gt(t, "marginTop", "margin-top")) || 0, i.left -= parseFloat(gt(t, "marginLeft", "margin-left")) || 0;
      const s = e[0];
      return o.top += parseFloat(gt(s, "borderTopWidth", "border-top-width")) || 0, o.left += parseFloat(gt(s, "borderLeftWidth", "border-left-width")) || 0, {
        top: i.top - o.top,
        left: i.left - o.left
      };
    },
    offsetParent() {
      return this.map(function() {
        let t = this.offsetParent || v.body;
        for (; t && !d.test(t.nodeName) && gt(t, "position", "position") == "static"; )
          t = t.offsetParent;
        return t;
      });
    }
  }, n.fn.detach = n.fn.remove, Object.defineProperty(n.fn, "classList", {
    get() {
      const t = this;
      return {
        // Tokens are split on whitespace (mirroring addClass/removeClass) so
        // space-separated strings behave like the class helpers instead of
        // throwing, which is what the native DOMTokenList does on ' '.
        add(...e) {
          return t.each(function() {
            const i = this.classList;
            for (const o of e) it(o, (s) => i.add(s));
          });
        },
        remove(...e) {
          return t.each(function() {
            const i = this.classList;
            for (const o of e) it(o, (s) => i.remove(s));
          });
        },
        toggle(e, i) {
          return t.each(function() {
            const o = this.classList;
            it(e, (s) => o.toggle(s, i));
          });
        },
        contains(e) {
          return t.length > 0 && t[0].classList.contains(e);
        },
        replace(e, i) {
          return t.each(function() {
            this.classList.replace(e, i);
          });
        },
        entries() {
          return t.length > 0 ? t[0].classList.entries() : [][Symbol.iterator]();
        },
        forEach(e) {
          t.length > 0 && t[0].classList.forEach(e);
        },
        item(e) {
          return t.length > 0 ? t[0].classList.item(e) : null;
        },
        keys() {
          return t.length > 0 ? t[0].classList.keys() : [][Symbol.iterator]();
        },
        values() {
          return t.length > 0 ? t[0].classList.values() : [][Symbol.iterator]();
        },
        toString() {
          return t.length > 0 ? t[0].classList.toString() : "";
        },
        get length() {
          return t.length > 0 ? t[0].classList.length : 0;
        },
        get value() {
          return t.length > 0 ? t[0].classList.value : "";
        },
        set value(e) {
          t.each(function() {
            this.classList.value = e;
          });
        }
      };
    }
  }), Object.defineProperty(n.fn, "attrs", {
    get() {
      const t = this;
      return {
        get(e) {
          if (t.length > 0 && t[0].nodeType === 1) {
            const i = t[0].getAttribute(e);
            return i ?? void 0;
          }
        },
        set(e, i) {
          return t.each(function() {
            if (this.nodeType === 1)
              if (H(e))
                for (const o in e) U(this, o, e[o]);
              else
                U(this, e, i);
          });
        },
        remove(e) {
          const i = e.split(" ");
          return t.each(function() {
            if (this.nodeType === 1)
              for (let o = 0; o < i.length; o++)
                i[o] && this.removeAttribute(i[o]);
          });
        }
      };
    }
  }), Object.defineProperty(n.fn, "styles", {
    get() {
      const t = this;
      return {
        get(e) {
          if (t.length > 0 && t[0].nodeType === 1) {
            const i = t[0];
            return i.style[nt(e)] || getComputedStyle(i, "").getPropertyValue(e);
          }
        },
        set(e, i) {
          const o = [];
          if (typeof e == "string")
            o.push(
              !i && i !== 0 ? [et(e), null] : [et(e), String(st(e, i))]
            );
          else {
            const s = Object.keys(e);
            for (let c = 0; c < s.length; c++) {
              const m = s[c], A = e[m];
              o.push(
                !A && A !== 0 ? [et(m), null] : [et(m), String(st(m, A))]
              );
            }
          }
          return t.each(function() {
            if (this.nodeType !== 1) return;
            const s = this.style;
            for (let c = 0; c < o.length; c++) {
              const m = o[c];
              m[1] === null ? s.removeProperty(m[0]) : s.setProperty(m[0], m[1]);
            }
          });
        }
      };
    }
  }), ["width", "height"].forEach((t) => {
    const e = t.replace(/./, (i) => i[0].toUpperCase());
    n.fn[t] = function(i) {
      let o, s = this[0];
      return i === void 0 ? x(s) ? s["inner" + e] : D(s) ? s.documentElement["scroll" + e] : (o = this.offset(), (o == null ? void 0 : o[t]) ?? 0) : this.each(function(c) {
        const m = n(this);
        m.css(
          t,
          b(i) ? i.call(this, c, m[t]()) : i
        );
      });
    };
  }), ["width", "height"].forEach((t) => {
    const e = t.replace(/./, (s) => s[0].toUpperCase()), i = "offset" + e, o = t === "width" ? ["marginLeft", "marginRight"] : ["marginTop", "marginBottom"];
    n.fn["outer" + e] = function(s) {
      const c = this[0];
      if ((c == null ? void 0 : c.nodeType) !== 1) return 0;
      let m = c[i];
      if (s) {
        const A = getComputedStyle(c);
        m += parseFloat(A[o[0]]) + parseFloat(A[o[1]]);
      }
      return m;
    };
  });
  function At(t, e) {
    if (!t) return;
    e(t);
    const i = t.childNodes;
    for (let o = 0, s = i.length; o < s; o++)
      At(i[o], e);
  }
  z.forEach((t, e) => {
    const i = e % 2;
    n.fn[t] = function(...o) {
      let s, c = n.map(o, (O) => {
        const R = [];
        return s = l(O), s == "array" ? (O.forEach((K) => {
          if (K.nodeType !== void 0) return R.push(K);
          if (r.isZ(K))
            return R.push(...K.get());
          R.push(...r.fragment(K));
        }), R) : s === "object" || O == null || O.nodeType !== void 0 ? O : r.fragment(O);
      }), m, A = this.length > 1;
      return c.length < 1 ? this : this.each((O, R) => {
        m = i ? R : R.parentNode, R = e == 0 ? R.nextSibling : e == 1 ? R.firstChild : e == 2 ? R : null;
        const K = n.contains(v.documentElement, m);
        c.forEach((Q) => {
          if (A) Q = Q.cloneNode(!0);
          else if (!m) return n(Q).remove();
          m.insertBefore(Q, R), K && At(Q, (xt) => {
            const at = xt;
            if (xt.nodeName === "SCRIPT" && (!at.type || at.type === "text/javascript") && !at.src) {
              const Nt = at.ownerDocument ? at.ownerDocument.defaultView : window;
              Nt.eval.call(Nt, at.innerHTML);
            }
          });
        });
      });
    }, n.fn[i ? t + "To" : "insert" + (e ? "Before" : "After")] = function(o) {
      return n(o)[t](this), this;
    };
  }), r.Z.prototype = G.prototype = n.fn, n.fn.jquery = "3.7.1", r.jquery = "3.7.1";
  const ot = /* @__PURE__ */ new WeakMap();
  function jt(t) {
    let e = ot.get(t);
    return e || (e = /* @__PURE__ */ new Map(), ot.set(t, e)), e;
  }
  n.data = function(t, e, i) {
    if (typeof t == "string" && (t = v.querySelector(t)), !t || !t.nodeType) return;
    if (e === void 0) return ot.get(t);
    if (arguments.length === 3)
      return jt(t).set(e, i), i;
    const o = ot.get(t);
    return o && o.has(e) ? o.get(e) : n(t).data(e);
  }, n.removeData = function(t, e) {
    var i;
    typeof t == "string" && (t = v.querySelector(t)), !(!t || !t.nodeType) && (e === void 0 ? ot.delete(t) : (i = ot.get(t)) == null || i.delete(e));
  }, n.Event = function(t, e) {
    let i;
    if (typeof t == "string")
      i = new CustomEvent(t, { bubbles: !0, cancelable: !0 });
    else {
      const o = t;
      i = new CustomEvent(o.type, {
        bubbles: !0,
        cancelable: !0
      });
      for (const s in o)
        try {
          i[s] = o[s];
        } catch {
        }
    }
    return e && Object.assign(i, e), i;
  };
  const Dt = n.fn.trigger;
  n.fn.trigger = function(t, e) {
    const i = Array.isArray(e) ? e : e !== void 0 ? [e] : [];
    if (typeof t == "string")
      return Dt.call(this, t, ...i);
    const o = t.type;
    return this.each(function() {
      const s = t;
      s.__extra = i, this.dispatchEvent(s);
    });
  }, n.bridget || (n.bridget = function(t, e) {
    const i = e;
    n.fn[t] = function(o, ...s) {
      var c;
      if (typeof o == "string") {
        if (o.charAt(0) === "_")
          return window.console && console.error(t + " has no method " + o), this;
        for (let m = 0; m < this.length; m++) {
          const A = this[m], R = (i.data ? i.data(A) : n.data(A, t)) || ((c = ot.get(A)) == null ? void 0 : c.get(t));
          if (!R) {
            window.console && console.error(t + " not initialized. Cannot call method " + o);
            continue;
          }
          const K = R[o];
          if (!K) {
            window.console && console.error(t + " has no method " + o);
            continue;
          }
          const Q = K.apply(R, s);
          if (Q !== void 0 && Q !== R) return Q;
        }
        return this;
      }
      return this.each(function() {
        var O, R;
        const m = this, A = ((O = ot.get(m)) == null ? void 0 : O.get(t)) || ((R = i.data) == null ? void 0 : R.call(i, m));
        if (A) {
          const K = A;
          K.option && K.option(o);
        } else {
          const K = i, Q = new K(m, o);
          jt(m).set(t, Q);
        }
      });
    };
  }), n.batch = function(t, e) {
    const i = v.createDocumentFragment(), o = Array.isArray(e) ? e : Array.from(e);
    for (let s = 0, c = o.length; s < c; s++) i.appendChild(o[s]);
    t.appendChild(i);
  };
  const vt = [], Tt = [];
  let Et = !1;
  function Ot() {
    Et = !1;
    const t = vt.splice(0, vt.length), e = Tt.splice(0, Tt.length);
    for (let i = 0, o = t.length; i < o; i++) t[i]();
    for (let i = 0, o = e.length; i < o; i++) e[i]();
  }
  function Pt() {
    Et || (Et = !0, requestAnimationFrame(Ot));
  }
  return n.raf = function(t) {
    return requestAnimationFrame(t);
  }, n.measure = function(t) {
    vt.push(t), Pt();
  }, n.mutate = function(t) {
    Tt.push(t), Pt();
  }, r.uniq = mt, r.deserializeValue = pt, n.mepto = r, n;
}(), Ct = window;
Ct.mepto = Lt;
Ct.$ === void 0 && (Ct.$ = Lt);
(function(n) {
  n.Callbacks = function(N) {
    const y = n.extend({}, N);
    let C, T = !1, v = !1, j = 0, M = 0, p = 0, a = [], h = y.once ? void 0 : [];
    const d = function(S) {
      for (C = y.memory && S, T = !0, p = j || 0, j = 0, M = a.length, v = !0; a && p < M; ++p)
        if (a[p].apply(S[0], S[1]) === !1 && y.stopOnFalse) {
          C = !1;
          break;
        }
      v = !1, a && (h ? h.length && d(h.shift()) : C ? a.length = 0 : L.disable());
    }, E = function(S) {
      for (let P = 0; P < S.length; P++) {
        const k = S[P];
        typeof k == "function" ? (!y.unique || !L.has(k)) && a.push(k) : k && typeof k != "string" && k.length && E(k);
      }
    }, L = {
      add: function(...S) {
        if (a) {
          const P = a.length;
          E(S), v ? M = a.length : C && (j = P, d(C));
        }
        return this;
      },
      remove: function(...S) {
        if (a)
          for (let P = 0; P < S.length; P++) {
            const k = S[P];
            let F = 0;
            for (; (F = n.inArray(k, a, F)) > -1; )
              a.splice(F, 1), v && (F <= M && --M, F <= p && --p);
          }
        return this;
      },
      has: function(S) {
        return !!(a && (S ? n.inArray(S, a) > -1 : a.length));
      },
      empty: function() {
        return M = a.length = 0, this;
      },
      disable: function() {
        return a = void 0, h = void 0, C = void 0, this;
      },
      disabled: function() {
        return !a;
      },
      lock: function() {
        return h = void 0, C || L.disable(), this;
      },
      locked: function() {
        return !h;
      },
      fireWith: function(S, P) {
        if (a && (!T || h)) {
          const k = P ? [...P] : [], F = [S, k];
          v ? h.push(F) : d(F);
        }
        return this;
      },
      fire: function(...S) {
        return L.fireWith(this, S);
      },
      fired: function() {
        return !!T;
      }
    };
    return L;
  };
})(mepto);
(function(n) {
  const N = Array.prototype.slice;
  function y(C) {
    const T = [
      [
        "resolve",
        "done",
        n.Callbacks({ once: 1, memory: 1 }),
        "resolved"
      ],
      [
        "reject",
        "fail",
        n.Callbacks({ once: 1, memory: 1 }),
        "rejected"
      ],
      ["notify", "progress", n.Callbacks({ memory: 1 })]
    ];
    let v = "pending";
    const j = {}, M = {
      state: function() {
        return v;
      },
      always: function(...p) {
        return j.done(...p), j.fail(...p), this;
      },
      then: function(p, a, h) {
        const d = [p, a, h];
        return y(function(E) {
          n.each(T, function(L, S) {
            const P = n.isFunction(d[L]) && d[L];
            j[S[1]](function() {
              const k = N.call(arguments), F = P && P.apply(this, k);
              if (F && n.isFunction(F.promise))
                F.promise().done(E.resolve).fail(E.reject).progress(E.notify);
              else {
                const B = this === M ? E.promise() : this, z = P ? [F] : k;
                E[S[0] + "With"](
                  B,
                  z
                );
              }
            });
          });
        }).promise();
      },
      promise: function(p) {
        return p != null ? n.extend(p, M) : M;
      }
    };
    return n.each(T, function(p, a) {
      const h = a[2], d = a[3];
      M[a[1]] = h.add, d && h.add(
        function() {
          v = d;
        },
        T[p ^ 1][2].disable,
        T[2][2].lock
      ), j[a[0]] = function() {
        return j[a[0] + "With"](
          this === j ? M : this,
          arguments
        ), j;
      }, j[a[0] + "With"] = h.fireWith;
    }), M.promise(j), C && C.call(j, j), j;
  }
  n.when = function(...C) {
    const T = C, v = T.length;
    let j = v !== 1 || C[0] && n.isFunction(C[0].promise) ? v : 0;
    const M = j === 1 ? C[0] : y();
    let p = [], a = [], h = [];
    const d = function(E, L, S) {
      return function(P) {
        L[E] = this, S[E] = arguments.length > 1 ? N.call(arguments) : P, S === p ? M.notifyWith(L, S) : --j || M.resolveWith(L, [S]);
      };
    };
    if (v > 1) {
      p = new Array(v), a = new Array(v), h = new Array(v);
      for (let E = 0; E < v; ++E)
        T[E] && n.isFunction(T[E].promise) ? T[E].promise().done(d(E, h, T)).fail(M.reject).progress(d(E, a, p)) : --j;
    }
    return j || M.resolveWith(h, T), M.promise();
  }, n.Deferred = y;
})(mepto);
(function(n) {
  const N = Array.prototype.slice, y = n.isFunction, C = function(g) {
    return typeof g == "string";
  }, T = /* @__PURE__ */ new WeakMap();
  let v = 1;
  const j = /* @__PURE__ */ new WeakMap();
  function M(g) {
    let w = j.get(g);
    return w === void 0 && (w = v++, j.set(g, w)), w;
  }
  const p = { focus: "focusin", blur: "focusout" }, a = { mouseenter: "mouseover", mouseleave: "mouseout" };
  function h(g, w, r, u) {
    const f = T.get(g);
    if (!f || f.length === 0) return [];
    const l = d(w), b = l.ns ? E(l.ns) : null, x = r ? M(r) : null;
    return f.filter(
      (D) => D && (!l.e || D.e === l.e) && (!l.ns || b.test(D.ns)) && (!r || M(D.fn) === x) && (!u || D.sel === u)
    );
  }
  function d(g) {
    const w = ("" + g).split(".");
    return { e: w[0], ns: w.slice(1).sort().join(" ") };
  }
  function E(g) {
    return new RegExp("(?:^| )" + g.replace(" ", " .* ?") + "(?: |$)");
  }
  function L(g) {
    return !!g;
  }
  function S(g) {
    return a[g] || p[g] || g;
  }
  function P(g, w, r, u, f, l, b) {
    let x = T.get(g);
    x || (x = [], T.set(g, x)), (w.match(/\S+/g) || []).forEach((D) => {
      if (D == "ready") {
        n(document).ready(r);
        return;
      }
      const H = d(D), I = {
        e: H.e,
        ns: H.ns,
        fn: r,
        sel: f,
        del: void 0,
        proxy: () => {
        },
        i: x.length
      };
      let q = r;
      I.e in a && (q = function(...V) {
        const X = V[0].relatedTarget;
        if (!X || X !== this && !n.contains(this, X))
          return I.fn.apply(this, V);
      }), I.del = l;
      const Y = l || q;
      I.proxy = (V) => {
        if (V = J(V), V.isImmediatePropagationStopped())
          return;
        V.data = u;
        const $ = V._args, X = Y.apply(g, $ == null ? [V] : [V].concat($));
        return X === !1 && (V.preventDefault(), V.stopPropagation()), X;
      }, x.push(I), "addEventListener" in g && g.addEventListener(S(I.e), I.proxy, L(b));
    });
  }
  function k(g, w, r, u, f) {
    const l = T.get(g);
    if (!l) return;
    ((w || "").match(/\S+/g) || [""]).forEach((x) => {
      h(g, x, r, u).forEach((D) => {
        delete l[D.i], g.removeEventListener(S(D.e), D.proxy, L(f));
      });
    });
  }
  n.event = { add: P, remove: k }, n.proxy = function(g, w, ...r) {
    const u = 2 in arguments ? r : void 0;
    if (y(g)) {
      const f = function() {
        return g.apply(
          w,
          u ? u.concat(N.call(arguments)) : Array.from(arguments)
        );
      };
      return j.set(f, M(g)), f;
    } else if (C(w)) {
      const f = g;
      return u ? n.proxy.apply(
        null,
        [f[w], g].concat(u)
      ) : n.proxy(f[w], g);
    } else
      throw new TypeError("expected function");
  }, n.fn.bind = function(g, w, r) {
    return this.on(g, w, r);
  }, n.fn.unbind = function(g, w) {
    return this.off(g, w);
  }, n.fn.one = function(g, w, r, u, f) {
    return this.on(g, w, r, u, 1);
  };
  const F = function() {
    return !0;
  }, B = function() {
    return !1;
  }, z = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/, Z = {
    preventDefault: "isDefaultPrevented",
    stopImmediatePropagation: "isImmediatePropagationStopped",
    stopPropagation: "isPropagationStopped"
  };
  function J(g, w) {
    const r = g;
    if (w || !r.isDefaultPrevented) {
      w || (w = g);
      const u = w;
      {
        const f = "preventDefault", l = "isDefaultPrevented", b = u[f];
        r[f] = function(...x) {
          return this[l] = F, b ? b.apply(w, x) : void 0;
        }, r[l] = B;
      }
      {
        const f = "stopImmediatePropagation", l = "isImmediatePropagationStopped", b = u[f];
        r[f] = function(...x) {
          return this[l] = F, b ? b.apply(w, x) : void 0;
        }, r[l] = B;
      }
      {
        const f = "stopPropagation", l = "isPropagationStopped", b = u[f];
        r[f] = function(...x) {
          return this[l] = F, b ? b.apply(w, x) : void 0;
        }, r[l] = B;
      }
      w.defaultPrevented && (r.isDefaultPrevented = F);
    }
    return g;
  }
  function W(g) {
    let w;
    const r = {
      originalEvent: g
    };
    for (w in g)
      !z.test(w) && g[w] !== void 0 && (r[w] = g[w]);
    return J(r, g);
  }
  n.fn.delegate = function(g, w, r) {
    return this.on(w, g, r);
  }, n.fn.undelegate = function(g, w, r) {
    return this.off(w, g, r);
  }, n.fn.on = function(g, w, r, u, f) {
    const l = this;
    return g && !C(g) ? (n.each(
      g,
      (b, x) => {
        this.on(b, w, r, x, f);
      }
    ), this) : (!C(w) && !y(u) && u !== !1 && (u = r, r = w, w = void 0), (u === void 0 || r === !1) && (u = r, r = void 0), u === !1 && (u = B), l.each((b, x) => {
      let D, H;
      f && (D = function(...I) {
        const q = I[0];
        return k(x, q.type, u), u.apply(this, I);
      }), w && (H = function(...I) {
        const q = I[0];
        let Y = null;
        const V = q.target;
        if (V) {
          const $ = V.closest !== void 0 ? V : V.parentElement;
          if ($) {
            const X = $.closest(w);
            if (X && X !== x) {
              const nt = x.contains;
              nt && nt.call(x, X) && (Y = X);
            }
          }
        }
        if (Y) {
          const $ = n.extend(W(q), {
            // `currentTarget` is the element where the listener is
            // attached (the parent), not the matched descendant.
            // jQuery semantics: `this` in the handler is the match
            // (the child); `event.currentTarget` is the listener host
            // (the parent). The previous code set currentTarget to
            // `match`, which made the two indistinguishable.
            currentTarget: x,
            liveFired: x
          });
          return (D || u).apply(Y, [$, ...I.slice(1)]);
        }
      }), P(
        x,
        g,
        u,
        r,
        w,
        H || D
      );
    }));
  }, n.fn.off = function(g, w, r) {
    const u = this;
    return g && !C(g) ? (n.each(
      g,
      (f, l) => {
        u.off(f, w, l);
      }
    ), u) : (!C(w) && !y(r) && r !== !1 && (r = w, w = void 0), r === !1 && (r = B), u.each(function() {
      k(
        this,
        g,
        r,
        w
      );
    }));
  }, n.fn.trigger = function(g, w) {
    const r = C(g) || n.isPlainObject(g) ? n.Event(g) : J(g);
    return r._args = w, this.each(function() {
      r.type in p && typeof this[r.type] == "function" ? this[r.type]() : "dispatchEvent" in this ? this.dispatchEvent(r) : n(this).triggerHandler(r, w);
    });
  }, n.fn.triggerHandler = function(g, w) {
    let r, u;
    return this.each((f, l) => {
      r = W(C(g) ? n.Event(g) : g), r._args = w, r.target = l, n.each(
        h(l, g.type || g),
        (b, x) => {
          if (u = x.proxy(r), r.isImmediatePropagationStopped())
            return !1;
        }
      );
    }), u;
  }, "focusin focusout focus blur load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach((g) => {
    const w = n.fn;
    w[g] = function(...r) {
      return r.length > 0 ? this.bind(g, r[0]) : this.trigger(g);
    };
  }), n.Event = function(g, w) {
    C(g) || (w = g, g = w.type);
    let r = !0;
    if (w)
      for (const f in w)
        f === "bubbles" && (r = !!w[f]);
    const u = new Event(g, { bubbles: r, cancelable: !0 });
    if (w)
      for (const f in w)
        f !== "bubbles" && (u[f] = w[f]);
    return J(u);
  };
})(mepto);
(function(n) {
  let N = Date.now(), y = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, C = /^(?:text|application)\/javascript/i, T = /^(?:text|application)\/xml/i, v = "application/json", j = "text/html", M = /^\s*$/;
  function p(r, u, f) {
    const l = n.Event(u);
    return n(r || document).trigger(l, f), !l.isDefaultPrevented();
  }
  function a(r, u, f, l) {
    if (r.global) return p(u || document, f, l);
  }
  n.active = 0;
  function h(r) {
    r.global && n.active++ === 0 && a(r, null, "ajaxStart");
  }
  function d(r) {
    r.global && !--n.active && a(r, null, "ajaxStop");
  }
  function E(r, u) {
    const f = u.context;
    if (u.beforeSend.call(f, r, u) === !1 || a(u, f, "ajaxBeforeSend", [r, u]) === !1)
      return !1;
    a(u, f, "ajaxSend", [r, u]);
  }
  function L(r, u, f, l) {
    const b = f.context, x = "success";
    B(f.success, b, [r, x, u]), l && l.resolveWith(b, [r, x, u]), a(f, b, "ajaxSuccess", [u, f, r]), P(x, u, f);
  }
  function S(r, u, f, l, b) {
    const x = l.context;
    B(l.error, x, [f, u, r]), b && b.rejectWith(x, [f, u, r]), a(l, x, "ajaxError", [f, l, r || u]), P(u, f, l);
  }
  function P(r, u, f) {
    const l = f.context;
    B(f.complete, l, [u, r]), a(f, l, "ajaxComplete", [u, f]), d(f);
  }
  function k(r, u, f) {
    if (f.dataFilter == F) return r;
    const l = f.context;
    return f.dataFilter.call(l, r, u);
  }
  function F() {
  }
  function B(r, u, f) {
    if (typeof r == "function") r.apply(u, f);
    else if (Array.isArray(r))
      for (const l of r) typeof l == "function" && l.apply(u, f);
  }
  n.ajaxJSONP = function(r, u) {
    if (!("type" in r)) return n.ajax(r);
    const f = r.jsonpCallback, l = (n.isFunction(f) ? f() : f) || "mepto" + N++, b = document.createElement("script"), x = function(Y) {
      n(b).triggerHandler("error", Y || "abort");
    }, D = { abort: x };
    let H = window[l], I, q;
    return u && u.promise(D), n(b).on("load error", (Y, V) => {
      clearTimeout(q), n(b).off().remove(), Y.type == "error" || !I ? S(null, V || "error", D, r, u) : L(I[0], D, r, u), window[l] = H, I && H && H(I[0]), H = void 0, I = void 0;
    }), E(D, r) === !1 ? (x("abort"), D) : (window[l] = (...Y) => {
      I = Y;
    }, b.src = r.url.replace(/\?(.+)=\?/, "?$1=" + l), document.head.appendChild(b), r.timeout > 0 && (q = setTimeout(() => {
      x("timeout");
    }, r.timeout)), D);
  }, n.ajaxSettings = {
    // Default type of request
    type: "GET",
    // Callback that is executed before request
    beforeSend: F,
    // Callback that is executed if the request succeeds
    success: F,
    // Callback that is executed the the server drops error
    error: F,
    // Callback that is executed on request complete (both: error and success)
    complete: F,
    // The context for the callbacks
    context: null,
    // Whether to trigger "global" Ajax events
    global: !0,
    // Transport
    xhr: function() {
      return new window.XMLHttpRequest();
    },
    // MIME types mapping
    // IIS returns Javascript as "application/x-javascript"
    accepts: {
      script: "text/javascript, application/javascript, application/x-javascript",
      json: v,
      xml: "application/xml, text/xml",
      html: j,
      text: "text/plain"
    },
    // Whether the request is to another domain
    crossDomain: !1,
    // Default timeout
    timeout: 0,
    // Whether data should be serialized to string
    processData: !0,
    // Whether the browser should be allowed to cache GET responses
    cache: !0,
    //Used to handle the raw response data of XMLHttpRequest.
    //This is a pre-filtering function to sanitize the response.
    //The sanitized response should be returned
    dataFilter: F
  };
  function z(r) {
    let u = r;
    return u && (u = u.split(";", 2)[0]), u && (u == j ? "html" : u == v ? "json" : C.test(u) ? "script" : T.test(u) && "xml") || "text";
  }
  function Z(r, u) {
    return u == "" ? r : (r + "&" + u).replace(/[&?]{1,2}/, "?");
  }
  function J(r) {
    r.processData && r.data && n.type(r.data) != "string" && (r.data = n.param(r.data, r.traditional)), r.data && (!r.type || r.type.toUpperCase() == "GET" || r.dataType == "jsonp") && (r.url = Z(r.url, r.data), r.data = void 0);
  }
  n.ajax = function(r, u) {
    const f = typeof r == "string" ? n.extend({}, u, { url: r }) : r, l = n.extend({}, f || {}), b = n.Deferred();
    let x;
    const D = n.ajaxSettings, H = l, I = D;
    for (const _ in D) H[_] === void 0 && (H[_] = I[_]);
    if (h(l), !l.crossDomain) {
      const _ = new URL(l.url, window.location.href);
      l.crossDomain = window.location.protocol + "//" + window.location.host != _.protocol + "//" + _.host;
    }
    l.url || (l.url = window.location.toString()), (x = l.url.indexOf("#")) > -1 && (l.url = l.url.slice(0, x)), J(l);
    let q = l.dataType;
    const Y = /\?.+=\?/.test(l.url);
    if (Y && (q = "jsonp"), (l.cache === !1 || (!f || f.cache !== !0) && (q == "script" || q == "jsonp")) && (l.url = Z(l.url, "_=" + Date.now())), q == "jsonp")
      return Y || (l.url = Z(
        l.url,
        l.jsonp ? l.jsonp + "=?" : l.jsonp === !1 ? "" : "callback=?"
      )), n.ajaxJSONP(
        l,
        b
      );
    let V = l.accepts[q];
    const $ = {}, X = function(_, U) {
      $[_] = U;
    };
    if (l.crossDomain || X("X-Requested-With", "XMLHttpRequest"), X("Accept", V || "*/*"), (l.contentType || l.contentType !== !1 && l.data && l.type.toUpperCase() != "GET") && X("Content-Type", l.contentType || "application/x-www-form-urlencoded"), l.headers)
      for (const _ in l.headers) X(_, l.headers[_]);
    const nt = /^([\w-]+):\/\//.exec(l.url), wt = nt ? nt[1] : window.location.protocol, rt = new AbortController(), et = (l.type || "GET").toUpperCase(), mt = new Headers($), it = et === "GET" || et === "HEAD" ? void 0 : l.data != null ? String(l.data) : void 0, st = {
      method: et,
      headers: mt,
      body: it,
      signal: rt.signal
    };
    l.xhrFields && l.xhrFields.withCredentials && (st.credentials = "include");
    let ft = 0, ut = "", ct = "";
    const ht = /* @__PURE__ */ new Map(), G = {
      get readyState() {
        return ft !== 0 || ct ? 4 : 0;
      },
      get status() {
        return ft;
      },
      get statusText() {
        return ut;
      },
      get responseText() {
        return ct;
      },
      getResponseHeader(_) {
        return ht.get(_.toLowerCase()) || null;
      },
      getAllResponseHeaders() {
        let _ = "";
        return ht.forEach((U, tt) => {
          _ += `${tt}: ${U}\r
`;
        }), _;
      },
      abort() {
        rt.abort();
      },
      setRequestHeader() {
      }
    };
    b && b.promise(G);
    let lt;
    return E(G, l) === !1 ? (rt.abort(), S(null, "abort", G, l, b), G) : (l.timeout > 0 && (lt = setTimeout(() => {
      rt.abort(), S(null, "timeout", G, l, b);
    }, l.timeout)), fetch(l.url, st).then(async (_) => {
      var yt;
      clearTimeout(lt), ft = _.status, ut = _.statusText, _.headers.forEach((dt, bt) => ht.set(bt.toLowerCase(), dt));
      let U, tt = q;
      tt = tt || z(_.headers.get("content-type"));
      const pt = (yt = l.xhrFields) == null ? void 0 : yt.responseType;
      if (pt === "arraybuffer") U = await _.arrayBuffer();
      else if (pt === "blob") U = await _.blob();
      else {
        ct = await _.text(), U = ct;
        try {
          U = k(U, tt, l), tt === "script" ? (0, eval)(U) : tt === "xml" ? U = new DOMParser().parseFromString(U, "application/xml") : tt === "json" && (U = M.test(U) ? null : n.parseJSON(U));
        } catch (dt) {
          S(dt, "parsererror", G, l, b);
          return;
        }
      }
      _.ok || _.status === 304 || _.status === 0 && wt === "file:" ? L(U, G, l, b) : S(
        _.statusText || null,
        _.status ? "error" : "abort",
        G,
        l,
        b
      );
    }).catch((_) => {
      clearTimeout(lt), _.name === "AbortError" ? S(null, "abort", G, l, b) : S(_, "error", G, l, b);
    }), G);
  };
  function W(r, u, f, l) {
    let b = u, x = f, D = l;
    return n.isFunction(b) && (D = x, x = b, b = void 0), n.isFunction(x) || (D = x, x = void 0), {
      url: r,
      data: b,
      success: x,
      dataType: D
    };
  }
  n.get = function(r, u, f, l) {
    return n.ajax(W(r, u, f, l));
  }, n.post = function(r, u, f, l) {
    const b = W(r, u, f, l);
    return b.type = "POST", n.ajax(b);
  }, n.getJSON = function(r, u, f) {
    const l = W(r, u, f);
    return l.dataType = "json", n.ajax(l);
  }, n.fn.load = function(r, u, f) {
    if (!this.length) return this;
    const l = this, b = r.split(/\s/), x = W(r, u, f), D = x.success;
    let H;
    return b.length > 1 && (x.url = b[0], H = b[1]), x.success = function(I) {
      l.html(
        H ? n("<div>").html(I.replace(y, "")).find(H) : I
      ), D && D.apply(l, arguments);
    }, n.ajax(x), this;
  };
  const g = encodeURIComponent;
  function w(r, u, f, l) {
    const b = n.isArray(u), x = n.isPlainObject(u);
    let D;
    n.each(u, (H, I) => {
      D = n.type(I);
      let q = String(H);
      l && (q = f ? l : l + "[" + (x || D == "object" || D == "array" ? H : "") + "]"), !l && b ? r.add(I.name, I.value) : D == "array" || !f && D == "object" ? w(r, I, f, q) : r.add(q, I);
    });
  }
  n.param = function(r, u) {
    const f = [];
    return f.add = function(l, b) {
      let x = b;
      n.isFunction(x) && (x = x()), x == null && (x = ""), this.push(g(l) + "=" + g(x));
    }, w(f, r, u, void 0), f.join("&").replace(/%20/g, "+");
  };
})(mepto);
(function(n) {
  n.fn.serializeArray = function() {
    const N = [];
    let y = "", C = "";
    const T = function(v) {
      if (Array.isArray(v)) {
        v.forEach((j) => T(j));
        return;
      }
      N.push({ name: y, value: v });
    };
    if (this[0]) {
      const v = this[0];
      n.each(Array.from(v.elements), function(j, M) {
        const p = M;
        y = p.name, C = p.type, y && p.nodeName.toLowerCase() != "fieldset" && !p.disabled && C != "submit" && C != "reset" && C != "button" && C != "file" && (C != "radio" && C != "checkbox" || p.checked) && T(n(p).val());
      });
    }
    return N;
  }, n.fn.serialize = function() {
    const N = [];
    return this.serializeArray().forEach(function(y) {
      N.push(encodeURIComponent(y.name) + "=" + encodeURIComponent(y.value));
    }), N.join("&");
  }, n.fn.submit = function(N) {
    if (N !== void 0)
      this.bind("submit", N);
    else if (this.length) {
      const y = n.Event("submit");
      this.eq(0).trigger(y);
      const C = this.get(0);
      y.isDefaultPrevented() || C.submit();
    }
    return this;
  };
})(mepto);
(function(n) {
  function N(y, C) {
    const T = this.os = {}, v = this.browser = {}, j = y.match(/Web[kK]it[/]{0,1}([\d.]+)/), M = y.match(/(Android);?[\s/]+([\d.]+)?/), p = !!y.match(/\(Macintosh; Intel /), a = y.match(/(iPad).*OS\s([\d_]+)/), h = y.match(/(iPod)(.*OS\s([\d_]+))?/), d = a ? null : y.match(/(iPhone\sOS)\s([\d_]+)/), E = /Win\d{2}|Windows/.test(C), L = y.match(/Windows Phone ([\d.]+)/), S = y.match(/Chrome\/([\d.]+)/) ?? y.match(/CriOS\/([\d.]+)/), P = y.match(/Firefox\/([\d.]+)/), k = S ? null : y.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/), F = k ?? y.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/);
    (v.webkit = !!j) && (v.version = j[1]), M && (T.android = !0, T.version = M[2]), d && !h && (T.ios = T.iphone = !0, T.version = d[2].replace(/_/g, ".")), a && (T.ios = T.ipad = !0, T.version = a[2].replace(/_/g, ".")), h && (T.ios = T.ipod = !0, T.version = h[3] ? h[3].replace(/_/g, ".") : void 0), L && (T.wp = !0, T.version = L[1]), S && (v.chrome = !0, v.version = S[1]), P && (v.firefox = !0, v.version = P[1]), F && (p || T.ios || E) && (v.safari = !0, T.ios || (v.version = F[1])), k && (v.webview = !0), T.tablet = !!(a || M && !y.match(/Mobile/) || P && y.match(/Tablet/)), T.phone = !!(!T.tablet && !T.ipod && (M || d || S && y.match(/Android/) || S && y.match(/CriOS\/([\d.]+)/) || P && y.match(/Mobile/)));
  }
  N.call(n, navigator.userAgent, navigator.platform);
})(mepto);
(function(n) {
  const N = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i, y = "transform", C = "transition-property", T = "transition-duration", v = "transition-delay", j = "transition-timing-function", M = "animation-name", p = "animation-duration", a = "animation-delay", h = "animation-timing-function", d = {
    "transition-property": "",
    "transition-duration": "",
    "transition-delay": "",
    "transition-timing-function": "",
    "animation-name": "",
    "animation-duration": "",
    "animation-delay": "",
    "animation-timing-function": ""
  };
  function E(S) {
    return S.replace(/([A-Z])/g, "-$1").toLowerCase();
  }
  n.fx = {
    off: !1,
    speeds: { _default: 400, fast: 200, slow: 600 },
    cssPrefix: "",
    transitionEnd: "transitionend",
    animationEnd: "animationend"
  };
  const L = n.fn;
  L.animate = function(S, P, k, F, B) {
    if (n.isFunction(P) && !F && (F = P, k = void 0, P = void 0), n.isFunction(k) && !F && (F = k, k = void 0), n.isPlainObject(P)) {
      const z = P;
      k = z.easing, F = z.complete, B = z.delay, P = z.duration;
    }
    return P && (P = (typeof P == "number" ? P : n.fx.speeds[P] || n.fx.speeds._default) / 1e3), B && (B = parseFloat(B) / 1e3), this.anim(
      S,
      P,
      k,
      F,
      B
    );
  }, L.anim = function(S, P, k, F, B) {
    let z;
    const Z = {};
    let J, W = "";
    const g = this;
    let w, r = n.fx.transitionEnd, u = !1;
    if (P === void 0 && (P = n.fx.speeds._default / 1e3), B === void 0 && (B = 0), n.fx.off && (P = 0), typeof S == "string")
      Z[M] = S, Z[p] = P + "s", Z[a] = B + "s", Z[h] = k || "linear", r = n.fx.animationEnd;
    else {
      J = [];
      for (z in S)
        N.test(z) ? W += z + "(" + S[z] + ") " : (Z[z] = S[z], J.push(E(z)));
      W && (Z[y] = W, J.push(y)), P > 0 && typeof S == "object" && (Z[C] = J.join(", "), Z[T] = P + "s", Z[v] = B + "s", Z[j] = k || "linear");
    }
    w = function(l) {
      if (typeof l < "u") {
        if (l.target !== l.currentTarget) return;
        n(l.target).unbind(r, w);
      } else n(this).unbind(r, w);
      u = !0, n(this).css(d), F && F.call(this);
    }, P > 0 && (this.bind(r, w), setTimeout(
      function() {
        u || w.call(g);
      },
      (P + B) * 1e3 + 25
    ));
    const f = this.get(0);
    return this.size() && f && f.clientLeft, this.css(Z), P <= 0 && setTimeout(function() {
      g.each(function() {
        w.call(this);
      });
    }, 0), this;
  };
})(mepto);
(function(n) {
  const N = n.fn.show, y = n.fn.hide, C = n.fn.toggle;
  function T(p, a, h, d, E) {
    typeof a == "function" && !E && (E = a, a = void 0);
    const L = { opacity: h };
    return d && (L.scale = d, p.css("transform-origin", "0 0")), p.animate(
      L,
      a,
      void 0,
      E
    );
  }
  function v(p, a, h, d) {
    return T(p, a, 0, h, function() {
      y.call(n(this)), d && d.call(this);
    });
  }
  const j = n.fn;
  j.show = function(p, a) {
    return N.call(this), p === void 0 ? p = 0 : this.css("opacity", 0), T(this, p, 1, "1,1", a);
  }, j.hide = function(p, a) {
    return p === void 0 ? y.call(this) : v(this, p, "0,0", a);
  }, j.toggle = function(p, a) {
    return p === void 0 || typeof p == "boolean" ? C.call(this, p) : this.each(function() {
      const h = n(this), d = h.css("display") == "none" ? "show" : "hide";
      h[d].call(h, p, a);
    });
  }, j.fadeTo = function(p, a, h) {
    return T(this, p, a, null, h);
  };
  function M(p, a) {
    return typeof p == "function" && a === void 0 ? { speed: void 0, callback: p } : { speed: p, callback: a };
  }
  j.fadeIn = function(p, a) {
    const h = M(p, a);
    let d = this.css("opacity");
    return Number(d) > 0 ? this.css("opacity", 0) : d = 1, N.call(this).fadeTo(
      h.speed,
      d,
      h.callback
    );
  }, j.fadeOut = function(p, a) {
    const h = M(p, a);
    return v(this, h.speed, null, h.callback);
  }, j.fadeToggle = function(p, a) {
    return this.each(function() {
      const h = n(this), d = Number(h.css("opacity")) == 0 || h.css("display") == "none" ? "fadeIn" : "fadeOut";
      h[d].call(h, p, a);
    });
  };
})(mepto);
(function(n) {
  const N = /* @__PURE__ */ new WeakMap(), y = n.fn.data, C = n.camelCase;
  function T(p, a) {
    const h = N.get(p);
    if (a === void 0) return h || v(p);
    if (h) {
      if (a in h) return h[a];
      const d = C(a);
      if (d in h) return h[d];
    }
    return y.call(n(p), a);
  }
  function v(p, a, h) {
    let d = N.get(p);
    return d || (d = M(p), N.set(p, d)), a !== void 0 && (d[C(a)] = h), d;
  }
  const j = n.mepto;
  function M(p) {
    const a = {}, h = p.attributes;
    if (!h) return a;
    for (let d = 0; d < h.length; d++) {
      const E = h[d];
      E.name.indexOf("data-") === 0 && (a[C(E.name.replace("data-", ""))] = j.deserializeValue(E.value));
    }
    return a;
  }
  n.fn.data = function(p, a) {
    return a === void 0 ? n.isPlainObject(p) ? this.each(function(h, d) {
      n.each(p, function(E, L) {
        v(d, E, L);
      });
    }) : 0 in this ? T(this[0], p) : void 0 : this.each(function(h, d) {
      v(d, p, a);
    });
  }, n.data = function(p, a, h) {
    return n(p).data(a, h);
  }, n.hasData = function(p) {
    const a = N.get(p);
    return a ? !n.isEmptyObject(a) : !1;
  }, n.fn.removeData = function(p) {
    return typeof p == "string" && (p = p.split(/\s+/)), this.each(function(a, h) {
      const d = N.get(h);
      d && (p ? p.forEach(function(E) {
        delete d[C(E)];
      }) : N.delete(h));
    });
  }, ["remove", "empty"].forEach(function(p) {
    const a = n.fn[p];
    n.fn[p] = function() {
      let h = this.find("*");
      return p === "remove" && (h = h.add(this)), h.removeData(), h.off(), a.call(this);
    };
  });
})(mepto);
(function(n) {
  const N = n.mepto, y = N.qsa, C = N.matches;
  function T(a) {
    const h = n(a);
    return !!(h.width() || h.height()) && h.css("display") !== "none";
  }
  const v = {
    visible: function() {
      if (T(this)) return this;
    },
    hidden: function() {
      if (!T(this)) return this;
    },
    selected: function() {
      if (this.selected) return this;
    },
    checked: function() {
      if (this.checked) return this;
    },
    parent: function() {
      return this.parentNode;
    },
    first: function(a) {
      if (a === 0) return this;
    },
    last: function(a, h) {
      if (a === h.length - 1) return this;
    },
    eq: function(a, h, d) {
      if (typeof d == "number" && a === d) return this;
    },
    contains: function(a, h, d) {
      if (typeof d == "string" && n(this).text().indexOf(d) > -1) return this;
    },
    has: function(a, h, d) {
      if (typeof d == "string" && N.qsa(this, d).length) return this;
    }
  };
  n.expr[":"] = v;
  const j = /^(.*):(\w+)(?:\(([^)]+)\))?\s*$/, M = /^\s*>/;
  function p(a, h) {
    if (a.indexOf(":") === -1)
      return h(a, null, void 0);
    let d, E;
    const L = j.exec(a);
    if (L && L[2] in v && (d = v[L[2]], E = L[3], a = L[1], E)) {
      const S = Number(E);
      isNaN(S) ? E = E.replace(/^["']|["']$/g, "") : E = S;
    }
    return h(a, d || null, E);
  }
  N.qsa = function(a, h) {
    return p(
      h,
      function(d, E, L) {
        let S, P = d;
        try {
          !P && E ? P = "*" : M.test(P) && (P = ":scope " + P), S = y(a, P);
        } catch (k) {
          throw console.error("error performing selector: %o", h), k;
        }
        return E ? N.uniq(
          n.map(S, function(k, F) {
            return E.call(k, F, S, L) || null;
          })
        ) : S;
      }
    );
  }, N.matches = function(a, h) {
    return p(
      h,
      function(d, E, L) {
        if (d)
          try {
            if (!C(a, d)) return !1;
          } catch {
            return !1;
          }
        if (!E) return !0;
        const S = a.parentNode;
        if (!S) return !1;
        const P = d ? y(S, d) : Array.from(S.children), k = P.indexOf(a);
        return k < 0 ? !1 : E.call(a, k, P, L) === a;
      }
    );
  };
})(mepto);
(function(n) {
  n.fn.end = function() {
    return this.prevObject || n();
  };
  const N = [
    "filter",
    "add",
    "not",
    "eq",
    "first",
    "last",
    "find",
    "closest",
    "parents",
    "parent",
    "children",
    "siblings"
  ], y = n.fn;
  N.forEach((C) => {
    const T = y[C];
    y[C] = function(...v) {
      const j = T.apply(this, v);
      return j.prevObject = this, j;
    };
  });
})(mepto);
(function(n) {
  let y = {}, C = null, T = null, v = null, j = null, M, p, a, h = !1, d = !1, E = !1;
  function L(W, g, w, r) {
    return Math.abs(W - g) >= Math.abs(w - r) ? W - g > 0 ? "Left" : "Right" : w - r > 0 ? "Up" : "Down";
  }
  function S() {
    j = null, y.last && (y.el.trigger("longTap"), y = {});
  }
  function P() {
    j && clearTimeout(j), j = null;
  }
  function k() {
    C && clearTimeout(C), T && clearTimeout(T), v && clearTimeout(v), j && clearTimeout(j), C = T = v = j = null, E = !0, y = {};
  }
  function F(W) {
    return W.pointerType == "touch" && W.isPrimary;
  }
  function B(W, g) {
    return W.type == "pointer" + g;
  }
  function z() {
    d && h && (n(document).off(h.down, M).off(h.up, p).off(h.move, a).off(h.cancel, k), n(window).off("scroll", k), k(), d = !1);
  }
  function Z(W) {
    let g = 0, w = 0, r = 0, u = 0, f, l = !1;
    z(), h = W && "down" in W ? W : "ontouchstart" in document ? { down: "touchstart", up: "touchend", move: "touchmove", cancel: "touchcancel" } : "onpointerdown" in document ? { down: "pointerdown", up: "pointerup", move: "pointermove", cancel: "pointercancel" } : !1, h && (M = (b) => {
      const x = B(b, "down");
      l = x, !(x && !F(b)) && (f = x ? b : b.touches[0], b.touches && b.touches.length === 1 && y.x2 && (y.x2 = void 0, y.y2 = void 0), g = Date.now(), w = g - (y.last || g), y.el = n(
        "tagName" in f.target ? f.target : f.target.parentNode
      ), C && clearTimeout(C), y.x1 = f.pageX, y.y1 = f.pageY, w > 0 && w <= 250 && (y.isDoubleTap = !0), y.last = g, j = setTimeout(S, 750));
    }, a = (b) => {
      const x = B(b, "move");
      l = x, !(x && !F(b)) && (f = x ? b : b.touches[0], P(), y.x2 = f.pageX, y.y2 = f.pageY, r += Math.abs(y.x1 - y.x2), u += Math.abs(y.y1 - y.y2));
    }, p = (b) => {
      const x = B(b, "up");
      if (l = x, !(x && !F(b))) {
        if (P(), E = !1, y.x2 && Math.abs(y.x1 - y.x2) > 30 || y.y2 && Math.abs(y.y1 - y.y2) > 30) {
          const D = y.el, H = y.x1, I = y.y1, q = y.x2, Y = y.y2;
          v = setTimeout(() => {
            !E && D && (D.trigger("swipe"), D.trigger("swipe" + L(H, q, I, Y))), y = {};
          }, 0);
        } else "last" in y && (r < 30 && u < 30 ? T = setTimeout(() => {
          const D = n.Event("tap");
          D.cancelTouch = k, y.el && y.el.trigger(D), y.isDoubleTap ? (y.el && y.el.trigger("doubleTap"), y = {}) : C = setTimeout(() => {
            C = null, y.el && y.el.trigger("singleTap"), y = {};
          }, 250);
        }, 0) : y = {});
        r = u = 0;
      }
    }, n(document).on(h.up, p).on(h.down, M).on(h.move, a), n(document).on(h.cancel, k), n(window).on("scroll", k), d = !0);
  }
  const J = n.fn;
  [
    "swipe",
    "swipeLeft",
    "swipeRight",
    "swipeUp",
    "swipeDown",
    "doubleTap",
    "tap",
    "singleTap",
    "longTap"
  ].forEach((W) => {
    J[W] = function(g) {
      return this.on(W, g);
    };
  }), n.touch = { setup: Z }, n(document).ready(Z);
})(mepto);
(function(n) {
  if (n.os.ios) {
    let N = {};
    const y = (T) => "tagName" in T ? T : T.parentNode;
    n(document).bind("gesturestart", (T) => {
      const v = Date.now(), j = v - (N.last || v);
      N.target = y(T.target), N.e1 = T.scale, N.last = v;
    }).bind("gesturechange", (T) => {
      N.e2 = T.scale;
    }).bind("gestureend", (T) => {
      N.e2 > 0 ? (Math.abs(N.e1 - N.e2) !== 0 && (n(N.target).trigger("pinch"), n(N.target).trigger("pinch" + (N.e1 - N.e2 > 0 ? "In" : "Out"))), N.e1 = N.e2 = N.last = 0) : "last" in N && (N = {});
    });
    const C = n.fn;
    ["pinch", "pinchIn", "pinchOut"].forEach((T) => {
      C[T] = function(v) {
        return this.bind(T, v);
      };
    });
  }
})(mepto);
(function(n) {
  const v = {
    backspace: 8,
    tab: 9,
    enter: 13,
    shift: 16,
    ctrl: 17,
    control: 17,
    alt: 18,
    capslock: 20,
    escape: 27,
    esc: 27,
    space: 32,
    " ": 32,
    pageup: 33,
    pagedown: 34,
    end: 35,
    home: 36,
    arrowleft: 37,
    arrowup: 38,
    arrowright: 39,
    arrowdown: 40,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    insert: 45,
    delete: 46,
    meta: 91,
    cmd: 91,
    command: 91,
    f1: 112,
    f2: 113,
    f3: 114,
    f4: 115,
    f5: 116,
    f6: 117,
    f7: 118,
    f8: 119,
    f9: 120,
    f10: 121,
    f11: 122,
    f12: 123
  };
  function j(d) {
    if (!d) return 0;
    const E = d.toLowerCase();
    return v[E] !== void 0 ? v[E] : d.length === 1 ? d.toUpperCase().charCodeAt(0) : 0;
  }
  function M(d) {
    let E = 0;
    d.ctrlKey && (E |= 1024), d.altKey && (E |= 2048), d.shiftKey && (E |= 4096), d.metaKey && (E |= 8192);
    const L = d.keyCode || d.which || j(d.key || "");
    return E | L & 255;
  }
  function p(d) {
    if (!d || typeof d != "string") return 0;
    const E = d.split(/[+-]/).map((B) => B.trim()).filter(Boolean);
    if (E.length === 0) return 0;
    let L = 0, S = "";
    const P = typeof navigator < "u" && /Mac|iPhone|iPad/.test(navigator.platform || "");
    for (let B = 0; B < E.length; B++) {
      const z = E[B].toLowerCase();
      if (z === "ctrl" || z === "control") L |= 1024;
      else if (z === "alt" || z === "option") L |= 2048;
      else if (z === "shift") L |= 4096;
      else if (z === "meta" || z === "cmd" || z === "command" || z === "win" || z === "super")
        L |= 8192;
      else if (z === "mod" || z === "$mod") L |= P ? 8192 : 1024;
      else {
        S = E.slice(B).join("+");
        break;
      }
    }
    !S && E.length === 1 && (S = E[0]);
    const k = S.replace(/\+/g, ""), F = j(k) || j(S);
    return L | F & 255;
  }
  function a(d) {
    return !!(d.repeat || d.isComposing || d.keyCode === 229 || d.key === "Process" || d.key === "Dead");
  }
  const h = {
    CTRL: 1024,
    ALT: 2048,
    SHIFT: 4096,
    META: 8192,
    CMD: 8192,
    encode: M,
    parse: p,
    shouldIgnore: a,
    keyToCode: j
  };
  n.hotkey = h, n.key = h, globalThis.__mepto_hotkey = h;
})(mepto);
/**
 * Mepto - Modern TypeScript fork of Zepto.js
 * A minimalist jQuery-compatible library for modern browsers
 *
 * @version 2.0.0
 * @license MIT
 */
const St = window.mepto, Mt = St;
if (typeof window < "u") {
  const n = window;
  n.Mepto = St, n.$ = St;
}
export {
  Mt as $,
  St as Mepto,
  St as default
};
//# sourceMappingURL=meptos.js.map
