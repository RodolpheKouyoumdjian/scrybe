!(function (t, e, r) {
  "undefined" != typeof module && module.exports
    ? (module.exports = e())
    : "function" == typeof r.define && r.define.amd
    ? define(e)
    : (r.Firepad = e());
})(
  0,
  function () {
    function t(t) {
      return (
        (function (t) {
          if (Array.isArray(t)) return e(t);
        })(t) ||
        (function (t) {
          if ("undefined" != typeof Symbol && Symbol.iterator in Object(t))
            return Array.from(t);
        })(t) ||
        (function (t, r) {
          if (!t) return;
          if ("string" == typeof t) return e(t, r);
          var n = Object.prototype.toString.call(t).slice(8, -1);
          "Object" === n && t.constructor && (n = t.constructor.name);
          if ("Map" === n || "Set" === n) return Array.from(n);
          if (
            "Arguments" === n ||
            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
          )
            return e(t, r);
        })(t) ||
        (function () {
          throw new TypeError(
            "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
          );
        })()
      );
    }
    function e(t, e) {
      (null == e || e > t.length) && (e = t.length);
      for (var r = 0, n = new Array(e); r < e; r++) n[r] = t[r];
      return n;
    }
    function r(t, e) {
      for (var r = 0; r < e.length; r++) {
        var n = e[r];
        (n.enumerable = n.enumerable || !1),
          (n.configurable = !0),
          "value" in n && (n.writable = !0),
          Object.defineProperty(t, n.key, n);
      }
    }
    ((n = n || {}).utils = {}),
      (n.utils.makeEventEmitter = function (t, e) {
        (t.prototype.allowedEvents_ = e),
          (t.prototype.on = function (t, e, r) {
            this.validateEventType_(t),
              (this.eventListeners_ = this.eventListeners_ || {}),
              (this.eventListeners_[t] = this.eventListeners_[t] || []),
              this.eventListeners_[t].push({ callback: e, context: r });
          }),
          (t.prototype.off = function (t, e) {
            this.validateEventType_(t),
              (this.eventListeners_ = this.eventListeners_ || {});
            for (
              var r = this.eventListeners_[t] || [], n = 0;
              n < r.length;
              n++
            )
              if (r[n].callback === e) return void r.splice(n, 1);
          }),
          (t.prototype.trigger = function (t) {
            this.eventListeners_ = this.eventListeners_ || {};
            for (
              var e = this.eventListeners_[t] || [], r = 0;
              r < e.length;
              r++
            )
              e[r].callback.apply(
                e[r].context,
                Array.prototype.slice.call(arguments, 1)
              );
          }),
          (t.prototype.validateEventType_ = function (t) {
            if (this.allowedEvents_) {
              for (var e = !1, r = 0; r < this.allowedEvents_.length; r++)
                if (this.allowedEvents_[r] === t) {
                  e = !0;
                  break;
                }
              if (!e) throw new Error('Unknown event "' + t + '"');
            }
          });
      }),
      (n.utils.elt = function (t, e, r) {
        var i = document.createElement(t);
        if ("string" == typeof e) n.utils.setTextContent(i, e);
        else if (e) for (var o = 0; o < e.length; ++o) i.appendChild(e[o]);
        for (var s in r || {}) i.setAttribute(s, r[s]);
        return i;
      }),
      (n.utils.setTextContent = function (t, e) {
        (t.innerHTML = ""), t.appendChild(document.createTextNode(e));
      }),
      (n.utils.on = function (t, e, r, n) {
        t.addEventListener
          ? t.addEventListener(e, r, n || !1)
          : t.attachEvent && t.attachEvent("on" + e, r);
      }),
      (n.utils.off = function (t, e, r, n) {
        t.removeEventListener
          ? t.removeEventListener(e, r, n || !1)
          : t.detachEvent && t.detachEvent("on" + e, r);
      }),
      (n.utils.preventDefault = function (t) {
        t.preventDefault ? t.preventDefault() : (t.returnValue = !1);
      }),
      (n.utils.stopPropagation = function (t) {
        t.stopPropagation ? t.stopPropagation() : (t.cancelBubble = !0);
      }),
      (n.utils.stopEvent = function (t) {
        n.utils.preventDefault(t), n.utils.stopPropagation(t);
      }),
      (n.utils.stopEventAnd = function (t) {
        return function (e) {
          return t(e), n.utils.stopEvent(e), !1;
        };
      }),
      (n.utils.trim = function (t) {
        return t.replace(/^\s+/g, "").replace(/\s+$/g, "");
      }),
      (n.utils.stringEndsWith = function (t, e) {
        for (var r = "string" == typeof e ? [e] : e, n = 0; n < r.length; n++) {
          e = r[n];
          if (-1 !== t.indexOf(e, t.length - e.length)) return !0;
        }
        return !1;
      }),
      (n.utils.assert = function (t, e) {
        if (!t) throw new Error(e || "assertion error");
      }),
      (n.utils.log = function () {
        if ("undefined" != typeof console && void 0 !== console.log) {
          for (var t = ["Firepad:"], e = 0; e < arguments.length; e++)
            t.push(arguments[e]);
          console.log.apply(console, t);
        }
      }),
      ((n = n || {}).Span = (function () {
        function t(t, e) {
          (this.pos = t), (this.length = e);
        }
        return (
          (t.prototype.end = function () {
            return this.pos + this.length;
          }),
          t
        );
      })()),
      ((n = n || {}).TextOp = (function () {
        var t = n.utils;
        function e(e) {
          (this.type = e),
            (this.chars = null),
            (this.text = null),
            (this.attributes = null),
            "insert" === e
              ? ((this.text = arguments[1]),
                t.assert("string" == typeof this.text),
                (this.attributes = arguments[2] || {}),
                t.assert("object" == typeof this.attributes))
              : "delete" === e
              ? ((this.chars = arguments[1]),
                t.assert("number" == typeof this.chars))
              : "retain" === e &&
                ((this.chars = arguments[1]),
                t.assert("number" == typeof this.chars),
                (this.attributes = arguments[2] || {}),
                t.assert("object" == typeof this.attributes));
        }
        return (
          (e.prototype.isInsert = function () {
            return "insert" === this.type;
          }),
          (e.prototype.isDelete = function () {
            return "delete" === this.type;
          }),
          (e.prototype.isRetain = function () {
            return "retain" === this.type;
          }),
          (e.prototype.equals = function (t) {
            return (
              this.type === t.type &&
              this.text === t.text &&
              this.chars === t.chars &&
              this.attributesEqual(t.attributes)
            );
          }),
          (e.prototype.attributesEqual = function (t) {
            for (var e in this.attributes)
              if (this.attributes[e] !== t[e]) return !1;
            for (e in t) if (this.attributes[e] !== t[e]) return !1;
            return !0;
          }),
          (e.prototype.hasEmptyAttributes = function () {
            var t = !0;
            for (var e in this.attributes) {
              t = !1;
              break;
            }
            return t;
          }),
          e
        );
      })()),
      ((n = n || {}).TextOperation = (function () {
        "use strict";
        var t = n.TextOp,
          e = n.utils;
        function r() {
          if (!this || this.constructor !== r) return new r();
          (this.ops = []), (this.baseLength = 0), (this.targetLength = 0);
        }
        function i(t) {
          var e = t.ops;
          switch (e.length) {
            case 1:
              return e[0];
            case 2:
              return e[0].isRetain() ? e[1] : e[1].isRetain() ? e[0] : null;
            case 3:
              if (e[0].isRetain() && e[2].isRetain()) return e[1];
          }
          return null;
        }
        function o(t) {
          return t.ops[0].isRetain() ? t.ops[0].chars : 0;
        }
        return (
          (r.prototype.equals = function (t) {
            if (this.baseLength !== t.baseLength) return !1;
            if (this.targetLength !== t.targetLength) return !1;
            if (this.ops.length !== t.ops.length) return !1;
            for (var e = 0; e < this.ops.length; e++)
              if (!this.ops[e].equals(t.ops[e])) return !1;
            return !0;
          }),
          (r.prototype.retain = function (e, r) {
            if ("number" != typeof e || e < 0)
              throw new Error("retain expects a positive integer.");
            if (0 === e) return this;
            (this.baseLength += e), (this.targetLength += e), (r = r || {});
            var n = this.ops.length > 0 ? this.ops[this.ops.length - 1] : null;
            return (
              n && n.isRetain() && n.attributesEqual(r)
                ? (n.chars += e)
                : this.ops.push(new t("retain", e, r)),
              this
            );
          }),
          (r.prototype.insert = function (e, r) {
            if ("string" != typeof e)
              throw new Error("insert expects a string");
            if ("" === e) return this;
            (r = r || {}), (this.targetLength += e.length);
            var n = this.ops.length > 0 ? this.ops[this.ops.length - 1] : null,
              i = this.ops.length > 1 ? this.ops[this.ops.length - 2] : null;
            return (
              n && n.isInsert() && n.attributesEqual(r)
                ? (n.text += e)
                : n && n.isDelete()
                ? i && i.isInsert() && i.attributesEqual(r)
                  ? (i.text += e)
                  : ((this.ops[this.ops.length - 1] = new t("insert", e, r)),
                    this.ops.push(n))
                : this.ops.push(new t("insert", e, r)),
              this
            );
          }),
          (r.prototype.delete = function (e) {
            if (
              ("string" == typeof e && (e = e.length),
              "number" != typeof e || e < 0)
            )
              throw new Error("delete expects a positive integer or a string");
            if (0 === e) return this;
            this.baseLength += e;
            var r = this.ops.length > 0 ? this.ops[this.ops.length - 1] : null;
            return (
              r && r.isDelete()
                ? (r.chars += e)
                : this.ops.push(new t("delete", e)),
              this
            );
          }),
          (r.prototype.isNoop = function () {
            return (
              0 === this.ops.length ||
              (1 === this.ops.length &&
                this.ops[0].isRetain() &&
                this.ops[0].hasEmptyAttributes())
            );
          }),
          (r.prototype.clone = function () {
            for (var t = new r(), e = 0; e < this.ops.length; e++)
              this.ops[e].isRetain()
                ? t.retain(this.ops[e].chars, this.ops[e].attributes)
                : this.ops[e].isInsert()
                ? t.insert(this.ops[e].text, this.ops[e].attributes)
                : t.delete(this.ops[e].chars);
            return t;
          }),
          (r.prototype.toString = function () {
            return (
              Array.prototype.map ||
              function (t) {
                for (var e = [], r = 0, n = this.length; r < n; r++)
                  e[r] = t(this[r]);
                return e;
              }
            )
              .call(this.ops, function (t) {
                return t.isRetain()
                  ? "retain " + t.chars
                  : t.isInsert()
                  ? "insert '" + t.text + "'"
                  : "delete " + t.chars;
              })
              .join(", ");
          }),
          (r.prototype.toJSON = function () {
            for (var t = [], e = 0; e < this.ops.length; e++)
              this.ops[e].hasEmptyAttributes() ||
                t.push(this.ops[e].attributes),
                "retain" === this.ops[e].type
                  ? t.push(this.ops[e].chars)
                  : "insert" === this.ops[e].type
                  ? t.push(this.ops[e].text)
                  : "delete" === this.ops[e].type && t.push(-this.ops[e].chars);
            return 0 === t.length && t.push(0), t;
          }),
          (r.fromJSON = function (t) {
            for (var n = new r(), i = 0, o = t.length; i < o; i++) {
              var s = t[i],
                a = {};
              "object" == typeof s && ((a = s), (s = t[++i])),
                "number" == typeof s
                  ? s > 0
                    ? n.retain(s, a)
                    : n.delete(-s)
                  : (e.assert("string" == typeof s), n.insert(s, a));
            }
            return n;
          }),
          (r.prototype.apply = function (t, r, n) {
            if (((r = r || []), (n = n || []), t.length !== this.baseLength))
              throw new Error(
                "The operation's base length must be equal to the string's length."
              );
            for (
              var i, o, s = [], a = 0, h = 0, c = this.ops, u = 0, l = c.length;
              u < l;
              u++
            ) {
              var p = c[u];
              if (p.isRetain()) {
                if (h + p.chars > t.length)
                  throw new Error(
                    "Operation can't retain more characters than are left in the string."
                  );
                for (
                  s[a++] = t.slice(h, h + p.chars), i = 0;
                  i < p.chars;
                  i++
                ) {
                  var d = r[h + i] || {},
                    f = {};
                  for (o in d) (f[o] = d[o]), e.assert(!1 !== f[o]);
                  for (o in p.attributes)
                    !1 === p.attributes[o]
                      ? delete f[o]
                      : (f[o] = p.attributes[o]),
                      e.assert(!1 !== f[o]);
                  n.push(f);
                }
                h += p.chars;
              } else if (p.isInsert())
                for (s[a++] = p.text, i = 0; i < p.text.length; i++) {
                  var g = {};
                  for (o in p.attributes)
                    (g[o] = p.attributes[o]), e.assert(!1 !== g[o]);
                  n.push(g);
                }
              else h += p.chars;
            }
            if (h !== t.length)
              throw new Error(
                "The operation didn't operate on the whole string."
              );
            var m = s.join("");
            return e.assert(m.length === n.length), m;
          }),
          (r.prototype.invert = function (t) {
            for (
              var e = 0, n = new r(), i = this.ops, o = 0, s = i.length;
              o < s;
              o++
            ) {
              var a = i[o];
              a.isRetain()
                ? (n.retain(a.chars), (e += a.chars))
                : a.isInsert()
                ? n.delete(a.text.length)
                : (n.insert(t.slice(e, e + a.chars)), (e += a.chars));
            }
            return n;
          }),
          (r.prototype.compose = function (t) {
            if (this.targetLength !== t.baseLength)
              throw new Error(
                "The base length of the second operation has to be the target length of the first operation"
              );
            function e(t, e, r) {
              var n,
                i = {};
              for (n in t) i[n] = t[n];
              for (n in e) r && !1 === e[n] ? delete i[n] : (i[n] = e[n]);
              return i;
            }
            for (
              var n,
                i = new r(),
                o = this.clone().ops,
                s = t.clone().ops,
                a = 0,
                h = 0,
                c = o[a++],
                u = s[h++];
              void 0 !== c || void 0 !== u;

            )
              if (c && c.isDelete()) i.delete(c.chars), (c = o[a++]);
              else if (u && u.isInsert())
                i.insert(u.text, u.attributes), (u = s[h++]);
              else {
                if (void 0 === c)
                  throw new Error(
                    "Cannot compose operations: first operation is too short."
                  );
                if (void 0 === u)
                  throw new Error(
                    "Cannot compose operations: first operation is too long."
                  );
                if (c.isRetain() && u.isRetain())
                  (n = e(c.attributes, u.attributes)),
                    c.chars > u.chars
                      ? (i.retain(u.chars, n),
                        (c.chars -= u.chars),
                        (u = s[h++]))
                      : c.chars === u.chars
                      ? (i.retain(c.chars, n), (c = o[a++]), (u = s[h++]))
                      : (i.retain(c.chars, n),
                        (u.chars -= c.chars),
                        (c = o[a++]));
                else if (c.isInsert() && u.isDelete())
                  c.text.length > u.chars
                    ? ((c.text = c.text.slice(u.chars)), (u = s[h++]))
                    : c.text.length === u.chars
                    ? ((c = o[a++]), (u = s[h++]))
                    : ((u.chars -= c.text.length), (c = o[a++]));
                else if (c.isInsert() && u.isRetain())
                  (n = e(c.attributes, u.attributes, !0)),
                    c.text.length > u.chars
                      ? (i.insert(c.text.slice(0, u.chars), n),
                        (c.text = c.text.slice(u.chars)),
                        (u = s[h++]))
                      : c.text.length === u.chars
                      ? (i.insert(c.text, n), (c = o[a++]), (u = s[h++]))
                      : (i.insert(c.text, n),
                        (u.chars -= c.text.length),
                        (c = o[a++]));
                else {
                  if (!c.isRetain() || !u.isDelete())
                    throw new Error(
                      "This shouldn't happen: op1: " +
                        JSON.stringify(c) +
                        ", op2: " +
                        JSON.stringify(u)
                    );
                  c.chars > u.chars
                    ? (i.delete(u.chars), (c.chars -= u.chars), (u = s[h++]))
                    : c.chars === u.chars
                    ? (i.delete(u.chars), (c = o[a++]), (u = s[h++]))
                    : (i.delete(c.chars), (u.chars -= c.chars), (c = o[a++]));
                }
              }
            return i;
          }),
          (r.prototype.shouldBeComposedWith = function (t) {
            if (this.isNoop() || t.isNoop()) return !0;
            var e = o(this),
              r = o(t),
              n = i(this),
              s = i(t);
            return (
              !(!n || !s) &&
              (n.isInsert() && s.isInsert()
                ? e + n.text.length === r
                : !(!n.isDelete() || !s.isDelete()) &&
                  (r + s.chars === e || e === r))
            );
          }),
          (r.prototype.shouldBeComposedWithInverted = function (t) {
            if (this.isNoop() || t.isNoop()) return !0;
            var e = o(this),
              r = o(t),
              n = i(this),
              s = i(t);
            return (
              !(!n || !s) &&
              (n.isInsert() && s.isInsert()
                ? e + n.text.length === r || e === r
                : !(!n.isDelete() || !s.isDelete()) && r + s.chars === e)
            );
          }),
          (r.transformAttributes = function (t, r) {
            var n,
              i = {},
              o = {},
              s = {};
            for (n in t) s[n] = !0;
            for (n in r) s[n] = !0;
            for (n in s) {
              var a = t[n],
                h = r[n];
              e.assert(null != a || null != h),
                null == a
                  ? (o[n] = h)
                  : null == h
                  ? (i[n] = a)
                  : a === h || (i[n] = a);
            }
            return [i, o];
          }),
          (r.transform = function (t, e) {
            if (t.baseLength !== e.baseLength)
              throw new Error(
                "Both operations have to have the same base length"
              );
            for (
              var n = new r(),
                i = new r(),
                o = t.clone().ops,
                s = e.clone().ops,
                a = 0,
                h = 0,
                c = o[a++],
                u = s[h++];
              void 0 !== c || void 0 !== u;

            )
              if (c && c.isInsert())
                n.insert(c.text, c.attributes),
                  i.retain(c.text.length),
                  (c = o[a++]);
              else if (u && u.isInsert())
                n.retain(u.text.length),
                  i.insert(u.text, u.attributes),
                  (u = s[h++]);
              else {
                if (void 0 === c)
                  throw new Error(
                    "Cannot transform operations: first operation is too short."
                  );
                if (void 0 === u)
                  throw new Error(
                    "Cannot transform operations: first operation is too long."
                  );
                var l;
                if (c.isRetain() && u.isRetain()) {
                  var p = r.transformAttributes(c.attributes, u.attributes);
                  c.chars > u.chars
                    ? ((l = u.chars), (c.chars -= u.chars), (u = s[h++]))
                    : c.chars === u.chars
                    ? ((l = u.chars), (c = o[a++]), (u = s[h++]))
                    : ((l = c.chars), (u.chars -= c.chars), (c = o[a++])),
                    n.retain(l, p[0]),
                    i.retain(l, p[1]);
                } else if (c.isDelete() && u.isDelete())
                  c.chars > u.chars
                    ? ((c.chars -= u.chars), (u = s[h++]))
                    : c.chars === u.chars
                    ? ((c = o[a++]), (u = s[h++]))
                    : ((u.chars -= c.chars), (c = o[a++]));
                else if (c.isDelete() && u.isRetain())
                  c.chars > u.chars
                    ? ((l = u.chars), (c.chars -= u.chars), (u = s[h++]))
                    : c.chars === u.chars
                    ? ((l = u.chars), (c = o[a++]), (u = s[h++]))
                    : ((l = c.chars), (u.chars -= c.chars), (c = o[a++])),
                    n.delete(l);
                else {
                  if (!c.isRetain() || !u.isDelete())
                    throw new Error("The two operations aren't compatible");
                  c.chars > u.chars
                    ? ((l = u.chars), (c.chars -= u.chars), (u = s[h++]))
                    : c.chars === u.chars
                    ? ((l = c.chars), (c = o[a++]), (u = s[h++]))
                    : ((l = c.chars), (u.chars -= c.chars), (c = o[a++])),
                    i.delete(l);
                }
              }
            return [n, i];
          }),
          (r.prototype.transform = function (t) {
            return r.transform(this, t);
          }),
          r
        );
      })()),
      ((n = n || {}).AnnotationList = (function () {
        var t = n.Span;
        function e(t, e) {
          if (!t)
            throw new Error(
              "AnnotationList assertion failed" + (e ? ": " + e : "")
            );
        }
        function r(t, e) {
          (this.pos = t),
            (this.length = e.length),
            (this.annotation = e.annotation),
            (this.attachedObject_ = e.attachedObject);
        }
        function i(t, e) {
          (this.pos = t),
            (this.length = e.length),
            (this.annotation = e.annotation),
            (this.node_ = e);
        }
        (r.prototype.getAttachedObject = function () {
          return this.attachedObject_;
        }),
          (i.prototype.attachObject = function (t) {
            this.node_.attachedObject = t;
          });
        var o = {
          equals: function () {
            return !1;
          },
        };
        function s(t) {
          (this.head_ = new a(0, o)), (this.changeHandler_ = t);
        }
        function a(t, e) {
          (this.length = t),
            (this.annotation = e),
            (this.attachedObject = null),
            (this.next = null);
        }
        return (
          (s.prototype.insertAnnotatedSpan = function (r, n) {
            this.wrapOperation_(new t(r.pos, 0), function (t, i) {
              e(!i || null === i.next);
              var s = new a(r.length, n);
              if (i) {
                e(r.pos > t && r.pos < t + i.length);
                var h = new a(0, o);
                return (
                  (h.next = new a(r.pos - t, i.annotation)),
                  (h.next.next = s),
                  (s.next = new a(t + i.length - r.pos, i.annotation)),
                  h.next
                );
              }
              return s;
            });
          }),
          (s.prototype.removeSpan = function (t) {
            0 !== t.length &&
              this.wrapOperation_(t, function (r, n) {
                e(null !== n);
                var i = new a(0, o),
                  s = i;
                for (
                  t.pos > r &&
                  ((s.next = new a(t.pos - r, n.annotation)), (s = s.next));
                  t.end() > r + n.length;

                )
                  (r += n.length), (n = n.next);
                var h = r + n.length - t.end();
                return h > 0 && (s.next = new a(h, n.annotation)), i.next;
              });
          }),
          (s.prototype.updateSpan = function (t, r) {
            0 !== t.length &&
              this.wrapOperation_(t, function (n, i) {
                e(null !== i);
                var s = new a(0, o),
                  h = s,
                  c = n,
                  u = t.pos - c;
                for (
                  e(u < i.length),
                    u > 0 &&
                      ((h.next = new a(u, i.annotation)),
                      (c += (h = h.next).length));
                  null !== i && t.end() >= n + i.length;

                ) {
                  var l = n + i.length - c;
                  (h.next = new a(l, r(i.annotation, l))),
                    (h = h.next),
                    (n += i.length),
                    (i = i.next),
                    (c = n);
                }
                var p = t.end() - c;
                return (
                  p > 0 &&
                    (e(p < i.length),
                    (h.next = new a(p, r(i.annotation, p))),
                    (c += (h = h.next).length),
                    (h.next = new a(n + i.length - c, i.annotation))),
                  s.next
                );
              });
          }),
          (s.prototype.wrapOperation_ = function (t, e) {
            if (t.pos < 0) throw new Error("Span start cannot be negative.");
            var n,
              o = [],
              s = [],
              h = this.getAffectedNodes_(t);
            null !== h.start
              ? ((n = h.end.next), (h.end.next = null))
              : (n = h.succ);
            var c = e(h.startPos, h.start),
              u = !1,
              l = !1;
            if (c) {
              var p;
              for (
                this.mergeNodesWithSameAnnotations_(c),
                  h.pred && h.pred.annotation.equals(c.annotation)
                    ? ((u = !0),
                      (c.length += h.pred.length),
                      (h.beforePred.next = c),
                      (p = h.predPos))
                    : ((h.beforeStart.next = c), (p = h.startPos));
                c.next;

              )
                s.push(new i(p, c)), (p += c.length), (c = c.next);
              h.succ && h.succ.annotation.equals(c.annotation)
                ? ((c.length += h.succ.length),
                  (l = !0),
                  (c.next = h.succ.next))
                : (c.next = n),
                s.push(new i(p, c));
            } else
              h.pred && h.succ && h.pred.annotation.equals(h.succ.annotation)
                ? ((u = !0),
                  (l = !0),
                  (c = new a(h.pred.length + h.succ.length, h.pred.annotation)),
                  (h.beforePred.next = c),
                  (c.next = h.succ.next),
                  s.push(new i(h.startPos - h.pred.length, c)))
                : (h.beforeStart.next = n);
            u && o.push(new r(h.predPos, h.pred));
            for (var d = h.startPos, f = h.start; null !== f; )
              o.push(new r(d, f)), (d += f.length), (f = f.next);
            l && o.push(new r(d, h.succ)), this.changeHandler_(o, s);
          }),
          (s.prototype.getAffectedNodes_ = function (t) {
            for (
              var e = {}, r = null, n = this.head_, i = n.next, o = 0;
              null !== i && t.pos >= o + i.length;

            )
              (o += i.length), (r = n), (n = i), (i = i.next);
            if (null === i && (0 !== t.length || t.pos !== o))
              throw new Error(
                "Span start exceeds the bounds of the AnnotationList."
              );
            for (
              e.startPos = o,
                0 === t.length && t.pos === o
                  ? (e.start = null)
                  : (e.start = i),
                e.beforeStart = n,
                o === t.pos && o > 0
                  ? ((e.pred = n),
                    (e.predPos = o - n.length),
                    (e.beforePred = r))
                  : (e.pred = null);
              null !== i && t.end() > o;

            )
              (o += i.length), (n = i), (i = i.next);
            if (t.end() > o)
              throw new Error(
                "Span end exceeds the bounds of the AnnotationList."
              );
            return (
              0 === t.length && t.end() === o ? (e.end = null) : (e.end = n),
              (e.succ = o === t.end() ? i : null),
              e
            );
          }),
          (s.prototype.mergeNodesWithSameAnnotations_ = function (t) {
            if (t)
              for (var e = null, r = t; r; )
                e && e.annotation.equals(r.annotation)
                  ? ((e.length += r.length), (e.next = r.next))
                  : (e = r),
                  (r = r.next);
          }),
          (s.prototype.forEach = function (t) {
            for (var e = this.head_.next; null !== e; )
              t(e.length, e.annotation, e.attachedObject), (e = e.next);
          }),
          (s.prototype.getAnnotatedSpansForPos = function (t) {
            for (
              var e = 0, n = this.head_.next, i = null;
              null !== n && e + n.length <= t;

            )
              (e += n.length), (i = n), (n = n.next);
            if (null === n && e !== t)
              throw new Error("pos exceeds the bounds of the AnnotationList");
            var o = [];
            return (
              e === t && i && o.push(new r(e - i.length, i)),
              n && o.push(new r(e, n)),
              o
            );
          }),
          (s.prototype.getAnnotatedSpansForSpan = function (e) {
            if (0 === e.length) return [];
            for (
              var r = [],
                n = this.getAffectedNodes_(e),
                i = n.startPos,
                o = n.start;
              null !== o && i < e.end();

            ) {
              var s = Math.max(i, e.pos),
                a = Math.min(i + o.length, e.end()),
                h = new t(s, a - s);
              (h.annotation = o.annotation),
                r.push(h),
                (i += o.length),
                (o = o.next);
            }
            return r;
          }),
          (s.prototype.count = function () {
            for (var t = 0, r = this.head_.next, n = null; null !== r; )
              n && e(!n.annotation.equals(r.annotation)),
                (n = r),
                (r = r.next),
                t++;
            return t;
          }),
          (a.prototype.clone = function () {
            var t = new a(this.spanLength, this.annotation);
            return (t.next = this.next), t;
          }),
          s
        );
      })()),
      ((n = n || {}).Cursor = (function () {
        "use strict";
        function t(t, e) {
          (this.position = t), (this.selectionEnd = e);
        }
        return (
          (t.fromJSON = function (e) {
            return new t(e.position, e.selectionEnd);
          }),
          (t.prototype.equals = function (t) {
            return (
              this.position === t.position &&
              this.selectionEnd === t.selectionEnd
            );
          }),
          (t.prototype.compose = function (t) {
            return t;
          }),
          (t.prototype.transform = function (e) {
            function r(t) {
              for (
                var r = t, n = e.ops, i = 0, o = e.ops.length;
                i < o &&
                (n[i].isRetain()
                  ? (t -= n[i].chars)
                  : n[i].isInsert()
                  ? (r += n[i].text.length)
                  : ((r -= Math.min(t, n[i].chars)), (t -= n[i].chars)),
                !(t < 0));
                i++
              );
              return r;
            }
            var n = r(this.position);
            return this.position === this.selectionEnd
              ? new t(n, n)
              : new t(n, r(this.selectionEnd));
          }),
          t
        );
      })()),
      ((n = n || {}).FirebaseAdapter = (function (t) {
        "undefined" == typeof firebase &&
          "function" == typeof require &&
          "function" != typeof Firebase &&
          ((firebase = require("firebase/app")), require("firebase/database"));
        var e = n.TextOperation,
          r = n.utils;
        function i(t, r, n) {
          (this.ref_ = t),
            (this.ready_ = !1),
            (this.firebaseCallbacks_ = []),
            (this.zombie_ = !1),
            (this.document_ = new e()),
            (this.revision_ = 0),
            (this.pendingReceivedRevisions_ = {});
          var i = this;
          if (r) {
            this.setUserId(r), this.setColor(n);
            var o = t.root.child(".info/connected");
            this.firebaseOn_(
              o,
              "value",
              function (t) {
                !0 === t.val() && i.initializeUserData_();
              },
              this
            ),
              this.on("ready", function () {
                i.monitorCursors_();
              });
          } else this.userId_ = t.push().key;
          setTimeout(function () {
            i.monitorHistory_();
          }, 0);
        }
        function o(t, e) {
          if (!t) throw new Error(e || "assertion error");
        }
        r.makeEventEmitter(i, ["ready", "cursor", "operation", "ack", "retry"]),
          (i.prototype.dispose = function () {
            var t = this;
            this.removeFirebaseCallbacks_(),
              (this.handleInitialRevisions_ = () => {}),
              this.ready_
                ? (this.userRef_ &&
                    (this.userRef_.child("cursor").remove(),
                    this.userRef_.child("color").remove()),
                  (this.ref_ = null),
                  (this.document_ = null),
                  (this.zombie_ = !0))
                : this.on("ready", function () {
                    t.dispose();
                  });
          }),
          (i.prototype.setUserId = function (t) {
            this.userRef_ &&
              (this.userRef_.child("cursor").remove(),
              this.userRef_.child("cursor").onDisconnect().cancel(),
              this.userRef_.child("color").remove(),
              this.userRef_.child("color").onDisconnect().cancel()),
              (this.userId_ = t),
              (this.userRef_ = this.ref_.child("users").child(t)),
              this.initializeUserData_();
          }),
          (i.prototype.isHistoryEmpty = function () {
            return o(this.ready_, "Not ready yet."), 0 === this.revision_;
          }),
          (i.prototype.sendOperation = function (t, e) {
            var n = this;
            if (this.ready_) {
              o(
                this.document_.targetLength === t.baseLength,
                "sendOperation() called with invalid operation."
              );
              var i = a(this.revision_);
              (this.sent_ = { id: i, op: t }),
                (function t(i, o) {
                  n.ref_
                    .child("history")
                    .child(i)
                    .transaction(
                      function (t) {
                        if (null === t) return o;
                      },
                      function (s, a, h) {
                        if (s) {
                          if ("disconnect" !== s.message)
                            throw (r.log("Transaction failure!", s), s);
                          n.sent_ && n.sent_.id === i
                            ? setTimeout(function () {
                                t(i, o);
                              }, 0)
                            : e && e(s, !1);
                        } else e && e(null, a);
                      },
                      !1
                    );
                })(i, {
                  a: n.userId_,
                  o: t.toJSON(),
                  t: firebase.database.ServerValue.TIMESTAMP,
                });
            } else
              this.on("ready", function () {
                n.trigger("retry");
              });
          }),
          (i.prototype.sendCursor = function (t) {
            this.userRef_.child("cursor").set(t), (this.cursor_ = t);
          }),
          (i.prototype.setColor = function (t) {
            this.userRef_.child("color").set(t), (this.color_ = t);
          }),
          (i.prototype.getDocument = function () {
            return this.document_;
          }),
          (i.prototype.registerCallbacks = function (t) {
            for (var e in t) this.on(e, t[e]);
          }),
          (i.prototype.initializeUserData_ = function () {
            this.userRef_.child("cursor").onDisconnect().remove(),
              this.userRef_.child("color").onDisconnect().remove(),
              this.sendCursor(this.cursor_ || null),
              this.setColor(this.color_ || null);
          }),
          (i.prototype.monitorCursors_ = function () {
            var t = this.ref_.child("users"),
              e = this;
            function r(t) {
              var r = t.key,
                n = t.val();
              e.trigger("cursor", r, n.cursor, n.color);
            }
            this.firebaseOn_(t, "child_added", r),
              this.firebaseOn_(t, "child_changed", r),
              this.firebaseOn_(t, "child_removed", function (t) {
                var r = t.key;
                e.trigger("cursor", r, null);
              });
          }),
          (i.prototype.monitorHistory_ = function () {
            var t = this;
            this.ref_.child("checkpoint").once("value", function (e) {
              if (!t.zombie_) {
                var r = e.child("id").val(),
                  n = e.child("o").val(),
                  i = e.child("a").val();
                null != n && null != r && null !== i
                  ? ((t.pendingReceivedRevisions_[r] = { o: n, a: i }),
                    (t.checkpointRevision_ = (function (t) {
                      o(t.length > 0 && t[0] === s[t.length + 8]);
                      for (var e = 0, r = 1; r < t.length; r++)
                        (e *= s.length), (e += s.indexOf(t[r]));
                      return e;
                    })(r)),
                    t.monitorHistoryStartingAt_(t.checkpointRevision_ + 1))
                  : ((t.checkpointRevision_ = 0),
                    t.monitorHistoryStartingAt_(t.checkpointRevision_));
              }
            });
          }),
          (i.prototype.monitorHistoryStartingAt_ = function (t) {
            var e = this.ref_.child("history").startAt(null, a(t)),
              r = this;
            setTimeout(function () {
              r.firebaseOn_(e, "child_added", function (t) {
                var e = t.key;
                (r.pendingReceivedRevisions_[e] = t.val()),
                  r.ready_ && r.handlePendingReceivedRevisions_();
              }),
                e.once("value", function () {
                  r.handleInitialRevisions_();
                });
            }, 0);
          }),
          (i.prototype.handleInitialRevisions_ = function () {
            o(!this.ready_, "Should not be called multiple times."),
              (this.revision_ = this.checkpointRevision_);
            for (
              var t = a(this.revision_), e = this.pendingReceivedRevisions_;
              null != e[t];

            ) {
              var n = this.parseRevision_(e[t]);
              n
                ? (this.document_ = this.document_.compose(n.operation))
                : r.log("Invalid operation.", this.ref_.toString(), t, e[t]),
                delete e[t],
                this.revision_++,
                (t = a(this.revision_));
            }
            this.trigger("operation", this.document_), (this.ready_ = !0);
            var i = this;
            setTimeout(function () {
              i.trigger("ready");
            }, 0);
          }),
          (i.prototype.handlePendingReceivedRevisions_ = function () {
            for (
              var t = this.pendingReceivedRevisions_,
                e = a(this.revision_),
                n = !1;
              null != t[e];

            ) {
              this.revision_++;
              var i = this.parseRevision_(t[e]);
              i
                ? ((this.document_ = this.document_.compose(i.operation)),
                  this.sent_ && e === this.sent_.id
                    ? this.sent_.op.equals(i.operation) &&
                      i.author === this.userId_
                      ? (this.revision_ % 100 == 0 && this.saveCheckpoint_(),
                        (this.sent_ = null),
                        this.trigger("ack"))
                      : ((n = !0), this.trigger("operation", i.operation))
                    : this.trigger("operation", i.operation))
                : r.log("Invalid operation.", this.ref_.toString(), e, t[e]),
                delete t[e],
                (e = a(this.revision_));
            }
            n && ((this.sent_ = null), this.trigger("retry"));
          }),
          (i.prototype.parseRevision_ = function (t) {
            if ("object" != typeof t) return null;
            if ("string" != typeof t.a || "object" != typeof t.o) return null;
            var r = null;
            try {
              r = e.fromJSON(t.o);
            } catch (t) {
              return null;
            }
            return r.baseLength !== this.document_.targetLength
              ? null
              : { author: t.a, operation: r };
          }),
          (i.prototype.saveCheckpoint_ = function () {
            this.ref_.child("checkpoint").set({
              a: this.userId_,
              o: this.document_.toJSON(),
              id: a(this.revision_ - 1),
            });
          }),
          (i.prototype.firebaseOn_ = function (t, e, r, n) {
            return (
              this.firebaseCallbacks_.push({
                ref: t,
                eventType: e,
                callback: r,
                context: n,
              }),
              t.on(e, r, n),
              r
            );
          }),
          (i.prototype.firebaseOff_ = function (t, e, r, n) {
            t.off(e, r, n);
            for (var i = 0; i < this.firebaseCallbacks_.length; i++) {
              var o = this.firebaseCallbacks_[i];
              if (
                o.ref === t &&
                o.eventType === e &&
                o.callback === r &&
                o.context === n
              ) {
                this.firebaseCallbacks_.splice(i, 1);
                break;
              }
            }
          }),
          (i.prototype.removeFirebaseCallbacks_ = function () {
            for (var t = 0; t < this.firebaseCallbacks_.length; t++) {
              var e = this.firebaseCallbacks_[t];
              e.ref.off(e.eventType, e.callback, e.context);
            }
            this.firebaseCallbacks_ = [];
          });
        var s =
          "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        function a(t) {
          if (0 === t) return "A0";
          for (var e = ""; t > 0; ) {
            var r = t % s.length;
            (e = s[r] + e), (t -= r), (t /= s.length);
          }
          return s[e.length + 9] + e;
        }
        return i;
      })()),
      ((n = n || {}).RichTextToolbar = (function (t) {
        var e = n.utils;
        function r(t) {
          (this.imageInsertionUI = t), (this.element_ = this.makeElement_());
        }
        return (
          e.makeEventEmitter(r, [
            "bold",
            "italic",
            "underline",
            "strike",
            "font",
            "font-size",
            "color",
            "left",
            "center",
            "right",
            "unordered-list",
            "ordered-list",
            "todo-list",
            "indent-increase",
            "indent-decrease",
            "undo",
            "redo",
          ]),
          (r.prototype.element = function () {
            return this.element_;
          }),
          (r.prototype.makeButton_ = function (t, r) {
            var n = this;
            r = r || t;
            var i = e.elt(
              "a",
              [e.elt("span", "", { class: "firepad-tb-" + r })],
              { class: "firepad-btn" }
            );
            return (
              e.on(
                i,
                "click",
                e.stopEventAnd(function () {
                  n.trigger(t);
                })
              ),
              i
            );
          }),
          (r.prototype.makeElement_ = function () {
            var t = this.makeFontDropdown_(),
              r = this.makeFontSizeDropdown_(),
              n = this.makeColorDropdown_(),
              i = [
                e.elt("div", [t], { class: "firepad-btn-group" }),
                e.elt("div", [r], { class: "firepad-btn-group" }),
                e.elt("div", [n], { class: "firepad-btn-group" }),
                e.elt(
                  "div",
                  [
                    this.makeButton_("bold"),
                    this.makeButton_("italic"),
                    this.makeButton_("underline"),
                    this.makeButton_("strike", "strikethrough"),
                  ],
                  { class: "firepad-btn-group" }
                ),
                e.elt(
                  "div",
                  [
                    this.makeButton_("unordered-list", "list-2"),
                    this.makeButton_("ordered-list", "numbered-list"),
                    this.makeButton_("todo-list", "list"),
                  ],
                  { class: "firepad-btn-group" }
                ),
                e.elt(
                  "div",
                  [
                    this.makeButton_("indent-decrease"),
                    this.makeButton_("indent-increase"),
                  ],
                  { class: "firepad-btn-group" }
                ),
                e.elt(
                  "div",
                  [
                    this.makeButton_("left", "paragraph-left"),
                    this.makeButton_("center", "paragraph-center"),
                    this.makeButton_("right", "paragraph-right"),
                  ],
                  { class: "firepad-btn-group" }
                ),
                e.elt(
                  "div",
                  [this.makeButton_("undo"), this.makeButton_("redo")],
                  { class: "firepad-btn-group" }
                ),
              ];
            var o = e.elt("div", i, { class: "firepad-toolbar-wrapper" }),
              s = e.elt("div", null, { class: "firepad-toolbar" });
            return s.appendChild(o), s;
          }),
          (r.prototype.makeFontDropdown_ = function () {
            for (
              var t = [
                  "Arial",
                  "Comic Sans MS",
                  "Courier New",
                  "Impact",
                  "Times New Roman",
                  "Verdana",
                ],
                r = [],
                n = 0;
              n < t.length;
              n++
            ) {
              var i = e.elt("span", t[n]);
              i.setAttribute("style", "font-family:" + t[n]),
                r.push({ content: i, value: t[n] });
            }
            return this.makeDropdown_("Font", "font", r, "", "fa fa-font");
          }),
          (r.prototype.makeFontSizeDropdown_ = function () {
            for (
              var t = [9, 10, 12, 14, 18, 24, 32, 42], r = [], n = 0;
              n < t.length;
              n++
            ) {
              var i = e.elt("span", t[n].toString());
              i.setAttribute("style", "font-size: 14px; line-height: 20px;"),
                r.push({ content: i, value: t[n] });
            }
            return this.makeDropdown_(
              "Size",
              "font-size",
              r,
              "px",
              "ri-font-size"
            );
          }),
          (r.prototype.makeColorDropdown_ = function () {
            for (
              var t = [
                  "black",
                  "red",
                  "green",
                  "blue",
                  "yellow",
                  "cyan",
                  "magenta",
                  "grey",
                ],
                r = [],
                n = 0;
              n < t.length;
              n++
            ) {
              var i = e.elt("div");
              (i.className = "firepad-color-dropdown-item"),
                i.setAttribute("style", "background-color:" + t[n]),
                r.push({ content: i, value: t[n] });
            }
            return this.makeDropdown_("Color", "color", r, "", "ri-font-color");
          }),
          (r.prototype.makeDropdown_ = function (t, r, n, i, fontClass) {
            var o = this,
              s = e.elt("a", "", {
                class: "firepad-btn firepad-dropdown",
              }),
              a = e.elt("ul", [], { class: "firepad-dropdown-menu" });
            font = e.elt("i", [], { class: fontClass });
            s.appendChild(font);
            s.appendChild(a);
            var h = !1;
            var c = !1;
            function u() {
              h &&
                ((a.style.display = ""),
                e.off(document, "click", u, !0),
                (h = !1)),
                (c = !0),
                setTimeout(function () {
                  c = !1;
                }, 0);
            }
            function l(t, n) {
              "object" != typeof t && (t = document.createTextNode(String(t)));
              var s = e.elt("a", [t]);
              e.on(
                s,
                "click",
                e.stopEventAnd(function () {
                  u(), o.trigger(r, n + i);
                })
              ),
                a.appendChild(s);
            }
            for (var p = 0; p < n.length; p++) {
              l(n[p].content, n[p].value);
            }
            return (
              e.on(
                s,
                "click",
                e.stopEventAnd(function () {
                  c ||
                    h ||
                    ((a.style.display = "block"),
                    e.on(document, "click", u, !0),
                    (h = !0));
                })
              ),
              s
            );
          }),
          r
        );
      })()),
      ((n = n || {}).WrappedOperation = (function (t) {
        "use strict";
        function e(t, e) {
          (this.wrapped = t), (this.meta = e);
        }
        function r(t, e) {
          for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
        }
        function n(t, e) {
          return t && "object" == typeof t && "function" == typeof t.transform
            ? t.transform(e)
            : t;
        }
        return (
          (e.prototype.apply = function () {
            return this.wrapped.apply.apply(this.wrapped, arguments);
          }),
          (e.prototype.invert = function () {
            var t = this.meta;
            return new e(
              this.wrapped.invert.apply(this.wrapped, arguments),
              t && "object" == typeof t && "function" == typeof t.invert
                ? t.invert.apply(t, arguments)
                : t
            );
          }),
          (e.prototype.compose = function (t) {
            return new e(
              this.wrapped.compose(t.wrapped),
              (function (t, e) {
                if (t && "object" == typeof t) {
                  if ("function" == typeof t.compose) return t.compose(e);
                  var n = {};
                  return r(t, n), r(e, n), n;
                }
                return e;
              })(this.meta, t.meta)
            );
          }),
          (e.transform = function (t, r) {
            var i = t.wrapped.transform(r.wrapped);
            return [
              new e(i[0], n(t.meta, r.wrapped)),
              new e(i[1], n(r.meta, t.wrapped)),
            ];
          }),
          (e.prototype.transform = function (t) {
            return e.transform(this, t);
          }),
          e
        );
      })()),
      ((n = n || {}).UndoManager = (function () {
        "use strict";
        var t = "normal";
        function e(e) {
          (this.maxItems = e || 50),
            (this.state = t),
            (this.dontCompose = !1),
            (this.undoStack = []),
            (this.redoStack = []);
        }
        function r(t, e) {
          for (var r = [], n = e.constructor, i = t.length - 1; i >= 0; i--) {
            var o = n.transform(t[i], e);
            ("function" == typeof o[0].isNoop && o[0].isNoop()) || r.push(o[0]),
              (e = o[1]);
          }
          return r.reverse();
        }
        return (
          (e.prototype.add = function (t, e) {
            if ("undoing" === this.state)
              this.redoStack.push(t), (this.dontCompose = !0);
            else if ("redoing" === this.state)
              this.undoStack.push(t), (this.dontCompose = !0);
            else {
              var r = this.undoStack;
              !this.dontCompose && e && r.length > 0
                ? r.push(t.compose(r.pop()))
                : (r.push(t), r.length > this.maxItems && r.shift()),
                (this.dontCompose = !1),
                (this.redoStack = []);
            }
          }),
          (e.prototype.transform = function (t) {
            (this.undoStack = r(this.undoStack, t)),
              (this.redoStack = r(this.redoStack, t));
          }),
          (e.prototype.performUndo = function (e) {
            if (((this.state = "undoing"), 0 === this.undoStack.length))
              throw new Error("undo not possible");
            e(this.undoStack.pop()), (this.state = t);
          }),
          (e.prototype.performRedo = function (e) {
            if (((this.state = "redoing"), 0 === this.redoStack.length))
              throw new Error("redo not possible");
            e(this.redoStack.pop()), (this.state = t);
          }),
          (e.prototype.canUndo = function () {
            return 0 !== this.undoStack.length;
          }),
          (e.prototype.canRedo = function () {
            return 0 !== this.redoStack.length;
          }),
          (e.prototype.isUndoing = function () {
            return "undoing" === this.state;
          }),
          (e.prototype.isRedoing = function () {
            return "redoing" === this.state;
          }),
          e
        );
      })()),
      ((n = n || {}).Client = (function () {
        "use strict";
        function t() {
          this.state = r;
        }
        function e() {}
        (t.prototype.setState = function (t) {
          this.state = t;
        }),
          (t.prototype.applyClient = function (t) {
            this.setState(this.state.applyClient(this, t));
          }),
          (t.prototype.applyServer = function (t) {
            this.setState(this.state.applyServer(this, t));
          }),
          (t.prototype.serverAck = function () {
            this.setState(this.state.serverAck(this));
          }),
          (t.prototype.serverRetry = function () {
            this.setState(this.state.serverRetry(this));
          }),
          (t.prototype.sendOperation = function (t) {
            throw new Error("sendOperation must be defined in child class");
          }),
          (t.prototype.applyOperation = function (t) {
            throw new Error("applyOperation must be defined in child class");
          }),
          (t.Synchronized = e),
          (e.prototype.applyClient = function (t, e) {
            return t.sendOperation(e), new n(e);
          }),
          (e.prototype.applyServer = function (t, e) {
            return t.applyOperation(e), this;
          }),
          (e.prototype.serverAck = function (t) {
            throw new Error("There is no pending operation.");
          }),
          (e.prototype.serverRetry = function (t) {
            throw new Error("There is no pending operation.");
          });
        var r = new e();
        function n(t) {
          this.outstanding = t;
        }
        function i(t, e) {
          (this.outstanding = t), (this.buffer = e);
        }
        return (
          (t.AwaitingConfirm = n),
          (n.prototype.applyClient = function (t, e) {
            return new i(this.outstanding, e);
          }),
          (n.prototype.applyServer = function (t, e) {
            var r = this.outstanding.transform(e);
            return t.applyOperation(r[1]), new n(r[0]);
          }),
          (n.prototype.serverAck = function (t) {
            return r;
          }),
          (n.prototype.serverRetry = function (t) {
            return t.sendOperation(this.outstanding), this;
          }),
          (t.AwaitingWithBuffer = i),
          (i.prototype.applyClient = function (t, e) {
            var r = this.buffer.compose(e);
            return new i(this.outstanding, r);
          }),
          (i.prototype.applyServer = function (t, e) {
            var r = this.outstanding.transform(e),
              n = this.buffer.transform(r[1]);
            return t.applyOperation(n[1]), new i(r[0], n[0]);
          }),
          (i.prototype.serverRetry = function (t) {
            var e = this.outstanding.compose(this.buffer);
            return t.sendOperation(e), new n(e);
          }),
          (i.prototype.serverAck = function (t) {
            return t.sendOperation(this.buffer), new n(this.buffer);
          }),
          t
        );
      })()),
      ((n = n || {}).EditorClient = (function () {
        "use strict";
        var t = n.Client,
          e = n.Cursor,
          r = n.UndoManager,
          i = n.WrappedOperation;
        function o(t, e) {
          (this.cursorBefore = t), (this.cursorAfter = e);
        }
        function s(t, e) {
          (this.id = t), (this.editorAdapter = e);
        }
        function a(n, i) {
          t.call(this),
            (this.serverAdapter = n),
            (this.editorAdapter = i),
            (this.undoManager = new r()),
            (this.clients = {});
          var o = this;
          this.editorAdapter.registerCallbacks({
            change: function (t, e) {
              o.onChange(t, e);
            },
            cursorActivity: function () {
              o.onCursorActivity();
            },
            blur: function () {
              o.onBlur();
            },
            focus: function () {
              o.onFocus();
            },
          }),
            this.editorAdapter.registerUndo(function () {
              o.undo();
            }),
            this.editorAdapter.registerRedo(function () {
              o.redo();
            }),
            this.serverAdapter.registerCallbacks({
              ack: function () {
                o.serverAck(),
                  o.focused &&
                    o.state instanceof t.Synchronized &&
                    (o.updateCursor(), o.sendCursor(o.cursor)),
                  o.emitStatus();
              },
              retry: function () {
                o.serverRetry();
              },
              operation: function (t) {
                o.applyServer(t);
              },
              cursor: function (r, n, i) {
                if (
                  o.serverAdapter.userId_ !== r &&
                  o.state instanceof t.Synchronized
                ) {
                  var s = o.getClientObject(r);
                  n
                    ? (i && s.setColor(i), s.updateCursor(e.fromJSON(n)))
                    : s.removeCursor();
                }
              },
            });
        }
        return (
          (o.prototype.invert = function () {
            return new o(this.cursorAfter, this.cursorBefore);
          }),
          (o.prototype.compose = function (t) {
            return new o(this.cursorBefore, t.cursorAfter);
          }),
          (o.prototype.transform = function (t) {
            return new o(
              this.cursorBefore ? this.cursorBefore.transform(t) : null,
              this.cursorAfter ? this.cursorAfter.transform(t) : null
            );
          }),
          (s.prototype.setColor = function (t) {
            this.color = t;
          }),
          (s.prototype.updateCursor = function (t) {
            this.removeCursor(),
              (this.cursor = t),
              (this.mark = this.editorAdapter.setOtherCursor(
                t,
                this.color,
                this.id
              ));
          }),
          (s.prototype.removeCursor = function () {
            this.mark && this.mark.clear();
          }),
          (function (t, e) {
            function r() {}
            (r.prototype = e.prototype),
              (t.prototype = new r()),
              (t.prototype.constructor = t);
          })(a, t),
          (a.prototype.getClientObject = function (t) {
            var e = this.clients[t];
            return e || (this.clients[t] = new s(t, this.editorAdapter));
          }),
          (a.prototype.applyUnredo = function (t) {
            this.undoManager.add(this.editorAdapter.invertOperation(t)),
              this.editorAdapter.applyOperation(t.wrapped),
              (this.cursor = t.meta.cursorAfter),
              this.cursor && this.editorAdapter.setCursor(this.cursor),
              this.applyClient(t.wrapped);
          }),
          (a.prototype.undo = function () {
            var t = this;
            this.undoManager.canUndo() &&
              this.undoManager.performUndo(function (e) {
                t.applyUnredo(e);
              });
          }),
          (a.prototype.redo = function () {
            var t = this;
            this.undoManager.canRedo() &&
              this.undoManager.performRedo(function (e) {
                t.applyUnredo(e);
              });
          }),
          (a.prototype.onChange = function (t, e) {
            var r = this.cursor;
            this.updateCursor();
            var n,
              s =
                this.undoManager.undoStack.length > 0 &&
                e.shouldBeComposedWithInverted(
                  ((n = this.undoManager.undoStack), n[n.length - 1]).wrapped
                ),
              a = new o(this.cursor, r);
            this.undoManager.add(new i(e, a), s), this.applyClient(t);
          }),
          (a.prototype.updateCursor = function () {
            this.cursor = this.editorAdapter.getCursor();
          }),
          (a.prototype.onCursorActivity = function () {
            var t = this.cursor;
            this.updateCursor(),
              !this.focused ||
                (t && this.cursor.equals(t)) ||
                this.sendCursor(this.cursor);
          }),
          (a.prototype.onBlur = function () {
            (this.cursor = null), this.sendCursor(null), (this.focused = !1);
          }),
          (a.prototype.onFocus = function () {
            (this.focused = !0), this.onCursorActivity();
          }),
          (a.prototype.sendCursor = function (e) {
            this.state instanceof t.AwaitingWithBuffer ||
              this.serverAdapter.sendCursor(e);
          }),
          (a.prototype.sendOperation = function (t) {
            this.serverAdapter.sendOperation(t), this.emitStatus();
          }),
          (a.prototype.applyOperation = function (t) {
            this.editorAdapter.applyOperation(t),
              this.updateCursor(),
              this.undoManager.transform(new i(t, null));
          }),
          (a.prototype.emitStatus = function () {
            var e = this;
            setTimeout(function () {
              e.trigger("synced", e.state instanceof t.Synchronized);
            }, 0);
          }),
          a
        );
      })()),
      n.utils.makeEventEmitter(n.EditorClient, ["synced"]),
      (void 0 !== n && null !== n) || (n = {}),
      (n.ACEAdapter = function () {
        var e = (function () {
          function e(t) {
            var r;
            !(function (t, e) {
              if (!(t instanceof e))
                throw new TypeError("Cannot call a class as a function");
            })(this, e),
              (this.onChange = this.onChange.bind(this)),
              (this.onBlur = this.onBlur.bind(this)),
              (this.onFocus = this.onFocus.bind(this)),
              (this.onCursorActivity = this.onCursorActivity.bind(this)),
              (this.ace = t),
              (this.aceSession = this.ace.getSession()),
              (this.aceDoc = this.aceSession.getDocument()),
              this.aceDoc.setNewLineMode("unix"),
              this.grabDocumentState(),
              this.ace.on("change", this.onChange),
              this.ace.on("blur", this.onBlur),
              this.ace.on("focus", this.onFocus),
              this.aceSession.selection.on(
                "changeCursor",
                this.onCursorActivity
              ),
              null == this.aceRange &&
                (this.aceRange = (null != (r = ace.require) ? r : require)(
                  "ace/range"
                ).Range);
          }
          var i, o, s;
          return (
            (i = e),
            (o = [
              {
                key: "grabDocumentState",
                value: function () {
                  return (
                    (this.lastDocLines = this.aceDoc.getAllLines()),
                    (this.lastCursorRange =
                      this.aceSession.selection.getRange())
                  );
                },
              },
              {
                key: "detach",
                value: function () {
                  return (
                    this.ace.removeListener("change", this.onChange),
                    this.ace.removeListener("blur", this.onBlur),
                    this.ace.removeListener("focus", this.onFocus),
                    this.aceSession.selection.removeListener(
                      "changeCursor",
                      this.onCursorActivity
                    )
                  );
                },
              },
              {
                key: "onChange",
                value: function (e) {
                  var r;
                  if (!this.ignoreChanges)
                    return (
                      (r = this.operationFromACEChange(e)),
                      this.trigger.apply(this, ["change"].concat(t(r))),
                      this.grabDocumentState()
                    );
                },
              },
              {
                key: "onBlur",
                value: function () {
                  if (this.ace.selection.isEmpty()) return this.trigger("blur");
                },
              },
              {
                key: "onFocus",
                value: function () {
                  return this.trigger("focus");
                },
              },
              {
                key: "onCursorActivity",
                value: function () {
                  var t = this;
                  return setTimeout(function () {
                    return t.trigger("cursorActivity");
                  }, 0);
                },
              },
              {
                key: "operationFromACEChange",
                value: function (t) {
                  var e, r, i, o, s, a, h;
                  return (
                    t.data
                      ? ("insertLines" === (o = (r = t.data).action) ||
                        "removeLines" === o
                          ? ((h = r.lines.join("\n") + "\n"),
                            r.action.replace("Lines", ""))
                          : ((h = r.text.replace(
                              this.aceDoc.getNewLineCharacter(),
                              "\n"
                            )),
                            r.action.replace("Text", "")),
                        (a = this.indexFromPos(r.range.start)))
                      : ((h = t.lines.join("\n")),
                        (a = this.indexFromPos(t.start))),
                    (s = this.lastDocLines.join("\n").length - a),
                    "remove" === t.action && (s -= h.length),
                    (i = new n.TextOperation().retain(a).insert(h).retain(s)),
                    (e = new n.TextOperation().retain(a).delete(h).retain(s)),
                    "remove" === t.action ? [e, i] : [i, e]
                  );
                },
              },
              {
                key: "applyOperationToACE",
                value: function (t) {
                  var e, r, n, i, o, s, a, h;
                  for (r = 0, n = 0, i = (a = t.ops).length; n < i; n++)
                    (o = a[n]).isRetain()
                      ? (r += o.chars)
                      : o.isInsert()
                      ? (this.aceDoc.insert(this.posFromIndex(r), o.text),
                        (r += o.text.length))
                      : o.isDelete() &&
                        ((e = this.posFromIndex(r)),
                        (h = this.posFromIndex(r + o.chars)),
                        (s = this.aceRange.fromPoints(e, h)),
                        this.aceDoc.remove(s));
                  return this.grabDocumentState();
                },
              },
              {
                key: "posFromIndex",
                value: function (t) {
                  var e, r, n, i, o;
                  for (
                    o = e = 0, r = (i = this.aceDoc.$lines).length;
                    e < r && !(t <= (n = i[o]).length);
                    o = ++e
                  )
                    t -= n.length + 1;
                  return { row: o, column: t };
                },
              },
              {
                key: "indexFromPos",
                value: function (t, e) {
                  var r, n, i, o;
                  for (
                    null == e && (e = this.lastDocLines),
                      n = 0,
                      r = i = 0,
                      o = t.row;
                    0 <= o ? i < o : i > o;
                    r = 0 <= o ? ++i : --i
                  )
                    n += this.lastDocLines[r].length + 1;
                  return n + t.column;
                },
              },
              {
                key: "getValue",
                value: function () {
                  return this.aceDoc.getValue();
                },
              },
              {
                key: "getCursor",
                value: function () {
                  var t, e, r;
                  try {
                    (r = this.indexFromPos(
                      this.aceSession.selection.getRange().start,
                      this.aceDoc.$lines
                    )),
                      (e = this.indexFromPos(
                        this.aceSession.selection.getRange().end,
                        this.aceDoc.$lines
                      ));
                  } catch (n) {
                    n;
                    try {
                      (r = this.indexFromPos(this.lastCursorRange.start)),
                        (e = this.indexFromPos(this.lastCursorRange.end));
                    } catch (n) {
                      (t = n),
                        console.log(
                          "Couldn't figure out the cursor range:",
                          t,
                          "-- setting it to 0:0."
                        ),
                        (r = 0),
                        (e = 0);
                    }
                  }
                  if (r > e) {
                    var i = [e, r];
                    (r = i[0]), (e = i[1]);
                  }
                  return new n.Cursor(r, e);
                },
              },
              {
                key: "setCursor",
                value: function (t) {
                  var e, r;
                  if (
                    ((r = this.posFromIndex(t.position)),
                    (e = this.posFromIndex(t.selectionEnd)),
                    t.position > t.selectionEnd)
                  ) {
                    var n = [e, r];
                    (r = n[0]), (e = n[1]);
                  }
                  return this.aceSession.selection.setSelectionRange(
                    new this.aceRange(r.row, r.column, e.row, e.column)
                  );
                },
              },
              {
                key: "setOtherCursor",
                value: function (t, e, r) {
                  var n,
                    i,
                    o,
                    s,
                    a,
                    h,
                    c,
                    u = this;
                  if (
                    (null == this.otherCursors && (this.otherCursors = {}),
                    (o = this.otherCursors[r]) &&
                      (o.start.detach(),
                      o.end.detach(),
                      this.aceSession.removeMarker(o.id)),
                    (c = this.posFromIndex(t.position)),
                    (s = this.posFromIndex(t.selectionEnd)),
                    t.selectionEnd < t.position)
                  ) {
                    var l = [s, c];
                    (c = l[0]), (s = l[1]);
                  }
                  return (
                    (n = "other-client-selection-".concat(e.replace("#", ""))),
                    (a = t.position === t.selectionEnd) &&
                      (n = n.replace("selection", "cursor")),
                    (i = "."
                      .concat(
                        n,
                        " {\n  position: absolute;\n  background-color: "
                      )
                      .concat(
                        a ? "transparent" : e,
                        ";\n  border-left: 2px solid "
                      )
                      .concat(e, ";\n}")),
                    this.addStyleRule(i),
                    (this.otherCursors[r] = o =
                      new this.aceRange(c.row, c.column, s.row, s.column)),
                    (h = this),
                    (o.clipRows = function () {
                      var t;
                      return (
                        ((t = h.aceRange.prototype.clipRows.apply(
                          this,
                          arguments
                        )).isEmpty = function () {
                          return !1;
                        }),
                        t
                      );
                    }),
                    (o.start = this.aceDoc.createAnchor(o.start)),
                    (o.end = this.aceDoc.createAnchor(o.end)),
                    (o.id = this.aceSession.addMarker(o, n, "text")),
                    {
                      clear: function () {
                        return (
                          o.start.detach(),
                          o.end.detach(),
                          u.aceSession.removeMarker(o.id)
                        );
                      },
                    }
                  );
                },
              },
              {
                key: "addStyleRule",
                value: function (t) {
                  var e;
                  if (
                    "undefined" != typeof document &&
                    null !== document &&
                    (this.addedStyleRules ||
                      ((this.addedStyleRules = {}),
                      (e = document.createElement("style")),
                      document.documentElement
                        .getElementsByTagName("head")[0]
                        .appendChild(e),
                      (this.addedStyleSheet = e.sheet)),
                    !this.addedStyleRules[t])
                  )
                    return (
                      (this.addedStyleRules[t] = !0),
                      this.addedStyleSheet.insertRule(t, 0)
                    );
                },
              },
              {
                key: "registerCallbacks",
                value: function (t) {
                  this.callbacks = t;
                },
              },
              {
                key: "trigger",
                value: function (t) {
                  for (
                    var e,
                      r,
                      n = arguments.length,
                      i = new Array(n > 1 ? n - 1 : 0),
                      o = 1;
                    o < n;
                    o++
                  )
                    i[o - 1] = arguments[o];
                  return null != (e = this.callbacks) && null != (r = e[t])
                    ? r.apply(this, i)
                    : void 0;
                },
              },
              {
                key: "applyOperation",
                value: function (t) {
                  return (
                    t.isNoop() || (this.ignoreChanges = !0),
                    this.applyOperationToACE(t),
                    (this.ignoreChanges = !1)
                  );
                },
              },
              {
                key: "registerUndo",
                value: function (t) {
                  return (this.ace.undo = t);
                },
              },
              {
                key: "registerRedo",
                value: function (t) {
                  return (this.ace.redo = t);
                },
              },
              {
                key: "invertOperation",
                value: function (t) {
                  return t.invert(this.getValue());
                },
              },
            ]) && r(i.prototype, o),
            s && r(i, s),
            e
          );
        })();
        return (e.prototype.ignoreChanges = !1), e;
      }.call(void 0));
    var n,
      i = function (t, e, r) {
        return (
          "." +
          t +
          " {\n  position: relative;\nbackground-color: " +
          e +
          ";\nborder-left: 2px solid " +
          r +
          ";\n}"
        );
      },
      o = function (t, e) {
        if ("undefined" == typeof document || null === document) return !1;
        if (-1 === this.addedStyleRules.indexOf(t)) {
          var r = document.createElement("style"),
            n = document.createTextNode(e);
          r.appendChild(n),
            document.head.appendChild(r),
            this.addedStyleRules.push(t);
        }
      },
      s = (function () {
        function t(t) {
          if (!t || "function" != typeof t.getModel)
            throw new Error(
              "MonacoAdapter: Incorrect Parameter Recieved in constructor, expected valid Monaco Instance"
            );
          (this.monaco = t),
            (this.monacoModel = this.monaco.getModel()),
            (this.lastDocLines = this.monacoModel.getLinesContent()),
            (this.lastCursorRange = this.monaco.getSelection()),
            (this.callbacks = {}),
            (this.otherCursors = []),
            (this.addedStyleRules = []),
            (this.ignoreChanges = !1),
            (this.onChange = this.onChange.bind(this)),
            (this.onBlur = this.onBlur.bind(this)),
            (this.onFocus = this.onFocus.bind(this)),
            (this.onCursorActivity = this.onCursorActivity.bind(this)),
            (this.changeHandler = this.monaco.onDidChangeModelContent(
              this.onChange
            )),
            (this.didBlurHandler = this.monaco.onDidBlurEditorWidget(
              this.onBlur
            )),
            (this.didFocusHandler = this.monaco.onDidFocusEditorWidget(
              this.onFocus
            )),
            (this.didChangeCursorPositionHandler =
              this.monaco.onDidChangeCursorPosition(this.onCursorActivity));
        }
        return (
          (t.prototype.detach = function () {
            this.changeHandler.dispose(),
              this.didBlurHandler.dispose(),
              this.didFocusHandler.dispose(),
              this.didChangeCursorPositionHandler.dispose();
          }),
          (t.prototype.getCursor = function () {
            var t = this.monaco.getSelection();
            (void 0 !== t && null !== t) || (t = this.lastCursorRange);
            var e = t.getStartPosition(),
              r = t.getEndPosition(),
              i = this.monacoModel.getOffsetAt(e),
              o = this.monacoModel.getOffsetAt(r);
            if (i > o) {
              var s = [o, i];
              (i = s[0]), (o = s[1]);
            }
            return new n.Cursor(i, o);
          }),
          (t.prototype.setCursor = function (t) {
            var e = t.position,
              r = t.selectionEnd,
              n = this.monacoModel.getPositionAt(e),
              i = this.monacoModel.getPositionAt(r);
            if (e > r) {
              var o = [i, n];
              (n = o[0]), (i = o[1]);
            }
            this.monaco.setSelection(
              new monaco.Range(n.lineNumber, n.column, i.lineNumber, i.column)
            );
          }),
          (t.prototype.setOtherCursor = function (t, e, r) {
            if (
              "object" != typeof t ||
              "number" != typeof t.position ||
              "number" != typeof t.selectionEnd
            )
              return !1;
            if ("string" != typeof e || !e.match(/^#[a-fA-F0-9]{3,6}$/))
              return !1;
            var n = t.position,
              s = t.selectionEnd;
            if (n < 0 || s < 0) return !1;
            var a = this.otherCursors.find(function (t) {
              return t.clientID === r;
            });
            a ||
              ((a = { clientID: r, decoration: [] }),
              this.otherCursors.push(a)),
              (a.decoration = this.monaco.deltaDecorations(a.decoration, []));
            var h,
              c,
              u = "other-client-selection-" + e.replace("#", "");
            n === s
              ? ((u = u.replace("selection", "cursor")),
                (h = i(u, "transparent", e)),
                (c = o.call(this, u, h)))
              : ((h = i(u, e, e)), (c = o.call(this, u, h))),
              0 == c &&
                console.log(
                  "Monaco Adapter: Failed to add some css style.\nPlease make sure you're running on supported environment."
                );
            var l = this.monacoModel.getPositionAt(n),
              p = this.monacoModel.getPositionAt(s);
            if (n > s) {
              var d = [p, l];
              (l = d[0]), (p = d[1]);
            }
            a.decoration = this.monaco.deltaDecorations(a.decoration, [
              {
                range: new monaco.Range(
                  l.lineNumber,
                  l.column,
                  p.lineNumber,
                  p.column
                ),
                options: { className: u },
              },
            ]);
            var f = this;
            return {
              clear: function () {
                a.decoration = f.monaco.deltaDecorations(a.decoration, []);
              },
            };
          }),
          (t.prototype.registerCallbacks = function (t) {
            this.callbacks = Object.assign({}, this.callbacks, t);
          }),
          (t.prototype.registerUndo = function (t) {
            if ("function" != typeof t)
              throw new Error(
                "MonacoAdapter: registerUndo method expects a callback function in parameter"
              );
            this.callbacks.undo = t;
          }),
          (t.prototype.registerRedo = function (t) {
            if ("function" != typeof t)
              throw new Error(
                "MonacoAdapter: registerRedo method expects a callback function in parameter"
              );
            this.callbacks.redo = t;
          }),
          (t.prototype.operationFromMonacoChanges = function (t, e, r) {
            var i,
              o,
              s,
              a = t.text,
              h = t.rangeLength,
              c = t.rangeOffset + r,
              u = e.length + r - c;
            return (
              0 === a.length && h > 0
                ? ((s = e.slice(c, c + h)),
                  (i = new n.TextOperation()
                    .retain(c)
                    .delete(h)
                    .retain(u - h)),
                  (o = new n.TextOperation()
                    .retain(c)
                    .insert(s)
                    .retain(u - h)))
                : a.length > 0 && h > 0
                ? ((s = e.slice(c, c + h)),
                  (i = new n.TextOperation()
                    .retain(c)
                    .delete(h)
                    .insert(a)
                    .retain(u - h)),
                  (o = new n.TextOperation()
                    .retain(c)
                    .delete(a.length)
                    .insert(s)
                    .retain(u - h)))
                : ((i = new n.TextOperation().retain(c).insert(a).retain(u)),
                  (o = new n.TextOperation().retain(c).delete(a).retain(u))),
              [i, o]
            );
          }),
          (t.prototype.onChange = function (t) {
            var e = this;
            if (!this.ignoreChanges) {
              var r = this.lastDocLines.join(this.monacoModel.getEOL()),
                i = 0;
              if (!t.changes) {
                var o = new n.TextOperation().retain(r.length);
                this.trigger("change", o, o);
              }
              t.changes.reverse().forEach(function (t) {
                var n = e.operationFromMonacoChanges(t, r, i);
                (i += n[0].targetLength - n[0].baseLength),
                  e.trigger.apply(e, ["change"].concat(n));
              }),
                (this.lastDocLines = this.monacoModel.getLinesContent());
            }
          }),
          (t.prototype.trigger = function (t) {
            if (this.callbacks.hasOwnProperty(t)) {
              var e = this.callbacks[t];
              0;
              var r = [];
              if (arguments.length > 1)
                for (var n = 1; n < arguments.length; n++) r.push(arguments[n]);
              e.apply(null, r);
            }
          }),
          (t.prototype.onBlur = function () {
            this.monaco.getSelection().isEmpty() && this.trigger("blur");
          }),
          (t.prototype.onFocus = function () {
            this.trigger("focus");
          }),
          (t.prototype.onCursorActivity = function () {
            var t = this;
            setTimeout(function () {
              return t.trigger("cursorActivity");
            }, 1);
          }),
          (t.prototype.applyOperation = function (t) {
            t.isNoop() || (this.ignoreChanges = !0);
            var e = 0,
              r = this;
            t.ops.forEach(function (t) {
              if (t.isRetain()) e += t.chars;
              else if (t.isInsert()) {
                var n = r.monacoModel.getPositionAt(e);
                r.monaco.executeEdits("my-source", [
                  {
                    range: new monaco.Range(
                      n.lineNumber,
                      n.column,
                      n.lineNumber,
                      n.column
                    ),
                    text: t.text,
                    forceMoveMarkers: !0,
                  },
                ]),
                  (e += t.text.length);
              } else if (t.isDelete()) {
                var i = r.monacoModel.getPositionAt(e),
                  o = r.monacoModel.getPositionAt(e + t.chars);
                r.monaco.executeEdits("my-source", [
                  {
                    range: new monaco.Range(
                      i.lineNumber,
                      i.column,
                      o.lineNumber,
                      o.column
                    ),
                    text: "",
                    forceMoveMarkers: !0,
                  },
                ]);
              }
            }),
              (this.lastDocLines = this.monacoModel.getLinesContent()),
              (this.ignoreChanges = !1);
          }),
          (t.prototype.invertOperation = function (t) {
            t.invert(this.getValue());
          }),
          t
        );
      })();
    return (
      (n.MonacoAdapter = s),
      ((n = n || {}).AttributeConstants = {
        BOLD: "b",
        ITALIC: "i",
        UNDERLINE: "u",
        STRIKE: "s",
        FONT: "f",
        FONT_SIZE: "fs",
        COLOR: "c",
        BACKGROUND_COLOR: "bc",
        ENTITY_SENTINEL: "ent",
        LINE_SENTINEL: "l",
        LINE_INDENT: "li",
        LINE_ALIGN: "la",
        LIST_TYPE: "lt",
      }),
      (n.sentinelConstants = {
        LINE_SENTINEL_CHARACTER: "",
        ENTITY_SENTINEL_CHARACTER: "",
      }),
      ((n = n || {}).EntityManager = (function () {
        var t = n.utils;
        function e() {
          this.entities_ = {};
          var e = ["src", "alt", "width", "height", "style", "class"];
          this.register("img", {
            render: function (e) {
              t.assert(e.src, "image entity should have 'src'!");
              for (
                var r = ["src", "alt", "width", "height", "style", "class"],
                  n = "<img ",
                  i = 0;
                i < r.length;
                i++
              ) {
                var o = r[i];
                o in e && (n += " " + o + '="' + e[o] + '"');
              }
              return (n += ">");
            },
            fromElement: function (t) {
              for (var r = {}, n = 0; n < e.length; n++) {
                var i = e[n];
                t.hasAttribute(i) && (r[i] = t.getAttribute(i));
              }
              return r;
            },
          });
        }
        return (
          (e.prototype.register = function (t, e) {
            n.utils.assert(
              e.render,
              "Entity options should include a 'render' function!"
            ),
              n.utils.assert(
                e.fromElement,
                "Entity options should include a 'fromElement' function!"
              ),
              (this.entities_[t] = e);
          }),
          (e.prototype.renderToElement = function (t, e) {
            return this.tryRenderToElement_(t, "render", e);
          }),
          (e.prototype.exportToElement = function (t) {
            var e =
              this.tryRenderToElement_(t, "export") ||
              this.tryRenderToElement_(t, "getHtml") ||
              this.tryRenderToElement_(t, "render");
            return e.setAttribute("data-firepad-entity", t.type), e;
          }),
          (e.prototype.updateElement = function (t, e) {
            var r = t.type,
              n = t.info;
            this.entities_[r] &&
              void 0 !== this.entities_[r].update &&
              this.entities_[r].update(n, e);
          }),
          (e.prototype.fromElement = function (t) {
            var e = t.getAttribute("data-firepad-entity");
            if ((e || (e = t.nodeName.toLowerCase()), e && this.entities_[e])) {
              var r = this.entities_[e].fromElement(t);
              return new n.Entity(e, r);
            }
          }),
          (e.prototype.tryRenderToElement_ = function (t, e, r) {
            var i = t.type,
              o = t.info;
            if (this.entities_[i] && this.entities_[i][e]) {
              var s = n.document || (window && window.document),
                a = this.entities_[i][e](o, r, s);
              if (a) {
                if ("string" == typeof a) {
                  var h = (n.document || document).createElement("div");
                  return (h.innerHTML = a), h.childNodes[0];
                }
                if ("object" == typeof a)
                  return (
                    n.utils.assert(
                      void 0 !== a.nodeType,
                      "Error rendering " +
                        i +
                        " entity.  render() function must return an html string or a DOM element."
                    ),
                    a
                  );
              }
            }
          }),
          (e.prototype.entitySupportsUpdate = function (t) {
            return this.entities_[t] && this.entities_[t].update;
          }),
          e
        );
      })()),
      ((n = n || {}).Entity = (function () {
        var t = n.AttributeConstants.ENTITY_SENTINEL,
          e = t + "_";
        function r(t, e) {
          if (!(this instanceof r)) return new r(t, e);
          (this.type = t), (this.info = e || {});
        }
        return (
          (r.prototype.toAttributes = function () {
            var r = {};
            for (var n in ((r[t] = this.type), this.info))
              r[e + n] = this.info[n];
            return r;
          }),
          (r.fromAttributes = function (n) {
            var i = n[t],
              o = {};
            for (var s in n)
              0 === s.indexOf(e) && (o[s.substr(e.length)] = n[s]);
            return new r(i, o);
          }),
          r
        );
      })()),
      ((n = n || {}).RichTextCodeMirror = (function () {
        var t = n.AnnotationList,
          e = n.Span,
          r = n.utils,
          i = n.AttributeConstants,
          o = {
            c: "color",
            bc: "background-color",
            fs: "font-size",
            li: function (t) {
              return "padding-left: " + 40 * t + "px";
            },
          },
          s = {};
        function a(e, r, n) {
          (this.codeMirror = e),
            (this.options_ = n || {}),
            (this.entityManager_ = r),
            (this.currentAttributes_ = null);
          var i = this;
          (this.annotationList_ = new t(function (t, e) {
            i.onAnnotationsChanged_(t, e);
          })),
            this.initAnnotationList_(),
            f(this, "onCodeMirrorBeforeChange_"),
            f(this, "onCodeMirrorChange_"),
            f(this, "onCursorActivity_"),
            parseInt(CodeMirror.version) >= 4
              ? this.codeMirror.on("changes", this.onCodeMirrorChange_)
              : this.codeMirror.on("change", this.onCodeMirrorChange_),
            this.codeMirror.on("beforeChange", this.onCodeMirrorBeforeChange_),
            this.codeMirror.on("cursorActivity", this.onCursorActivity_),
            (this.changeId_ = 0),
            (this.outstandingChanges_ = {}),
            (this.dirtyLines_ = []);
        }
        r.makeEventEmitter(a, ["change", "attributesChange", "newLine"]);
        var h = n.sentinelConstants.LINE_SENTINEL_CHARACTER,
          c = n.sentinelConstants.ENTITY_SENTINEL_CHARACTER;
        function u(t, e) {
          return t.line - e.line || t.ch - e.ch;
        }
        function l(t, e) {
          return u(t, e) <= 0;
        }
        function p(t) {
          if (0 === t.length) return 0;
          for (var e = 0, r = 0; r < t.length; r++) e += t[r].length;
          return e + t.length - 1;
        }
        function d(t) {
          this.attributes = t || {};
        }
        function f(t, e) {
          var r = t[e];
          t[e] = function () {
            r.apply(t, arguments);
          };
        }
        return (
          (a.prototype.detach = function () {
            this.codeMirror.off("beforeChange", this.onCodeMirrorBeforeChange_),
              this.codeMirror.off("change", this.onCodeMirrorChange_),
              this.codeMirror.off("changes", this.onCodeMirrorChange_),
              this.codeMirror.off("cursorActivity", this.onCursorActivity_),
              this.clearAnnotations_();
          }),
          (a.prototype.toggleAttribute = function (t, e) {
            var r = e || !0;
            if (this.emptySelection_()) {
              var n = this.getCurrentAttributes_();
              n[t] === r ? delete n[t] : (n[t] = r),
                (this.currentAttributes_ = n);
            } else {
              var i = this.getCurrentAttributes_()[t] !== r && r;
              this.setAttribute(t, i);
            }
          }),
          (a.prototype.setAttribute = function (t, e) {
            var r = this.codeMirror;
            if (this.emptySelection_()) {
              var n = this.getCurrentAttributes_();
              !1 === e ? delete n[t] : (n[t] = e),
                (this.currentAttributes_ = n);
            } else
              this.updateTextAttributes(
                r.indexFromPos(r.getCursor("start")),
                r.indexFromPos(r.getCursor("end")),
                function (r) {
                  !1 === e ? delete r[t] : (r[t] = e);
                }
              ),
                this.updateCurrentAttributes_();
          }),
          (a.prototype.updateTextAttributes = function (t, r, n, o, s) {
            var a = [],
              h = t,
              c = this;
            this.annotationList_.updateSpan(new e(t, r - t), function (t, e) {
              var r = {};
              for (var u in t.attributes) r[u] = t.attributes[u];
              (r[i.LINE_SENTINEL] && !s) || n(r);
              var l = {},
                p = {};
              return (
                c.computeChangedAttributes_(t.attributes, r, l, p),
                (function (t) {
                  for (var e in t) return !1;
                  return !0;
                })(l) ||
                  a.push({
                    start: h,
                    end: h + e,
                    attributes: l,
                    attributesInverse: p,
                    origin: o,
                  }),
                (h += e),
                new d(r)
              );
            }),
              a.length > 0 && this.trigger("attributesChange", this, a);
          }),
          (a.prototype.computeChangedAttributes_ = function (t, e, r, n) {
            var i,
              o = {};
            for (i in t) o[i] = !0;
            for (i in e) o[i] = !0;
            for (i in o)
              i in e
                ? i in t
                  ? t[i] !== e[i] && ((r[i] = e[i]), (n[i] = t[i]))
                  : ((r[i] = e[i]), (n[i] = !1))
                : ((r[i] = !1), (n[i] = t[i]));
          }),
          (a.prototype.toggleLineAttribute = function (t, e) {
            var r,
              n = this.getCurrentLineAttributes_();
            (r = !(t in n && n[t] === e) && e), this.setLineAttribute(t, r);
          }),
          (a.prototype.setLineAttribute = function (t, e) {
            this.updateLineAttributesForSelection(function (r) {
              !1 === e ? delete r[t] : (r[t] = e);
            });
          }),
          (a.prototype.updateLineAttributesForSelection = function (t) {
            var e = this.codeMirror,
              r = e.getCursor("start"),
              n = e.getCursor("end"),
              i = r.line,
              o = n.line,
              s = e.getLine(o),
              a = this.areLineSentinelCharacters_(s.substr(0, n.ch));
            o > i && a && o--, this.updateLineAttributes(i, o, t);
          }),
          (a.prototype.updateLineAttributes = function (t, e, r) {
            for (var n = t; n <= e; n++) {
              var o = this.codeMirror.getLine(n),
                s = this.codeMirror.indexFromPos({ line: n, ch: 0 });
              if (o[0] !== h) {
                var a = {};
                (a[i.LINE_SENTINEL] = !0), r(a), this.insertText(s, h, a);
              } else this.updateTextAttributes(s, s + 1, r, null, !0);
            }
          }),
          (a.prototype.replaceText = function (t, e, r, n, i) {
            this.changeId_++;
            var o = "cmrt-" + this.changeId_;
            this.outstandingChanges_[o] = { origOrigin: i, attributes: n };
            var s = this.codeMirror,
              a = s.posFromIndex(t),
              h = "number" == typeof e ? s.posFromIndex(e) : null;
            s.replaceRange(r, a, h, o);
          }),
          (a.prototype.insertText = function (t, e, r, n) {
            var i = this.codeMirror,
              o = i.getCursor(),
              s =
                "RTCMADAPTER" == n &&
                !i.somethingSelected() &&
                t == i.indexFromPos(o);
            this.replaceText(t, null, e, r, n), s && i.setCursor(o);
          }),
          (a.prototype.removeText = function (t, e, r) {
            var n = this.codeMirror;
            n.replaceRange("", n.posFromIndex(t), n.posFromIndex(e), r);
          }),
          (a.prototype.insertEntityAtCursor = function (t, e, r) {
            var n = this.codeMirror,
              i = n.indexFromPos(n.getCursor("head"));
            this.insertEntityAt(i, t, e, r);
          }),
          (a.prototype.insertEntityAt = function (t, e, r, i) {
            this.codeMirror;
            this.insertEntity_(t, new n.Entity(e, r), i);
          }),
          (a.prototype.insertEntity_ = function (t, e, r) {
            this.replaceText(t, null, c, e.toAttributes(), r);
          }),
          (a.prototype.getAttributeSpans = function (t, r) {
            for (
              var n = [],
                i = this.annotationList_.getAnnotatedSpansForSpan(
                  new e(t, r - t)
                ),
                o = 0;
              o < i.length;
              o++
            )
              n.push({
                length: i[o].length,
                attributes: i[o].annotation.attributes,
              });
            return n;
          }),
          (a.prototype.end = function () {
            var t = this.codeMirror.lineCount() - 1;
            return this.codeMirror.indexFromPos({
              line: t,
              ch: this.codeMirror.getLine(t).length,
            });
          }),
          (a.prototype.getRange = function (t, e) {
            var r = this.codeMirror.posFromIndex(t),
              n = this.codeMirror.posFromIndex(e);
            return this.codeMirror.getRange(r, n);
          }),
          (a.prototype.initAnnotationList_ = function () {
            var t = this.end();
            0 !== t &&
              this.annotationList_.insertAnnotatedSpan(new e(0, t), new d());
          }),
          (a.prototype.onAnnotationsChanged_ = function (t, e) {
            var r,
              n = {};
            this.tryToUpdateEntitiesInPlace(t, e);
            for (var o = 0; o < t.length; o++) {
              var s = t[o].annotation.attributes;
              i.LINE_SENTINEL in s &&
                (n[this.codeMirror.posFromIndex(t[o].pos).line] = !0),
                (r = t[o].getAttachedObject()) && r.clear();
            }
            for (o = 0; o < e.length; o++) {
              var a = e[o].annotation,
                h = i.LINE_SENTINEL in a.attributes,
                c = i.ENTITY_SENTINEL in a.attributes,
                u = this.codeMirror.posFromIndex(e[o].pos);
              if (h) n[u.line] = !0;
              else if (c) this.markEntity_(e[o]);
              else {
                var l = this.getClassNameForAttributes_(a.attributes);
                if ("" !== l) {
                  var p = this.codeMirror.posFromIndex(e[o].pos + e[o].length);
                  (r = this.codeMirror.markText(u, p, { className: l })),
                    e[o].attachObject(r);
                }
              }
            }
            for (var d in n)
              this.dirtyLines_.push(this.codeMirror.getLineHandle(Number(d))),
                this.queueLineMarking_();
          }),
          (a.prototype.tryToUpdateEntitiesInPlace = function (t, e) {
            for (var r = t.length; r--; )
              for (var n = t[r], i = e.length; i--; ) {
                var o = e[i];
                if (
                  n.pos == o.pos &&
                  n.length == o.length &&
                  n.annotation.attributes.ent &&
                  n.annotation.attributes.ent == o.annotation.attributes.ent
                ) {
                  var s = o.annotation.attributes.ent;
                  if (this.entityManager_.entitySupportsUpdate(s)) {
                    t.splice(r, 1), e.splice(i, 1);
                    var a = n.getAttachedObject();
                    a.update(o.annotation.attributes), o.attachObject(a);
                  }
                }
              }
          }),
          (a.prototype.queueLineMarking_ = function () {
            if (null == this.lineMarkTimeout_) {
              var t = this;
              this.lineMarkTimeout_ = setTimeout(function () {
                t.lineMarkTimeout_ = null;
                for (var e = [], r = 0; r < t.dirtyLines_.length; r++) {
                  var n = t.codeMirror.getLineNumber(t.dirtyLines_[r]);
                  e.push(Number(n));
                }
                (t.dirtyLines_ = []),
                  e.sort(function (t, e) {
                    return t - e;
                  });
                var i = -1;
                for (r = 0; r < e.length; r++) {
                  var o = e[r];
                  o > i &&
                    (i = t.markLineSentinelCharactersForChangedLines_(o, o));
                }
              }, 0);
            }
          }),
          (a.prototype.addStyleWithCSS_ = function (t) {
            var e = document.getElementsByTagName("head")[0],
              r = document.createElement("style");
            (r.type = "text/css"),
              r.styleSheet
                ? (r.styleSheet.cssText = t)
                : r.appendChild(document.createTextNode(t)),
              e.appendChild(r);
          }),
          (a.prototype.getClassNameForAttributes_ = function (t) {
            var e = "";
            for (var r in t) {
              var a = t[r];
              if (r === i.LINE_SENTINEL)
                n.utils.assert(
                  !0 === a,
                  "LINE_SENTINEL attribute should be true if it exists."
                );
              else {
                var h = (this.options_.cssPrefix || "cmrt-") + r;
                if (!0 !== a) {
                  r === i.FONT_SIZE && "string" != typeof a && (a += "px");
                  var c = a
                    .toString()
                    .toLowerCase()
                    .replace(/[^a-z0-9-_]/g, "-");
                  if (
                    ((h += "-" + c), o[r] && (s[r] || (s[r] = {}), !s[r][c]))
                  ) {
                    s[r][c] = !0;
                    var u = o[r],
                      l = "function" == typeof u ? u(a) : u + ": " + a,
                      p = r == i.LINE_INDENT ? "pre." + h : "." + h;
                    if (
                      (this.addStyleWithCSS_(p + " { " + l + " }"),
                      r === i.LINE_INDENT)
                    ) {
                      p = "pre.CodeMirror-line." + h;
                      this.addStyleWithCSS_(p + " { " + l + " }");
                    }
                  }
                }
                e = e + " " + h;
              }
            }
            return e;
          }),
          (a.prototype.markEntity_ = function (t) {
            for (
              var e = t.annotation.attributes,
                r = n.Entity.fromAttributes(e),
                i = this.codeMirror,
                o = this,
                s = [],
                a = 0;
              a < t.length;
              a++
            ) {
              var h = i.posFromIndex(t.pos + a),
                c = i.posFromIndex(t.pos + a + 1),
                u = {
                  collapsed: !0,
                  atomic: !0,
                  inclusiveLeft: !1,
                  inclusiveRight: !1,
                },
                l = this.createEntityHandle_(r, t.pos),
                p = this.entityManager_.renderToElement(r, l);
              p && (u.replacedWith = p);
              var d = i.markText(h, c, u);
              s.push(d), l.setMarker(d);
            }
            t.attachObject({
              clear: function () {
                for (var t = 0; t < s.length; t++) s[t].clear();
              },
              update: function (t) {
                for (
                  var e = n.Entity.fromAttributes(t), r = 0;
                  r < s.length;
                  r++
                )
                  o.entityManager_.updateElement(e, s[r].replacedWith);
              },
            }),
              this.queueRefresh_();
          }),
          (a.prototype.queueRefresh_ = function () {
            var t = this;
            this.refreshTimer_ ||
              (this.refreshTimer_ = setTimeout(function () {
                t.codeMirror.refresh(), (t.refreshTimer_ = null);
              }, 0));
          }),
          (a.prototype.createEntityHandle_ = function (t, e) {
            var r = null,
              i = this;
            function o() {
              if (r) {
                var t = r.find();
                return t ? i.codeMirror.indexFromPos(t.from) : null;
              }
              return e;
            }
            return {
              find: o,
              remove: function () {
                var t = o();
                null != t && (i.codeMirror.focus(), i.removeText(t, t + 1));
              },
              replace: function (e) {
                var r = n.AttributeConstants.ENTITY_SENTINEL,
                  s = r + "_",
                  a = o();
                i.updateTextAttributes(a, a + 1, function (n) {
                  for (var i in n) delete n[i];
                  for (var o in ((n[r] = t.type), e)) n[s + o] = e[o];
                });
              },
              setMarker: function (t) {
                r = t;
              },
            };
          }),
          (a.prototype.lineClassRemover_ = function (t) {
            var e = this.codeMirror,
              r = e.getLineHandle(t);
            return {
              clear: function () {
                e.removeLineClass(r, "text", ".*");
              },
            };
          }),
          (a.prototype.emptySelection_ = function () {
            var t = this.codeMirror.getCursor("start"),
              e = this.codeMirror.getCursor("end");
            return t.line === e.line && t.ch === e.ch;
          }),
          (a.prototype.onCodeMirrorBeforeChange_ = function (t, e) {
            if ("+input" === e.origin || "paste" === e.origin) {
              for (var r = [], n = 0; n < e.text.length; n++) {
                var i = e.text[n];
                (i = i.replace(new RegExp("[" + h + c + "]", "g"), "")),
                  r.push(i);
              }
              e.update(e.from, e.to, r);
            }
          }),
          (a.prototype.onCodeMirrorChange_ = function (t, r) {
            if ("object" == typeof r.from) {
              for (var n = []; r; ) n.push(r), (r = r.next);
              r = n;
            }
            for (
              var i = this.convertCoordinateSystemForChanges_(r), o = [], s = 0;
              s < i.length;
              s++
            ) {
              var a,
                h = i[s],
                c = h.start,
                u = (h.end, h.text),
                l = h.removed,
                p = h.origin;
              if (l.length > 0) {
                for (
                  var f = this.annotationList_.getAnnotatedSpansForSpan(
                      new e(c, l.length)
                    ),
                    g = 0,
                    m = 0;
                  m < f.length;
                  m++
                ) {
                  var y = f[m];
                  o.push({
                    start: c,
                    end: c + y.length,
                    removedAttributes: y.annotation.attributes,
                    removed: l.substr(g, y.length),
                    attributes: {},
                    text: "",
                    origin: h.origin,
                  }),
                    (g += y.length);
                }
                this.annotationList_.removeSpan(new e(c, l.length));
              }
              if (u.length > 0)
                "+input" === h.origin || "paste" === h.origin
                  ? (a = this.currentAttributes_ || {})
                  : p in this.outstandingChanges_
                  ? ((a = this.outstandingChanges_[p].attributes),
                    (p = this.outstandingChanges_[p].origOrigin),
                    delete this.outstandingChanges_[p])
                  : (a = {}),
                  this.annotationList_.insertAnnotatedSpan(
                    new e(c, u.length),
                    new d(a)
                  ),
                  o.push({
                    start: c,
                    end: c,
                    removedAttributes: {},
                    removed: "",
                    text: u,
                    attributes: a,
                    origin: p,
                  });
            }
            this.markLineSentinelCharactersForChanges_(r),
              o.length > 0 && this.trigger("change", this, o);
          }),
          (a.prototype.convertCoordinateSystemForChanges_ = function (t) {
            var e = this,
              r = function (t) {
                return e.codeMirror.indexFromPos(t);
              };
            function n(t, e) {
              return function (r) {
                return l(r, e.from)
                  ? t(r)
                  : l(e.to, r)
                  ? t({
                      line:
                        r.line + e.text.length - 1 - (e.to.line - e.from.line),
                      ch:
                        e.to.line < r.line
                          ? r.ch
                          : e.text.length <= 1
                          ? r.ch - (e.to.ch - e.from.ch) + p(e.text)
                          : r.ch -
                            e.to.ch +
                            ((n = e.text), n[n.length - 1]).length,
                    }) +
                    p(e.removed) -
                    p(e.text)
                  : e.from.line === r.line
                  ? t(e.from) + r.ch - e.from.ch
                  : t(e.from) +
                    p(e.removed.slice(0, r.line - e.from.line)) +
                    1 +
                    r.ch;
                var n;
              };
            }
            for (var i = [], o = t.length - 1; o >= 0; o--) {
              var s = t[o],
                a = (r = n(r, s))(s.from),
                h = s.removed.join("\n"),
                c = s.text.join("\n");
              i.unshift({
                start: a,
                end: a + h.length,
                removed: h,
                text: c,
                origin: s.origin,
              });
            }
            return i;
          }),
          (a.prototype.markLineSentinelCharactersForChanges_ = function (t) {
            for (var e = Number.MAX_VALUE, r = -1, n = 0; n < t.length; n++) {
              var i = t[n],
                o = i.from.line;
              i.from.ch;
              (i.removed.length > 1 || i.removed[0].indexOf(h) >= 0) &&
                ((e = Math.min(e, o)), (r = Math.max(r, o))),
                i.text.length > 1
                  ? ((e = Math.min(e, o)),
                    (r = Math.max(r, o + i.text.length - 1)))
                  : i.text[0].indexOf(h) >= 0 &&
                    ((e = Math.min(e, o)), (r = Math.max(r, o)));
            }
            (r = Math.min(r, this.codeMirror.lineCount() - 1)),
              this.markLineSentinelCharactersForChangedLines_(e, r);
          }),
          (a.prototype.markLineSentinelCharactersForChangedLines_ = function (
            t,
            e
          ) {
            if (t < Number.MAX_VALUE)
              for (; t > 0 && this.lineIsListItemOrIndented_(t - 1); ) t--;
            if (e > -1)
              for (
                var r = this.codeMirror.lineCount();
                e + 1 < r && this.lineIsListItemOrIndented_(e + 1);

              )
                e++;
            for (var n = [], i = this.codeMirror, o = t; o <= e; o++) {
              var s = i.getLine(o),
                a = i.getLineHandle(o);
              if ((i.removeLineClass(a, "text", ".*"), s.length > 0))
                for (var c = s.indexOf(h); c >= 0; ) {
                  for (var u = c; c < s.length && s[c] === h; ) {
                    for (
                      var l = i.findMarksAt({ line: o, ch: c }), p = 0;
                      p < l.length;
                      p++
                    )
                      l[p].isForLineSentinel && l[p].clear();
                    c++;
                  }
                  this.markLineSentinelCharacters_(o, u, c, n),
                    (c = s.indexOf(h, c));
                }
              else n = [];
            }
            return e;
          }),
          (a.prototype.markLineSentinelCharacters_ = function (t, e, r, n) {
            var o = this.codeMirror,
              s = null,
              a = null,
              h = function () {
                var t = a.find();
                return t ? t.from.line : null;
              };
            if (0 === e) {
              var c = this.getLineAttributes_(t),
                u = c[i.LIST_TYPE],
                l = c[i.LINE_INDENT] || 0;
              for (u && 0 === l && (l = 1); l >= n.length; ) n.push(1);
              "o" === u
                ? ((s = this.makeOrderedListElement_(n[l])), n[l]++)
                : "u" === u
                ? ((s = this.makeUnorderedListElement_()), (n[l] = 1))
                : "t" === u
                ? ((s = this.makeTodoListElement_(!1, h)), (n[l] = 1))
                : "tc" === u &&
                  ((s = this.makeTodoListElement_(!0, h)), (n[l] = 1));
              var p = this.getClassNameForAttributes_(c);
              "" !== p && this.codeMirror.addLineClass(t, "text", p),
                (n[l + 1] = 1);
            }
            var d = { inclusiveLeft: !0, collapsed: !0 };
            s && (d.replacedWith = s),
              ((a = o.markText(
                { line: t, ch: e },
                { line: t, ch: r },
                d
              )).isForLineSentinel = !0);
          }),
          (a.prototype.makeOrderedListElement_ = function (t) {
            return r.elt("div", t + ".", { class: "firepad-list-left" });
          }),
          (a.prototype.makeUnorderedListElement_ = function () {
            return r.elt("div", "•", { class: "firepad-list-left" });
          }),
          (a.prototype.toggleTodo = function (t) {
            var e,
              r = i.LIST_TYPE,
              n = this.getCurrentLineAttributes_();
            r in n && ("t" === n[r] || "tc" === n[r])
              ? "t" === n[r]
                ? (e = "tc")
                : "tc" === n[r] && (e = !!t && "t")
              : (e = "t"),
              this.setLineAttribute(r, e);
          }),
          (a.prototype.makeTodoListElement_ = function (t, e) {
            var n = { type: "checkbox", class: "firepad-todo-left" };
            t && (n.checked = !0);
            var i = r.elt("input", !1, n),
              o = this;
            return (
              r.on(
                i,
                "click",
                r.stopEventAnd(function (t) {
                  o.codeMirror.setCursor({ line: e(), ch: 1 }),
                    o.toggleTodo(!0);
                })
              ),
              i
            );
          }),
          (a.prototype.lineIsListItemOrIndented_ = function (t) {
            var e = this.getLineAttributes_(t);
            return (
              !1 !== (e[i.LIST_TYPE] || !1) || 0 !== (e[i.LINE_INDENT] || 0)
            );
          }),
          (a.prototype.onCursorActivity_ = function () {
            var t = this;
            setTimeout(function () {
              t.updateCurrentAttributes_();
            }, 1);
          }),
          (a.prototype.getCurrentAttributes_ = function () {
            return (
              this.currentAttributes_ || this.updateCurrentAttributes_(),
              this.currentAttributes_
            );
          }),
          (a.prototype.updateCurrentAttributes_ = function () {
            var t = this.codeMirror,
              e = t.indexFromPos(t.getCursor("anchor")),
              r = t.indexFromPos(t.getCursor("head")),
              o = r;
            if (e > r) {
              for (; o < this.end(); ) {
                var s = this.getRange(o, o + 1);
                if ("\n" !== s && s !== h) break;
                o++;
              }
              o < this.end() && o++;
            } else
              for (
                ;
                o > 0 && ("\n" === (s = this.getRange(o - 1, o)) || s === h);

              )
                o--;
            var a = this.annotationList_.getAnnotatedSpansForPos(o);
            this.currentAttributes_ = {};
            var c = {};
            for (var u in (a.length > 0 &&
            !(i.LINE_SENTINEL in a[0].annotation.attributes)
              ? (c = a[0].annotation.attributes)
              : a.length > 1 &&
                (n.utils.assert(
                  !(i.LINE_SENTINEL in a[1].annotation.attributes),
                  "Cursor can't be between two line sentinel characters."
                ),
                (c = a[1].annotation.attributes)),
            c))
              "l" !== u &&
                "lt" !== u &&
                "li" !== u &&
                0 !== u.indexOf(i.ENTITY_SENTINEL) &&
                (this.currentAttributes_[u] = c[u]);
          }),
          (a.prototype.getCurrentLineAttributes_ = function () {
            var t = this.codeMirror,
              e = t.getCursor("anchor"),
              r = t.getCursor("head"),
              n = r.line;
            return (
              0 === r.ch && e.line < r.line && n--, this.getLineAttributes_(n)
            );
          }),
          (a.prototype.getLineAttributes_ = function (t) {
            var r = {},
              i = this.codeMirror.getLine(t);
            if (i.length > 0 && i[0] === h) {
              var o = this.codeMirror.indexFromPos({ line: t, ch: 0 }),
                s = this.annotationList_.getAnnotatedSpansForSpan(new e(o, 1));
              for (var a in (n.utils.assert(1 === s.length),
              s[0].annotation.attributes))
                r[a] = s[0].annotation.attributes[a];
            }
            return r;
          }),
          (a.prototype.clearAnnotations_ = function () {
            this.annotationList_.updateSpan(
              new e(0, this.end()),
              function (t, e) {
                return new d({});
              }
            );
          }),
          (a.prototype.newline = function () {
            var t = this.codeMirror,
              e = this;
            if (this.emptySelection_()) {
              var r = t.getCursor("head").line,
                n = this.getLineAttributes_(r),
                o = n[i.LIST_TYPE];
              o && 1 === t.getLine(r).length
                ? this.updateLineAttributes(r, r, function (t) {
                    delete t[i.LIST_TYPE], delete t[i.LINE_INDENT];
                  })
                : (t.replaceSelection("\n", "end", "+input"),
                  this.updateLineAttributes(r + 1, r + 1, function (t) {
                    for (var s in n) t[s] = n[s];
                    "tc" === o && (t[i.LIST_TYPE] = "t"),
                      e.trigger("newLine", { line: r + 1, attr: t });
                  }));
            } else t.replaceSelection("\n", "end", "+input");
          }),
          (a.prototype.deleteLeft = function () {
            var t = this.codeMirror,
              e = t.getCursor("head"),
              r = this.getLineAttributes_(e.line),
              n = r[i.LIST_TYPE],
              o = r[i.LINE_INDENT],
              s = this.emptySelection_() && 1 === e.ch;
            s && n
              ? this.updateLineAttributes(e.line, e.line, function (t) {
                  delete t[i.LIST_TYPE], delete t[i.LINE_INDENT];
                })
              : s && o && o > 0
              ? this.unindent()
              : t.deleteH(-1, "char");
          }),
          (a.prototype.deleteRight = function () {
            var t = this.codeMirror,
              e = t.getCursor("head"),
              r = t.getLine(e.line),
              n = this.areLineSentinelCharacters_(r),
              i = e.line + 1 < t.lineCount() ? t.getLine(e.line + 1) : "";
            this.emptySelection_() && n && i[0] === h
              ? (t.replaceRange(
                  "",
                  { line: e.line, ch: 0 },
                  { line: e.line + 1, ch: 0 },
                  "+input"
                ),
                t.setCursor({ line: e.line, ch: 0 }))
              : t.deleteH(1, "char");
          }),
          (a.prototype.indent = function () {
            this.updateLineAttributesForSelection(function (t) {
              var e = t[i.LINE_INDENT],
                r = t[i.LIST_TYPE];
              e ? t[i.LINE_INDENT]++ : (t[i.LINE_INDENT] = r ? 2 : 1);
            });
          }),
          (a.prototype.unindent = function () {
            this.updateLineAttributesForSelection(function (t) {
              var e = t[i.LINE_INDENT];
              e && e > 1
                ? (t[i.LINE_INDENT] = e - 1)
                : (delete t[i.LIST_TYPE], delete t[i.LINE_INDENT]);
            });
          }),
          (a.prototype.getText = function () {
            return this.codeMirror.getValue().replace(new RegExp(h, "g"), "");
          }),
          (a.prototype.areLineSentinelCharacters_ = function (t) {
            for (var e = 0; e < t.length; e++) if (t[e] !== h) return !1;
            return !0;
          }),
          (d.prototype.equals = function (t) {
            if (!(t instanceof d)) return !1;
            var e;
            for (e in this.attributes)
              if (t.attributes[e] !== this.attributes[e]) return !1;
            for (e in t.attributes)
              if (t.attributes[e] !== this.attributes[e]) return !1;
            return !0;
          }),
          a
        );
      })()),
      ((n = n || {}).RichTextCodeMirrorAdapter = (function () {
        "use strict";
        var t = n.TextOperation,
          e = n.WrappedOperation,
          r = n.Cursor;
        function i(t) {
          (this.rtcm = t),
            (this.cm = t.codeMirror),
            h(this, "onChange"),
            h(this, "onAttributesChange"),
            h(this, "onCursorActivity"),
            h(this, "onFocus"),
            h(this, "onBlur"),
            this.rtcm.on("change", this.onChange),
            this.rtcm.on("attributesChange", this.onAttributesChange),
            this.cm.on("cursorActivity", this.onCursorActivity),
            this.cm.on("focus", this.onFocus),
            this.cm.on("blur", this.onBlur);
        }
        function o(t, e) {
          return t.line < e.line
            ? -1
            : t.line > e.line
            ? 1
            : t.ch < e.ch
            ? -1
            : t.ch > e.ch
            ? 1
            : 0;
        }
        function s(t) {
          var e = t.lineCount() - 1;
          return t.indexFromPos({ line: e, ch: t.getLine(e).length });
        }
        function a(t, e) {
          if (!t) throw new Error(e || "assertion error");
        }
        function h(t, e) {
          var r = t[e];
          t[e] = function () {
            r.apply(t, arguments);
          };
        }
        function c(t) {
          for (var e in t) return !1;
          return !0;
        }
        function u(t, e) {
          if ("string" != typeof t) throw new TypeError("Expected a string");
          3 === (t = t.replace(/^#/, "")).length &&
            (t = t[0] + t[0] + t[1] + t[1] + t[2] + t[2]);
          var r,
            n = parseInt(t, 16),
            i = [n >> 16, (n >> 8) & 255, 255 & n],
            o = "rgb";
          return (
            null !== (r = e) && void 0 !== r && ((o = "rgba"), i.push(e)),
            o + "(" + i.join(",") + ")"
          );
        }
        return (
          (i.prototype.detach = function () {
            this.rtcm.off("change", this.onChange),
              this.rtcm.off("attributesChange", this.onAttributesChange),
              this.cm.off("cursorActivity", this.onCursorActivity),
              this.cm.off("focus", this.onFocus),
              this.cm.off("blur", this.onBlur);
          }),
          (i.operationFromCodeMirrorChanges = function (e, r) {
            for (
              var n = s(r),
                i = new t().retain(n),
                o = new t().retain(n),
                a = e.length - 1;
              a >= 0;
              a--
            ) {
              var h = e[a],
                c = h.start,
                u = n - c - h.text.length;
              (i = new t()
                .retain(c)
                .delete(h.removed.length)
                .insert(h.text, h.attributes)
                .retain(u)
                .compose(i)),
                (o = o.compose(
                  new t()
                    .retain(c)
                    .delete(h.text.length)
                    .insert(h.removed, h.removedAttributes)
                    .retain(u)
                )),
                (n += h.removed.length - h.text.length);
            }
            return [i, o];
          }),
          (i.operationFromAttributesChanges = function (e, r) {
            for (
              var n = s(r), i = new t(), o = new t(), h = 0, c = 0;
              c < e.length;
              c++
            ) {
              var u = e[c],
                l = u.start - h;
              a(l >= 0), i.retain(l), o.retain(l);
              var p = u.end - u.start;
              i.retain(p, u.attributes),
                o.retain(p, u.attributesInverse),
                (h = u.start + p);
            }
            return i.retain(n - h), o.retain(n - h), [i, o];
          }),
          (i.prototype.registerCallbacks = function (t) {
            this.callbacks = t;
          }),
          (i.prototype.onChange = function (t, e) {
            if ("RTCMADAPTER" !== e[0].origin) {
              var r = i.operationFromCodeMirrorChanges(e, this.cm);
              this.trigger("change", r[0], r[1]);
            }
          }),
          (i.prototype.onAttributesChange = function (t, e) {
            if ("RTCMADAPTER" !== e[0].origin) {
              var r = i.operationFromAttributesChanges(e, this.cm);
              this.trigger("change", r[0], r[1]);
            }
          }),
          (i.prototype.onCursorActivity = function () {
            var t = this;
            setTimeout(function () {
              t.trigger("cursorActivity");
            }, 1);
          }),
          (i.prototype.onFocus = function () {
            this.trigger("focus");
          }),
          (i.prototype.onBlur = function () {
            this.cm.somethingSelected() || this.trigger("blur");
          }),
          (i.prototype.getValue = function () {
            return this.cm.getValue();
          }),
          (i.prototype.getCursor = function () {
            var t,
              e = this.cm,
              n = e.getCursor(),
              i = e.indexFromPos(n);
            if (e.somethingSelected()) {
              var s = e.getCursor(!0),
                a = 0 === o(n, s) ? e.getCursor(!1) : s;
              t = e.indexFromPos(a);
            } else t = i;
            return new r(i, t);
          }),
          (i.prototype.setCursor = function (t) {
            this.cm.setSelection(
              this.cm.posFromIndex(t.position),
              this.cm.posFromIndex(t.selectionEnd)
            );
          }),
          (i.prototype.addStyleRule = function (t) {
            if ("undefined" != typeof document && null !== document) {
              if (!this.addedStyleRules) {
                this.addedStyleRules = {};
                var e = document.createElement("style");
                document.documentElement
                  .getElementsByTagName("head")[0]
                  .appendChild(e),
                  (this.addedStyleSheet = e.sheet);
              }
              if (!this.addedStyleRules[t])
                return (
                  (this.addedStyleRules[t] = !0),
                  this.addedStyleSheet.insertRule(t, 0)
                );
            }
          }),
          (i.prototype.setOtherCursor = function (t, e, r) {
            var n = this.cm.posFromIndex(t.position);
            if ("string" == typeof e && e.match(/^#[a-fA-F0-9]{3,6}$/)) {
              var i = this.rtcm.end();
              if (
                "object" == typeof t &&
                "number" == typeof t.position &&
                "number" == typeof t.selectionEnd &&
                !(
                  t.position < 0 ||
                  t.position > i ||
                  t.selectionEnd < 0 ||
                  t.selectionEnd > i
                )
              ) {
                if (t.position === t.selectionEnd) {
                  var o = this.cm.cursorCoords(n),
                    s = document.createElement("span");
                  return (
                    (s.className = "other-client"),
                    (s.style.borderLeftWidth = "2px"),
                    (s.style.borderLeftStyle = "solid"),
                    (s.style.borderLeftColor = e),
                    (s.style.marginLeft = s.style.marginRight = "-1px"),
                    (s.style.height = 0.9 * (o.bottom - o.top) + "px"),
                    s.setAttribute("data-clientid", r),
                    (s.style.zIndex = 0),
                    this.cm.setBookmark(n, { widget: s, insertLeft: !0 })
                  );
                }
                var a,
                  h,
                  c = "selection-" + e.replace("#", ""),
                  l =
                    "." +
                    c +
                    " { background: " +
                    u(e) +
                    ";\n background: " +
                    u(e, 0.4) +
                    ";}";
                return (
                  this.addStyleRule(l),
                  t.selectionEnd > t.position
                    ? ((a = n), (h = this.cm.posFromIndex(t.selectionEnd)))
                    : ((a = this.cm.posFromIndex(t.selectionEnd)), (h = n)),
                  this.cm.markText(a, h, { className: c })
                );
              }
            }
          }),
          (i.prototype.trigger = function (t) {
            var e = Array.prototype.slice.call(arguments, 1),
              r = this.callbacks && this.callbacks[t];
            r && r.apply(this, e);
          }),
          (i.prototype.applyOperation = function (t) {
            t.ops.length > 10 &&
              this.rtcm.codeMirror
                .getWrapperElement()
                .setAttribute("style", "display: none");
            for (var e = t.ops, r = 0, n = 0, i = e.length; n < i; n++) {
              var o = e[n];
              o.isRetain()
                ? (c(o.attributes) ||
                    this.rtcm.updateTextAttributes(
                      r,
                      r + o.chars,
                      function (t) {
                        for (var e in o.attributes)
                          !1 === o.attributes[e]
                            ? delete t[e]
                            : (t[e] = o.attributes[e]);
                      },
                      "RTCMADAPTER",
                      !0
                    ),
                  (r += o.chars))
                : o.isInsert()
                ? (this.rtcm.insertText(r, o.text, o.attributes, "RTCMADAPTER"),
                  (r += o.text.length))
                : o.isDelete() &&
                  this.rtcm.removeText(r, r + o.chars, "RTCMADAPTER");
            }
            t.ops.length > 10 &&
              (this.rtcm.codeMirror
                .getWrapperElement()
                .setAttribute("style", ""),
              this.rtcm.codeMirror.refresh());
          }),
          (i.prototype.registerUndo = function (t) {
            this.cm.undo = t;
          }),
          (i.prototype.registerRedo = function (t) {
            this.cm.redo = t;
          }),
          (i.prototype.invertOperation = function (r) {
            for (
              var n, i, o = 0, s = this.rtcm.codeMirror, a = new t(), h = 0;
              h < r.wrapped.ops.length;
              h++
            ) {
              var u = r.wrapped.ops[h];
              if (u.isRetain())
                if (c(u.attributes)) a.retain(u.chars), (o += u.chars);
                else
                  for (
                    n = this.rtcm.getAttributeSpans(o, o + u.chars), i = 0;
                    i < n.length;
                    i++
                  ) {
                    var l = {};
                    for (var p in u.attributes) {
                      var d = u.attributes[p],
                        f = n[i].attributes[p];
                      !1 === d ? f && (l[p] = f) : d !== f && (l[p] = f || !1);
                    }
                    a.retain(n[i].length, l), (o += n[i].length);
                  }
              else if (u.isInsert()) a.delete(u.text.length);
              else if (u.isDelete()) {
                var g = s.getRange(
                  s.posFromIndex(o),
                  s.posFromIndex(o + u.chars)
                );
                n = this.rtcm.getAttributeSpans(o, o + u.chars);
                var m = 0;
                for (i = 0; i < n.length; i++)
                  a.insert(g.substr(m, n[i].length), n[i].attributes),
                    (m += n[i].length);
                o += u.chars;
              }
            }
            return new e(a, r.meta.invert());
          }),
          i
        );
      })()),
      ((n = n || {}).Formatting = (function () {
        var t = n.AttributeConstants;
        function e(t) {
          if (!(this instanceof e)) return new e(t);
          this.attributes = t || {};
        }
        return (
          (e.prototype.cloneWithNewAttribute_ = function (t, r) {
            var n = {};
            for (var i in this.attributes) n[i] = this.attributes[i];
            return !1 === r ? delete n[t] : (n[t] = r), new e(n);
          }),
          (e.prototype.bold = function (e) {
            return this.cloneWithNewAttribute_(t.BOLD, e);
          }),
          (e.prototype.italic = function (e) {
            return this.cloneWithNewAttribute_(t.ITALIC, e);
          }),
          (e.prototype.underline = function (e) {
            return this.cloneWithNewAttribute_(t.UNDERLINE, e);
          }),
          (e.prototype.strike = function (e) {
            return this.cloneWithNewAttribute_(t.STRIKE, e);
          }),
          (e.prototype.font = function (e) {
            return this.cloneWithNewAttribute_(t.FONT, e);
          }),
          (e.prototype.fontSize = function (e) {
            return this.cloneWithNewAttribute_(t.FONT_SIZE, e);
          }),
          (e.prototype.color = function (e) {
            return this.cloneWithNewAttribute_(t.COLOR, e);
          }),
          (e.prototype.backgroundColor = function (e) {
            return this.cloneWithNewAttribute_(t.BACKGROUND_COLOR, e);
          }),
          e
        );
      })()),
      ((n = n || {}).Text = (function () {
        return function t(e, r) {
          if (!(this instanceof t)) return new t(e, r);
          (this.text = e), (this.formatting = r || n.Formatting());
        };
      })()),
      ((n = n || {}).LineFormatting = (function () {
        var t = n.AttributeConstants;
        function e(r) {
          if (!(this instanceof e)) return new e(r);
          (this.attributes = r || {}), (this.attributes[t.LINE_SENTINEL] = !0);
        }
        return (
          (e.LIST_TYPE = {
            NONE: !1,
            ORDERED: "o",
            UNORDERED: "u",
            TODO: "t",
            TODOCHECKED: "tc",
          }),
          (e.prototype.cloneWithNewAttribute_ = function (t, r) {
            var n = {};
            for (var i in this.attributes) n[i] = this.attributes[i];
            return !1 === r ? delete n[t] : (n[t] = r), new e(n);
          }),
          (e.prototype.indent = function (e) {
            return this.cloneWithNewAttribute_(t.LINE_INDENT, e);
          }),
          (e.prototype.align = function (e) {
            return this.cloneWithNewAttribute_(t.LINE_ALIGN, e);
          }),
          (e.prototype.listItem = function (e) {
            return (
              n.utils.assert(
                !1 === e || "u" === e || "o" === e || "t" === e || "tc" === e
              ),
              this.cloneWithNewAttribute_(t.LIST_TYPE, e)
            );
          }),
          (e.prototype.getIndent = function () {
            return this.attributes[t.LINE_INDENT] || 0;
          }),
          (e.prototype.getAlign = function () {
            return this.attributes[t.LINE_ALIGN] || 0;
          }),
          (e.prototype.getListItem = function () {
            return this.attributes[t.LIST_TYPE] || !1;
          }),
          e
        );
      })()),
      ((n = n || {}).Line = (function () {
        return function t(e, r) {
          if (!(this instanceof t)) return new t(e, r);
          "[object Array]" !== Object.prototype.toString.call(e) &&
            (e = void 0 === e ? [] : [e]),
            (this.textPieces = e),
            (this.formatting = r || n.LineFormatting());
        };
      })()),
      ((n = n || {}).ParseHtml = (function () {
        var t,
          e = n.LineFormatting.LIST_TYPE;
        function r(t, r, i) {
          (this.listType = t || e.UNORDERED),
            (this.lineFormatting = r || n.LineFormatting()),
            (this.textFormatting = i || n.Formatting());
        }
        function i() {
          (this.lines = []),
            (this.currentLine = []),
            (this.currentLineListItemType = null);
        }
        (r.prototype.withTextFormatting = function (t) {
          return new r(this.listType, this.lineFormatting, t);
        }),
          (r.prototype.withLineFormatting = function (t) {
            return new r(this.listType, t, this.textFormatting);
          }),
          (r.prototype.withListType = function (t) {
            return new r(t, this.lineFormatting, this.textFormatting);
          }),
          (r.prototype.withIncreasedIndent = function () {
            var t = this.lineFormatting.indent(
              this.lineFormatting.getIndent() + 1
            );
            return new r(this.listType, t, this.textFormatting);
          }),
          (r.prototype.withAlign = function (t) {
            var e = this.lineFormatting.align(t);
            return new r(this.listType, e, this.textFormatting);
          }),
          (i.prototype.newlineIfNonEmpty = function (t) {
            this.cleanLine_(), this.currentLine.length > 0 && this.newline(t);
          }),
          (i.prototype.newlineIfNonEmptyOrListItem = function (t) {
            this.cleanLine_(),
              (this.currentLine.length > 0 ||
                null !== this.currentLineListItemType) &&
                this.newline(t);
          }),
          (i.prototype.newline = function (t) {
            this.cleanLine_();
            var e = t.lineFormatting;
            null !== this.currentLineListItemType &&
              ((e = e.listItem(this.currentLineListItemType)),
              (this.currentLineListItemType = null)),
              this.lines.push(n.Line(this.currentLine, e)),
              (this.currentLine = []);
          }),
          (i.prototype.makeListItem = function (t) {
            this.currentLineListItemType = t;
          }),
          (i.prototype.cleanLine_ = function () {
            if (this.currentLine.length > 0) {
              var t = this.currentLine.length - 1;
              (this.currentLine[0].text = this.currentLine[0].text.replace(
                /^ +/,
                ""
              )),
                (this.currentLine[t].text = this.currentLine[t].text.replace(
                  / +$/g,
                  ""
                ));
              for (var e = 0; e < this.currentLine.length; e++)
                this.currentLine[e].text = this.currentLine[e].text.replace(
                  /\u00a0/g,
                  " "
                );
            }
            1 === this.currentLine.length &&
              "" === this.currentLine[0].text &&
              (this.currentLine = []);
          });
        var o = o || { ELEMENT_NODE: 1, TEXT_NODE: 3 };
        function s(r, i, s) {
          if (r.nodeType === o.ELEMENT_NODE) {
            var h = t.fromElement(r);
            if (h)
              return void s.currentLine.push(
                new n.Text(
                  n.sentinelConstants.ENTITY_SENTINEL_CHARACTER,
                  new n.Formatting(h.toAttributes())
                )
              );
          }
          switch (r.nodeType) {
            case o.TEXT_NODE:
              var c = r.nodeValue.replace(/[ \n\t]+/g, " ");
              s.currentLine.push(n.Text(c, i.textFormatting));
              break;
            case o.ELEMENT_NODE:
              switch (
                ((i = (function (t, e) {
                  for (
                    var r = t.textFormatting,
                      i = t.lineFormatting,
                      o = e.split(";"),
                      s = 0;
                    s < o.length;
                    s++
                  ) {
                    var a = o[s].split(":");
                    if (2 === a.length) {
                      var h = n.utils.trim(a[0]).toLowerCase(),
                        c = n.utils.trim(a[1]).toLowerCase();
                      switch (h) {
                        case "text-decoration":
                          var u = c.indexOf("underline") >= 0,
                            l = c.indexOf("line-through") >= 0;
                          r = r.underline(u).strike(l);
                          break;
                        case "font-weight":
                          var p = "bold" === c || parseInt(c) >= 600;
                          r = r.bold(p);
                          break;
                        case "font-style":
                          var d = "italic" === c || "oblique" === c;
                          r = r.italic(d);
                          break;
                        case "color":
                          r = r.color(c);
                          break;
                        case "background-color":
                          r = r.backgroundColor(c);
                          break;
                        case "text-align":
                          i = i.align(c);
                          break;
                        case "font-size":
                          var f = null;
                          n.utils.stringEndsWith(c, [
                            "px",
                            "pt",
                            "%",
                            "em",
                            "xx-small",
                            "x-small",
                            "small",
                            "medium",
                            "large",
                            "x-large",
                            "xx-large",
                            "smaller",
                            "larger",
                          ])
                            ? (f = c)
                            : parseInt(c) && (f = parseInt(c) + "px"),
                            f && (r = r.fontSize(f));
                          break;
                        case "font-family":
                          var g = n.utils.trim(c.split(",")[0]);
                          (g = (g = g.replace(/['"]/g, "")).replace(
                            /\w\S*/g,
                            function (t) {
                              return (
                                t.charAt(0).toUpperCase() +
                                t.substr(1).toLowerCase()
                              );
                            }
                          )),
                            (r = r.font(g));
                      }
                    }
                  }
                  return t.withLineFormatting(i).withTextFormatting(r);
                })(i, r.getAttribute("style") || "")),
                r.nodeName.toLowerCase())
              ) {
                case "div":
                case "h1":
                case "h2":
                case "h3":
                case "p":
                  s.newlineIfNonEmpty(i), a(r, i, s), s.newlineIfNonEmpty(i);
                  break;
                case "center":
                  (i = i.withAlign("center")),
                    s.newlineIfNonEmpty(i),
                    a(r, i.withAlign("center"), s),
                    s.newlineIfNonEmpty(i);
                  break;
                case "b":
                case "strong":
                  a(r, i.withTextFormatting(i.textFormatting.bold(!0)), s);
                  break;
                case "u":
                  a(r, i.withTextFormatting(i.textFormatting.underline(!0)), s);
                  break;
                case "i":
                case "em":
                  a(r, i.withTextFormatting(i.textFormatting.italic(!0)), s);
                  break;
                case "s":
                  a(r, i.withTextFormatting(i.textFormatting.strike(!0)), s);
                  break;
                case "font":
                  var u = r.getAttribute("face"),
                    l = r.getAttribute("color"),
                    p = parseInt(r.getAttribute("size"));
                  u && (i = i.withTextFormatting(i.textFormatting.font(u))),
                    l && (i = i.withTextFormatting(i.textFormatting.color(l))),
                    p &&
                      (i = i.withTextFormatting(i.textFormatting.fontSize(p))),
                    a(r, i, s);
                  break;
                case "br":
                  s.newline(i);
                  break;
                case "ul":
                  s.newlineIfNonEmptyOrListItem(i);
                  var d =
                    "firepad-todo" === r.getAttribute("class")
                      ? e.TODO
                      : e.UNORDERED;
                  a(r, i.withListType(d).withIncreasedIndent(), s),
                    s.newlineIfNonEmpty(i);
                  break;
                case "ol":
                  s.newlineIfNonEmptyOrListItem(i),
                    a(r, i.withListType(e.ORDERED).withIncreasedIndent(), s),
                    s.newlineIfNonEmpty(i);
                  break;
                case "li":
                  !(function (t, r, n) {
                    n.newlineIfNonEmptyOrListItem(r);
                    var i =
                      "firepad-checked" === t.getAttribute("class")
                        ? e.TODOCHECKED
                        : r.listType;
                    n.makeListItem(i);
                    var o = n.currentLine;
                    a(t, r, n),
                      (o === n.currentLine || n.currentLine.length > 0) &&
                        n.newline(r);
                  })(r, i, s);
                  break;
                case "style":
                  break;
                default:
                  a(r, i, s);
              }
          }
        }
        function a(t, e, r) {
          if (t.hasChildNodes())
            for (var n = 0; n < t.childNodes.length; n++)
              s(t.childNodes[n], e, r);
        }
        return function (e, o) {
          var a = (n.document || document).createElement("div");
          (a.innerHTML = e), (t = o);
          var h = new i();
          return s(a, new r(), h), h.lines;
        };
      })()),
      ((n = n || {}).SerializeHtml = (function () {
        var t = n.utils,
          e = n.AttributeConstants,
          r = n.LineFormatting.LIST_TYPE,
          i =
            '<style>ul.firepad-todo { list-style: none; margin-left: 0; padding-left: 0; } ul.firepad-todo > li { padding-left: 1em; text-indent: -1em; } ul.firepad-todo > li:before { content: "\\2610"; padding-right: 5px; } ul.firepad-todo > li.firepad-checked:before { content: "\\2611"; padding-right: 5px; }</style>\n';
        function o(t) {
          return t === r.ORDERED
            ? "<ol>"
            : t === r.UNORDERED
            ? "<ul>"
            : '<ul class="firepad-todo">';
        }
        function s(t) {
          return t === r.ORDERED ? "</ol>" : "</ul>";
        }
        function a(t) {
          return t
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\u00a0/g, "&nbsp;");
        }
        return function (h, c) {
          for (
            var u,
              l,
              p = "",
              d = !0,
              f = [],
              g = !1,
              m = !0,
              y = !0,
              v = 0,
              _ = h.ops[v],
              b = !1;
            _;

          ) {
            t.assert(_.isInsert());
            var E = _.attributes;
            if (d) {
              d = !1;
              var C = 0,
                x = null,
                w = "left";
              e.LINE_SENTINEL in E &&
                ((C = E[e.LINE_INDENT] || 0),
                (x = E[e.LIST_TYPE] || null),
                (w = E[e.LINE_ALIGN] || "left")),
                x && (C = C || 1),
                g
                  ? ((p += "</li>"), (g = !1))
                  : m || (y && (p += "<br/>"), (p += "</div>")),
                (m = !1),
                t.assert(C >= 0, "Indent must not be negative.");
              for (
                ;
                f.length > C ||
                (C === f.length &&
                  null !== x &&
                  ((u = x),
                  (l = f[f.length - 1]),
                  !(
                    u === l ||
                    (u === r.TODO && l === r.TODOCHECKED) ||
                    (u === r.TODOCHECKED && l === r.TODO)
                  )));

              )
                p += s(f.pop());
              for (; f.length < C; ) {
                var A = x || r.UNORDERED;
                (b = x == r.TODO || x == r.TODOCHECKED || b),
                  (p += o(A)),
                  f.push(A);
              }
              var T = "left" !== w ? ' style="text-align:' + w + '"' : "";
              if (x) {
                var L = "";
                switch (x) {
                  case r.TODOCHECKED:
                    L = ' class="firepad-checked"';
                    break;
                  case r.TODO:
                    L = ' class="firepad-unchecked"';
                }
                (p += "<li" + L + T + ">"), (g = !0);
              } else p += "<div" + T + ">";
              y = !0;
            }
            if (e.LINE_SENTINEL in E) _ = h.ops[++v];
            else if (e.ENTITY_SENTINEL in E) {
              for (var I = 0; I < _.text.length; I++) {
                var M = n.Entity.fromAttributes(E);
                p += c.exportToElement(M).outerHTML;
              }
              _ = h.ops[++v];
            } else {
              var S = "",
                N = "";
              for (var k in E) {
                var R,
                  O,
                  F = E[k];
                k === e.BOLD ||
                k === e.ITALIC ||
                k === e.UNDERLINE ||
                k === e.STRIKE
                  ? (t.assert(!0 === F), (R = O = k))
                  : k === e.FONT_SIZE
                  ? ((R = 'span style="font-size: ' + F),
                    (R +=
                      "string" != typeof F ||
                      -1 === F.indexOf("px", F.length - 2)
                        ? 'px"'
                        : '"'),
                    (O = "span"))
                  : k === e.FONT
                  ? ((R = 'span style="font-family: ' + F + '"'), (O = "span"))
                  : k === e.COLOR
                  ? ((R = 'span style="color: ' + F + '"'), (O = "span"))
                  : k === e.BACKGROUND_COLOR
                  ? ((R = 'span style="background-color: ' + F + '"'),
                    (O = "span"))
                  : t.log(
                      !1,
                      "Encountered unknown attribute while rendering html: " + k
                    ),
                  R && (S += "<" + R + ">"),
                  O && (N = "</" + O + ">" + N);
              }
              var D = _.text,
                P = D.indexOf("\n");
              P >= 0
                ? ((d = !0),
                  (_ =
                    P < D.length - 1
                      ? new n.TextOp("insert", D.substr(P + 1), E)
                      : h.ops[++v]),
                  (D = D.substr(0, P)))
                : (_ = h.ops[++v]),
                (D = D.replace(/  +/g, function (t) {
                  return new Array(t.length + 1).join(" ");
                })
                  .replace(/^ /, " ")
                  .replace(/ $/, " ")).length > 0 && (y = !1),
                (p += S + a(D) + N);
            }
          }
          for (
            g ? (p += "</li>") : m || (y && (p += "&nbsp;"), (p += "</div>"));
            f.length > 0;

          )
            p += s(f.pop());
          return b && (p = i + p), p;
        };
      })()),
      ((n = n || {}).textPiecesToInserts = function (t, e) {
        var r = [];
        function i(e, i) {
          e instanceof n.Text && ((i = e.formatting.attributes), (e = e.text)),
            r.push({ string: e, attributes: i }),
            (t = "\n" === e[e.length - 1]);
        }
        function o(e, r) {
          t &&
            i(
              n.sentinelConstants.LINE_SENTINEL_CHARACTER,
              e.formatting.attributes
            );
          for (var o = 0; o < e.textPieces.length; o++) i(e.textPieces[o]);
          r && i("\n");
        }
        for (var s = 0; s < e.length; s++)
          e[s] instanceof n.Line ? o(e[s], s < e.length - 1) : i(e[s]);
        return r;
      }),
      ((n = n || {}).Headless = (function () {
        var t = n.TextOperation,
          e = n.FirebaseAdapter,
          r = n.EntityManager,
          i = n.ParseHtml;
        function o(t) {
          if (!(this instanceof o)) return new o(t);
          var n, i;
          "string" == typeof t
            ? (void 0 === window.firebase && "object" != typeof n
                ? (console.log("REQUIRING"),
                  (n = require("firebase/app")),
                  require("firebase/database"))
                : (n = window.firebase),
              (i = n.database().refFromURL(t)))
            : (i = t),
            (this.entityManager_ = new r()),
            (this.firebaseAdapter_ = new e(i)),
            (this.ready_ = !1),
            (this.zombie_ = !1);
        }
        return (
          (o.prototype.getDocument = function (t) {
            var e = this;
            if (e.ready_) return t(e.firebaseAdapter_.getDocument());
            e.firebaseAdapter_.on("ready", function () {
              (e.ready_ = !0), t(e.firebaseAdapter_.getDocument());
            });
          }),
          (o.prototype.getText = function (t) {
            if (this.zombie_)
              throw new Error(
                "You can't use a firepad.Headless after calling dispose()!"
              );
            this.getDocument(function (e) {
              var r = e.apply("");
              for (var i in n.sentinelConstants)
                r = r.replace(new RegExp(n.sentinelConstants[i], "g"), "");
              t(r);
            });
          }),
          (o.prototype.setText = function (e, r) {
            if (this.zombie_)
              throw new Error(
                "You can't use a firepad.Headless after calling dispose()!"
              );
            var n = t().insert(e);
            this.sendOperationWithRetry(n, r);
          }),
          (o.prototype.initializeFakeDom = function (t) {
            if ("object" == typeof document || "object" == typeof n.document)
              t();
            else {
              const e = require("jsdom"),
                { JSDOM: r } = e,
                { window: i } = new r("<head></head><body></body>");
              if (n.document) return i.close(), t();
              (n.document = i.document), t();
            }
          }),
          (o.prototype.getHtml = function (t) {
            var e = this;
            if (this.zombie_)
              throw new Error(
                "You can't use a firepad.Headless after calling dispose()!"
              );
            e.initializeFakeDom(function () {
              e.getDocument(function (r) {
                t(n.SerializeHtml(r, e.entityManager_));
              });
            });
          }),
          (o.prototype.setHtml = function (e, r) {
            var o = this;
            if (this.zombie_)
              throw new Error(
                "You can't use a firepad.Headless after calling dispose()!"
              );
            o.initializeFakeDom(function () {
              for (
                var s = i(e, o.entityManager_),
                  a = n.textPiecesToInserts(!0, s),
                  h = new t(),
                  c = 0;
                c < a.length;
                c++
              )
                h.insert(a[c].string, a[c].attributes);
              o.sendOperationWithRetry(h, r);
            });
          }),
          (o.prototype.sendOperationWithRetry = function (t, e) {
            var r = this;
            r.getDocument(function (n) {
              var i = t.clone().delete(n.targetLength);
              r.firebaseAdapter_.sendOperation(i, function (n, i) {
                i ? void 0 !== e && e(null, i) : r.sendOperationWithRetry(t, e);
              });
            });
          }),
          (o.prototype.dispose = function () {
            (this.zombie_ = !0), this.firebaseAdapter_.dispose();
          }),
          o
        );
      })()),
      ((n = n || {}).Firepad = (function (t) {
        if (!n.RichTextCodeMirrorAdapter)
          throw new Error(
            "Oops! It looks like you're trying to include lib/firepad.js directly.  This is actually one of many source files that make up firepad.  You want dist/firepad.js instead."
          );
        var e = n.RichTextCodeMirrorAdapter,
          r = n.RichTextCodeMirror,
          i = n.RichTextToolbar,
          o = n.ACEAdapter,
          s = n.MonacoAdapter,
          a = n.FirebaseAdapter,
          h = n.EditorClient,
          c = n.EntityManager,
          u = n.AttributeConstants,
          l = n.utils,
          p = (n.LineFormatting.LIST_TYPE, t.CodeMirror),
          d = t.ace;
        t.monaco;
        function f(n, i, u) {
          if (!(this instanceof f)) return new f(n, i, u);
          if (!p && !d && !t.monaco)
            throw new Error(
              "Couldn't find CodeMirror, ACE or Monaco.  Did you forget to include codemirror.js/ace.js or import monaco?"
            );
          if (((this.zombie_ = !1), p && i instanceof p)) {
            this.codeMirror_ = this.editor_ = i;
            var m = this.codeMirror_.getValue();
            if ("" !== m)
              throw new Error(
                "Can't initialize Firepad with a CodeMirror instance that already contains text."
              );
          } else if (d && i && i.session instanceof d.EditSession) {
            if (
              ((this.ace_ = this.editor_ = i),
              "" !== (m = this.ace_.getValue()))
            )
              throw new Error(
                "Can't initialize Firepad with an ACE instance that already contains text."
              );
          } else if (t.monaco && i && i instanceof t.monaco.constructor) {
            if (
              (t.monaco,
              (this.monaco_ = this.editor_ = i),
              "" !== (m = this.monaco_.getValue()))
            )
              throw new Error(
                "Can't initialize Firepad with a Monaco instance that already contains text."
              );
          } else this.codeMirror_ = this.editor_ = new p(i);
          var y;
          (y = this.codeMirror_
            ? this.codeMirror_.getWrapperElement()
            : this.ace_
            ? this.ace_.container
            : this.monaco_.getDomNode()),
            (this.firepadWrapper_ = l.elt("div", null, { class: "firepad" })),
            y.parentNode.replaceChild(this.firepadWrapper_, y),
            this.firepadWrapper_.appendChild(y),
            l.on(y, "dragstart", l.stopEvent),
            (this.editor_.firepad = this),
            (this.options_ = u || {}),
            this.getOption("richTextShortcuts", !1) &&
              (p.keyMap.richtext || this.initializeKeyMap_(),
              this.codeMirror_.setOption("keyMap", "richtext"),
              (this.firepadWrapper_.className += " firepad-richtext")),
            (this.imageInsertionUI = this.getOption("imageInsertionUI", !0)),
            this.getOption("richTextToolbar", !1) &&
              (this.addToolbar_(),
              (this.firepadWrapper_.className +=
                " firepad-richtext firepad-with-toolbar")),
            this.codeMirror_ && this.codeMirror_.refresh();
          var v = this.getOption("userId", n.push().key),
            _ = this.getOption(
              "userColor",
              (function (t) {
                for (var e = 1, r = 0; r < t.length; r++)
                  e = (17 * (e + t.charCodeAt(r))) % 360;
                return (function (t, e, r) {
                  if (0 === e) return g(r, r, r);
                  var n = r < 0.5 ? r * (1 + e) : r + e - e * r,
                    i = 2 * r - n,
                    o = function (t) {
                      return (
                        t < 0 && (t += 1),
                        t > 1 && (t -= 1),
                        6 * t < 1
                          ? i + 6 * (n - i) * t
                          : 2 * t < 1
                          ? n
                          : 3 * t < 2
                          ? i + 6 * (n - i) * (2 / 3 - t)
                          : i
                      );
                    };
                  return g(o(t + 1 / 3), o(t), o(t - 1 / 3));
                })(e / 360, 1, 0.75);
              })(v)
            );
          (this.entityManager_ = new c()),
            (this.firebaseAdapter_ = new a(n, v, _)),
            this.codeMirror_
              ? ((this.richTextCodeMirror_ = new r(
                  this.codeMirror_,
                  this.entityManager_,
                  { cssPrefix: "firepad-" }
                )),
                (this.editorAdapter_ = new e(this.richTextCodeMirror_)))
              : this.ace_
              ? (this.editorAdapter_ = new o(this.ace_))
              : (this.editorAdapter_ = new s(this.monaco_)),
            (this.client_ = new h(this.firebaseAdapter_, this.editorAdapter_));
          var b = this;
          this.firebaseAdapter_.on("cursor", function () {
            b.trigger.apply(b, ["cursor"].concat([].slice.call(arguments)));
          }),
            this.codeMirror_ &&
              this.richTextCodeMirror_.on("newLine", function () {
                b.trigger.apply(
                  b,
                  ["newLine"].concat([].slice.call(arguments))
                );
              }),
            this.firebaseAdapter_.on("ready", function () {
              (b.ready_ = !0),
                this.ace_ && this.editorAdapter_.grabDocumentState(),
                this.monaco_ && this.editorAdapter_.grabDocumentState();
              var t = b.getOption("defaultText", null);
              t && b.isHistoryEmpty() && b.setText(t), b.trigger("ready");
            }),
            this.client_.on("synced", function (t) {
              b.trigger("synced", t);
            }),
            "Microsoft Internet Explorer" == navigator.appName &&
              navigator.userAgent.match(/MSIE 8\./) &&
              (window.onload = function () {
                var t = document.getElementsByTagName("head")[0],
                  e = document.createElement("style");
                (e.type = "text/css"),
                  (e.styleSheet.cssText =
                    ":before,:after{content:none !important;}"),
                  t.appendChild(e),
                  setTimeout(function () {
                    t.removeChild(e);
                  }, 0);
              });
        }
        function g(t, e, r) {
          function n(t) {
            var e = Math.round(255 * t).toString(16);
            return 1 === e.length ? "0" + e : e;
          }
          return "#" + n(t) + n(e) + n(r);
        }
        return (
          l.makeEventEmitter(f),
          (f.fromCodeMirror = f),
          (f.fromACE = f),
          (f.fromMonaco = f),
          (f.prototype.dispose = function () {
            (this.zombie_ = !0),
              this.codeMirror_
                ? (editorWrapper = this.codeMirror_.getWrapperElement())
                : this.ace_
                ? (editorWrapper = this.ace_.container)
                : (editorWrapper = this.monaco_.getDomNode()),
              this.firepadWrapper_.removeChild(editorWrapper),
              this.firepadWrapper_.parentNode.replaceChild(
                editorWrapper,
                this.firepadWrapper_
              ),
              (this.editor_.firepad = null),
              this.codeMirror_ &&
                "richtext" === this.codeMirror_.getOption("keyMap") &&
                this.codeMirror_.setOption("keyMap", "default"),
              this.firebaseAdapter_.dispose(),
              this.editorAdapter_.detach(),
              this.richTextCodeMirror_ && this.richTextCodeMirror_.detach();
          }),
          (f.prototype.setUserId = function (t) {
            this.firebaseAdapter_.setUserId(t);
          }),
          (f.prototype.setUserColor = function (t) {
            this.firebaseAdapter_.setColor(t);
          }),
          (f.prototype.getText = function () {
            return (
              this.assertReady_("getText"),
              this.codeMirror_
                ? this.richTextCodeMirror_.getText()
                : this.ace_
                ? this.ace_.getSession().getDocument().getValue()
                : this.monaco_.getModel().getValue()
            );
          }),
          (f.prototype.setText = function (t) {
            return (
              this.assertReady_("setText"),
              this.monaco_
                ? this.monaco_.getModel().setValue(t)
                : this.ace_
                ? this.ace_.getSession().getDocument().setValue(t)
                : (this.codeMirror_
                    .getWrapperElement()
                    .setAttribute("style", "display: none"),
                  this.codeMirror_.setValue(""),
                  this.insertText(0, t),
                  this.codeMirror_
                    .getWrapperElement()
                    .setAttribute("style", ""),
                  this.codeMirror_.refresh(),
                  void this.editorAdapter_.setCursor({
                    position: 0,
                    selectionEnd: 0,
                  }))
            );
          }),
          (f.prototype.insertTextAtCursor = function (t) {
            this.insertText(
              this.codeMirror_.indexFromPos(this.codeMirror_.getCursor()),
              t
            );
          }),
          (f.prototype.insertText = function (t, e) {
            l.assert(!this.ace_, "Not supported for ace yet."),
              l.assert(!this.monaco_, "Not supported for monaco yet."),
              this.assertReady_("insertText"),
              "[object Array]" !== Object.prototype.toString.call(e) &&
                (e = [e]);
            var r = this;
            r.codeMirror_.operation(function () {
              for (
                var i = 0 === t, o = n.textPiecesToInserts(i, e), s = 0;
                s < o.length;
                s++
              ) {
                var a = o[s].string,
                  h = o[s].attributes;
                r.richTextCodeMirror_.insertText(t, a, h), (t += a.length);
              }
            });
          }),
          (f.prototype.getOperationForSpan = function (t, e) {
            for (
              var r = this.richTextCodeMirror_.getRange(t, e),
                i = this.richTextCodeMirror_.getAttributeSpans(t, e),
                o = 0,
                s = new n.TextOperation(),
                a = 0;
              a < i.length;
              a++
            )
              s.insert(r.substr(o, i[a].length), i[a].attributes),
                (o += i[a].length);
            return s;
          }),
          (f.prototype.getHtml = function () {
            return this.getHtmlFromRange(null, null);
          }),
          (f.prototype.getHtmlFromSelection = function () {
            var t = this.codeMirror_.getCursor("start"),
              e = this.codeMirror_.getCursor("end"),
              r = this.codeMirror_.indexFromPos(t),
              n = this.codeMirror_.indexFromPos(e);
            return this.getHtmlFromRange(r, n);
          }),
          (f.prototype.getHtmlFromRange = function (t, e) {
            this.assertReady_("getHtmlFromRange");
            var r =
              null != t && null != e
                ? this.getOperationForSpan(t, e)
                : this.getOperationForSpan(
                    0,
                    this.codeMirror_.getValue().length
                  );
            return n.SerializeHtml(r, this.entityManager_);
          }),
          (f.prototype.insertHtml = function (t, e) {
            var r = n.ParseHtml(e, this.entityManager_);
            this.insertText(t, r);
          }),
          (f.prototype.insertHtmlAtCursor = function (t) {
            this.insertHtml(
              this.codeMirror_.indexFromPos(this.codeMirror_.getCursor()),
              t
            );
          }),
          (f.prototype.setHtml = function (t) {
            var e = n.ParseHtml(t, this.entityManager_);
            this.setText(e);
          }),
          (f.prototype.isHistoryEmpty = function () {
            return (
              this.assertReady_("isHistoryEmpty"),
              this.firebaseAdapter_.isHistoryEmpty()
            );
          }),
          (f.prototype.bold = function () {
            this.richTextCodeMirror_.toggleAttribute(u.BOLD),
              this.codeMirror_.focus();
          }),
          (f.prototype.italic = function () {
            this.richTextCodeMirror_.toggleAttribute(u.ITALIC),
              this.codeMirror_.focus();
          }),
          (f.prototype.underline = function () {
            this.richTextCodeMirror_.toggleAttribute(u.UNDERLINE),
              this.codeMirror_.focus();
          }),
          (f.prototype.strike = function () {
            this.richTextCodeMirror_.toggleAttribute(u.STRIKE),
              this.codeMirror_.focus();
          }),
          (f.prototype.fontSize = function (t) {
            this.richTextCodeMirror_.setAttribute(u.FONT_SIZE, t),
              this.codeMirror_.focus();
          }),
          (f.prototype.font = function (t) {
            this.richTextCodeMirror_.setAttribute(u.FONT, t),
              this.codeMirror_.focus();
          }),
          (f.prototype.color = function (t) {
            this.richTextCodeMirror_.setAttribute(u.COLOR, t),
              this.codeMirror_.focus();
          }),
          (f.prototype.highlight = function () {
            this.richTextCodeMirror_.toggleAttribute(
              u.BACKGROUND_COLOR,
              "rgba(255,255,0,.65)"
            ),
              this.codeMirror_.focus();
          }),
          (f.prototype.align = function (t) {
            if ("left" !== t && "center" !== t && "right" !== t)
              throw new Error(
                'align() must be passed "left", "center", or "right".'
              );
            this.richTextCodeMirror_.setLineAttribute(u.LINE_ALIGN, t),
              this.codeMirror_.focus();
          }),
          (f.prototype.orderedList = function () {
            this.richTextCodeMirror_.toggleLineAttribute(u.LIST_TYPE, "o"),
              this.codeMirror_.focus();
          }),
          (f.prototype.unorderedList = function () {
            this.richTextCodeMirror_.toggleLineAttribute(u.LIST_TYPE, "u"),
              this.codeMirror_.focus();
          }),
          (f.prototype.todo = function () {
            this.richTextCodeMirror_.toggleTodo(), this.codeMirror_.focus();
          }),
          (f.prototype.newline = function () {
            this.richTextCodeMirror_.newline();
          }),
          (f.prototype.deleteLeft = function () {
            this.richTextCodeMirror_.deleteLeft();
          }),
          (f.prototype.deleteRight = function () {
            this.richTextCodeMirror_.deleteRight();
          }),
          (f.prototype.indent = function () {
            this.richTextCodeMirror_.indent(), this.codeMirror_.focus();
          }),
          (f.prototype.unindent = function () {
            this.richTextCodeMirror_.unindent(), this.codeMirror_.focus();
          }),
          (f.prototype.undo = function () {
            this.codeMirror_.undo();
          }),
          (f.prototype.redo = function () {
            this.codeMirror_.redo();
          }),
          (f.prototype.insertEntity = function (t, e, r) {
            this.richTextCodeMirror_.insertEntityAtCursor(t, e, r);
          }),
          (f.prototype.insertEntityAt = function (t, e, r, n) {
            this.richTextCodeMirror_.insertEntityAt(t, e, r, n);
          }),
          (f.prototype.registerEntity = function (t, e) {
            this.entityManager_.register(t, e);
          }),
          (f.prototype.getOption = function (t, e) {
            return t in this.options_ ? this.options_[t] : e;
          }),
          (f.prototype.assertReady_ = function (t) {
            if (!this.ready_)
              throw new Error(
                'You must wait for the "ready" event before calling ' + t + "."
              );
            if (this.zombie_)
              throw new Error(
                "You can't use a Firepad after calling dispose()!  [called " +
                  t +
                  "]"
              );
          }),
          (f.prototype.makeImageDialog_ = function () {
            this.makeDialog_("img", "Insert image url");
          }),
          (f.prototype.makeDialog_ = function (t, e) {
            var r = this,
              n = l.elt("input", null, {
                class: "firepad-dialog-input",
                id: t,
                type: "text",
                placeholder: e,
                autofocus: "autofocus",
              }),
              i = l.elt("a", "Submit", {
                class: "firepad-btn",
                id: "submitbtn",
              });
            l.on(
              i,
              "click",
              l.stopEventAnd(function () {
                var e = document.getElementById("overlay");
                e.style.visibility = "hidden";
                var n = document.getElementById(t).value;
                null !== n && r.insertEntity(t, { src: n }),
                  r.firepadWrapper_.removeChild(e);
              })
            );
            var o = l.elt("a", "Cancel", { class: "firepad-btn" });
            l.on(
              o,
              "click",
              l.stopEventAnd(function () {
                var t = document.getElementById("overlay");
                (t.style.visibility = "hidden"),
                  r.firepadWrapper_.removeChild(t);
              })
            );
            var s = l.elt("div", [i, o], { class: "firepad-btn-group" }),
              a = l.elt("div", [n, s], { class: "firepad-dialog-div" }),
              h = l.elt("div", [a], { class: "firepad-dialog", id: "overlay" });
            this.firepadWrapper_.appendChild(h);
          }),
          (f.prototype.addToolbar_ = function () {
            (this.toolbar = new i(this.imageInsertionUI)),
              this.toolbar.on("undo", this.undo, this),
              this.toolbar.on("redo", this.redo, this),
              this.toolbar.on("bold", this.bold, this),
              this.toolbar.on("italic", this.italic, this),
              this.toolbar.on("underline", this.underline, this),
              this.toolbar.on("strike", this.strike, this),
              this.toolbar.on("font-size", this.fontSize, this),
              this.toolbar.on("font", this.font, this),
              this.toolbar.on("color", this.color, this),
              this.toolbar.on(
                "left",
                function () {
                  this.align("left");
                },
                this
              ),
              this.toolbar.on(
                "center",
                function () {
                  this.align("center");
                },
                this
              ),
              this.toolbar.on(
                "right",
                function () {
                  this.align("right");
                },
                this
              ),
              this.toolbar.on("ordered-list", this.orderedList, this),
              this.toolbar.on("unordered-list", this.unorderedList, this),
              this.toolbar.on("todo-list", this.todo, this),
              this.toolbar.on("indent-increase", this.indent, this),
              this.toolbar.on("indent-decrease", this.unindent, this),
              this.firepadWrapper_.insertBefore(
                this.toolbar.element(),
                this.firepadWrapper_.firstChild
              );
          }),
          (f.prototype.initializeKeyMap_ = function () {
            function t(t) {
              return function (e) {
                setTimeout(function () {
                  t.call(e.firepad);
                }, 0);
              };
            }
            p.keyMap.richtext = {
              "Ctrl-B": t(this.bold),
              "Cmd-B": t(this.bold),
              "Ctrl-I": t(this.italic),
              "Cmd-I": t(this.italic),
              "Ctrl-U": t(this.underline),
              "Cmd-U": t(this.underline),
              "Ctrl-H": t(this.highlight),
              "Cmd-H": t(this.highlight),
              Enter: t(this.newline),
              Delete: t(this.deleteRight),
              Backspace: t(this.deleteLeft),
              Tab: t(this.indent),
              "Shift-Tab": t(this.unindent),
              fallthrough: ["default"],
            };
          }),
          f
        );
      })(this)),
      (n.Firepad.Formatting = n.Formatting),
      (n.Firepad.Text = n.Text),
      (n.Firepad.Entity = n.Entity),
      (n.Firepad.LineFormatting = n.LineFormatting),
      (n.Firepad.Line = n.Line),
      (n.Firepad.TextOperation = n.TextOperation),
      (n.Firepad.Headless = n.Headless),
      (n.Firepad.RichTextCodeMirrorAdapter = n.RichTextCodeMirrorAdapter),
      (n.Firepad.ACEAdapter = n.ACEAdapter),
      (n.Firepad.MonacoAdapter = n.MonacoAdapter),
      n.Firepad
    );
  },
  this
);
