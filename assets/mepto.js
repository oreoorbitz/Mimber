const Ot = function() {
  let n = {};
  const j = [], m = Array.prototype.filter, E = Array.prototype.slice, T = Array.prototype.reduce, w = window.document, N = /* @__PURE__ */ new Map(), F = {
    "column-count": 1,
    columns: 1,
    "font-weight": 1,
    "line-height": 1,
    opacity: 1,
    "z-index": 1,
    zoom: 1
  }, p = /^\s*<(\w+|!)[^>]*>/, a = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, h = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, v = /^(?:body|html)$/i, P = /([A-Z])/g, R = /::/g, C = /([A-Z]+)([A-Z][a-z])/g, A = /([a-z\d])([A-Z])/g, L = /_/g, k = ["val", "css", "html", "text", "data", "width", "height", "offset"], z = new Set(k), H = ["after", "prepend", "before", "append"], Z = w.createElement("table"), J = w.createElement("tr"), B = {
    tr: w.createElement("tbody"),
    tbody: Z,
    thead: Z,
    tfoot: Z,
    td: J,
    th: J,
    "*": w.createElement("div")
  }, d = /^[\w-]*$/, y = Object.prototype.toString, o = {}, f = {
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
  }, u = Array.isArray;
  o.matches = function(t, e) {
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
    const e = typeof t, i = e === "object", s = y.call(t), r = typeof s == "string" ? s.slice(8, -1).toLowerCase() : "object";
    return i ? r : e;
  }
  function b(t) {
    return typeof t == "function";
  }
  function x(t) {
    return t instanceof Window;
  }
  function O(t) {
    return t instanceof Document;
  }
  function W(t) {
    return typeof t == "object" && t !== null && !Array.isArray(t);
  }
  function _(t) {
    if (!W(t) || x(t)) return !1;
    const e = Object.getPrototypeOf(t);
    return e === null || e === Object.prototype;
  }
  function q(t) {
    if (u(t)) return !0;
    if (!t || typeof t != "object" || x(t)) return !1;
    const e = t.length;
    return e === 0 ? !0 : typeof e == "number" && e > 0 && e - 1 in t;
  }
  function Y(t) {
    const e = [];
    for (let i = 0; i < t.length; i++) {
      const s = t[i];
      s != null && e.push(s);
    }
    return e;
  }
  function X(t) {
    if (!t || t.length === 0) return [];
    const e = [];
    for (let i = 0; i < t.length; i++) {
      const s = t[i];
      if (u(s))
        for (let r = 0; r < s.length; r++) e.push(s[r]);
      else if (o.isZ(s)) {
        const r = s;
        for (let c = 0; c < r.length; c++) e.push(r[c]);
      } else
        e.push(s);
    }
    return e;
  }
  function et(t) {
    return t.replace(
      /-+(.)?/g,
      (e, i) => i ? i.toUpperCase() : ""
    );
  }
  const G = /* @__PURE__ */ new Map();
  function st(t) {
    let e = G.get(t);
    return e === void 0 && (e = et(t), G.set(t, e)), e;
  }
  function wt(t) {
    return t && t.replace(R, "/").replace(C, "$1_$2").replace(A, "$1_$2").replace(L, "-").toLowerCase();
  }
  const ot = /* @__PURE__ */ new Map();
  function tt(t) {
    let e = ot.get(t);
    return e === void 0 && (e = wt(t), ot.set(t, e)), e;
  }
  const mt = function(t) {
    if (!t || t.length === 0) return [];
    const e = /* @__PURE__ */ new Set(), i = [];
    for (let s = 0; s < t.length; s++) {
      const r = t[s];
      e.has(r) || (e.add(r), i.push(r));
    }
    return i;
  };
  function nt(t, e) {
    const i = t.split(/\s+/);
    for (let s = 0; s < i.length; s++) {
      const r = i[s];
      r && e(r);
    }
  }
  function rt(t, e) {
    return typeof e == "number" && !F[tt(t)] ? e + "px" : e;
  }
  function ft(t) {
    let e = N.get(t);
    if (e === void 0) {
      const i = w.createElement(t);
      w.body.appendChild(i), e = getComputedStyle(i, "").getPropertyValue("display");
      const s = i.parentNode;
      s && s.removeChild(i), e === "none" && (e = "block"), N.set(t, e);
    }
    return e;
  }
  function ut(t, e) {
    t.innerHTML = e;
  }
  function ct(t) {
    const e = t !== void 0 && t in B ? t : "*";
    return B[e];
  }
  function ht(t) {
    return t instanceof Element ? E.call(t.children) : [];
  }
  const Q = function(t, e) {
    const i = t ? t.length : 0;
    for (let s = 0; s < i; s++)
      t && (this[s] = t[s]);
    this.length = i, this.selector = e || "";
  };
  o.fragment = function(t, e, i) {
    let s, r = t, c = e;
    const g = a.exec(r);
    if (g)
      s = [w.createElement(g[1])];
    else {
      if (r = r.replace(h, "<$1></$2>"), c === void 0) {
        const M = p.exec(r);
        c = M ? M[1] : void 0;
      }
      const S = ct(c);
      ut(S, r);
      const D = E.call(S.childNodes);
      s = n.each(D, function() {
        S.removeChild(this);
      });
    }
    if (_(i)) {
      const S = n(s), D = Object.keys(i);
      for (let M = 0; M < D.length; M++) {
        const U = D[M], K = i[U];
        z.has(U) ? S[U].call(S, K) : S.attr(U, K);
      }
    }
    return s;
  }, o.Z = function(t, e) {
    return new Q(t, e);
  }, o.isZ = function(t) {
    return t instanceof o.Z;
  }, o.init = function(t, e) {
    let i, s = t;
    if (t)
      if (typeof t == "string") {
        const r = t.trim();
        s = r;
        const c = r[0] === "<" ? p.exec(r) : null;
        if (c)
          i = o.fragment(
            r,
            c[1],
            e
          ), s = null;
        else {
          if (e !== void 0)
            return n(e).find(r);
          i = o.qsa(w, r);
        }
      } else {
        if (b(t))
          return n(w).ready(t);
        if (o.isZ(t))
          return t;
        if (u(t))
          i = Y(t);
        else if (W(t))
          i = [t], s = null;
        else {
          const r = p.exec(String(t));
          if (r)
            i = o.fragment(
              String(t).trim(),
              r[1],
              e
            ), s = null;
          else {
            if (e !== void 0)
              return n(e).find(t);
            i = o.qsa(w, String(t));
          }
        }
      }
    else return o.Z();
    return o.Z(i, s);
  }, n = function(t, e) {
    return o.init(t, e);
  };
  function lt(t, e, i) {
    const s = Object.keys(e);
    for (let r = 0; r < s.length; r++) {
      const c = s[r], g = e[c];
      i && (_(g) || u(g)) ? (_(g) && !_(t[c]) && (t[c] = {}), u(g) && !u(t[c]) && (t[c] = []), lt(t[c], g, i)) : g !== void 0 && (t[c] = g);
    }
  }
  n.extend = function(t, ...e) {
    let i = !1, s;
    return typeof t == "boolean" ? (i = t, s = e.shift()) : s = t, e.forEach((r) => {
      r && lt(s, r, i);
    }), s;
  }, o.qsa = function(t, e) {
    const i = e[0] === "#", s = !i && e[0] === ".", r = i || s ? e.slice(1) : e, c = d.test(r);
    if (i && c && "getElementById" in t) {
      const S = t.getElementById(r);
      return S && t instanceof Element && !t.contains(S) ? [] : S ? [S] : [];
    }
    const g = t.nodeType;
    if (g !== 1 && g !== 9 && g !== 11)
      return [];
    if (c && !i) {
      if (s && "getElementsByClassName" in t) {
        const S = t.getElementsByClassName(r);
        return E.call(S);
      }
      if (!s && "getElementsByTagName" in t) {
        const S = t.getElementsByTagName(e);
        return E.call(S);
      }
    }
    return E.call(t.querySelectorAll(e));
  }, o.getElementsByClassName = function(t, e) {
    const i = e || w;
    if (!("getElementsByClassName" in i)) return n();
    const s = i.getElementsByClassName(t);
    return n(E.call(s));
  }, o.getElementsByTagName = function(t, e) {
    const s = (e || w).getElementsByTagName(t);
    return n(E.call(s));
  }, o.getElementById = function(t, e) {
    const i = e || w;
    if (!("getElementById" in i)) return n();
    const s = i.getElementById(t);
    return s && i instanceof Element && !i.contains(s) ? n() : s ? n([s]) : n();
  }, o.findFast = function(t, e) {
    const i = e || w, s = t.trim();
    if (/^#[\w-]+$/.test(s) && "getElementById" in i) {
      const r = i.getElementById(s.slice(1));
      return r && i instanceof Element && !i.contains(r) ? n() : r ? n([r]) : n();
    }
    if (/^\.[\w-]+$/.test(s) && "getElementsByClassName" in i) {
      const r = i.getElementsByClassName(s.slice(1));
      return n(E.call(r));
    }
    if (/^[a-zA-Z][\w-]*$/.test(s) && "getElementsByTagName" in i) {
      const r = i.getElementsByTagName(s);
      return n(E.call(r));
    }
    return n(E.call(i.querySelectorAll(s)));
  };
  function I(t, e) {
    return e == null ? n(t) : n(t).filter(e);
  }
  n.contains = function(t, e) {
    return t !== e && t.contains(e);
  };
  function V(t, e, i) {
    i == null ? t.removeAttribute(e) : t.setAttribute(e, i);
  }
  function $(t, e) {
    const i = t == null ? void 0 : t.className, s = !!i && typeof i == "object" && "baseVal" in i;
    if (e === void 0)
      return s ? i.baseVal : i;
    s ? i.baseVal = e : t.className = e;
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
  n.type = l, n.isFunction = b, n.isWindow = x, n.isArray = u, n.isPlainObject = _, n.isEmptyObject = function(t) {
    for (const e in t) return !1;
    return !0;
  }, n.isNumeric = function(t) {
    const e = Number(t), i = typeof t;
    return t != null && i !== "boolean" && (i !== "string" || t.length > 0) && !isNaN(e) && isFinite(e) || !1;
  }, n.inArray = function(t, e, i) {
    return j.indexOf.call(e, t, i);
  }, n.camelCase = st, n.trim = function(t) {
    return t == null ? "" : String.prototype.trim.call(t);
  }, n.uuid = 0, n.support = {}, n.expr = {}, n.noop = function() {
  }, n.map = function(t, e) {
    const i = [];
    if (q(t))
      for (let s = 0; s < t.length; s++) {
        const r = e(t[s], s);
        r != null && i.push(r);
      }
    else {
      const s = t;
      for (const r in s) {
        const c = e(s[r], r);
        c != null && i.push(c);
      }
    }
    return X(i);
  }, n.each = function(t, e) {
    if (q(t))
      for (let i = 0, s = t.length; i < s; i++) {
        const r = t[i];
        if (e.call(r, i, r) === !1) return t;
      }
    else {
      const i = t;
      for (const s in i) {
        const r = i[s];
        if (e.call(r, s, r) === !1) return t;
      }
    }
    return t;
  }, n.grep = function(t, e) {
    return m.call(t, e);
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
  function Dt(t) {
    this.scrollTo(t, this.scrollY);
  }
  function gt(t, e, i) {
    return t.style[e] || getComputedStyle(t, "").getPropertyValue(i);
  }
  n.fn = {
    constructor: o.Z,
    length: 0,
    // Because a collection acts like an array,
    // copy over these useful native array methods.
    // Explicit functions are used over emptyArray.* to satisfy unbound-method linter rules
    // while preserving the dynamic `this` binding required for array-like operations.
    forEach(t, e) {
      return j.forEach.call(this, t, e);
    },
    reduce(t, e) {
      return arguments.length > 1 ? T.call(this, t, e) : T.call(this, t);
    },
    push(...t) {
      return j.push.apply(this, t);
    },
    sort(t) {
      return j.sort.call(this, t);
    },
    splice(...t) {
      return j.splice.apply(this, t);
    },
    indexOf(t, e) {
      return j.indexOf.call(this, t, e);
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
        (i) => o.isZ(i) ? i.toArray() : i
      );
      return j.concat(o.isZ(this) ? this.toArray() : this, ...e);
    },
    // `map` and `slice` follow jQuery conventions, not Array.prototype:
    // - `map` invokes the callback as `(index, element)` with `this` bound to
    //   the element, and excludes null/undefined results from the output.
    // - `slice` wraps the result in a new Mepto collection instead of a plain array.
    map(t) {
      return n(n.map(this, (e, i) => t.call(e, i, e)));
    },
    slice(t, e) {
      return n(E.call(this, t, e));
    },
    /**
     * Executes `callback` when the DOM is ready (DOMContentLoaded).
     * If the DOM is already loaded, the callback is scheduled via `setTimeout`.
     *
     * @param callback - Function receiving the `$` factory.
     * @returns The collection for chaining.
     */
    ready(t) {
      return w.readyState !== "loading" ? setTimeout(() => t(n), 0) : w.addEventListener("DOMContentLoaded", () => t(n), { once: !0 }), this;
    },
    /**
     * Retrieves an element by index, or the entire collection as an array.
     * Negative indices count from the end (`-1` is the last element).
     *
     * @param idx - Zero-based index, or `undefined` for the full array.
     * @returns A single DOM element, or an array of all elements.
     */
    get(t) {
      return t === void 0 ? E.call(this) : this[t >= 0 ? t : t + this.length];
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
        const s = this[e];
        if (t.call(s, e, s) === !1) break;
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
        e = (s, r) => t.call(s, r, s);
      else if (t[0] === "." && d.test(t.slice(1))) {
        const s = t.slice(1);
        e = (r) => r.classList.contains(s);
      } else if (d.test(t) && /^[a-zA-Z][\w-]*$/.test(t)) {
        const s = t.toUpperCase();
        e = (r) => r.tagName === s;
      } else
        e = (s) => o.matches(s, t);
      const i = [];
      for (let s = 0, r = this.length; s < r; s++) {
        const c = this[s];
        e(c, s) && i.push(c);
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
      return typeof t == "string" ? this.length > 0 && o.matches(this[0], t) : !!(t && this.selector == t.selector);
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
        const r = [];
        for (let c = 0, g = this.length; c < g; c++) {
          const S = this[c];
          t.call(S, c) || r.push(S);
        }
        return n(r);
      }
      const e = typeof t == "string" ? this.filter(t) : q(t) && b(t.item) ? E.call(t) : n(t), i = /* @__PURE__ */ new Set();
      for (let r = 0, c = e.length; r < c; r++)
        i.add(e[r]);
      const s = [];
      for (let r = 0, c = this.length; r < c; r++) {
        const g = this[r];
        i.has(g) || s.push(g);
      }
      return n(s);
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
        return W(t) ? n.contains(this, t) : n(this).find(t).length > 0;
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
        const s = n(t), r = [], c = this;
        for (let g = 0, S = s.length; g < S; g++) {
          const D = s[g];
          if (D instanceof Element) {
            for (let M = 0, U = c.length; M < U; M++)
              if (n.contains(c[M], D)) {
                r.push(D);
                break;
              }
          }
        }
        return n(r);
      }
      if (this.length == 1) return n(o.qsa(this[0], t));
      const e = /* @__PURE__ */ new Set(), i = [];
      for (let s = 0, r = this.length; s < r; s++) {
        const c = o.qsa(this[s], t);
        for (let g = 0, S = c.length; g < S; g++) {
          const D = c[g];
          e.has(D) || (e.add(D), i.push(D));
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
      const i = [], s = typeof t == "object" && n(t), r = /* @__PURE__ */ new Set();
      if (s) {
        const c = /* @__PURE__ */ new Set();
        for (let g = 0, S = s.length; g < S; g++) {
          const D = s[g];
          D instanceof Element && c.add(D);
        }
        for (let g = 0, S = this.length; g < S; g++) {
          const D = this[g];
          if (!(D instanceof Element)) continue;
          let M = D;
          for (; M; ) {
            if (c.has(M)) {
              r.has(M) || (r.add(M), i.push(M));
              break;
            }
            if (M === e || O(M)) break;
            M = M.parentNode;
          }
        }
        return n(i);
      }
      for (let c = 0, g = this.length; c < g; c++) {
        const S = this[c];
        if (!(S instanceof Element)) continue;
        const D = S.closest(t);
        D && (!e || e.contains(D)) && !r.has(D) && (r.add(D), i.push(D));
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
        const g = i.closest(t);
        return !g || e && !e.contains(g) ? n() : n(g);
      }
      const s = n(t), r = /* @__PURE__ */ new Set();
      for (let g = 0, S = s.length; g < S; g++) {
        const D = s[g];
        D instanceof Element && r.add(D);
      }
      let c = i;
      for (; c; ) {
        if (c instanceof Element && r.has(c))
          return n(c);
        if (c === e || O(c)) break;
        c = c.parentNode;
      }
      return n();
    },
    parents(t) {
      const e = [], i = /* @__PURE__ */ new Set();
      let s = this;
      for (; s.length > 0; )
        s = n.map(s, (r) => {
          const c = r.parentNode;
          return c && !O(c) && c instanceof Element && !i.has(c) ? (i.add(c), e.push(c), c) : null;
        });
      return I(e, t);
    },
    parent(t) {
      const e = [], i = /* @__PURE__ */ new Set();
      for (let s = 0, r = this.length; s < r; s++) {
        const c = this[s].parentNode;
        c && !i.has(c) && (i.add(c), e.push(c));
      }
      return I(e, t);
    },
    children(t) {
      return I(
        // the map callback returns plain arrays, which $.map flattens
        this.map(function() {
          return ht(this);
        }),
        t
      );
    },
    contents() {
      return this.map(function() {
        return this.contentDocument || E.call(this.childNodes);
      });
    },
    siblings(t) {
      return I(
        this.map((e, i) => {
          const s = i.parentNode;
          if (!s) return [];
          const r = [];
          for (let c = s.firstElementChild; c; c = c.nextElementSibling)
            c !== i && r.push(c);
          return r;
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
      let i, s = !1;
      return this[0] && !e && (i = n(t).get(0), s = !!i && (!!i.parentNode || this.length > 1)), this.each(function(r) {
        const c = e ? t.call(this, r) : s ? i.cloneNode(!0) : i;
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
      let i = e, s = i.children();
      for (; s.length; )
        i = s.first(), s = i.children();
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
        const s = n(this), r = s.contents(), c = e ? t.call(this, i) : t;
        r.length ? r.wrapAll(c) : s.append(c);
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
          const r = this[0].getAttribute(t);
          return r ?? void 0;
        }
        return;
      }
      const i = W(t), s = b(e);
      for (let r = 0, c = this.length; r < c; r++) {
        const g = this[r];
        if (g.nodeType === 1)
          if (i) {
            const S = t;
            for (const D in S) V(g, D, S[D]);
          } else
            V(g, t, s ? e.call(g, r, g.getAttribute(t)) : e);
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
            V(this, e[i]);
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
      const i = typeof t == "string" && f[t] || t;
      if (typeof i == "string" && arguments.length < 2)
        return this[0] && this[0][i];
      const s = W(i), r = b(e);
      return this.each(function(c) {
        const g = this;
        if (s) {
          const S = i;
          for (const D in S) g[f[D] || D] = S[D];
        } else {
          const S = i;
          g[S] = r ? e.call(this, c, g[S]) : e;
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
      const e = f[t] || t;
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
      const i = "data-" + t.replace(P, "-$1").toLowerCase();
      if (arguments.length > 1)
        return this.attr(i, e);
      const s = this.attr(i);
      return s !== void 0 ? pt(s) : void 0;
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
        for (let s = 0, r = this.length; s < r; s++) {
          const c = this[s];
          c.value = b(i) ? i.call(c, s, c.value) : i;
        }
        return this;
      }
      const e = this[0];
      if (e) {
        if (e.multiple) {
          const i = [], s = e.selectedOptions;
          for (let r = 0, c = s.length; r < c; r++)
            i.push(s[r].value);
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
          const s = n(this), r = b(t) ? t.call(this, i, s.offset()) : t, c = s.offsetParent().offset(), g = {
            top: r.top - c.top,
            left: r.left - c.left
          };
          s.css("position") == "static" && (g.position = "relative"), s.css(g);
        });
      if (!this.length) return null;
      if (w.documentElement !== this[0] && !n.contains(w.documentElement, this[0]))
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
          return c ? c.style[st(t)] || getComputedStyle(c, "").getPropertyValue(t) : void 0;
        if (u(t)) {
          if (!c) return;
          const g = {}, S = getComputedStyle(c, "");
          return n.each(t, (D, M) => {
            g[M] = c.style[st(M)] || S.getPropertyValue(M);
          }), g;
        }
      }
      if (l(t) == "string") {
        const c = tt(t);
        if (!e && e !== 0)
          return this.each(function() {
            this.style.removeProperty(c);
          });
        const g = String(rt(t, e));
        return this.each(function() {
          this.style.setProperty(c, g);
        });
      }
      const i = t, s = [], r = Object.keys(i);
      for (let c = 0; c < r.length; c++) {
        const g = r[c], S = i[g];
        s.push(
          !S && S !== 0 ? [tt(g), null] : [tt(g), String(rt(g, S))]
        );
      }
      return this.each(function() {
        const c = this.style;
        for (let g = 0; g < s.length; g++) {
          const S = s[g];
          S[1] === null ? c.removeProperty(S[0]) : c.setProperty(S[0], S[1]);
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
      for (let i = 0, s = this.length; i < s; i++) {
        const r = this[i];
        if (!(r instanceof Element)) continue;
        let c = !1, g = !0;
        for (let S = 0; S < e.length; S++) {
          const D = e[S];
          if (D && (c = !0, !r.classList.contains(D))) {
            g = !1;
            break;
          }
        }
        if (c && g) return !0;
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
        const i = b(t) ? t.call(this, e, $(this) || "") : t, s = this.classList;
        nt(i, (r) => {
          s.add(r);
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
          $(this, "");
          return;
        }
        const i = b(t) ? t.call(this, e, $(this) || "") : t, s = this.classList;
        nt(i, (r) => {
          s.remove(r);
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
        const s = b(t) ? t.call(this, i, $(this) || "") : t, r = this.classList;
        nt(s, (c) => {
          r.toggle(c, e);
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
      const s = i ? yt : dt;
      return this.each(function() {
        s.call(this, t);
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
      const s = i ? bt : Dt;
      return this.each(function() {
        s.call(this, t);
      });
    },
    position() {
      if (!this.length) return;
      const t = this[0], e = this.offsetParent(), i = this.offset(), s = v.test(e[0].nodeName) ? { top: 0, left: 0 } : e.offset();
      i.top -= parseFloat(gt(t, "marginTop", "margin-top")) || 0, i.left -= parseFloat(gt(t, "marginLeft", "margin-left")) || 0;
      const r = e[0];
      return s.top += parseFloat(gt(r, "borderTopWidth", "border-top-width")) || 0, s.left += parseFloat(gt(r, "borderLeftWidth", "border-left-width")) || 0, {
        top: i.top - s.top,
        left: i.left - s.left
      };
    },
    offsetParent() {
      return this.map(function() {
        let t = this.offsetParent || w.body;
        for (; t && !v.test(t.nodeName) && gt(t, "position", "position") == "static"; )
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
            for (const s of e) nt(s, (r) => i.add(r));
          });
        },
        remove(...e) {
          return t.each(function() {
            const i = this.classList;
            for (const s of e) nt(s, (r) => i.remove(r));
          });
        },
        toggle(e, i) {
          return t.each(function() {
            const s = this.classList;
            nt(e, (r) => s.toggle(r, i));
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
              if (W(e))
                for (const s in e) V(this, s, e[s]);
              else
                V(this, e, i);
          });
        },
        remove(e) {
          const i = e.split(" ");
          return t.each(function() {
            if (this.nodeType === 1)
              for (let s = 0; s < i.length; s++)
                i[s] && this.removeAttribute(i[s]);
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
            return i.style[st(e)] || getComputedStyle(i, "").getPropertyValue(e);
          }
        },
        set(e, i) {
          const s = [];
          if (typeof e == "string")
            s.push(
              !i && i !== 0 ? [tt(e), null] : [tt(e), String(rt(e, i))]
            );
          else {
            const r = Object.keys(e);
            for (let c = 0; c < r.length; c++) {
              const g = r[c], S = e[g];
              s.push(
                !S && S !== 0 ? [tt(g), null] : [tt(g), String(rt(g, S))]
              );
            }
          }
          return t.each(function() {
            if (this.nodeType !== 1) return;
            const r = this.style;
            for (let c = 0; c < s.length; c++) {
              const g = s[c];
              g[1] === null ? r.removeProperty(g[0]) : r.setProperty(g[0], g[1]);
            }
          });
        }
      };
    }
  }), ["width", "height"].forEach((t) => {
    const e = t.replace(/./, (i) => i[0].toUpperCase());
    n.fn[t] = function(i) {
      let s, r = this[0];
      return i === void 0 ? x(r) ? r["inner" + e] : O(r) ? r.documentElement["scroll" + e] : (s = this.offset(), (s == null ? void 0 : s[t]) ?? 0) : this.each(function(c) {
        const g = n(this);
        g.css(
          t,
          b(i) ? i.call(this, c, g[t]()) : i
        );
      });
    };
  }), ["width", "height"].forEach((t) => {
    const e = t.replace(/./, (r) => r[0].toUpperCase()), i = "offset" + e, s = t === "width" ? ["marginLeft", "marginRight"] : ["marginTop", "marginBottom"];
    n.fn["outer" + e] = function(r) {
      const c = this[0];
      if ((c == null ? void 0 : c.nodeType) !== 1) return 0;
      let g = c[i];
      if (r) {
        const S = getComputedStyle(c);
        g += parseFloat(S[s[0]]) + parseFloat(S[s[1]]);
      }
      return g;
    };
  });
  function jt(t, e) {
    if (!t) return;
    e(t);
    const i = t.childNodes;
    for (let s = 0, r = i.length; s < r; s++)
      jt(i[s], e);
  }
  H.forEach((t, e) => {
    const i = e % 2;
    n.fn[t] = function(...s) {
      let r, c = n.map(s, (D) => {
        const M = [];
        return r = l(D), r == "array" ? (D.forEach((U) => {
          if (U.nodeType !== void 0) return M.push(U);
          if (o.isZ(U))
            return M.push(...U.get());
          M.push(...o.fragment(U));
        }), M) : r === "object" || D == null || D.nodeType !== void 0 ? D : o.fragment(D);
      }), g, S = this.length > 1;
      return c.length < 1 ? this : this.each((D, M) => {
        g = i ? M : M.parentNode, M = e == 0 ? M.nextSibling : e == 1 ? M.firstChild : e == 2 ? M : null;
        const U = n.contains(w.documentElement, g);
        c.forEach((K) => {
          if (S) K = K.cloneNode(!0);
          else if (!g) return n(K).remove();
          g.insertBefore(K, M), U && jt(K, (xt) => {
            const at = xt;
            if (xt.nodeName === "SCRIPT" && (!at.type || at.type === "text/javascript") && !at.src) {
              const Pt = at.ownerDocument ? at.ownerDocument.defaultView : window;
              Pt.eval.call(Pt, at.innerHTML);
            }
          });
        });
      });
    }, n.fn[i ? t + "To" : "insert" + (e ? "Before" : "After")] = function(s) {
      return n(s)[t](this), this;
    };
  }), o.Z.prototype = Q.prototype = n.fn, n.fn.jquery = "3.7.1", o.jquery = "3.7.1";
  const it = /* @__PURE__ */ new WeakMap();
  function At(t) {
    let e = it.get(t);
    return e || (e = /* @__PURE__ */ new Map(), it.set(t, e)), e;
  }
  n.data = function(t, e, i) {
    if (typeof t == "string" && (t = w.querySelector(t)), !t || !t.nodeType) return;
    if (e === void 0) return it.get(t);
    if (arguments.length === 3)
      return At(t).set(e, i), i;
    const s = it.get(t);
    return s && s.has(e) ? s.get(e) : n(t).data(e);
  }, n.removeData = function(t, e) {
    var i;
    typeof t == "string" && (t = w.querySelector(t)), !(!t || !t.nodeType) && (e === void 0 ? it.delete(t) : (i = it.get(t)) == null || i.delete(e));
  }, n.Event = function(t, e) {
    let i;
    if (typeof t == "string")
      i = new CustomEvent(t, { bubbles: !0, cancelable: !0 });
    else {
      const s = t;
      i = new CustomEvent(s.type, { bubbles: !0, cancelable: !0 });
      for (const r in s)
        try {
          i[r] = s[r];
        } catch {
        }
    }
    return e && Object.assign(i, e), i;
  };
  const Lt = n.fn.trigger;
  n.fn.trigger = function(t, e) {
    const i = Array.isArray(e) ? e : e !== void 0 ? [e] : [];
    if (typeof t == "string")
      return Lt.call(this, t, ...i);
    const s = t.type;
    return this.each(function() {
      const r = t;
      r.__extra = i, this.dispatchEvent(r);
    });
  }, n.bridget || (n.bridget = function(t, e) {
    const i = e;
    n.fn[t] = function(s, ...r) {
      var c;
      if (typeof s == "string") {
        if (s.charAt(0) === "_")
          return window.console && console.error(t + " has no method " + s), this;
        for (let g = 0; g < this.length; g++) {
          const S = this[g], M = (i.data ? i.data(S) : n.data(S, t)) || ((c = it.get(S)) == null ? void 0 : c.get(t));
          if (!M) {
            window.console && console.error(t + " not initialized. Cannot call method " + s);
            continue;
          }
          const U = M[s];
          if (!U) {
            window.console && console.error(t + " has no method " + s);
            continue;
          }
          const K = U.apply(M, r);
          if (K !== void 0 && K !== M) return K;
        }
        return this;
      }
      return this.each(function() {
        var D, M;
        const g = this, S = ((D = it.get(g)) == null ? void 0 : D.get(t)) || ((M = i.data) == null ? void 0 : M.call(i, g));
        if (S) {
          const U = S;
          U.option && U.option(s);
        } else {
          const U = i, K = new U(g, s);
          At(g).set(t, K);
        }
      });
    };
  }), n.batch = function(t, e) {
    const i = w.createDocumentFragment(), s = Array.isArray(e) ? e : Array.from(e);
    for (let r = 0, c = s.length; r < c; r++) i.appendChild(s[r]);
    t.appendChild(i);
  };
  const vt = [], Tt = [];
  let Et = !1;
  function Ft() {
    Et = !1;
    const t = vt.splice(0, vt.length), e = Tt.splice(0, Tt.length);
    for (let i = 0, s = t.length; i < s; i++) t[i]();
    for (let i = 0, s = e.length; i < s; i++) e[i]();
  }
  function Nt() {
    Et || (Et = !0, requestAnimationFrame(Ft));
  }
  return n.raf = function(t) {
    return requestAnimationFrame(t);
  }, n.measure = function(t) {
    vt.push(t), Nt();
  }, n.mutate = function(t) {
    Tt.push(t), Nt();
  }, o.uniq = mt, o.deserializeValue = pt, n.mepto = o, n;
}(), St = window;
St.mepto = Ot;
St.$ === void 0 && (St.$ = Ot);
(function(n) {
  n.Callbacks = function(j) {
    const m = n.extend({}, j);
    let E, T = !1, w = !1, N = 0, F = 0, p = 0, a = [], h = m.once ? void 0 : [];
    const v = function(C) {
      for (E = m.memory && C, T = !0, p = N || 0, N = 0, F = a.length, w = !0; a && p < F; ++p)
        if (a[p].apply(C[0], C[1]) === !1 && m.stopOnFalse) {
          E = !1;
          break;
        }
      w = !1, a && (h ? h.length && v(h.shift()) : E ? a.length = 0 : R.disable());
    }, P = function(C) {
      for (let A = 0; A < C.length; A++) {
        const L = C[A];
        typeof L == "function" ? (!m.unique || !R.has(L)) && a.push(L) : L && typeof L != "string" && L.length && P(L);
      }
    }, R = {
      add: function(...C) {
        if (a) {
          const A = a.length;
          P(C), w ? F = a.length : E && (N = A, v(E));
        }
        return this;
      },
      remove: function(...C) {
        if (a)
          for (let A = 0; A < C.length; A++) {
            const L = C[A];
            let k = 0;
            for (; (k = n.inArray(L, a, k)) > -1; )
              a.splice(k, 1), w && (k <= F && --F, k <= p && --p);
          }
        return this;
      },
      has: function(C) {
        return !!(a && (C ? n.inArray(C, a) > -1 : a.length));
      },
      empty: function() {
        return F = a.length = 0, this;
      },
      disable: function() {
        return a = void 0, h = void 0, E = void 0, this;
      },
      disabled: function() {
        return !a;
      },
      lock: function() {
        return h = void 0, E || R.disable(), this;
      },
      locked: function() {
        return !h;
      },
      fireWith: function(C, A) {
        if (a && (!T || h)) {
          const L = A ? [...A] : [], k = [C, L];
          w ? h.push(k) : v(k);
        }
        return this;
      },
      fire: function(...C) {
        return R.fireWith(this, C);
      },
      fired: function() {
        return !!T;
      }
    };
    return R;
  };
})(mepto);
(function(n) {
  const j = Array.prototype.slice;
  function m(E) {
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
    let w = "pending";
    const N = {}, F = {
      state: function() {
        return w;
      },
      always: function(...p) {
        return N.done(...p), N.fail(...p), this;
      },
      then: function(p, a, h) {
        const v = [p, a, h];
        return m(function(P) {
          n.each(T, function(R, C) {
            const A = n.isFunction(v[R]) && v[R];
            N[C[1]](function() {
              const L = j.call(arguments), k = A && A.apply(this, L);
              if (k && n.isFunction(k.promise))
                k.promise().done(P.resolve).fail(P.reject).progress(P.notify);
              else {
                const z = this === F ? P.promise() : this, H = A ? [k] : L;
                P[C[0] + "With"](
                  z,
                  H
                );
              }
            });
          });
        }).promise();
      },
      promise: function(p) {
        return p != null ? n.extend(p, F) : F;
      }
    };
    return n.each(T, function(p, a) {
      const h = a[2], v = a[3];
      F[a[1]] = h.add, v && h.add(
        function() {
          w = v;
        },
        T[p ^ 1][2].disable,
        T[2][2].lock
      ), N[a[0]] = function() {
        return N[a[0] + "With"](
          this === N ? F : this,
          arguments
        ), N;
      }, N[a[0] + "With"] = h.fireWith;
    }), F.promise(N), E && E.call(N, N), N;
  }
  n.when = function(...E) {
    const T = E, w = T.length;
    let N = w !== 1 || E[0] && n.isFunction(E[0].promise) ? w : 0;
    const F = N === 1 ? E[0] : m();
    let p = [], a = [], h = [];
    const v = function(P, R, C) {
      return function(A) {
        R[P] = this, C[P] = arguments.length > 1 ? j.call(arguments) : A, C === p ? F.notifyWith(R, C) : --N || F.resolveWith(R, [C]);
      };
    };
    if (w > 1) {
      p = new Array(w), a = new Array(w), h = new Array(w);
      for (let P = 0; P < w; ++P)
        T[P] && n.isFunction(T[P].promise) ? T[P].promise().done(v(P, h, T)).fail(F.reject).progress(v(P, a, p)) : --N;
    }
    return N || F.resolveWith(h, T), F.promise();
  }, n.Deferred = m;
})(mepto);
(function(n) {
  const j = Array.prototype.slice, m = n.isFunction, E = function(d) {
    return typeof d == "string";
  }, T = /* @__PURE__ */ new WeakMap();
  let w = 1;
  const N = /* @__PURE__ */ new WeakMap();
  function F(d) {
    let y = N.get(d);
    return y === void 0 && (y = w++, N.set(d, y)), y;
  }
  const p = { focus: "focusin", blur: "focusout" }, a = { mouseenter: "mouseover", mouseleave: "mouseout" };
  function h(d, y, o, f) {
    const u = T.get(d);
    if (!u || u.length === 0) return [];
    const l = v(y), b = l.ns ? P(l.ns) : null, x = o ? F(o) : null;
    return u.filter(
      (O) => O && (!l.e || O.e === l.e) && (!l.ns || b.test(O.ns)) && (!o || F(O.fn) === x) && (!f || O.sel === f)
    );
  }
  function v(d) {
    const y = ("" + d).split(".");
    return { e: y[0], ns: y.slice(1).sort().join(" ") };
  }
  function P(d) {
    return new RegExp("(?:^| )" + d.replace(" ", " .* ?") + "(?: |$)");
  }
  function R(d) {
    return !!d;
  }
  function C(d) {
    return a[d] || p[d] || d;
  }
  function A(d, y, o, f, u, l, b) {
    let x = T.get(d);
    x || (x = [], T.set(d, x)), (y.match(/\S+/g) || []).forEach((O) => {
      if (O == "ready") {
        n(document).ready(o);
        return;
      }
      const W = v(O), _ = {
        e: W.e,
        ns: W.ns,
        fn: o,
        sel: u,
        del: void 0,
        proxy: () => {
        },
        i: x.length
      };
      let q = o;
      _.e in a && (q = function(...X) {
        const G = X[0].relatedTarget;
        if (!G || G !== this && !n.contains(this, G))
          return _.fn.apply(this, X);
      }), _.del = l;
      const Y = l || q;
      _.proxy = (X) => {
        if (X = J(X), X.isImmediatePropagationStopped())
          return;
        X.data = f;
        const et = X._args, G = Y.apply(d, et == null ? [X] : [X].concat(et));
        return G === !1 && (X.preventDefault(), X.stopPropagation()), G;
      }, x.push(_), "addEventListener" in d && d.addEventListener(C(_.e), _.proxy, R(b));
    });
  }
  function L(d, y, o, f, u) {
    const l = T.get(d);
    if (!l) return;
    ((y || "").match(/\S+/g) || [""]).forEach((x) => {
      h(d, x, o, f).forEach((O) => {
        delete l[O.i], d.removeEventListener(C(O.e), O.proxy, R(u));
      });
    });
  }
  n.event = { add: A, remove: L }, n.proxy = function(d, y, ...o) {
    const f = 2 in arguments ? o : void 0;
    if (m(d)) {
      const u = function() {
        return d.apply(
          y,
          f ? f.concat(j.call(arguments)) : Array.from(arguments)
        );
      };
      return N.set(u, F(d)), u;
    } else if (E(y)) {
      const u = d;
      return f ? n.proxy.apply(
        null,
        [u[y], d].concat(f)
      ) : n.proxy(u[y], d);
    } else
      throw new TypeError("expected function");
  }, n.fn.bind = function(d, y, o) {
    return this.on(d, y, o);
  }, n.fn.unbind = function(d, y) {
    return this.off(d, y);
  }, n.fn.one = function(d, y, o, f, u) {
    return this.on(d, y, o, f, 1);
  };
  const k = function() {
    return !0;
  }, z = function() {
    return !1;
  }, H = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/, Z = {
    preventDefault: "isDefaultPrevented",
    stopImmediatePropagation: "isImmediatePropagationStopped",
    stopPropagation: "isPropagationStopped"
  };
  function J(d, y) {
    const o = d;
    return (y || !o.isDefaultPrevented) && (y || (y = d), n.each(Z, (f, u) => {
      const b = y[f];
      o[f] = function(...x) {
        return this[u] = k, b ? b.apply(y, x) : void 0;
      }, o[u] = z;
    }), y.defaultPrevented && (o.isDefaultPrevented = k)), d;
  }
  function B(d) {
    let y;
    const o = {
      originalEvent: d
    };
    for (y in d)
      !H.test(y) && d[y] !== void 0 && (o[y] = d[y]);
    return J(o, d);
  }
  n.fn.delegate = function(d, y, o) {
    return this.on(y, d, o);
  }, n.fn.undelegate = function(d, y, o) {
    return this.off(y, d, o);
  }, n.fn.on = function(d, y, o, f, u) {
    const l = this;
    return d && !E(d) ? (n.each(
      d,
      (b, x) => {
        this.on(b, y, o, x, u);
      }
    ), this) : (!E(y) && !m(f) && f !== !1 && (f = o, o = y, y = void 0), (f === void 0 || o === !1) && (f = o, o = void 0), f === !1 && (f = z), l.each((b, x) => {
      let O, W;
      u && (O = function(..._) {
        const q = _[0];
        return L(x, q.type, f), f.apply(this, _);
      }), y && (W = function(..._) {
        const q = _[0], Y = n(q.target).closest(y, x).get(0);
        if (Y && Y !== x) {
          const X = n.extend(B(q), {
            // `currentTarget` is the element where the listener is
            // attached (the parent), not the matched descendant.
            // jQuery semantics: `this` in the handler is the match
            // (the child); `event.currentTarget` is the listener host
            // (the parent). The previous code set currentTarget to
            // `match`, which made the two indistinguishable.
            currentTarget: x,
            liveFired: x
          });
          return (O || f).apply(Y, [X, ..._.slice(1)]);
        }
      }), A(
        x,
        d,
        f,
        o,
        y,
        W || O
      );
    }));
  }, n.fn.off = function(d, y, o) {
    const f = this;
    return d && !E(d) ? (n.each(
      d,
      (u, l) => {
        f.off(u, y, l);
      }
    ), f) : (!E(y) && !m(o) && o !== !1 && (o = y, y = void 0), o === !1 && (o = z), f.each(function() {
      L(
        this,
        d,
        o,
        y
      );
    }));
  }, n.fn.trigger = function(d, y) {
    const o = E(d) || n.isPlainObject(d) ? n.Event(d) : J(d);
    return o._args = y, this.each(function() {
      o.type in p && typeof this[o.type] == "function" ? this[o.type]() : "dispatchEvent" in this ? this.dispatchEvent(o) : n(this).triggerHandler(o, y);
    });
  }, n.fn.triggerHandler = function(d, y) {
    let o, f;
    return this.each((u, l) => {
      o = B(E(d) ? n.Event(d) : d), o._args = y, o.target = l, n.each(
        h(l, d.type || d),
        (b, x) => {
          if (f = x.proxy(o), o.isImmediatePropagationStopped())
            return !1;
        }
      );
    }), f;
  }, "focusin focusout focus blur load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach((d) => {
    const y = n.fn;
    y[d] = function(...o) {
      return o.length > 0 ? this.bind(d, o[0]) : this.trigger(d);
    };
  }), n.Event = function(d, y) {
    E(d) || (y = d, d = y.type);
    let o = !0;
    if (y)
      for (const u in y)
        u === "bubbles" && (o = !!y[u]);
    const f = new Event(d, { bubbles: o, cancelable: !0 });
    if (y)
      for (const u in y)
        u !== "bubbles" && (f[u] = y[u]);
    return J(f);
  };
})(mepto);
(function(n) {
  let j = Date.now(), m = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, E = /^(?:text|application)\/javascript/i, T = /^(?:text|application)\/xml/i, w = "application/json", N = "text/html", F = /^\s*$/;
  function p(o, f, u) {
    const l = n.Event(f);
    return n(o || document).trigger(l, u), !l.isDefaultPrevented();
  }
  function a(o, f, u, l) {
    if (o.global) return p(f || document, u, l);
  }
  n.active = 0;
  function h(o) {
    o.global && n.active++ === 0 && a(o, null, "ajaxStart");
  }
  function v(o) {
    o.global && !--n.active && a(o, null, "ajaxStop");
  }
  function P(o, f) {
    const u = f.context;
    if (f.beforeSend.call(u, o, f) === !1 || a(f, u, "ajaxBeforeSend", [o, f]) === !1)
      return !1;
    a(f, u, "ajaxSend", [o, f]);
  }
  function R(o, f, u, l) {
    const b = u.context, x = "success";
    z(u.success, b, [o, x, f]), l && l.resolveWith(b, [o, x, f]), a(u, b, "ajaxSuccess", [f, u, o]), A(x, f, u);
  }
  function C(o, f, u, l, b) {
    const x = l.context;
    z(l.error, x, [u, f, o]), b && b.rejectWith(x, [u, f, o]), a(l, x, "ajaxError", [u, l, o || f]), A(f, u, l);
  }
  function A(o, f, u) {
    const l = u.context;
    z(u.complete, l, [f, o]), a(u, l, "ajaxComplete", [f, u]), v(u);
  }
  function L(o, f, u) {
    if (u.dataFilter == k) return o;
    const l = u.context;
    return u.dataFilter.call(l, o, f);
  }
  function k() {
  }
  function z(o, f, u) {
    if (typeof o == "function") o.apply(f, u);
    else if (Array.isArray(o))
      for (const l of o) typeof l == "function" && l.apply(f, u);
  }
  n.ajaxJSONP = function(o, f) {
    if (!("type" in o)) return n.ajax(o);
    const u = o.jsonpCallback, l = (n.isFunction(u) ? u() : u) || "mepto" + j++, b = document.createElement("script"), x = function(Y) {
      n(b).triggerHandler("error", Y || "abort");
    }, O = { abort: x };
    let W = window[l], _, q;
    return f && f.promise(O), n(b).on("load error", (Y, X) => {
      clearTimeout(q), n(b).off().remove(), Y.type == "error" || !_ ? C(null, X || "error", O, o, f) : R(_[0], O, o, f), window[l] = W, _ && W && W(_[0]), W = void 0, _ = void 0;
    }), P(O, o) === !1 ? (x("abort"), O) : (window[l] = (...Y) => {
      _ = Y;
    }, b.src = o.url.replace(/\?(.+)=\?/, "?$1=" + l), document.head.appendChild(b), o.timeout > 0 && (q = setTimeout(() => {
      x("timeout");
    }, o.timeout)), O);
  }, n.ajaxSettings = {
    // Default type of request
    type: "GET",
    // Callback that is executed before request
    beforeSend: k,
    // Callback that is executed if the request succeeds
    success: k,
    // Callback that is executed the the server drops error
    error: k,
    // Callback that is executed on request complete (both: error and success)
    complete: k,
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
      json: w,
      xml: "application/xml, text/xml",
      html: N,
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
    dataFilter: k
  };
  function H(o) {
    let f = o;
    return f && (f = f.split(";", 2)[0]), f && (f == N ? "html" : f == w ? "json" : E.test(f) ? "script" : T.test(f) && "xml") || "text";
  }
  function Z(o, f) {
    return f == "" ? o : (o + "&" + f).replace(/[&?]{1,2}/, "?");
  }
  function J(o) {
    o.processData && o.data && n.type(o.data) != "string" && (o.data = n.param(o.data, o.traditional)), o.data && (!o.type || o.type.toUpperCase() == "GET" || o.dataType == "jsonp") && (o.url = Z(o.url, o.data), o.data = void 0);
  }
  n.ajax = function(o, f) {
    const u = typeof o == "string" ? n.extend({}, f, { url: o }) : o, l = n.extend({}, u || {}), b = n.Deferred();
    let x;
    const O = n.ajaxSettings, W = l, _ = O;
    for (const I in O) W[I] === void 0 && (W[I] = _[I]);
    if (h(l), !l.crossDomain) {
      const I = new URL(l.url, window.location.href);
      l.crossDomain = window.location.protocol + "//" + window.location.host != I.protocol + "//" + I.host;
    }
    l.url || (l.url = window.location.toString()), (x = l.url.indexOf("#")) > -1 && (l.url = l.url.slice(0, x)), J(l);
    let q = l.dataType;
    const Y = /\?.+=\?/.test(l.url);
    if (Y && (q = "jsonp"), (l.cache === !1 || (!u || u.cache !== !0) && (q == "script" || q == "jsonp")) && (l.url = Z(l.url, "_=" + Date.now())), q == "jsonp")
      return Y || (l.url = Z(
        l.url,
        l.jsonp ? l.jsonp + "=?" : l.jsonp === !1 ? "" : "callback=?"
      )), n.ajaxJSONP(
        l,
        b
      );
    let X = l.accepts[q];
    const et = {}, G = function(I, V) {
      et[I] = V;
    };
    if (l.crossDomain || G("X-Requested-With", "XMLHttpRequest"), G("Accept", X || "*/*"), (l.contentType || l.contentType !== !1 && l.data && l.type.toUpperCase() != "GET") && G("Content-Type", l.contentType || "application/x-www-form-urlencoded"), l.headers)
      for (const I in l.headers) G(I, l.headers[I]);
    const st = /^([\w-]+):\/\//.exec(l.url), wt = st ? st[1] : window.location.protocol, ot = new AbortController(), tt = (l.type || "GET").toUpperCase(), mt = new Headers(et), nt = tt === "GET" || tt === "HEAD" ? void 0 : l.data != null ? String(l.data) : void 0, rt = {
      method: tt,
      headers: mt,
      body: nt,
      signal: ot.signal
    };
    l.xhrFields && l.xhrFields.withCredentials && (rt.credentials = "include");
    let ft = 0, ut = "", ct = "";
    const ht = /* @__PURE__ */ new Map(), Q = {
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
      getResponseHeader(I) {
        return ht.get(I.toLowerCase()) || null;
      },
      getAllResponseHeaders() {
        let I = "";
        return ht.forEach((V, $) => {
          I += `${$}: ${V}\r
`;
        }), I;
      },
      abort() {
        ot.abort();
      },
      setRequestHeader() {
      }
    };
    b && b.promise(Q);
    let lt;
    return P(Q, l) === !1 ? (ot.abort(), C(null, "abort", Q, l, b), Q) : (l.timeout > 0 && (lt = setTimeout(() => {
      ot.abort(), C(null, "timeout", Q, l, b);
    }, l.timeout)), fetch(l.url, rt).then(async (I) => {
      var yt;
      clearTimeout(lt), ft = I.status, ut = I.statusText, I.headers.forEach((dt, bt) => ht.set(bt.toLowerCase(), dt));
      let V, $ = q;
      $ = $ || H(I.headers.get("content-type"));
      const pt = (yt = l.xhrFields) == null ? void 0 : yt.responseType;
      if (pt === "arraybuffer") V = await I.arrayBuffer();
      else if (pt === "blob") V = await I.blob();
      else {
        ct = await I.text(), V = ct;
        try {
          V = L(V, $, l), $ === "script" ? (0, eval)(V) : $ === "xml" ? V = new DOMParser().parseFromString(V, "application/xml") : $ === "json" && (V = F.test(V) ? null : n.parseJSON(V));
        } catch (dt) {
          C(dt, "parsererror", Q, l, b);
          return;
        }
      }
      I.ok || I.status === 304 || I.status === 0 && wt === "file:" ? R(V, Q, l, b) : C(
        I.statusText || null,
        I.status ? "error" : "abort",
        Q,
        l,
        b
      );
    }).catch((I) => {
      clearTimeout(lt), I.name === "AbortError" ? C(null, "abort", Q, l, b) : C(I, "error", Q, l, b);
    }), Q);
  };
  function B(o, f, u, l) {
    let b = f, x = u, O = l;
    return n.isFunction(b) && (O = x, x = b, b = void 0), n.isFunction(x) || (O = x, x = void 0), {
      url: o,
      data: b,
      success: x,
      dataType: O
    };
  }
  n.get = function(o, f, u, l) {
    return n.ajax(B(o, f, u, l));
  }, n.post = function(o, f, u, l) {
    const b = B(o, f, u, l);
    return b.type = "POST", n.ajax(b);
  }, n.getJSON = function(o, f, u) {
    const l = B(o, f, u);
    return l.dataType = "json", n.ajax(l);
  }, n.fn.load = function(o, f, u) {
    if (!this.length) return this;
    const l = this, b = o.split(/\s/), x = B(o, f, u), O = x.success;
    let W;
    return b.length > 1 && (x.url = b[0], W = b[1]), x.success = function(_) {
      l.html(
        W ? n("<div>").html(_.replace(m, "")).find(W) : _
      ), O && O.apply(l, arguments);
    }, n.ajax(x), this;
  };
  const d = encodeURIComponent;
  function y(o, f, u, l) {
    const b = n.isArray(f), x = n.isPlainObject(f);
    let O;
    n.each(f, (W, _) => {
      O = n.type(_);
      let q = String(W);
      l && (q = u ? l : l + "[" + (x || O == "object" || O == "array" ? W : "") + "]"), !l && b ? o.add(_.name, _.value) : O == "array" || !u && O == "object" ? y(o, _, u, q) : o.add(q, _);
    });
  }
  n.param = function(o, f) {
    const u = [];
    return u.add = function(l, b) {
      let x = b;
      n.isFunction(x) && (x = x()), x == null && (x = ""), this.push(d(l) + "=" + d(x));
    }, y(u, o, f, void 0), u.join("&").replace(/%20/g, "+");
  };
})(mepto);
(function(n) {
  n.fn.serializeArray = function() {
    const j = [];
    let m = "", E = "";
    const T = function(w) {
      if (Array.isArray(w)) {
        w.forEach((N) => T(N));
        return;
      }
      j.push({ name: m, value: w });
    };
    if (this[0]) {
      const w = this[0];
      n.each(Array.from(w.elements), function(N, F) {
        const p = F;
        m = p.name, E = p.type, m && p.nodeName.toLowerCase() != "fieldset" && !p.disabled && E != "submit" && E != "reset" && E != "button" && E != "file" && (E != "radio" && E != "checkbox" || p.checked) && T(n(p).val());
      });
    }
    return j;
  }, n.fn.serialize = function() {
    const j = [];
    return this.serializeArray().forEach(function(m) {
      j.push(encodeURIComponent(m.name) + "=" + encodeURIComponent(m.value));
    }), j.join("&");
  }, n.fn.submit = function(j) {
    if (j !== void 0)
      this.bind("submit", j);
    else if (this.length) {
      const m = n.Event("submit");
      this.eq(0).trigger(m);
      const E = this.get(0);
      m.isDefaultPrevented() || E.submit();
    }
    return this;
  };
})(mepto);
(function(n) {
  function j(m, E) {
    const T = this.os = {}, w = this.browser = {}, N = m.match(/Web[kK]it[/]{0,1}([\d.]+)/), F = m.match(/(Android);?[\s/]+([\d.]+)?/), p = !!m.match(/\(Macintosh; Intel /), a = m.match(/(iPad).*OS\s([\d_]+)/), h = m.match(/(iPod)(.*OS\s([\d_]+))?/), v = a ? null : m.match(/(iPhone\sOS)\s([\d_]+)/), P = /Win\d{2}|Windows/.test(E), R = m.match(/Windows Phone ([\d.]+)/), C = m.match(/Chrome\/([\d.]+)/) ?? m.match(/CriOS\/([\d.]+)/), A = m.match(/Firefox\/([\d.]+)/), L = C ? null : m.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/), k = L ?? m.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/);
    (w.webkit = !!N) && (w.version = N[1]), F && (T.android = !0, T.version = F[2]), v && !h && (T.ios = T.iphone = !0, T.version = v[2].replace(/_/g, ".")), a && (T.ios = T.ipad = !0, T.version = a[2].replace(/_/g, ".")), h && (T.ios = T.ipod = !0, T.version = h[3] ? h[3].replace(/_/g, ".") : void 0), R && (T.wp = !0, T.version = R[1]), C && (w.chrome = !0, w.version = C[1]), A && (w.firefox = !0, w.version = A[1]), k && (p || T.ios || P) && (w.safari = !0, T.ios || (w.version = k[1])), L && (w.webview = !0), T.tablet = !!(a || F && !m.match(/Mobile/) || A && m.match(/Tablet/)), T.phone = !!(!T.tablet && !T.ipod && (F || v || C && m.match(/Android/) || C && m.match(/CriOS\/([\d.]+)/) || A && m.match(/Mobile/)));
  }
  j.call(n, navigator.userAgent, navigator.platform);
})(mepto);
(function(n) {
  const j = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i, m = "transform", E = "transition-property", T = "transition-duration", w = "transition-delay", N = "transition-timing-function", F = "animation-name", p = "animation-duration", a = "animation-delay", h = "animation-timing-function", v = {
    "transition-property": "",
    "transition-duration": "",
    "transition-delay": "",
    "transition-timing-function": "",
    "animation-name": "",
    "animation-duration": "",
    "animation-delay": "",
    "animation-timing-function": ""
  };
  function P(C) {
    return C.replace(/([A-Z])/g, "-$1").toLowerCase();
  }
  n.fx = {
    off: !1,
    speeds: { _default: 400, fast: 200, slow: 600 },
    cssPrefix: "",
    transitionEnd: "transitionend",
    animationEnd: "animationend"
  };
  const R = n.fn;
  R.animate = function(C, A, L, k, z) {
    if (n.isFunction(A) && !k && (k = A, L = void 0, A = void 0), n.isFunction(L) && !k && (k = L, L = void 0), n.isPlainObject(A)) {
      const H = A;
      L = H.easing, k = H.complete, z = H.delay, A = H.duration;
    }
    return A && (A = (typeof A == "number" ? A : n.fx.speeds[A] || n.fx.speeds._default) / 1e3), z && (z = parseFloat(z) / 1e3), this.anim(
      C,
      A,
      L,
      k,
      z
    );
  }, R.anim = function(C, A, L, k, z) {
    let H;
    const Z = {};
    let J, B = "";
    const d = this;
    let y, o = n.fx.transitionEnd, f = !1;
    if (A === void 0 && (A = n.fx.speeds._default / 1e3), z === void 0 && (z = 0), n.fx.off && (A = 0), typeof C == "string")
      Z[F] = C, Z[p] = A + "s", Z[a] = z + "s", Z[h] = L || "linear", o = n.fx.animationEnd;
    else {
      J = [];
      for (H in C)
        j.test(H) ? B += H + "(" + C[H] + ") " : (Z[H] = C[H], J.push(P(H)));
      B && (Z[m] = B, J.push(m)), A > 0 && typeof C == "object" && (Z[E] = J.join(", "), Z[T] = A + "s", Z[w] = z + "s", Z[N] = L || "linear");
    }
    y = function(l) {
      if (typeof l < "u") {
        if (l.target !== l.currentTarget) return;
        n(l.target).unbind(o, y);
      } else n(this).unbind(o, y);
      f = !0, n(this).css(v), k && k.call(this);
    }, A > 0 && (this.bind(o, y), setTimeout(
      function() {
        f || y.call(d);
      },
      (A + z) * 1e3 + 25
    ));
    const u = this.get(0);
    return this.size() && u && u.clientLeft, this.css(Z), A <= 0 && setTimeout(function() {
      d.each(function() {
        y.call(this);
      });
    }, 0), this;
  };
})(mepto);
(function(n) {
  const j = n.fn.show, m = n.fn.hide, E = n.fn.toggle;
  function T(p, a, h, v, P) {
    typeof a == "function" && !P && (P = a, a = void 0);
    const R = { opacity: h };
    return v && (R.scale = v, p.css("transform-origin", "0 0")), p.animate(
      R,
      a,
      void 0,
      P
    );
  }
  function w(p, a, h, v) {
    return T(p, a, 0, h, function() {
      m.call(n(this)), v && v.call(this);
    });
  }
  const N = n.fn;
  N.show = function(p, a) {
    return j.call(this), p === void 0 ? p = 0 : this.css("opacity", 0), T(this, p, 1, "1,1", a);
  }, N.hide = function(p, a) {
    return p === void 0 ? m.call(this) : w(this, p, "0,0", a);
  }, N.toggle = function(p, a) {
    return p === void 0 || typeof p == "boolean" ? E.call(this, p) : this.each(function() {
      const h = n(this), v = h.css("display") == "none" ? "show" : "hide";
      h[v].call(h, p, a);
    });
  }, N.fadeTo = function(p, a, h) {
    return T(this, p, a, null, h);
  };
  function F(p, a) {
    return typeof p == "function" && a === void 0 ? { speed: void 0, callback: p } : { speed: p, callback: a };
  }
  N.fadeIn = function(p, a) {
    const h = F(p, a);
    let v = this.css("opacity");
    return Number(v) > 0 ? this.css("opacity", 0) : v = 1, j.call(this).fadeTo(
      h.speed,
      v,
      h.callback
    );
  }, N.fadeOut = function(p, a) {
    const h = F(p, a);
    return w(this, h.speed, null, h.callback);
  }, N.fadeToggle = function(p, a) {
    return this.each(function() {
      const h = n(this), v = Number(h.css("opacity")) == 0 || h.css("display") == "none" ? "fadeIn" : "fadeOut";
      h[v].call(h, p, a);
    });
  };
})(mepto);
(function(n) {
  const j = /* @__PURE__ */ new WeakMap(), m = n.fn.data, E = n.camelCase;
  function T(p, a) {
    const h = j.get(p);
    if (a === void 0) return h || w(p);
    if (h) {
      if (a in h) return h[a];
      const v = E(a);
      if (v in h) return h[v];
    }
    return m.call(n(p), a);
  }
  function w(p, a, h) {
    let v = j.get(p);
    return v || (v = F(p), j.set(p, v)), a !== void 0 && (v[E(a)] = h), v;
  }
  const N = n.mepto;
  function F(p) {
    const a = {}, h = p.attributes;
    if (!h) return a;
    for (let v = 0; v < h.length; v++) {
      const P = h[v];
      P.name.indexOf("data-") === 0 && (a[E(P.name.replace("data-", ""))] = N.deserializeValue(P.value));
    }
    return a;
  }
  n.fn.data = function(p, a) {
    return a === void 0 ? n.isPlainObject(p) ? this.each(function(h, v) {
      n.each(p, function(P, R) {
        w(v, P, R);
      });
    }) : 0 in this ? T(this[0], p) : void 0 : this.each(function(h, v) {
      w(v, p, a);
    });
  }, n.data = function(p, a, h) {
    return n(p).data(a, h);
  }, n.hasData = function(p) {
    const a = j.get(p);
    return a ? !n.isEmptyObject(a) : !1;
  }, n.fn.removeData = function(p) {
    return typeof p == "string" && (p = p.split(/\s+/)), this.each(function(a, h) {
      const v = j.get(h);
      v && (p ? p.forEach(function(P) {
        delete v[E(P)];
      }) : j.delete(h));
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
  const j = n.mepto, m = j.qsa, E = j.matches;
  function T(a) {
    const h = n(a);
    return !!(h.width() || h.height()) && h.css("display") !== "none";
  }
  const w = {
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
    eq: function(a, h, v) {
      if (typeof v == "number" && a === v) return this;
    },
    contains: function(a, h, v) {
      if (typeof v == "string" && n(this).text().indexOf(v) > -1) return this;
    },
    has: function(a, h, v) {
      if (typeof v == "string" && j.qsa(this, v).length) return this;
    }
  };
  n.expr[":"] = w;
  const N = /^(.*):(\w+)(?:\(([^)]+)\))?\s*$/, F = /^\s*>/;
  function p(a, h) {
    if (a.indexOf(":") === -1)
      return h(a, null, void 0);
    let v, P;
    const R = N.exec(a);
    if (R && R[2] in w && (v = w[R[2]], P = R[3], a = R[1], P)) {
      const C = Number(P);
      isNaN(C) ? P = P.replace(/^["']|["']$/g, "") : P = C;
    }
    return h(a, v || null, P);
  }
  j.qsa = function(a, h) {
    return p(
      h,
      function(v, P, R) {
        let C, A = v;
        try {
          !A && P ? A = "*" : F.test(A) && (A = ":scope " + A), C = m(a, A);
        } catch (L) {
          throw console.error("error performing selector: %o", h), L;
        }
        return P ? j.uniq(
          n.map(C, function(L, k) {
            return P.call(L, k, C, R) || null;
          })
        ) : C;
      }
    );
  }, j.matches = function(a, h) {
    return p(
      h,
      function(v, P, R) {
        if (v)
          try {
            if (!E(a, v)) return !1;
          } catch {
            return !1;
          }
        if (!P) return !0;
        const C = a.parentNode;
        if (!C) return !1;
        const A = v ? m(C, v) : Array.from(C.children), L = A.indexOf(a);
        return L < 0 ? !1 : P.call(a, L, A, R) === a;
      }
    );
  };
})(mepto);
(function(n) {
  n.fn.end = function() {
    return this.prevObject || n();
  };
  const j = [
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
  ], m = n.fn;
  j.forEach((E) => {
    const T = m[E];
    m[E] = function(...w) {
      const N = T.apply(this, w);
      return N.prevObject = this, N;
    };
  });
})(mepto);
(function(n) {
  let m = {}, E = null, T = null, w = null, N = null, F, p, a, h = !1, v = !1, P = !1;
  function R(B, d, y, o) {
    return Math.abs(B - d) >= Math.abs(y - o) ? B - d > 0 ? "Left" : "Right" : y - o > 0 ? "Up" : "Down";
  }
  function C() {
    N = null, m.last && (m.el.trigger("longTap"), m = {});
  }
  function A() {
    N && clearTimeout(N), N = null;
  }
  function L() {
    E && clearTimeout(E), T && clearTimeout(T), w && clearTimeout(w), N && clearTimeout(N), E = T = w = N = null, P = !0, m = {};
  }
  function k(B) {
    return B.pointerType == "touch" && B.isPrimary;
  }
  function z(B, d) {
    return B.type == "pointer" + d;
  }
  function H() {
    v && h && (n(document).off(h.down, F).off(h.up, p).off(h.move, a).off(h.cancel, L), n(window).off("scroll", L), L(), v = !1);
  }
  function Z(B) {
    let d = 0, y = 0, o = 0, f = 0, u, l = !1;
    H(), h = B && "down" in B ? B : "ontouchstart" in document ? { down: "touchstart", up: "touchend", move: "touchmove", cancel: "touchcancel" } : "onpointerdown" in document ? { down: "pointerdown", up: "pointerup", move: "pointermove", cancel: "pointercancel" } : !1, h && (F = (b) => {
      const x = z(b, "down");
      l = x, !(x && !k(b)) && (u = x ? b : b.touches[0], b.touches && b.touches.length === 1 && m.x2 && (m.x2 = void 0, m.y2 = void 0), d = Date.now(), y = d - (m.last || d), m.el = n(
        "tagName" in u.target ? u.target : u.target.parentNode
      ), E && clearTimeout(E), m.x1 = u.pageX, m.y1 = u.pageY, y > 0 && y <= 250 && (m.isDoubleTap = !0), m.last = d, N = setTimeout(C, 750));
    }, a = (b) => {
      const x = z(b, "move");
      l = x, !(x && !k(b)) && (u = x ? b : b.touches[0], A(), m.x2 = u.pageX, m.y2 = u.pageY, o += Math.abs(m.x1 - m.x2), f += Math.abs(m.y1 - m.y2));
    }, p = (b) => {
      const x = z(b, "up");
      if (l = x, !(x && !k(b))) {
        if (A(), P = !1, m.x2 && Math.abs(m.x1 - m.x2) > 30 || m.y2 && Math.abs(m.y1 - m.y2) > 30) {
          const O = m.el, W = m.x1, _ = m.y1, q = m.x2, Y = m.y2;
          w = setTimeout(() => {
            !P && O && (O.trigger("swipe"), O.trigger("swipe" + R(W, q, _, Y))), m = {};
          }, 0);
        } else "last" in m && (o < 30 && f < 30 ? T = setTimeout(() => {
          const O = n.Event("tap");
          O.cancelTouch = L, m.el && m.el.trigger(O), m.isDoubleTap ? (m.el && m.el.trigger("doubleTap"), m = {}) : E = setTimeout(() => {
            E = null, m.el && m.el.trigger("singleTap"), m = {};
          }, 250);
        }, 0) : m = {});
        o = f = 0;
      }
    }, n(document).on(h.up, p).on(h.down, F).on(h.move, a), n(document).on(h.cancel, L), n(window).on("scroll", L), v = !0);
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
  ].forEach((B) => {
    J[B] = function(d) {
      return this.on(B, d);
    };
  }), n.touch = { setup: Z }, n(document).ready(Z);
})(mepto);
(function(n) {
  if (n.os.ios) {
    let j = {};
    const m = (T) => "tagName" in T ? T : T.parentNode;
    n(document).bind("gesturestart", (T) => {
      const w = Date.now(), N = w - (j.last || w);
      j.target = m(T.target), j.e1 = T.scale, j.last = w;
    }).bind("gesturechange", (T) => {
      j.e2 = T.scale;
    }).bind("gestureend", (T) => {
      j.e2 > 0 ? (Math.abs(j.e1 - j.e2) !== 0 && (n(j.target).trigger("pinch"), n(j.target).trigger("pinch" + (j.e1 - j.e2 > 0 ? "In" : "Out"))), j.e1 = j.e2 = j.last = 0) : "last" in j && (j = {});
    });
    const E = n.fn;
    ["pinch", "pinchIn", "pinchOut"].forEach((T) => {
      E[T] = function(w) {
        return this.bind(T, w);
      };
    });
  }
})(mepto);
/**
 * Mepto - Modern TypeScript fork of Zepto.js
 * A minimalist jQuery-compatible library for modern browsers
 *
 * @version 2.0.0
 * @license MIT
 */
const Ct = window.mepto, Mt = Ct;
if (typeof window < "u") {
  const n = window;
  n.Mepto = Ct, n.$ = Ct;
}
export {
  Mt as $,
  Ct as Mepto,
  Ct as default
};
//# sourceMappingURL=meptos.js.map
