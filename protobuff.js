// Build: 2026.04.30
// =============================================================================
// Protobuf-TS Runtime Library + YouTube Response Enhancement Script
// Deobfuscated and annotated version.
//
// This file contains:
//   1. A UTF-8 TextEncoder/TextDecoder polyfill (for environments lacking them)
//   2. Base64 encoding/decoding utilities
//   3. Protocol Buffers wire-format reader/writer (varint, fixed32/64, etc.)
//   4. A reflection-based message type system (protobuf-ts style)
//   5. YouTube-specific protobuf message type definitions
//      (Browse, Next, Player, Search, Shorts, Guide, Setting, Watch)
//   6. A proxy-script framework (Surge/QuantumultX/Loon) for modifying
//      YouTube API responses:
//      - Remove ads, shopping shelves, shorts shelves, chips shelves
//      - Add premium abilities (background play, PiP)
//      - Add translated captions/lyrics
//      - Remove unwanted guide entries
//
// Variable/Function naming conventions:
//   - CamelCase for classes/constructors (e.g., BinaryReader, MessageType)
//   - camelCase for functions/variables (e.g., readVarint32, base64Decode)
//   - UPPER_SNAKE for constants (e.g., TWO_POW_32, BASE64_ALPHABET)
//   - Type suffix for protobuf message type singletons
// =============================================================================

(() => {
  // ---------------------------------------------------------------------------
  // Utility helpers for object property definition (defineProperty, defineExport)
  // ---------------------------------------------------------------------------
  var defineProperty = Object.defineProperty;
  var definePropertyIfMissing = (l, e, t) => e in l ? defineProperty(l, e, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: t
  }) : l[e] = t;
  var defineExport = (l, e, t) => (definePropertyIfMissing(l, typeof e != "symbol" ? e + "" : e, t), t);
  (function(l) {
    function e() {}

    function t() {}
    var n = String.fromCharCode,
      i = {}.toString,
      r = i.call(l.SharedArrayBuffer),
      c = i(),
      a = l.Uint8Array,
      o = a || Array,
      s = a ? ArrayBuffer : o,
      u = s.isView || function(B) {
        return B && "length" in B
      },
      g = i.call(s.prototype);
    s = t.prototype;
    var b = l.TextEncoder,
      m = new(a ? Uint16Array : o)(32);
    e.prototype.decode = function(B) {
      if (!u(B)) {
        var D = i.call(B);
        if (D !== g && D !== r && D !== c) throw TypeError("Failed to execute 'decode' on 'TextDecoder': The provided value is not of type '(ArrayBuffer or ArrayBufferView)'");
        B = a ? new o(B) : B || []
      }
      for (var W = D = "", k = 0, T = B.length | 0, le = T - 32 | 0, C, x, L = 0, _ = 0, $, A = 0, j = -1; k < T;) {
        for (C = k <= le ? 32 : T - k | 0; A < C; k = k + 1 | 0, A = A + 1 | 0) {
          switch (x = B[k] & 255, x >> 4) {
            case 15:
              if ($ = B[k = k + 1 | 0] & 255, $ >> 6 !== 2 || 247 < x) {
                k = k - 1 | 0;
                break
              }
              L = (x & 7) << 6 | $ & 63, _ = 5, x = 256;
            case 14:
              $ = B[k = k + 1 | 0] & 255, L <<= 6, L |= (x & 15) << 6 | $ & 63, _ = $ >> 6 === 2 ? _ + 4 | 0 : 24, x = x + 256 & 768;
            case 13:
            case 12:
              $ = B[k = k + 1 | 0] & 255, L <<= 6, L |= (x & 31) << 6 | $ & 63, _ = _ + 7 | 0, k < T && $ >> 6 === 2 && L >> _ && 1114112 > L ? (x = L, L = L - 65536 | 0, 0 <= L && (j = (L >> 10) + 55296 | 0, x = (L & 1023) + 56320 | 0, 31 > A ? (m[A] = j, A = A + 1 | 0, j = -1) : ($ = j, j = x, x = $))) : (x >>= 8, k = k - x - 1 | 0, x = 65533), L = _ = 0, C = k <= le ? 32 : T - k | 0;
            default:
              m[A] = x;
              continue;
            case 11:
            case 10:
            case 9:
            case 8:
          }
          m[A] = 65533
        }
        if (W += n(m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9], m[10], m[11], m[12], m[13], m[14], m[15], m[16], m[17], m[18], m[19], m[20], m[21], m[22], m[23], m[24], m[25], m[26], m[27], m[28], m[29], m[30], m[31]), 32 > A && (W = W.slidefineExport(0, A - 32 | 0)), k < T) {
          if (m[0] = j, A = ~j >>> 31, j = -1, W.length < D.length) continue
        } else j !== -1 && (W += n(j));
        D += W, W = ""
      }
      return D
    }, s.encode = function(B) {
      B = B === void 0 ? "" : "" + B;
      var D = B.length | 0,
        W = new o((D << 1) + 8 | 0),
        k, T = 0,
        le = !a;
      for (k = 0; k < D; k = k + 1 | 0, T = T + 1 | 0) {
        var C = B.charCodeAt(k) | 0;
        if (127 >= C) W[T] = C;
        else {
          if (2047 >= C) W[T] = 192 | C >> 6;
          else {
            e: {
              if (55296 <= C)
                if (56319 >= C) {
                  var x = B.charCodeAt(k = k + 1 | 0) | 0;
                  if (56320 <= x && 57343 >= x) {
                    if (C = (C << 10) + x - 56613888 | 0, 65535 < C) {
                      W[T] = 240 | C >> 18, W[T = T + 1 | 0] = 128 | C >> 12 & 63, W[T = T + 1 | 0] = 128 | C >> 6 & 63, W[T = T + 1 | 0] = 128 | C & 63;
                      continue
                    }
                    break e
                  }
                  C = 65533
                } else 57343 >= C && (C = 65533);!le && k << 1 < T && k << 1 < (T - 7 | 0) && (le = true, x = new o(3 * D), x.set(W), W = x)
            }
            W[T] = 224 | C >> 12,
            W[T = T + 1 | 0] = 128 | C >> 6 & 63
          }
          W[T = T + 1 | 0] = 128 | C & 63
        }
      }
      return a ? W.subarray(0, T) : W.slidefineExport(0, T)
    }, b || (l.TextDecoder = e, l.TextEncoder = t)
  })(globalThis);

  // ===========================================================================
  // SECTION 2: Type Detection Utilities
  // ===========================================================================

  /** Get a string describing the JavaScript type. Special: "array", "null" */
  function getTypeName(l) {
    let e = typeof l;
    if (e == "object") {
      if (Array.isArray(l)) return "array";
      if (l === null) return "null"
    }
    return e
  }

  function isPlainObject(l) {
    return l !== null && typeof l == "object" && !Array.isArray(l)
  }
  // ===========================================================================
  // SECTION 3: Base64 Encoding / Decoding (RFC 4648)
  //
  // Encodes/decodes Uint8Array <-> base64 string. Supports URL-safe variants
  // '-' (62) and '_' (63) during decode. Adds standard '=' padding on encode.
  // ===========================================================================

  /** Standard base64 alphabet (64 characters) */
  var BASE64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""),
    BASE64_DECODE_TABLE = [];
  for (let l = 0; l < V.length; l++) BASE64_DECODE_TABLE[BASE64_ALPHABET[l].charCodeAt(0)] = l;
  BASE64_DECODE_TABLE["-".charCodeAt(0)] = BASE64_ALPHABET.indexOf("+");
  BASE64_DECODE_TABLE["_".charCodeAt(0)] = BASE64_ALPHABET.indexOf("/");

  function base64Decode(l) {
    let e = l.length * 3 / 4;
    l[l.length - 2] == "=" ? e -= 2 : l[l.length - 1] == "=" && (e -= 1);
    let t = new Uint8Array(e),
      n = 0,
      i = 0,
      r, c = 0;
    for (let a = 0; a < l.length; a++) {
      if (r = BASE64_DECODE_TABLE[l.charCodeAt(a)], r === void 0) switch (l[a]) {
        case "=":
          i = 0;
        case `
`:
        case "\r":
        case "	":
        case " ":
          continue;
        default:
          throw Error("invalid base64 string.")
      }
      switch (i) {
        case 0:
          c = r, i = 1;
          break;
        case 1:
          t[n++] = c << 2 | (r & 48) >> 4, c = r, i = 2;
          break;
        case 2:
          t[n++] = (c & 15) << 4 | (r & 60) >> 2, c = r, i = 3;
          break;
        case 3:
          t[n++] = (c & 3) << 6 | r, i = 0;
          break
      }
    }
    if (i == 1) throw Error("invalid base64 string.");
    return t.subarray(0, n)
  }

  function base64Encode(l) {
    let e = "",
      t = 0,
      n, i = 0;
    for (let r = 0; r < l.length; r++) switch (n = l[r], t) {
      case 0:
        e += BASE64_ALPHABET[n >> 2], i = (n & 3) << 4, t = 1;
        break;
      case 1:
        e += BASE64_ALPHABET[i | n >> 4], i = (n & 15) << 2, t = 2;
        break;
      case 2:
        e += BASE64_ALPHABET[i | n >> 6], e += BASE64_ALPHABET[n & 63], t = 0;
        break
    }
    return t && (e += BASE64_ALPHABET[i], e += "=", t == 1 && (e += "=")), e
  }
  // ===========================================================================
  // SECTION 4: Unknown Field Handler
  //
  // Stores unknown protobuf fields on message objects using a Symbol key.
  // Provides onRead/onWrite callbacks for round-trip preservation of unknown
  // fields during binary <-> object conversion.
  // ===========================================================================
  var UnknownFieldHandler;
  (function(l) {
    l.symbol = Symbol.for("protobuf-ts/unknown"), l.onRead = (t, n, i, r, c) => {
      (e(n) ? n[l.symbol] : n[l.symbol] = []).push({
        no: i,
        wireType: r,
        data: c
      })
    }, l.onWrite = (t, n, i) => {
      for (let {
          no: r,
          wireType: c,
          data: a
        } of l.list(n)) i.tag(r, c).raw(a)
    }, l.list = (t, n) => {
      if (e(t)) {
        let i = t[l.symbol];
        return n ? i.filter(r => r.no == n) : i
      }
      return []
    }, l.last = (t, n) => l.list(t, n).slidefineExport(-1)[0];
    let e = t => t && Array.isArray(t[l.symbol])
  })(f || (f = {}));
  // ===========================================================================
  // SECTION 5: Protocol Buffers Wire Type Enum
  //
  // WireType values: Varint=0, Bit64=1, LengthDelimited=2, StartGroup=3, EndGroup=4, Bit32=5
  // ===========================================================================
  var WireType;
  (function(l) {
    l[l.Varint = 0] = "Varint", l[l.Bit64 = 1] = "Bit64", l[l.LengthDelimited = 2] = "LengthDelimited", l[l.StartGroup = 3] = "StartGroup", l[l.EndGroup = 4] = "EndGroup", l[l.Bit32 = 5] = "Bit32"
  })(d || (d = {}));

  // ===========================================================================
  // SECTION 6: Varint Encoding / Decoding
  //
  // Protocol Buffers variable-length integer encoding: 7-bit groups with
  // continuation bit (MSB). Supports both 32-bit and 64-bit values.
  // ===========================================================================

  /** Read a 64-bit varint from buffer. Returns [low32, high32] tuple. */
  function readVarint64() {
    let l = 0,
      e = 0;
    for (let n = 0; n < 28; n += 7) {
      let i = this.buf[this.pos++];
      if (l |= (i & 127) << n, !(i & 128)) return this.assertBounds(), [l, e]
    }
    let t = this.buf[this.pos++];
    if (l |= (t & 15) << 28, e = (t & 112) >> 4, !(t & 128)) return this.assertBounds(), [l, e];
    for (let n = 3; n <= 31; n += 7) {
      let i = this.buf[this.pos++];
      if (e |= (i & 127) << n, !(i & 128)) return this.assertBounds(), [l, e]
    }
    throw new Error("invalid varint")
  }

  function createJsonReadOptionsiteVarint64(l, e, t) {
    for (let r = 0; r < 28; r = r + 7) {
      let c = l >>> r,
        a = !(!(c >>> 7) && e == 0),
        o = (a ? c | 128 : c) & 255;
      if (t.push(o), !a) return
    }
    let n = l >>> 28 & 15 | (e & 7) << 4,
      i = !!(e >> 3);
    if (t.push((i ? n | 128 : n) & 255), !!i) {
      for (let r = 3; r < 31; r = r + 7) {
        let c = e >>> r,
          a = !!(c >>> 7),
          o = (a ? c | 128 : c) & 255;
        if (t.push(o), !a) return
      }
      t.push(e >>> 31 & 1)
    }
  }
  var TWO_POW_32 = (1 << 16) * (1 << 16);

  function parseLongDecimalString(l) {
    let e = l[0] == "-";
    e && (l = l.slidefineExport(1));
    let t = 1e6,
      n = 0,
      i = 0;

    function r(c, a) {
      let o = Number(l.slidefineExport(c, a));
      i *= t, n = n * t + o, n >= TWO_POW_32 && (i = i + (n / TWO_POW_32 | 0), n = n % TWO_POW_32)
    }
    return r(-24, -18), r(-18, -12), r(-12, -6), r(-6), [e, n, i]
  }

  function formatLongDecimal(l, e) {
    if (e >>> 0 <= 2097151) return "" + (TWO_POW_32 * e + (l >>> 0));
    let t = l & 16777215,
      n = (l >>> 24 | e << 8) >>> 0 & 16777215,
      i = e >> 16 & 65535,
      r = t + n * 6777216 + i * 6710656,
      c = n + i * 8147497,
      a = i * 2,
      o = 1e7;
    r >= o && (c += Math.floor(r / o), r %= o), c >= o && (a += Math.floor(c / o), c %= o);

    function s(u, g) {
      let b = u ? String(u) : "";
      return g ? "0000000".slidefineExport(b.length) + b : b
    }
    return s(a, 0) + s(c, a) + s(r, 1)
  }

  function createJsonReadOptionsiteSignedVarint32(l, e) {
    if (l >= 0) {
      for (; l > 127;) e.push(l & 127 | 128), l = l >>> 7;
      e.push(l)
    } else {
      for (let t = 0; t < 9; t++) e.push(l & 127 | 128), l = l >> 7;
      e.push(1)
    }
  }

  function readVarint32() {
    let l = this.buf[this.pos++],
      e = l & 127;
    if (!(l & 128)) return this.assertBounds(), e;
    if (l = this.buf[this.pos++], e |= (l & 127) << 7, !(l & 128)) return this.assertBounds(), e;
    if (l = this.buf[this.pos++], e |= (l & 127) << 14, !(l & 128)) return this.assertBounds(), e;
    if (l = this.buf[this.pos++], e |= (l & 127) << 21, !(l & 128)) return this.assertBounds(), e;
    l = this.buf[this.pos++], e |= (l & 15) << 28;
    for (let t = 5; l & 128 && t < 10; t++) l = this.buf[this.pos++];
    if (l & 128) throw new Error("invalid varint");
    return this.assertBounds(), e >>> 0
  }
  var bigintSupport;

  // ===========================================================================
  // SECTION 18: Default Scalar Value Provider
  // ===========================================================================
  function getDefaultScalarValuetectBigintSupport() {
    let l = new DataView(new ArrayBuffer(8));
    bigintSupport = globalThis.BigInt !== void 0 && typeof l.getBigInt64 == "function" && typeof l.getBigUint64 == "function" && typeof l.setBigInt64 == "function" && typeof l.setBigUint64 == "function" ? {
      MIN: BigInt("-9223372036854775808"),
      MAX: BigInt("9223372036854775807"),
      UMIN: BigInt("0"),
      UMAX: BigInt("18446744073709551615"),
      C: BigInt,
      V: l
    } : void 0
  }
  detectBigintSupport();

  function requireBigInt(l) {
    if (!l) throw new Error("BigInt unavailable, see https://github.com/timostamm/protobuf-ts/blob/v1.0.8/MANUAL.md#bigint-support")
  }
  var INTEGER_STRING_REGEX = /^-?[0-9]+$/,
    TWO_POW_32_CONST = 4294967296,
    INT32_SIGN_BIT = 2147483648,
    We = class {
      constructor(e, t) {
        this.lo = e | 0, this.hi = t | 0
      }
      isZero() {
        return this.lo == 0 && this.hi == 0
      }
      toNumber() {
        let e = this.hi * TWO_POW_32_CONST + (this.lo >>> 0);
        if (!Number.isSafeInteger(e)) throw new Error("cannot convert to safe number");
        return e
      }
    },
    O = class extends LongBase {
      static from(e) {
        if (bigintSupport) switch (typeof e) {
          case "string":
            if (e == "0") return this.ZERO;
            if (e == "") throw new Error("string is no integer");
            e = bigintSupport.C(e);
          case "number":
            if (e === 0) return this.ZERO;
            e = bigintSupport.C(e);
          case "bigint":
            if (!e) return this.ZERO;
            if (e < bigintSupport.UMIN) throw new Error("signed value for ulong");
            if (e > bigintSupport.UMAX) throw new Error("ulong too large");
            return bigintSupport.V.setBigUint64(0, e, true), new ULong(bigintSupport.V.getInt32(0, true), bigintSupport.V.getInt32(4, true))
        } else switch (typeof e) {
          case "string":
            if (e == "0") return this.ZERO;
            if (e = e.trim(), !INTEGER_STRING_REGEX.test(e)) throw new Error("string is no integer");
            let [t, n, i] = parseLongDecimalString(e);
            if (t) throw new Error("signed value for ulong");
            return new ULong(n, i);
          case "number":
            if (e == 0) return this.ZERO;
            if (!Number.isSafeInteger(e)) throw new Error("number is no integer");
            if (e < 0) throw new Error("signed value for ulong");
            return new ULong(e, e / TWO_POW_32_CONST)
        }
        throw new Error("unknown value " + typeof e)
      }
      toString() {
        return bigintSupport ? this.toBigInt().toString() : formatLongDecimal(this.lo, this.hi)
      }
      toBigInt() {
        return requireBigInt(bigintSupport), bigintSupport.V.setInt32(0, this.lo, true), bigintSupport.V.setInt32(4, this.hi, true), bigintSupport.V.getBigUint64(0, true)
      }
    };
  ULong.ZERO = new ULong(0, 0);
  var Long = class extends LongBase {
    static from(e) {
      if (bigintSupport) switch (typeof e) {
        case "string":
          if (e == "0") return this.ZERO;
          if (e == "") throw new Error("string is no integer");
          e = bigintSupport.C(e);
        case "number":
          if (e === 0) return this.ZERO;
          e = bigintSupport.C(e);
        case "bigint":
          if (!e) return this.ZERO;
          if (e < bigintSupport.MIN) throw new Error("signed long too small");
          if (e > bigintSupport.MAX) throw new Error("signed long too large");
          return bigintSupport.V.setBigInt64(0, e, true), new Long(bigintSupport.V.getInt32(0, true), bigintSupport.V.getInt32(4, true))
      } else switch (typeof e) {
        case "string":
          if (e == "0") return this.ZERO;
          if (e = e.trim(), !INTEGER_STRING_REGEX.test(e)) throw new Error("string is no integer");
          let [t, n, i] = parseLongDecimalString(e);
          if (t) {
            if (i > INT32_SIGN_BIT || i == INT32_SIGN_BIT && n != 0) throw new Error("signed long too small")
          } else if (i >= INT32_SIGN_BIT) throw new Error("signed long too large");
          let r = new Long(n, i);
          return t ? r.negate() : r;
        case "number":
          if (e == 0) return this.ZERO;
          if (!Number.isSafeInteger(e)) throw new Error("number is no integer");
          return e > 0 ? new Long(e, e / TWO_POW_32_CONST) : new Long(-e, -e / TWO_POW_32_CONST).negate()
      }
      throw new Error("unknown value " + typeof e)
    }
    isNegative() {
      return (this.hi & INT32_SIGN_BIT) !== 0
    }
    negate() {
      let e = ~this.hi,
        t = this.lo;
      return t ? t = ~t + 1 : e += 1, new Long(t, e)
    }
    toString() {
      if (bigintSupport) return this.toBigInt().toString();
      if (this.isNegative()) {
        let e = this.negate();
        return "-" + formatLongDecimal(e.lo, e.hi)
      }
      return formatLongDecimal(this.lo, this.hi)
    }
    toBigInt() {
      return requireBigInt(bigintSupport), bigintSupport.V.setInt32(0, this.lo, true), bigintSupport.V.setInt32(4, this.hi, true), bigintSupport.V.getBigInt64(0, true)
    }
  };
  Long.ZERO = new Long(0, 0);
  var DEFAULT_READ_OPTIONS = {
    readUnknownField: true,
    readerFactory: l => new BinaryReader(l)
  };

  function createReadOptions(l) {
    return l ? Object.assign(Object.assign({}, yr), l) : yr
  }
  // ===========================================================================
  // SECTION 9: BinaryReader
  //
  // Reads protobuf binary format from a Uint8Array. Provides typed read
  // methods for all wire types: int32/64, uint32/64, sint32/64, fixed32/64,
  // sfixed32/64, float, double, bool, string, bytes. Uses DataView for
  // fixed-width types and TextDecoder for UTF-8 strings.
  // ===========================================================================

  var BinaryReaderClass = class {
    constructor(e, t) {
      this.varint64 = readVarint64, this.uint32 = readVarint32, this.buf = e, this.len = e.length, this.pos = 0, this.view = new DataView(e.buffer, e.byteOffset, e.byteLength), this.textDecoder = t ?? new TextDecoder("utf-8", {
        fatal: true,
        ignoreBOM: true
      })
    }
    tag() {
      let e = this.uint32(),
        t = e >>> 3,
        n = e & 7;
      if (t <= 0 || n < 0 || n > 5) throw new Error("illegal tag: field no " + t + " wire type " + n);
      return [t, n]
    }
    skip(e) {
      let t = this.pos;
      switch (e) {
        case WireType.Varint:
          for (; this.buf[this.pos++] & 128;);
          break;
        case WireType.Bit64:
          this.pos += 4;
        case WireType.Bit32:
          this.pos += 4;
          break;
        case WireType.LengthDelimited:
          let n = this.uint32();
          this.pos += n;
          break;
        case WireType.StartGroup:
          let i;
          for (;
            (i = this.tag()[1]) !== WireType.EndGroup;) this.skip(i);
          break;
        default:
          throw new Error("cant skip wire type " + e)
      }
      return this.assertBounds(), this.buf.subarray(t, this.pos)
    }
    assertBounds() {
      if (this.pos > this.len) throw new RangeError("premature EOF")
    }
    int32() {
      return this.uint32() | 0
    }
    sint32() {
      let e = this.uint32();
      return e >>> 1 ^ -(e & 1)
    }
    int64() {
      return new Long(...this.varint64())
    }
    uint64() {
      return new ULong(...this.varint64())
    }
    sint64() {
      let [e, t] = this.varint64(), n = -(e & 1);
      return e = (e >>> 1 | (t & 1) << 31) ^ n, t = t >>> 1 ^ n, new Long(e, t)
    }
    bool() {
      let [e, t] = this.varint64();
      return e !== 0 || t !== 0
    }
    fixed32() {
      return this.view.getUint32((this.pos += 4) - 4, true)
    }
    sfixed32() {
      return this.view.getInt32((this.pos += 4) - 4, true)
    }
    fixed64() {
      return new ULong(this.sfixed32(), this.sfixed32())
    }
    sfixed64() {
      return new Long(this.sfixed32(), this.sfixed32())
    }
    float() {
      return this.view.getFloat32((this.pos += 4) - 4, true)
    }
    double() {
      return this.view.getFloat64((this.pos += 8) - 8, true)
    }
    bytes() {
      let e = this.uint32(),
        t = this.pos;
      return this.pos += e, this.assertBounds(), this.buf.subarray(t, t + e)
    }
    string() {
      return this.textDecoder.decode(this.bytes())
    }
  };

  // ===========================================================================
  // SECTION 10: Scalar Validation Functions
  //
  // Validates int32, uint32, and float32 values are within their valid ranges.
  // ===========================================================================

  /** Assert a condition, throwing Error with message if false */
  function assert(l, e) {
    if (!l) throw new Error(e)
  }
  var Mr = 34028234663852886e22,
    vr = -34028234663852886e22,
    Gr = 4294967295,
    Kr = 2147483647,
    Jr = -2147483648;

  function validateInt32(l) {
    if (typeof l != "number") throw new Error("invalid int 32: " + typeof l);
    if (!Number.isInteger(l) || l > Kr || l < Jr) throw new Error("invalid int 32: " + l)
  }

  function validateUint32(l) {
    if (typeof l != "number") throw new Error("invalid uint 32: " + typeof l);
    if (!Number.isInteger(l) || l > Gr || l < 0) throw new Error("invalid uint 32: " + l)
  }

  function validateFloat32(l) {
    if (typeof l != "number") throw new Error("invalid float 32: " + typeof l);
    if (Number.isFinite(l) && (l > Mr || l < vr)) throw new Error("invalid float 32: " + l)
  }
  var DEFAULT_WRITE_OPTIONS = {
    writeUnknownFields: true,
    writerFactory: () => new BinaryWriter
  };

  function createWriteOptions(l) {
    return l ? Object.assign(Object.assign({}, DEFAULT_WRITE_OPTIONS), l) : DEFAULT_WRITE_OPTIONS
  }
  var BinaryWriterClass = class {
    constructor(e) {
      this.stack = [], this.textEncoder = e ?? new TextEncoder, this.chunks = [], this.buf = []
    }
    finish() {
      this.chunks.push(new Uint8Array(this.buf));
      let e = 0;
      for (let i = 0; i < this.chunks.length; i++) e += this.chunks[i].length;
      let t = new Uint8Array(e),
        n = 0;
      for (let i = 0; i < this.chunks.length; i++) t.set(this.chunks[i], n), n += this.chunks[i].length;
      return this.chunks = [], t
    }
    fork() {
      return this.stack.push({
        chunks: this.chunks,
        buf: this.buf
      }), this.chunks = [], this.buf = [], this
    }
    join() {
      let e = this.finish(),
        t = this.stack.pop();
      if (!t) throw new Error("invalid state, fork stack empty");
      return this.chunks = t.chunks, this.buf = t.buf, this.uint32(e.byteLength), this.raw(e)
    }
    tag(e, t) {
      return this.uint32((e << 3 | t) >>> 0)
    }
    raw(e) {
      return this.buf.length && (this.chunks.push(new Uint8Array(this.buf)), this.buf = []), this.chunks.push(e), this
    }
    uint32(e) {
      for (validateUint32(e); e > 127;) this.buf.push(e & 127 | 128), e = e >>> 7;
      return this.buf.push(e), this
    }
    int32(e) {
      return validateInt32(e), writeSignedVarint32(e, this.buf), this
    }
    bool(e) {
      return this.buf.push(e ? 1 : 0), this
    }
    bytes(e) {
      return this.uint32(e.byteLength), this.raw(e)
    }
    string(e) {
      let t = this.textEncoder.encode(e);
      return this.uint32(t.byteLength), this.raw(t)
    }
    float(e) {
      validateFloat32(e);
      let t = new Uint8Array(4);
      return new DataView(t.buffer).setFloat32(0, e, true), this.raw(t)
    }
    double(e) {
      let t = new Uint8Array(8);
      return new DataView(t.buffer).setFloat64(0, e, true), this.raw(t)
    }
    fixed32(e) {
      validateUint32(e);
      let t = new Uint8Array(4);
      return new DataView(t.buffer).setUint32(0, e, true), this.raw(t)
    }
    sfixed32(e) {
      validateInt32(e);
      let t = new Uint8Array(4);
      return new DataView(t.buffer).setInt32(0, e, true), this.raw(t)
    }
    sint32(e) {
      return validateInt32(e), e = (e << 1 ^ e >> 31) >>> 0, writeSignedVarint32(e, this.buf), this
    }
    sfixed64(e) {
      let t = new Uint8Array(8),
        n = new DataView(t.buffer),
        i = Long.from(e);
      return n.setInt32(0, i.lo, true), n.setInt32(4, i.hi, true), this.raw(t)
    }
    fixed64(e) {
      let t = new Uint8Array(8),
        n = new DataView(t.buffer),
        i = ULong.from(e);
      return n.setInt32(0, i.lo, true), n.setInt32(4, i.hi, true), this.raw(t)
    }
    int64(e) {
      let t = Long.from(e);
      return writeVarint64(t.lo, t.hi, this.buf), this
    }
    sint64(e) {
      let t = Long.from(e),
        n = t.hi >> 31,
        i = t.lo << 1 ^ n,
        r = (t.hi << 1 | t.lo >>> 31) ^ n;
      return writeVarint64(i, r, this.buf), this
    }
    uint64(e) {
      let t = ULong.from(e);
      return writeVarint64(t.lo, t.hi, this.buf), this
    }
  };
  var DEFAULT_JSON_WRITE_OPTIONS = {
      emitDefaultValues: false,
      enumAsInteger: false,
      useProtoFieldName: false,
      prettySpaces: 0
    },
    DEFAULT_JSON_READ_OPTIONS = {
      ignoreUnknownFields: false
    };

  function createJsonReadOptions(l) {
    return l ? Object.assign(Object.assign({}, DEFAULT_JSON_READ_OPTIONS), l) : DEFAULT_JSON_READ_OPTIONS
  }

  function createJsonWriteOptions(l) {
    return l ? Object.assign(Object.assign({}, DEFAULT_JSON_WRITE_OPTIONS), l) : DEFAULT_JSON_WRITE_OPTIONS
  }
  // ===========================================================================
  // SECTION 13: Field Naming & Symbol Utilities
  // ===========================================================================

  var MESSAGE_TYPE_SYMBOL = Symbol.for("protobuf-ts/message-type");

  function camelCaseFieldName(l) {
    let e = false,
      t = [];
    for (let n = 0; n < l.length; n++) {
      let i = l.charAt(n);
      i == "_" ? e = true : /\d/.test(i) ? (t.push(i), e = true) : e ? (t.push(i.toUpperCase()), e = false) : n == 0 ? t.push(i.toLowerCase()) : t.push(i)
    }
    return t.join("")
  }
  // ===========================================================================
  // SECTION 14: ScalarType / LongType / RepeatType Enums
  //
  // ScalarType: Numeric IDs for protobuf scalar types (DOUBLE=1..SINT64=18)
  // LongType:   How 64-bit values are represented (BIGINT=0, STRING=1, NUMBER=2)
  // RepeatType: How repeated fields are encoded (NO=0, PACKED=1, UNPACKED=2)
  // ===========================================================================
  var ScalarType;
  (function(l) {
    l[l.DOUBLE = 1] = "DOUBLE", l[l.FLOAT = 2] = "FLOAT", l[l.INT64 = 3] = "INT64", l[l.UINT64 = 4] = "UINT64", l[l.INT32 = 5] = "INT32", l[l.FIXED64 = 6] = "FIXED64", l[l.FIXED32 = 7] = "FIXED32", l[l.BOOL = 8] = "BOOL", l[l.STRING = 9] = "STRING", l[l.BYTES = 12] = "BYTES", l[l.UINT32 = 13] = "UINT32", l[l.SFIXED32 = 15] = "SFIXED32", l[l.SFIXED64 = 16] = "SFIXED64", l[l.SINT32 = 17] = "SINT32", l[l.SINT64 = 18] = "SINT64"
  })(p || (p = {}));
  var LongType;
  (function(l) {
    l[l.BIGINT = 0] = "BIGINT", l[l.STRING = 1] = "STRING", l[l.NUMBER = 2] = "NUMBER"
  })(E || (E = {}));
  var RepeatType;
  (function(l) {
    l[l.NO = 0] = "NO", l[l.PACKED = 1] = "PACKED", l[l.UNPACKED = 2] = "UNPACKED"
  })(ue || (ue = {}));

  /** Normalize field info: fill in defaults for localName, jsonName, repeat, opt */
  function normalizeFieldInfo(l) {
    var e, t, n, i;
    return l.localName = (e = l.localName) !== null && e !== void 0 ? e : camelCaseFieldName(l.name), l.jsonName = (t = l.jsonName) !== null && t !== void 0 ? t : camelCaseFieldName(l.name), l.repeat = (n = l.repeat) !== null && n !== void 0 ? n : RepeatType.NO, l.opt = (i = l.opt) !== null && i !== void 0 ? i : l.repeat || l.oneof ? false : l.kind == "message", l
  }

  function isOneofGroup(l) {
    if (typeof l != "object" || l === null || !l.hasOwnProperty("oneofKind")) return false;
    switch (typeof l.oneofKind) {
      case "string":
        return l[l.oneofKind] === void 0 ? false : Object.keys(l).length == 2;
      case "undefined":
        return Object.keys(l).length == 1;
      default:
        return false
    }
  }
  // ===========================================================================
  // SECTION 15: ReflectionTypeCheck
  //
  // Validates JavaScript objects against protobuf message type schemas.
  // Checks field presence, types, oneof constraints, and nested messages.
  // ===========================================================================
  var ReflectionTypeCheck = class {
    constructor(e) {
      var t;
      this.fields = (t = e.fields) !== null && t !== void 0 ? t : []
    }
    prepare() {
      if (this.data) return;
      let e = [],
        t = [],
        n = [];
      for (let i of this.fields)
        if (i.oneof) n.includes(i.oneof) || (n.push(i.oneof), e.push(i.oneof), t.push(i.oneof));
        else switch (t.push(i.localName), i.kind) {
          case "scalar":
          case "enum":
            (!i.opt || i.repeat) && e.push(i.localName);
            break;
          case "message":
            i.repeat && e.push(i.localName);
            break;
          case "map":
            e.push(i.localName);
            break
        }
      this.data = {
        req: e,
        known: t,
        oneofs: Object.values(n)
      }
    }
    is(e, t, n = false) {
      if (t < 0) return true;
      if (e == null || typeof e != "object") return false;
      this.prepare();
      let i = Object.keys(e),
        r = this.data;
      if (i.length < r.req.length || r.req.some(c => !i.includes(c)) || !n && i.some(c => !r.known.includes(c))) return false;
      if (t < 1) return true;
      for (let c of r.oneofs) {
        let a = e[c];
        if (!isOneofGroup(a)) return false;
        if (a.oneofKind === void 0) continue;
        let o = this.fields.find(s => s.localName === a.oneofKind);
        if (!o || !this.field(a[a.oneofKind], o, n, t)) return false
      }
      for (let c of this.fields)
        if (c.oneof === void 0 && !this.field(e[c.localName], c, n, t)) return false;
      return true
    }
    field(e, t, n, i) {
      let r = t.repeat;
      switch (t.kind) {
        case "scalar":
          return e === void 0 ? t.opt : r ? this.scalars(e, t.T, i, t.L) : this.scalar(e, t.T, t.L);
        case "enum":
          return e === void 0 ? t.opt : r ? this.scalars(e, ScalarType.INT32, i) : this.scalar(e, ScalarType.INT32);
        case "message":
          return e === void 0 ? true : r ? this.messages(e, t.T(), n, i) : this.message(e, t.T(), n, i);
        case "map":
          if (typeof e != "object" || e === null) return false;
          if (i < 2) return true;
          if (!this.mapKeys(e, t.validateInt32, i)) return false;
          switch (t.V.kind) {
            case "scalar":
              return this.scalars(Object.values(e), t.V.T, i, t.V.L);
            case "enum":
              return this.scalars(Object.values(e), ScalarType.INT32, i);
            case "message":
              return this.messages(Object.values(e), t.V.T(), n, i)
          }
          break
      }
      return true
    }
    message(e, t, n, i) {
      return n ? t.isAssignable(e, i) : t.is(e, i)
    }
    messages(e, t, n, i) {
      if (!Array.isArray(e)) return false;
      if (i < 2) return true;
      if (n) {
        for (let r = 0; r < e.length && r < i; r++)
          if (!t.isAssignable(e[r], i - 1)) return false
      } else
        for (let r = 0; r < e.length && r < i; r++)
          if (!t.is(e[r], i - 1)) return false;
      return true
    }
    scalar(e, t, n) {
      let i = typeof e;
      switch (t) {
        case ScalarType.UINT64:
        case ScalarType.FIXED64:
        case ScalarType.INT64:
        case ScalarType.SFIXED64:
        case ScalarType.SINT64:
          switch (n) {
            case LongType.BIGINT:
              return i == "bigint";
            case LongType.NUMBER:
              return i == "number" && !isNaN(e);
            default:
              return i == "string"
          }
        case ScalarType.BOOL:
          return i == "boolean";
        case ScalarType.STRING:
          return i == "string";
        case ScalarType.BYTES:
          return e instanceof Uint8Array;
        case ScalarType.DOUBLE:
        case ScalarType.FLOAT:
          return i == "number" && !isNaN(e);
        default:
          return i == "number" && Number.isInteger(e)
      }
    }
    scalars(e, t, n, i) {
      if (!Array.isArray(e)) return false;
      if (n < 2) return true;
      if (Array.isArray(e)) {
        for (let r = 0; r < e.length && r < n; r++)
          if (!this.scalar(e[r], t, i)) return false
      }
      return true
    }
    mapKeys(e, t, n) {
      let i = Object.keys(e);
      switch (t) {
        case ScalarType.INT32:
        case ScalarType.FIXED32:
        case ScalarType.SFIXED32:
        case ScalarType.SINT32:
        case ScalarType.UINT32:
          return this.scalars(i.slidefineExport(0, n).map(r => parseInt(r)), t, n);
        case ScalarType.BOOL:
          return this.scalars(i.slidefineExport(0, n).map(r => r == "true" ? true : r == "false" ? false : r), t, n);
        default:
          return this.scalars(i, t, n, LongType.STRING)
      }
    }
  };

  // ===========================================================================
  // SECTION 16: Long Value Formatting
  //
  // Converts Long/ULong to output format based on LongType (BigInt/string/number).
  // ===========================================================================
  function formatLongValue(l, e) {
    switch (e) {
      case LongType.BIGINT:
        return l.toBigInt();
      case LongType.NUMBER:
        return l.toNumber();
      default:
        return l.toString()
    }
  }
  // ===========================================================================
  // SECTION 17: JSON Reader / Writer
  //
  // Reads/writes protobuf messages in canonical JSON format. Handles:
  // - Field name mapping (proto name / jsonName / localName)
  // - Enum value parsing (numeric or string with optional prefix)
  // - Special float values (NaN, Infinity, -Infinity)
  // - Null handling for messages and oneofs
  // - Base64 encoding for bytes fields
  // ===========================================================================
  var JsonReader = class {
    constructor(e) {
      this.info = e
    }
    prepare() {
      var e;
      if (this.fMap === void 0) {
        this.fMap = {};
        let t = (e = this.info.fields) !== null && e !== void 0 ? e : [];
        for (let n of t) this.fMap[n.name] = n, this.fMap[n.jsonName] = n, this.fMap[n.localName] = n
      }
    }
    assert(e, t, n) {
      if (!e) {
        let i = getTypeName(n);
        throw (i == "number" || i == "boolean") && (i = n.toString()), new Error(`Cannot parse JSON ${i} for ${this.info.typeName}#${t}`)
      }
    }
    read(e, t, n) {
      this.prepare();
      let i = [];
      for (let [r, c] of Object.entries(e)) {
        let a = this.fMap[r];
        if (!a) {
          if (!n.ignoreUnknownFields) throw new Error(`Found unknown field while reading ${this.info.typeName} from JSON format. JSON key: ${r}`);
          continue
        }
        let o = a.localName,
          s;
        if (a.oneof) {
          if (c === null && (a.kind !== "enum" || a.T()[0] !== "google.protobuf.NullValue")) continue;
          if (i.includes(a.oneof)) throw new Error(`Multiple members of the oneof group "${a.oneof}" of ${this.info.typeName} are present in JSON.`);
          i.push(a.oneof), s = t[a.oneof] = {
            oneofKind: o
          }
        } else s = t;
        if (a.kind == "map") {
          if (c === null) continue;
          this.assert(isPlainObject(c), a.name, c);
          let u = s[o];
          for (let [g, b] of Object.entries(c)) {
            this.assert(b !== null, a.name + " map value", null);
            let m;
            switch (a.V.kind) {
              case "message":
                m = a.V.T().internalJsonRead(b, n);
                break;
              case "enum":
                if (m = this.enum(a.V.T(), b, a.name, n.ignoreUnknownFields), m === false) continue;
                break;
              case "scalar":
                m = this.scalar(b, a.V.T, a.V.L, a.name);
                break
            }
            this.assert(m !== void 0, a.name + " map value", b);
            let B = g;
            a.validateInt32 == ScalarType.BOOL && (B = B == "true" ? true : B == "false" ? false : B), B = this.scalar(B, a.validateInt32, LongType.STRING, a.name).toString(), u[B] = m
          }
        } else if (a.repeat) {
          if (c === null) continue;
          this.assert(Array.isArray(c), a.name, c);
          let u = s[o];
          for (let g of c) {
            this.assert(g !== null, a.name, null);
            let b;
            switch (a.kind) {
              case "message":
                b = a.T().internalJsonRead(g, n);
                break;
              case "enum":
                if (b = this.enum(a.T(), g, a.name, n.ignoreUnknownFields), b === false) continue;
                break;
              case "scalar":
                b = this.scalar(g, a.T, a.L, a.name);
                break
            }
            this.assert(b !== void 0, a.name, c), u.push(b)
          }
        } else switch (a.kind) {
          case "message":
            if (c === null && a.T().typeName != "google.protobuf.Value") {
              this.assert(a.oneof === void 0, a.name + " (oneof member)", null);
              continue
            }
            s[o] = a.T().internalJsonRead(c, n, s[o]);
            break;
          case "enum":
            let u = this.enum(a.T(), c, a.name, n.ignoreUnknownFields);
            if (u === false) continue;
            s[o] = u;
            break;
          case "scalar":
            s[o] = this.scalar(c, a.T, a.L, a.name);
            break
        }
      }
    }
    enum(e, t, n, i) {
      if (e[0] == "google.protobuf.NullValue" && assert(t === null || t === "NULL_VALUE", `Unable to parse field ${this.info.typeName}#${n}, enum ${e[0]} only accepts null.`), t === null) return 0;
      switch (typeof t) {
        case "number":
          return assert(Number.isInteger(t), `Unable to parse field ${this.info.typeName}#${n}, enum can only be integral number, got ${t}.`), t;
        case "string":
          let r = t;
          e[2] && t.substring(0, e[2].length) === e[2] && (r = t.substring(e[2].length));
          let c = e[1][r];
          return typeof c > "u" && i ? false : (assert(typeof c == "number", `Unable to parse field ${this.info.typeName}#${n}, enum ${e[0]} has no value for "${t}".`), c)
      }
      assert(false, `Unable to parse field ${this.info.typeName}#${n}, cannot parse enum value from ${typeof t}".`)
    }
    scalar(e, t, n, i) {
      let r;
      try {
        switch (t) {
          case ScalarType.DOUBLE:
          case ScalarType.FLOAT:
            if (e === null) return 0;
            if (e === "NaN") return Number.NaN;
            if (e === "Infinity") return Number.POSITIVE_INFINITY;
            if (e === "-Infinity") return Number.NEGATIVE_INFINITY;
            if (e === "") {
              r = "empty string";
              break
            }
            if (typeof e == "string" && e.trim().length !== e.length) {
              r = "extra whitespace";
              break
            }
            if (typeof e != "string" && typeof e != "number") break;
            let c = Number(e);
            if (Number.isNaN(c)) {
              r = "not a number";
              break
            }
            if (!Number.isFinite(c)) {
              r = "too large or small";
              break
            }
            return t == ScalarType.FLOAT && validateFloat32(c), c;
          case ScalarType.INT32:
          case ScalarType.FIXED32:
          case ScalarType.SFIXED32:
          case ScalarType.SINT32:
          case ScalarType.UINT32:
            if (e === null) return 0;
            let a;
            if (typeof e == "number" ? a = e : e === "" ? r = "empty string" : typeof e == "string" && (e.trim().length !== e.length ? r = "extra whitespace" : a = Number(e)), a === void 0) break;
            return t == ScalarType.UINT32 ? validateUint32(a) : validateInt32(a), a;
          case ScalarType.INT64:
          case ScalarType.SFIXED64:
          case ScalarType.SINT64:
            if (e === null) return formatLongValue(Long.ZERO, n);
            if (typeof e != "number" && typeof e != "string") break;
            return formatLongValue(Long.from(e), n);
          case ScalarType.FIXED64:
          case ScalarType.UINT64:
            if (e === null) return formatLongValue(ULong.ZERO, n);
            if (typeof e != "number" && typeof e != "string") break;
            return formatLongValue(ULong.from(e), n);
          case ScalarType.BOOL:
            if (e === null) return false;
            if (typeof e != "boolean") break;
            return e;
          case ScalarType.STRING:
            if (e === null) return "";
            if (typeof e != "string") {
              r = "extra whitespace";
              break
            }
            try {
              encodeURIComponent(e)
            } catch (o) {
              o = "invalid UTF8";
              break
            }
            return e;
          case ScalarType.BYTES:
            if (e === null || e === "") return new Uint8Array(0);
            if (typeof e != "string") break;
            return base64Decode(e)
        }
      } catch (c) {
        r = c.message
      }
      this.assert(false, i + (r ? " - " + r : ""), e)
    }
  };
  var JsonWriter = class {
    constructor(e) {
      var t;
      this.fields = (t = e.fields) !== null && t !== void 0 ? t : []
    }
    write(e, t) {
      let n = {},
        i = e;
      for (let r of this.fields) {
        if (!r.oneof) {
          let s = this.field(r, i[r.localName], t);
          s !== void 0 && (n[t.useProtoFieldName ? r.name : r.jsonName] = s);
          continue
        }
        let c = i[r.oneof];
        if (c.oneofKind !== r.localName) continue;
        let a = r.kind == "scalar" || r.kind == "enum" ? Object.assign(Object.assign({}, t), {
            emitDefaultValues: true
          }) : t,
          o = this.field(r, c[r.localName], a);
        assert(o !== void 0), n[t.useProtoFieldName ? r.name : r.jsonName] = o
      }
      return n
    }
    field(e, t, n) {
      let i;
      if (e.kind == "map") {
        assert(typeof t == "object" && t !== null);
        let r = {};
        switch (e.V.kind) {
          case "scalar":
            for (let [o, s] of Object.entries(t)) {
              let u = this.scalar(e.V.T, s, e.name, false, true);
              assert(u !== void 0), r[o.toString()] = u
            }
            break;
          case "message":
            let c = e.V.T();
            for (let [o, s] of Object.entries(t)) {
              let u = this.message(c, s, e.name, n);
              assert(u !== void 0), r[o.toString()] = u
            }
            break;
          case "enum":
            let a = e.V.T();
            for (let [o, s] of Object.entries(t)) {
              assert(s === void 0 || typeof s == "number");
              let u = this.enum(a, s, e.name, false, true, n.enumAsInteger);
              assert(u !== void 0), r[o.toString()] = u
            }
            break
        }(n.emitDefaultValues || Object.keys(r).length > 0) && (i = r)
      } else if (e.repeat) {
        assert(Array.isArray(t));
        let r = [];
        switch (e.kind) {
          case "scalar":
            for (let o = 0; o < t.length; o++) {
              let s = this.scalar(e.T, t[o], e.name, e.opt, true);
              assert(s !== void 0), r.push(s)
            }
            break;
          case "enum":
            let c = e.T();
            for (let o = 0; o < t.length; o++) {
              assert(t[o] === void 0 || typeof t[o] == "number");
              let s = this.enum(c, t[o], e.name, e.opt, true, n.enumAsInteger);
              assert(s !== void 0), r.push(s)
            }
            break;
          case "message":
            let a = e.T();
            for (let o = 0; o < t.length; o++) {
              let s = this.message(a, t[o], e.name, n);
              assert(s !== void 0), r.push(s)
            }
            break
        }(n.emitDefaultValues || r.length > 0 || n.emitDefaultValues) && (i = r)
      } else switch (e.kind) {
        case "scalar":
          i = this.scalar(e.T, t, e.name, e.opt, n.emitDefaultValues);
          break;
        case "enum":
          i = this.enum(e.T(), t, e.name, e.opt, n.emitDefaultValues, n.enumAsInteger);
          break;
        case "message":
          i = this.message(e.T(), t, e.name, n);
          break
      }
      return i
    }
    enum(e, t, n, i, r, c) {
      if (e[0] == "google.protobuf.NullValue") return !r && !i ? void 0 : null;
      if (t === void 0) {
        assert(i);
        return
      }
      if (!(t === 0 && !r && !i)) return assert(typeof t == "number"), assert(Number.isInteger(t)), c || !e[1].hasOwnProperty(t) ? t : e[2] ? e[2] + e[1][t] : e[1][t]
    }
    message(e, t, n, i) {
      return t === void 0 ? i.emitDefaultValues ? null : void 0 : e.internalJsonWrite(t, i)
    }
    scalar(e, t, n, i, r) {
      if (t === void 0) {
        assert(i);
        return
      }
      let c = r || i;
      switch (e) {
        case ScalarType.INT32:
        case ScalarType.SFIXED32:
        case ScalarType.SINT32:
          return t === 0 ? c ? 0 : void 0 : (validateInt32(t), t);
        case ScalarType.FIXED32:
        case ScalarType.UINT32:
          return t === 0 ? c ? 0 : void 0 : (validateUint32(t), t);
        case ScalarType.FLOAT:
          validateFloat32(t);
        case ScalarType.DOUBLE:
          return t === 0 ? c ? 0 : void 0 : (assert(typeof t == "number"), Number.isNaN(t) ? "NaN" : t === Number.POSITIVE_INFINITY ? "Infinity" : t === Number.NEGATIVE_INFINITY ? "-Infinity" : t);
        case ScalarType.STRING:
          return t === "" ? c ? "" : void 0 : (assert(typeof t == "string"), t);
        case ScalarType.BOOL:
          return t === false ? c ? false : void 0 : (assert(typeof t == "boolean"), t);
        case ScalarType.UINT64:
        case ScalarType.FIXED64:
          assert(typeof t == "number" || typeof t == "string" || typeof t == "bigint");
          let a = ULong.from(t);
          return a.isZero() && !c ? void 0 : a.toString();
        case ScalarType.INT64:
        case ScalarType.SFIXED64:
        case ScalarType.SINT64:
          assert(typeof t == "number" || typeof t == "string" || typeof t == "bigint");
          let o = Long.from(t);
          return o.isZero() && !c ? void 0 : o.toString();
        case ScalarType.BYTES:
          return assert(t instanceof Uint8Array), t.byteLength ? base64Encode(t) : c ? "" : void 0
      }
    }
  };

  function getDefaultScalarValue(l, e = LongType.STRING) {
    switch (l) {
      case ScalarType.BOOL:
        return false;
      case ScalarType.UINT64:
      case ScalarType.FIXED64:
        return formatLongValue(ULong.ZERO, e);
      case ScalarType.INT64:
      case ScalarType.SFIXED64:
      case ScalarType.SINT64:
        return formatLongValue(Long.ZERO, e);
      case ScalarType.DOUBLE:
      case ScalarType.FLOAT:
        return 0;
      case ScalarType.BYTES:
        return new Uint8Array(0);
      case ScalarType.STRING:
        return "";
      default:
        return 0
    }
  }
  // ===========================================================================
  // SECTION 19: BinaryMessageReader / BinaryMessageWriter
  //
  // Per-field binary serialization using field metadata (field number, type,
  // repeat style). Handles packed repeated fields, map entries, oneof groups,
  // and unknown field preservation.
  // ===========================================================================
  var BinaryMessageReader = class {
    constructor(e) {
      this.info = e
    }
    prepare() {
      var e;
      if (!this.fieldNoToField) {
        let t = (e = this.info.fields) !== null && e !== void 0 ? e : [];
        this.fieldNoToField = new Map(t.map(n => [n.no, n]))
      }
    }
    read(e, t, n, i) {
      this.prepare();
      let r = i === void 0 ? e.len : e.pos + i;
      for (; e.pos < r;) {
        let [c, a] = e.tag(), o = this.fieldNoToField.get(c);
        if (!o) {
          let b = n.readUnknownField;
          if (b == "throw") throw new Error(`Unknown field ${c} (wire type ${a}) for ${this.info.typeName}`);
          let m = e.skip(a);
          b !== false && (b === true ? UnknownFieldHandler.onRead : b)(this.info.typeName, t, c, a, m);
          continue
        }
        let s = t,
          u = o.repeat,
          g = o.localName;
        switch (o.oneof && (s = s[o.oneof], s.oneofKind !== g && (s = t[o.oneof] = {
          oneofKind: g
        })), o.kind) {
          case "scalar":
          case "enum":
            let b = o.kind == "enum" ? ScalarType.INT32 : o.T,
              m = o.kind == "scalar" ? o.L : void 0;
            if (u) {
              let W = s[g];
              if (a == WireType.LengthDelimited && b != ScalarType.STRING && b != ScalarType.BYTES) {
                let k = e.uint32() + e.pos;
                for (; e.pos < k;) W.push(this.scalar(e, b, m))
              } else W.push(this.scalar(e, b, m))
            } else s[g] = this.scalar(e, b, m);
            break;
          case "message":
            if (u) {
              let W = s[g],
                k = o.T().internalBinaryRead(e, e.uint32(), n);
              W.push(k)
            } else s[g] = o.T().internalBinaryRead(e, e.uint32(), n, s[g]);
            break;
          case "map":
            let [B, D] = this.mapEntry(o, e, n);
            s[g][B] = D;
            break
        }
      }
    }
    mapEntry(e, t, n) {
      let i = t.uint32(),
        r = t.pos + i,
        c, a;
      for (; t.pos < r;) {
        let [o, s] = t.tag();
        switch (o) {
          case 1:
            e.validateInt32 == ScalarType.BOOL ? c = t.bool().toString() : c = this.scalar(t, e.validateInt32, LongType.STRING);
            break;
          case 2:
            switch (e.V.kind) {
              case "scalar":
                a = this.scalar(t, e.V.T, e.V.L);
                break;
              case "enum":
                a = t.int32();
                break;
              case "message":
                a = e.V.T().internalBinaryRead(t, t.uint32(), n);
                break
            }
            break;
          default:
            throw new Error(`Unknown field ${o} (wire type ${s}) in map entry for ${this.info.typeName}#${e.name}`)
        }
      }
      if (c === void 0) {
        let o = getDefaultScalarValue(e.validateInt32);
        c = e.validateInt32 == ScalarType.BOOL ? o.toString() : o
      }
      if (a === void 0) switch (e.V.kind) {
        case "scalar":
          a = getDefaultScalarValue(e.V.T, e.V.L);
          break;
        case "enum":
          a = 0;
          break;
        case "message":
          a = e.V.T().create();
          break
      }
      return [c, a]
    }
    scalar(e, t, n) {
      switch (t) {
        case ScalarType.INT32:
          return e.int32();
        case ScalarType.STRING:
          return e.string();
        case ScalarType.BOOL:
          return e.bool();
        case ScalarType.DOUBLE:
          return e.double();
        case ScalarType.FLOAT:
          return e.float();
        case ScalarType.INT64:
          return formatLongValue(e.int64(), n);
        case ScalarType.UINT64:
          return formatLongValue(e.uint64(), n);
        case ScalarType.FIXED64:
          return formatLongValue(e.fixed64(), n);
        case ScalarType.FIXED32:
          return e.fixed32();
        case ScalarType.BYTES:
          return e.bytes();
        case ScalarType.UINT32:
          return e.uint32();
        case ScalarType.SFIXED32:
          return e.sfixed32();
        case ScalarType.SFIXED64:
          return formatLongValue(e.sfixed64(), n);
        case ScalarType.SINT32:
          return e.sint32();
        case ScalarType.SINT64:
          return formatLongValue(e.sint64(), n)
      }
    }
  };
  var BinaryMessageWriter = class {
    constructor(e) {
      this.info = e
    }
    prepare() {
      if (!this.fields) {
        let e = this.info.fields ? this.info.fields.concat() : [];
        this.fields = e.sort((t, n) => t.no - n.no)
      }
    }
    write(e, t, n) {
      this.prepare();
      for (let r of this.fields) {
        let c, a, o = r.repeat,
          s = r.localName;
        if (r.oneof) {
          let u = e[r.oneof];
          if (u.oneofKind !== s) continue;
          c = u[s], a = true
        } else c = e[s], a = false;
        switch (r.kind) {
          case "scalar":
          case "enum":
            let u = r.kind == "enum" ? ScalarType.INT32 : r.T;
            if (o)
              if (assert(Array.isArray(c)), o == RepeatType.PACKED) this.packed(t, u, r.no, c);
              else
                for (let g of c) this.scalar(t, u, r.no, g, true);
            else c === void 0 ? assert(r.opt) : this.scalar(t, u, r.no, c, a || r.opt);
            break;
          case "message":
            if (o) {
              assert(Array.isArray(c));
              for (let g of c) this.message(t, n, r.T(), r.no, g)
            } else this.message(t, n, r.T(), r.no, c);
            break;
          case "map":
            assert(typeof c == "object" && c !== null);
            for (let [g, b] of Object.entries(c)) this.mapEntry(t, n, r, g, b);
            break
        }
      }
      let i = n.writeUnknownFields;
      i !== false && (i === true ? UnknownFieldHandler.onWrite : i)(this.info.typeName, e, t)
    }
    mapEntry(e, t, n, i, r) {
      e.tag(n.no, WireType.LengthDelimited), e.fork();
      let c = i;
      switch (n.validateInt32) {
        case ScalarType.INT32:
        case ScalarType.FIXED32:
        case ScalarType.UINT32:
        case ScalarType.SFIXED32:
        case ScalarType.SINT32:
          c = Number.parseInt(i);
          break;
        case ScalarType.BOOL:
          assert(i == "true" || i == "false"), c = i == "true";
          break
      }
      switch (this.scalar(e, n.validateInt32, 1, c, true), n.V.kind) {
        case "scalar":
          this.scalar(e, n.V.T, 2, r, true);
          break;
        case "enum":
          this.scalar(e, ScalarType.INT32, 2, r, true);
          break;
        case "message":
          this.message(e, t, n.V.T(), 2, r);
          break
      }
      e.join()
    }
    message(e, t, n, i, r) {
      r !== void 0 && (n.internalBinaryWrite(r, e.tag(i, WireType.LengthDelimited).fork(), t), e.join())
    }
    scalar(e, t, n, i, r) {
      let [c, a, o] = this.scalarInfo(t, i);
      (!o || r) && (e.tag(n, c), e[a](i))
    }
    packed(e, t, n, i) {
      if (!i.length) return;
      assert(t !== ScalarType.BYTES && t !== ScalarType.STRING), e.tag(n, WireType.LengthDelimited), e.fork();
      let [, r] = this.scalarInfo(t);
      for (let c = 0; c < i.length; c++) e[r](i[c]);
      e.join()
    }
    scalarInfo(e, t) {
      let n = WireType.Varint,
        i, r = t === void 0,
        c = t === 0;
      switch (e) {
        case ScalarType.INT32:
          i = "int32";
          break;
        case ScalarType.STRING:
          c = r || !t.length, n = WireType.LengthDelimited, i = "string";
          break;
        case ScalarType.BOOL:
          c = t === false, i = "bool";
          break;
        case ScalarType.UINT32:
          i = "uint32";
          break;
        case ScalarType.DOUBLE:
          n = WireType.Bit64, i = "double";
          break;
        case ScalarType.FLOAT:
          n = WireType.Bit32, i = "float";
          break;
        case ScalarType.INT64:
          c = r || Long.from(t).isZero(), i = "int64";
          break;
        case ScalarType.UINT64:
          c = r || ULong.from(t).isZero(), i = "uint64";
          break;
        case ScalarType.FIXED64:
          c = r || ULong.from(t).isZero(), n = WireType.Bit64, i = "fixed64";
          break;
        case ScalarType.BYTES:
          c = r || !t.byteLength, n = WireType.LengthDelimited, i = "bytes";
          break;
        case ScalarType.FIXED32:
          n = WireType.Bit32, i = "fixed32";
          break;
        case ScalarType.SFIXED32:
          n = WireType.Bit32, i = "sfixed32";
          break;
        case ScalarType.SFIXED64:
          c = r || Long.from(t).isZero(), n = WireType.Bit64, i = "sfixed64";
          break;
        case ScalarType.SINT32:
          i = "sint32";
          break;
        case ScalarType.SINT64:
          c = r || Long.from(t).isZero(), i = "sint64";
          break
      }
      return [n, i, r || c]
    }
  };

  // ===========================================================================
  // SECTION 20: Message Creation, Merge, and Equality
  //
  // createMessage: Instantiates a message with default field values
  // mergePartial:  Recursively copies field values from source to target
  // messageEquals: Deep structural equality comparison
  // ===========================================================================

  /** Create a new message instance with default values for all fields */
  function createMessage(l) {
    let e = l.messagePrototype ? Object.create(l.messagePrototype) : Object.defineProperty({}, MESSAGE_TYPE_SYMBOL, {
      value: l
    });
    for (let t of l.fields) {
      let n = t.localName;
      if (!t.opt)
        if (t.oneof) e[t.oneof] = {
          oneofKind: void 0
        };
        else if (t.repeat) e[n] = [];
      else switch (t.kind) {
        case "scalar":
          e[n] = getDefaultScalarValue(t.T, t.L);
          break;
        case "enum":
          e[n] = 0;
          break;
        case "map":
          e[n] = {};
          break
      }
    }
    return e
  }

  function mergePartial(l, e, t) {
    let n, i = t,
      r;
    for (let c of l.fields) {
      let a = c.localName;
      if (c.oneof) {
        let o = i[c.oneof];
        if (o ?.oneofKind == null) continue;
        if (n = o[a], r = e[c.oneof], r.oneofKind = o.oneofKind, n == null) {
          delete r[a];
          continue
        }
      } else if (n = i[a], r = e, n == null) continue;
      switch (c.repeat && (r[a].length = n.length), c.kind) {
        case "scalar":
        case "enum":
          if (c.repeat)
            for (let s = 0; s < n.length; s++) r[a][s] = n[s];
          else r[a] = n;
          break;
        case "message":
          let o = c.T();
          if (c.repeat)
            for (let s = 0; s < n.length; s++) r[a][s] = o.create(n[s]);
          else r[a] === void 0 ? r[a] = o.create(n) : o.mergePartial(r[a], n);
          break;
        case "map":
          switch (c.V.kind) {
            case "scalar":
            case "enum":
              Object.assign(r[a], n);
              break;
            case "message":
              let s = c.V.T();
              for (let u of Object.keys(n)) r[a][u] = s.create(n[u]);
              break
          }
          break
      }
    }
  }

  function messageEquals(l, e, t) {
    if (e === t) return true;
    if (!e || !t) return false;
    for (let n of l.fields) {
      let i = n.localName,
        r = n.oneof ? e[n.oneof][i] : e[i],
        c = n.oneof ? t[n.oneof][i] : t[i];
      switch (n.kind) {
        case "enum":
        case "scalar":
          let a = n.kind == "enum" ? ScalarType.INT32 : n.T;
          if (!(n.repeat ? scalarArrayEquals(a, r, c) : scalarEquals(a, r, c))) return false;
          break;
        case "map":
          if (!(n.V.kind == "message" ? messageArrayEquals(n.V.T(), OBJECT_VALUES(r), OBJECT_VALUES(c)) : scalarArrayEquals(n.V.kind == "enum" ? ScalarType.INT32 : n.V.T, OBJECT_VALUES(r), OBJECT_VALUES(c)))) return false;
          break;
        case "message":
          let o = n.T();
          if (!(n.repeat ? messageArrayEquals(o, r, c) : o.equals(r, c))) return false;
          break
      }
    }
    return true
  }
  var OBJECT_VALUES = Object.values;

  function scalarEquals(l, e, t) {
    if (e === t) return true;
    if (l !== ScalarType.BYTES) return false;
    let n = e,
      i = t;
    if (n.length !== i.length) return false;
    for (let r = 0; r < n.length; r++)
      if (n[r] != i[r]) return false;
    return true
  }

  function scalarArrayEquals(l, e, t) {
    if (e.length !== t.length) return false;
    for (let n = 0; n < e.length; n++)
      if (!scalarEquals(l, e[n], t[n])) return false;
    return true
  }

  function messageArrayEquals(l, e, t) {
    if (e.length !== t.length) return false;
    for (let n = 0; n < e.length; n++)
      if (!l.equals(e[n], t[n])) return false;
    return true
  }
  var BASE_OBJECT_DESCRIPTORS = Object.getOwnPropertyDescriptors(Object.getPrototypeOf({})),
    MessageType = class {
      constructor(e, t, n) {
        this.defaultCheckDepth = 16, this.typeName = e, this.fields = t.map(normalizeFieldInfo), this.options = n ?? {}, this.messagePrototype = Object.create(null, Object.assign(Object.assign({}, BASE_OBJECT_DESCRIPTORS), {
          [MESSAGE_TYPE_SYMBOL]: {
            value: this
          }
        })), this.refTypeCheck = new ReflectionTypeCheck(this), this.refJsonReader = new JsonReader(this), this.refJsonWriter = new JsonWriter(this), this.refBinReader = new BinaryMessageReader(this), this.refBinWriter = new BinaryMessageWriter(this)
      }
      create(e) {
        let t = createMessage(this);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      clone(e) {
        let t = this.create();
        return mergePartial(this, t, e), t
      }
      equals(e, t) {
        return messageEquals(this, e, t)
      }
      is(e, t = this.defaultCheckDepth) {
        return this.refTypeCheck.is(e, t, false)
      }
      isAssignable(e, t = this.defaultCheckDepth) {
        return this.refTypeCheck.is(e, t, true)
      }
      mergePartial(e, t) {
        mergePartial(this, e, t)
      }
      fromBinary(e, t) {
        let n = createReadOptions(t);
        return this.internalBinaryRead(n.readerFactory(e), e.byteLength, n)
      }
      fromJson(e, t) {
        return this.internalJsonRead(e, createJsonReadOptions(t))
      }
      fromJsonString(e, t) {
        let n = JSON.parse(e);
        return this.fromJson(n, t)
      }
      toJson(e, t) {
        return this.internalJsonWrite(e, createJsonWriteOptions(t))
      }
      toJsonString(e, t) {
        var n;
        let i = this.toJson(e, t);
        return JSON.stringify(i, null, (n = t ?.prettySpaces) !== null && n !== void 0 ? n : 0)
      }
      toBinary(e, t) {
        let n = createWriteOptions(t);
        return this.internalBinaryWrite(e, n.writerFactory(), n).finish()
      }
      internalJsonRead(e, t, n) {
        if (e !== null && typeof e == "object" && !Array.isArray(e)) {
          let i = n ?? this.create();
          return this.refJsonReader.read(e, i, t), i
        }
        throw new Error(`Unable to parse message ${this.typeName} from JSON ${getTypeName(e)}.`)
      }
      internalJsonWrite(e, t) {
        return this.refJsonWriter.write(e, t)
      }
      internalBinaryWrite(e, t, n) {
        return this.refBinWriter.write(e, t, n), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create();
        return this.refBinReader.read(e, r, n, t), r
      }
    };
  // ===========================================================================
  // SECTION 22: YouTube Protobuf Message Type Definitions
  //
  // Defines protobuf message types for YouTube's internal API responses.
  // Each type extends MessageType with create(), internalBinaryRead(), and
  // internalBinaryWrite() methods for its specific fields.
  //
  // Types cover: Label, Run, ResponseContext, ServiceTrackingParam, Param,
  // Browse, BrowseContent, SingleColumnResultsRenderer, TabRenderer,
  // SectionListRenderer, ItemSectionRenderer, RichItemContent,
  // ElementRenderer, VideoRendererContent, VideoInfo, VideoContext,
  // VideoContent, TimedLyricsRender, TimedLyricsContent, RenderInfo,
  // LayoutRender, ShelfRenderer, RichSectionContent, ReelShelfRenderer,
  // MusicDescriptionShelfRenderer, Next, NextContent, NextResult,
  // Search, OnResponseReceivedCommand, Shorts, Entry, Command,
  // ReelWatchEndpoint, Overlay, ReelPlayerOverlayRenderer,
  // Guide, GuideItem, GuideSectionRenderer, GuideEntryRenderer,
  // Player, AdPlacement, PlayabilityStatus, PlaybackTracking, Tracking,
  // Captions, CaptionTrack, AudioTrack, TranslationLanguage, AdSlot,
  // Setting, SettingItem, Icon, SubSetting, SettingBooleanRenderer,
  // ServiceEndpoint, SetClientSettingEndpoint, SettingData, ClientSettingEnum,
  // Watch, WatchContent
  // ===========================================================================

  // ---- youtube.component.Label ----
  var LabelMessageType = class extends MessageType {
      constructor() {
        super("youtube.component.Label", [{
          no: 1,
          name: "runs",
          kind: "message",
          repeat: 1,
          T: () => textRun
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.runs = [], e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 1:
              r.runs.push(textRun.internalBinaryRead(e, e.uint32(), n));
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        for (let r = 0; r < e.runs.length; r++) textRun.internalBinaryWrite(e.runs[r], t.tag(1, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    textLabel = new LabelMessageType(),
    RunMessageType = class extends MessageType {
      constructor() {
        super("youtube.component.Run", [{
          no: 1,
          name: "text",
          kind: "scalar",
          T: 9
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.text = "", e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 1:
              r.text = e.string();
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.text !== "" && t.tag(1, WireType.LengthDelimited).string(e.text);
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    textRun = new RunMessageType;
  var ResponseContextType = class extends MessageType {
      constructor() {
        super("youtube.component.ResponseContext", [{
          no: 6,
          name: "serviceTrackingParams",
          kind: "message",
          repeat: 1,
          T: () => serviceTrackingParamType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.serviceTrackingParams = [], e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 6:
              r.serviceTrackingParams.push(serviceTrackingParamType.internalBinaryRead(e, e.uint32(), n));
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        for (let r = 0; r < e.serviceTrackingParams.length; r++) serviceTrackingParamType.internalBinaryWrite(e.serviceTrackingParams[r], t.tag(6, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    responseContextType = new ResponseContextType,
    ServiceTrackingParamType = class extends MessageType {
      constructor() {
        super("youtube.component.ServiceTrackingParam", [{
          no: 1,
          name: "service",
          kind: "scalar",
          T: 5
        }, {
          no: 2,
          name: "params",
          kind: "message",
          repeat: 1,
          T: () => paramType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.service = 0, t.params = [], e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 1:
              r.service = e.int32();
              break;
            case 2:
              r.params.push(paramType.internalBinaryRead(e, e.uint32(), n));
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.service !== 0 && t.tag(1, WireType.Varint).int32(e.service);
        for (let r = 0; r < e.params.length; r++) paramType.internalBinaryWrite(e.params[r], t.tag(2, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    serviceTrackingParamType = new ServiceTrackingParamType,
    ParamType = class extends MessageType {
      constructor() {
        super("youtube.component.Param", [{
          no: 1,
          name: "key",
          kind: "scalar",
          T: 9
        }, {
          no: 2,
          name: "value",
          kind: "scalar",
          T: 9
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.key = "", t.value = "", e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 1:
              r.key = e.string();
              break;
            case 2:
              r.value = e.string();
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.key !== "" && t.tag(1, WireType.LengthDelimited).string(e.key), e.value !== "" && t.tag(2, WireType.LengthDelimited).string(e.value);
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    paramType = new ParamType;
  var BrowseMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.browse.Browse", [{
          no: 1,
          name: "responseContext",
          kind: "message",
          T: () => playerType
        }, {
          no: 9,
          name: "content",
          kind: "message",
          T: () => browseContentType
        }, {
          no: 10,
          name: "onResponseReceivedAction",
          kind: "message",
          T: () => browseContentType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 1:
              r.responseContext = responseContextType.internalBinaryRead(e, e.uint32(), n, r.responseContext);
              break;
            case 9:
              r.content = browseContentType.internalBinaryRead(e, e.uint32(), n, r.content);
              break;
            case 10:
              r.onResponseReceivedAction = browseContentType.internalBinaryRead(e, e.uint32(), n, r.onResponseReceivedAction);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.responseContext && responseContextType.internalBinaryWrite(e.responseContext, t.tag(1, WireType.LengthDelimited).fork(), n).join(), e.content && browseContentType.internalBinaryWrite(e.content, t.tag(9, WireType.LengthDelimited).fork(), n).join(), e.onResponseReceivedAction && browseContentType.internalBinaryWrite(e.onResponseReceivedAction, t.tag(10, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    browseType = new gt,
    BrowseContentMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.browse.Content", [{
          no: 58173949,
          name: "singleColumnResultsRenderer",
          kind: "message",
          T: () => singleColumnResultsRendererType
        }, {
          no: 153515154,
          name: "elementRenderer",
          kind: "message",
          T: () => elementRendererType
        }, {
          no: 49399797,
          name: "sectionListRenderer",
          kind: "message",
          T: () => sectionListRendererType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 58173949:
              r.singleColumnResultsRenderer = singleColumnResultsRendererType.internalBinaryRead(e, e.uint32(), n, r.singleColumnResultsRenderer);
              break;
            case 153515154:
              r.elementRenderer = elementRendererType.internalBinaryRead(e, e.uint32(), n, r.elementRenderer);
              break;
            case 49399797:
              r.sectionListRenderer = sectionListRendererType.internalBinaryRead(e, e.uint32(), n, r.sectionListRenderer);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.singleColumnResultsRenderer && tt.internalBinaryWrite(e.singleColumnResultsRenderer, t.tag(58173949, WireType.LengthDelimited).fork(), n).join(), e.elementRenderer && elementRendererType.internalBinaryWrite(e.elementRenderer, t.tag(153515154, WireType.LengthDelimited).fork(), n).join(), e.sectionListRenderer && sectionListRendererType.internalBinaryWrite(e.sectionListRenderer, t.tag(49399797, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    browseContentType = new bt,
    SingleColumnResultsRendererMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.browse.SingleColumnResultsRenderer", [{
          no: 1,
          name: "tabs",
          kind: "message",
          repeat: 1,
          T: () => browseTabSupportedRendererType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.tabs = [], e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 1:
              r.tabs.push(browseTabSupportedRendererType.internalBinaryRead(e, e.uint32(), n));
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        for (let r = 0; r < e.tabs.length; r++) nt.internalBinaryWrite(e.tabs[r], t.tag(1, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    singleColumnResultsRendererType = new kt,
    BrowseTabSupportedRendererMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.browse.BrowseTabSupportedRenderer", [{
          no: 58174010,
          name: "tabRenderer",
          kind: "message",
          T: () => tabRendererType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 58174010:
              r.tabRenderer = tabRendererType.internalBinaryRead(e, e.uint32(), n, r.tabRenderer);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.tabRenderer && rt.internalBinaryWrite(e.tabRenderer, t.tag(58174010, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    browseTabSupportedRendererType = new Rt,
    TabRendererMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.browse.TabRenderer", [{
          no: 4,
          name: "content",
          kind: "message",
          T: () => browseContentType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 4:
              r.content = browseContentType.internalBinaryRead(e, e.uint32(), n, r.content);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.content && browseContentType.internalBinaryWrite(e.content, t.tag(4, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    tabRendererType = new wt,
    SectionListRendererMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.browse.SectionListRenderer", [{
          no: 1,
          name: "sectionListSupportedRenderers",
          kind: "message",
          repeat: 1,
          T: () => sectionListSupportedRendererType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.sectionListSupportedRenderers = [], e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 1:
              r.sectionListSupportedRenderers.push(sectionListSupportedRendererType.internalBinaryRead(e, e.uint32(), n));
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        for (let r = 0; r < e.sectionListSupportedRenderers.length; r++) sectionListSupportedRendererType.internalBinaryWrite(e.sectionListSupportedRenderers[r], t.tag(1, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    sectionListRendererType = new Bt,
    SectionListSupportedRendererMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.browse.SectionListSupportedRenderer", [{
          no: 50195462,
          name: "itemSectionRenderer",
          kind: "message",
          T: () => itemSectionRendererType
        }, {
          no: 51845067,
          name: "shelfRenderer",
          kind: "message",
          T: () => shelfRendererType
        }, {
          no: 221496734,
          name: "musicDescriptionShelfRenderer",
          kind: "message",
          T: () => musicDescriptionShelfRendererType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 50195462:
              r.itemSectionRenderer = itemSectionRendererType.internalBinaryRead(e, e.uint32(), n, r.itemSectionRenderer);
              break;
            case 51845067:
              r.shelfRenderer = shelfRendererType.internalBinaryRead(e, e.uint32(), n, r.shelfRenderer);
              break;
            case 221496734:
              r.musicDescriptionShelfRenderer = musicDescriptionShelfRendererType.internalBinaryRead(e, e.uint32(), n, r.musicDescriptionShelfRenderer);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.itemSectionRenderer && itemSectionRendererType.internalBinaryWrite(e.itemSectionRenderer, t.tag(50195462, WireType.LengthDelimited).fork(), n).join(), e.shelfRenderer && shelfRendererType.internalBinaryWrite(e.shelfRenderer, t.tag(51845067, WireType.LengthDelimited).fork(), n).join(), e.musicDescriptionShelfRenderer && musicDescriptionShelfRendererType.internalBinaryWrite(e.musicDescriptionShelfRenderer, t.tag(221496734, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    sectionListSupportedRendererType = new It,
    ItemSectionRendererMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.browse.ItemSectionRenderer", [{
          no: 1,
          name: "richItemContents",
          kind: "message",
          repeat: 1,
          T: () => richItemContentType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.richItemContents = [], e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 1:
              r.richItemContents.push(richItemContentType.internalBinaryRead(e, e.uint32(), n));
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        for (let r = 0; r < e.richItemContents.length; r++) richItemContentType.internalBinaryWrite(e.richItemContents[r], t.tag(1, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    itemSectionRendererType = new Tt,
    RichItemContentMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.browse.RichItemContent", [{
          no: 153515154,
          name: "videoWithContextRenderer",
          kind: "message",
          T: () => elementRendererType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 153515154:
              r.videoWithContextRenderer = elementRendererType.internalBinaryRead(e, e.uint32(), n, r.videoWithContextRenderer);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.videoWithContextRenderer && elementRendererType.internalBinaryWrite(e.videoWithContextRenderer, t.tag(153515154, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    richItemContentType = new Nt,
    ElementRendererMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.browse.ElementRenderer", [{
          no: 172660663,
          name: "videoRendererContent",
          kind: "message",
          T: () => videoRendererContentType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 172660663:
              r.videoRendererContent = videoRendererContentType.internalBinaryRead(e, e.uint32(), n, r.videoRendererContent);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.videoRendererContent && videoRendererContentType.internalBinaryWrite(e.videoRendererContent, t.tag(172660663, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    elementRendererType = new St,
    VideoRendererContentMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.browse.VideoRendererContent", [{
          no: 1,
          name: "videoInfo",
          kind: "message",
          T: () => videoInfoType
        }, {
          no: 2,
          name: "renderInfo",
          kind: "message",
          T: () => renderInfoType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 1:
              r.videoInfo = videoInfoType.internalBinaryRead(e, e.uint32(), n, r.videoInfo);
              break;
            case 2:
              r.renderInfo = renderInfoType.internalBinaryRead(e, e.uint32(), n, r.renderInfo);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.videoInfo && videoInfoType.internalBinaryWrite(e.videoInfo, t.tag(1, WireType.LengthDelimited).fork(), n).join(), e.renderInfo && renderInfoType.internalBinaryWrite(e.renderInfo, t.tag(2, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    videoRendererContentType = new Wt,
    VideoInfoMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.browse.VideoInfo", [{
          no: 168777401,
          name: "videoContext",
          kind: "message",
          T: () => videoContextType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 168777401:
              r.videoContext = videoContextType.internalBinaryRead(e, e.uint32(), n, r.videoContext);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.videoContext && videoContextType.internalBinaryWrite(e.videoContext, t.tag(168777401, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    videoInfoType = new xt,
    VideoContextMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.browse.VideoContext", [{
          no: 5,
          name: "videoContent",
          kind: "message",
          T: () => videoContentType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 5:
              r.videoContent = videoContentType.internalBinaryRead(e, e.uint32(), n, r.videoContent);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.videoContent && videoContentType.internalBinaryWrite(e.videoContent, t.tag(5, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    videoContextType = new Ot,
    VideoContentMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.browse.VideoContent", [{
          no: 465160965,
          name: "timedLyricsRender",
          kind: "message",
          T: () => timedLyricsRenderType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 465160965:
              r.timedLyricsRender = timedLyricsRenderType.internalBinaryRead(e, e.uint32(), n, r.timedLyricsRender);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.timedLyricsRender && timedLyricsRenderType.internalBinaryWrite(e.timedLyricsRender, t.tag(465160965, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    videoContentType = new Pt,
    TimedLyricsRenderMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.browse.TimedLyricsRender", [{
          no: 4,
          name: "timedLyricsContent",
          kind: "message",
          T: () => timedLyricsContentType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 4:
              r.timedLyricsContent = timedLyricsContentType.internalBinaryRead(e, e.uint32(), n, r.timedLyricsContent);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.timedLyricsContent && timedLyricsContentType.internalBinaryWrite(e.timedLyricsContent, t.tag(4, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    timedLyricsRenderType = new Ct,
    TimedLyricsContentMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.browse.TimedLyricsContent", [{
          no: 1,
          name: "runs",
          kind: "message",
          repeat: 1,
          T: () => textRun
        }, {
          no: 2,
          name: "footerLabel",
          kind: "scalar",
          T: 9
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.runs = [], t.footerLabel = "", e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 1:
              r.runs.push(textRun.internalBinaryRead(e, e.uint32(), n));
              break;
            case 2:
              r.footerLabel = e.string();
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        for (let r = 0; r < e.runs.length; r++) textRun.internalBinaryWrite(e.runs[r], t.tag(1, WireType.LengthDelimited).fork(), n).join();
        e.footerLabel !== "" && t.tag(2, WireType.LengthDelimited).string(e.footerLabel);
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    timedLyricsContentType = new Ut,
    RenderInfoMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.browse.RenderInfo", [{
          no: 183314536,
          name: "layoutRender",
          kind: "message",
          T: () => layoutRenderType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 183314536:
              r.layoutRender = layoutRenderType.internalBinaryRead(e, e.uint32(), n, r.layoutRender);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.layoutRender && layoutRenderType.internalBinaryWrite(e.layoutRender, t.tag(183314536, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    renderInfoType = new Et,
    LayoutRenderMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.browse.LayoutRender", [{
          no: 1,
          name: "eml",
          kind: "scalar",
          T: 9
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.eml = "", e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 1:
              r.eml = e.string();
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.eml !== "" && t.tag(1, WireType.LengthDelimited).string(e.eml);
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    layoutRenderType = new Lt,
    ShelfRendererMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.browse.ShelfRenderer", [{
          no: 5,
          name: "richSectionContent",
          kind: "message",
          T: () => richSectionContentType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 5:
              r.richSectionContent = richSectionContentType.internalBinaryRead(e, e.uint32(), n, r.richSectionContent);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.richSectionContent && richSectionContentType.internalBinaryWrite(e.richSectionContent, t.tag(5, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    shelfRendererType = new Ft,
    RichSectionContentMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.browse.RichSectionContent", [{
          no: 51431404,
          name: "reelShelfRenderer",
          kind: "message",
          T: () => reelShelfRendererType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 51431404:
              r.reelShelfRenderer = reelShelfRendererType.internalBinaryRead(e, e.uint32(), n, r.reelShelfRenderer);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.reelShelfRenderer && reelShelfRendererType.internalBinaryWrite(e.reelShelfRenderer, t.tag(51431404, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    richSectionContentType = new Dt,
    ReelShelfRendererMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.browse.ReelShelfRenderer", [{
          no: 1,
          name: "richItemContents",
          kind: "message",
          repeat: 1,
          T: () => richItemContentType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.richItemContents = [], e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 1:
              r.richItemContents.push(richItemContentType.internalBinaryRead(e, e.uint32(), n));
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        for (let r = 0; r < e.richItemContents.length; r++) richItemContentType.internalBinaryWrite(e.richItemContents[r], t.tag(1, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    reelShelfRendererType = new At,
    $t = class extends MessageType {
      constructor() {
        super("youtube.response.browse.MusicDescriptionShelfRenderer", [{
          no: 3,
          name: "description",
          kind: "message",
          T: () => textLabel
        }, {
          no: 10,
          name: "footer",
          kind: "message",
          T: () => textLabel
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 3:
              r.description = textLabel.internalBinaryRead(e, e.uint32(), n, r.description);
              break;
            case 10:
              r.footer = textLabel.internalBinaryRead(e, e.uint32(), n, r.footer);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.description && textLabel.internalBinaryWrite(e.description, t.tag(3, WireType.LengthDelimited).fork(), n).join(), e.footer && textLabel.internalBinaryWrite(e.footer, t.tag(10, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    musicDescriptionShelfRendererType = new $t;
  var NextMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.next.Next", [{
          no: 7,
          name: "content",
          kind: "message",
          T: () => guideEntryRendererTypextContentType
        }, {
          no: 8,
          name: "onResponseReceivedAction",
          kind: "message",
          T: () => browseContentType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 7:
              r.content = nextContentType.internalBinaryRead(e, e.uint32(), n, r.content);
              break;
            case 8:
              r.onResponseReceivedAction = browseContentType.internalBinaryRead(e, e.uint32(), n, r.onResponseReceivedAction);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.content && nextContentType.internalBinaryWrite(e.content, t.tag(7, WireType.LengthDelimited).fork(), n).join(), e.onResponseReceivedAction && browseContentType.internalBinaryWrite(e.onResponseReceivedAction, t.tag(8, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    nextType = new Mt,
    NextContentMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.next.Content", [{
          no: 51779735,
          name: "nextResult",
          kind: "message",
          T: () => guideEntryRendererTypextResultType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 51779735:
              r.nextResult = nextResultType.internalBinaryRead(e, e.uint32(), n, r.nextResult);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.nextResult && nextResultType.internalBinaryWrite(e.nextResult, t.tag(51779735, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    nextContentType = new vt,
    NextResultMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.next.NextResult", [{
          no: 1,
          name: "content",
          kind: "message",
          T: () => browseContentType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 1:
              r.content = browseContentType.internalBinaryRead(e, e.uint32(), n, r.content);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.content && browseContentType.internalBinaryWrite(e.content, t.tag(1, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    nextResultType = new Gt;
  var SearchMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.search.Search", [{
          no: 4,
          name: "content",
          kind: "message",
          T: () => browseContentType
        }, {
          no: 7,
          name: "onResponseReceivedCommand",
          kind: "message",
          T: () => onResponseReceivedCommandType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 4:
              r.content = browseContentType.internalBinaryRead(e, e.uint32(), n, r.content);
              break;
            case 7:
              r.onResponseReceivedCommand = onResponseReceivedCommandType.internalBinaryRead(e, e.uint32(), n, r.onResponseReceivedCommand);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.content && browseContentType.internalBinaryWrite(e.content, t.tag(4, WireType.LengthDelimited).fork(), n).join(), e.onResponseReceivedCommand && onResponseReceivedCommandType.internalBinaryWrite(e.onResponseReceivedCommand, t.tag(7, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    searchType = new Jt,
    OnResponseReceivedCommandMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.search.OnResponseReceivedCommand", [{
          no: 50195462,
          name: "itemSectionRenderer",
          kind: "message",
          T: () => itemSectionRendererType
        }, {
          no: 49399797,
          name: "appendContinuationItemsAction",
          kind: "message",
          T: () => sectionListRendererType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 50195462:
              r.itemSectionRenderer = itemSectionRendererType.internalBinaryRead(e, e.uint32(), n, r.itemSectionRenderer);
              break;
            case 49399797:
              r.appendContinuationItemsAction = sectionListRendererType.internalBinaryRead(e, e.uint32(), n, r.appendContinuationItemsAction);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.itemSectionRenderer && itemSectionRendererType.internalBinaryWrite(e.itemSectionRenderer, t.tag(50195462, WireType.LengthDelimited).fork(), n).join(), e.appendContinuationItemsAction && sectionListRendererType.internalBinaryWrite(e.appendContinuationItemsAction, t.tag(49399797, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    onResponseReceivedCommandType = new _t;
  var ShortsMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.shorts.Shorts", [{
          no: 2,
          name: "entries",
          kind: "message",
          repeat: 1,
          T: () => shortsEntryType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.entries = [], e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 2:
              r.entries.push(shortsEntryType.internalBinaryRead(e, e.uint32(), n));
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        for (let r = 0; r < e.entries.length; r++) shortsEntryType.internalBinaryWrite(e.entries[r], t.tag(2, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    shortsType = new Ht,
    ShortsEntryMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.shorts.Entry", [{
          no: 1,
          name: "command",
          kind: "message",
          T: () => textRunt
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 1:
              r.command = shortsCommandType.internalBinaryRead(e, e.uint32(), n, r.command);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.command && shortsCommandType.internalBinaryWrite(e.command, t.tag(1, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    shortsEntryType = new Qt,
    ShortsCommandMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.shorts.Command", [{
          no: 139608561,
          name: "reelWatchEndpoint",
          kind: "message",
          T: () => sectionListRendererTypet
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 139608561:
              r.reelWatchEndpoint = reelWatchEndpointType.internalBinaryRead(e, e.uint32(), n, r.reelWatchEndpoint);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.reelWatchEndpoint && reelWatchEndpointType.internalBinaryWrite(e.reelWatchEndpoint, t.tag(139608561, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    shortsCommandType = new en,
    ReelWatchEndpointMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.shorts.ReelWatchEndpoint", [{
          no: 8,
          name: "overlay",
          kind: "message",
          T: () => itemSectionRendererTypet
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 8:
              r.overlay = overlayType.internalBinaryRead(e, e.uint32(), n, r.overlay);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.overlay && overlayType.internalBinaryWrite(e.overlay, t.tag(8, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    reelWatchEndpointType = new tn,
    OverlayMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.shorts.Overlay", [{
          no: 139970731,
          name: "reelPlayerOverlayRenderer",
          kind: "message",
          T: () => reelPlayerOverlayRendererType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 139970731:
              r.reelPlayerOverlayRenderer = reelPlayerOverlayRendererType.internalBinaryRead(e, e.uint32(), n, r.reelPlayerOverlayRenderer);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.reelPlayerOverlayRenderer && reelPlayerOverlayRendererType.internalBinaryWrite(e.reelPlayerOverlayRenderer, t.tag(139970731, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    overlayType = new nn,
    ReelPlayerOverlayRendererMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.shorts.ReelPlayerOverlayRenderer", [{
          no: 12,
          name: "style",
          kind: "scalar",
          T: 5
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.style = 0, e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 12:
              r.style = e.int32();
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.style !== 0 && t.tag(12, WireType.Varint).int32(e.style);
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    reelPlayerOverlayRendererType = new rn;
  var GuideMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.guide.Guide", [{
          no: 4,
          name: "labelItems",
          kind: "message",
          repeat: 1,
          T: () => guideItemType
        }, {
          no: 6,
          name: "iconItems",
          kind: "message",
          repeat: 1,
          T: () => guideItemType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.labelItems = [], t.iconItems = [], e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 4:
              r.labelItems.push(guideItemType.internalBinaryRead(e, e.uint32(), n));
              break;
            case 6:
              r.iconItems.push(guideItemType.internalBinaryRead(e, e.uint32(), n));
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        for (let r = 0; r < e.labelItems.length; r++) guideItemType.internalBinaryWrite(e.labelItems[r], t.tag(4, WireType.LengthDelimited).fork(), n).join();
        for (let r = 0; r < e.iconItems.length; r++) guideItemType.internalBinaryWrite(e.iconItems[r], t.tag(6, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    guideType = new on,
    GuideItemMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.guide.Item", [{
          no: 117866661,
          name: "guideSectionRenderer",
          kind: "message",
          T: () => guideSectionRendererType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 117866661:
              r.guideSectionRenderer = guideSectionRendererType.internalBinaryRead(e, e.uint32(), n, r.guideSectionRenderer);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.guideSectionRenderer && guideSectionRendererType.internalBinaryWrite(e.guideSectionRenderer, t.tag(117866661, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    guideItemType = new ln,
    GuideSectionRendererMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.guide.GuideSectionRenderer", [{
          no: 1,
          name: "rendererItems",
          kind: "message",
          repeat: 1,
          T: () => guideRendererItemType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.rendererItems = [], e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 1:
              r.rendererItems.push(guideRendererItemType.internalBinaryRead(e, e.uint32(), n));
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        for (let r = 0; r < e.rendererItems.length; r++) guideRendererItemType.internalBinaryWrite(e.rendererItems[r], t.tag(1, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    guideSectionRendererType = new cn,
    GuideRendererItemMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.guide.RendererItem", [{
          no: 318370163,
          name: "iconRender",
          kind: "message",
          T: () => guideEntryRendererType
        }, {
          no: 117501096,
          name: "labelRender",
          kind: "message",
          T: () => guideEntryRendererType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 318370163:
              r.iconRender = guideEntryRendererType.internalBinaryRead(e, e.uint32(), n, r.iconRender);
              break;
            case 117501096:
              r.labelRender = guideEntryRendererType.internalBinaryRead(e, e.uint32(), n, r.labelRender);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.iconRender && guideEntryRendererType.internalBinaryWrite(e.iconRender, t.tag(318370163, WireType.LengthDelimited).fork(), n).join(), e.labelRender && guideEntryRendererType.internalBinaryWrite(e.labelRender, t.tag(117501096, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    guideRendererItemType = new un,
    GuideEntryRendererMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.guide.guideEntryRenderer", [{
          no: 1,
          name: "browseId",
          kind: "scalar",
          T: 9
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.browseId = "", e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 1:
              r.browseId = e.string();
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.browseId !== "" && t.tag(1, WireType.LengthDelimited).string(e.browseId);
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    guideEntryRendererType = new dn;
  var PlayerMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.player.Player", [{
          no: 7,
          name: "adPlacements",
          kind: "message",
          repeat: 1,
          T: () => adPlacementType
        }, {
          no: 2,
          name: "playabilityStatus",
          kind: "message",
          T: () => playabilityStatusType
        }, {
          no: 9,
          name: "playbackTracking",
          kind: "message",
          T: () => playbackTrackingType
        }, {
          no: 10,
          name: "captions",
          kind: "message",
          T: () => captionsType
        }, {
          no: 68,
          name: "adSlots",
          kind: "message",
          repeat: 1,
          T: () => adSlotType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.adPlacements = [], t.adSlots = [], e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 7:
              r.adPlacements.push(adPlacementType.internalBinaryRead(e, e.uint32(), n));
              break;
            case 2:
              r.playabilityStatus = playabilityStatusType.internalBinaryRead(e, e.uint32(), n, r.playabilityStatus);
              break;
            case 9:
              r.playbackTracking = playbackTrackingType.internalBinaryRead(e, e.uint32(), n, r.playbackTracking);
              break;
            case 10:
              r.captions = captionsType.internalBinaryRead(e, e.uint32(), n, r.captions);
              break;
            case 68:
              r.adSlots.push(adSlotType.internalBinaryRead(e, e.uint32(), n));
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        for (let r = 0; r < e.adPlacements.length; r++) adPlacementType.internalBinaryWrite(e.adPlacements[r], t.tag(7, WireType.LengthDelimited).fork(), n).join();
        e.playabilityStatus && playabilityStatusType.internalBinaryWrite(e.playabilityStatus, t.tag(2, WireType.LengthDelimited).fork(), n).join(), e.playbackTracking && playbackTrackingType.internalBinaryWrite(e.playbackTracking, t.tag(9, WireType.LengthDelimited).fork(), n).join(), e.captions && captionsType.internalBinaryWrite(e.captions, t.tag(10, WireType.LengthDelimited).fork(), n).join();
        for (let r = 0; r < e.adSlots.length; r++) adSlotType.internalBinaryWrite(e.adSlots[r], t.tag(68, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    playerType = new In,
    AdPlacementMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.player.AdPlacement", [{
          no: 84813246,
          name: "adPlacementRenderer",
          kind: "message",
          T: () => adPlacementRendererType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 84813246:
              r.adPlacementRenderer = adPlacementRendererType.internalBinaryRead(e, e.uint32(), n, r.adPlacementRenderer);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.adPlacementRenderer && adPlacementRendererType.internalBinaryWrite(e.adPlacementRenderer, t.tag(84813246, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    adPlacementType = new Tn,
    AdPlacementRendererMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.player.AdPlacementRenderer", [{
          no: 4,
          name: "params",
          kind: "scalar",
          T: 9
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.params = "", e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 4:
              r.params = e.string();
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.params !== "" && t.tag(4, WireType.LengthDelimited).string(e.params);
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    adPlacementRendererType = new Nn,
    PlayabilityStatusMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.player.PlayabilityStatus", [{
          no: 21,
          name: "pictureInPictureRender",
          kind: "message",
          T: () => pictureInPictureRendererType
        }, {
          no: 11,
          name: "backgroundPlayerRender",
          kind: "message",
          T: () => backgroundPlayerRendererType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 21:
              r.pictureInPictureRender = pictureInPictureRendererType.internalBinaryRead(e, e.uint32(), n, r.pictureInPictureRender);
              break;
            case 11:
              r.backgroundPlayerRender = backgroundPlayerRendererType.internalBinaryRead(e, e.uint32(), n, r.backgroundPlayerRender);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.pictureInPictureRender && pictureInPictureRendererType.internalBinaryWrite(e.pictureInPictureRender, t.tag(21, WireType.LengthDelimited).fork(), n).join(), e.backgroundPlayerRender && backgroundPlayerRendererType.internalBinaryWrite(e.backgroundPlayerRender, t.tag(11, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    playabilityStatusType = new Sn,
    PictureInPictureSupportedRendererMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.player.PictureInPictureSupportedRenderer", [{
          no: 151635310,
          name: "pictureInPictureAbility",
          kind: "message",
          T: () => pictureInPictureAbilityType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 151635310:
              r.pictureInPictureAbility = pictureInPictureAbilityType.internalBinaryRead(e, e.uint32(), n, r.pictureInPictureAbility);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.pictureInPictureAbility && pictureInPictureAbilityType.internalBinaryWrite(e.pictureInPictureAbility, t.tag(151635310, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    pictureInPictureRendererType = new Wn,
    BackgroundSupportedRendererMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.player.BackgroundSupportedRenderer", [{
          no: 64657230,
          name: "backgroundAbility",
          kind: "message",
          T: () => backgroundAbilityType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 64657230:
              r.backgroundAbility = backgroundAbilityType.internalBinaryRead(e, e.uint32(), n, r.backgroundAbility);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.backgroundAbility && backgroundAbilityType.internalBinaryWrite(e.backgroundAbility, t.tag(64657230, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    backgroundPlayerRendererType = new BackgroundSupportedRendererMessageType,
    PictureInPictureAbilityMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.player.PictureInPictureAbility", [{
          no: 1,
          name: "active",
          kind: "scalar",
          T: 8
        }, {
          no: 4,
          name: "f4",
          kind: "scalar",
          T: 5
        }, {
          no: 6,
          name: "f6",
          kind: "scalar",
          T: 5
        }, {
          no: 8,
          name: "f8",
          kind: "scalar",
          T: 5
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.active = false, t.f4 = 0, t.f6 = 0, t.f8 = 0, e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 1:
              r.active = e.bool();
              break;
            case 4:
              r.f4 = e.int32();
              break;
            case 6:
              r.f6 = e.int32();
              break;
            case 8:
              r.f8 = e.int32();
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.active !== false && t.tag(1, WireType.Varint).bool(e.active), e.f4 !== 0 && t.tag(4, WireType.Varint).int32(e.f4), e.f6 !== 0 && t.tag(6, WireType.Varint).int32(e.f6), e.f8 !== 0 && t.tag(8, WireType.Varint).int32(e.f8);
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    pictureInPictureAbilityType = new PictureInPictureAbilityMessageType,
    BackgroundAbilityMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.player.BackgroundAbility", [{
          no: 1,
          name: "active",
          kind: "scalar",
          T: 8
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.active = false, e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 1:
              r.active = e.bool();
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.active !== false && t.tag(1, WireType.Varint).bool(e.active);
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    backgroundAbilityType = new BackgroundAbilityMessageType,
    PlaybackTrackingMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.player.PlaybackTracking", [{
          no: 1,
          name: "videostatsPlaybackUrl",
          kind: "message",
          T: () => trackingType
        }, {
          no: 2,
          name: "videostatsDelayplayUrl",
          kind: "message",
          T: () => trackingType
        }, {
          no: 3,
          name: "videostatsWatchtimeUrl",
          kind: "message",
          T: () => trackingType
        }, {
          no: 4,
          name: "ptrackingUrl",
          kind: "message",
          T: () => trackingType
        }, {
          no: 5,
          name: "qoeUrl",
          kind: "message",
          T: () => trackingType
        }, {
          no: 13,
          name: "atrUrl",
          kind: "message",
          T: () => trackingType
        }, {
          no: 15,
          name: "videostatsEngageUrl",
          kind: "message",
          T: () => trackingType
        }, {
          no: 18,
          name: "pageadViewthroughconversion",
          kind: "message",
          T: () => trackingType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 1:
              r.videostatsPlaybackUrl = trackingType.internalBinaryRead(e, e.uint32(), n, r.videostatsPlaybackUrl);
              break;
            case 2:
              r.videostatsDelayplayUrl = trackingType.internalBinaryRead(e, e.uint32(), n, r.videostatsDelayplayUrl);
              break;
            case 3:
              r.videostatsWatchtimeUrl = trackingType.internalBinaryRead(e, e.uint32(), n, r.videostatsWatchtimeUrl);
              break;
            case 4:
              r.ptrackingUrl = trackingType.internalBinaryRead(e, e.uint32(), n, r.ptrackingUrl);
              break;
            case 5:
              r.qoeUrl = trackingType.internalBinaryRead(e, e.uint32(), n, r.qoeUrl);
              break;
            case 13:
              r.atrUrl = trackingType.internalBinaryRead(e, e.uint32(), n, r.atrUrl);
              break;
            case 15:
              r.videostatsEngageUrl = trackingType.internalBinaryRead(e, e.uint32(), n, r.videostatsEngageUrl);
              break;
            case 18:
              r.pageadViewthroughconversion = trackingType.internalBinaryRead(e, e.uint32(), n, r.pageadViewthroughconversion);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.videostatsPlaybackUrl && trackingType.internalBinaryWrite(e.videostatsPlaybackUrl, t.tag(1, WireType.LengthDelimited).fork(), n).join(), e.videostatsDelayplayUrl && trackingType.internalBinaryWrite(e.videostatsDelayplayUrl, t.tag(2, WireType.LengthDelimited).fork(), n).join(), e.videostatsWatchtimeUrl && trackingType.internalBinaryWrite(e.videostatsWatchtimeUrl, t.tag(3, WireType.LengthDelimited).fork(), n).join(), e.ptrackingUrl && trackingType.internalBinaryWrite(e.ptrackingUrl, t.tag(4, WireType.LengthDelimited).fork(), n).join(), e.qoeUrl && trackingType.internalBinaryWrite(e.qoeUrl, t.tag(5, WireType.LengthDelimited).fork(), n).join(), e.atrUrl && trackingType.internalBinaryWrite(e.atrUrl, t.tag(13, WireType.LengthDelimited).fork(), n).join(), e.videostatsEngageUrl && trackingType.internalBinaryWrite(e.videostatsEngageUrl, t.tag(15, WireType.LengthDelimited).fork(), n).join(), e.pageadViewthroughconversion && trackingType.internalBinaryWrite(e.pageadViewthroughconversion, t.tag(18, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    playbackTrackingType = new PlaybackTrackingMessageType,
    TrackingMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.player.Tracking", [{
          no: 1,
          name: "baseUrl",
          kind: "scalar",
          T: 9
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.baseUrl = "", e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 1:
              r.baseUrl = e.string();
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.baseUrl !== "" && t.tag(1, WireType.LengthDelimited).string(e.baseUrl);
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    trackingType = new TrackingMessageType,
    CaptionsMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.player.Captions", [{
          no: 51621377,
          name: "playerCaptionsTrackListRenderer",
          kind: "message",
          jsonName: "playerCaptionsTracklistRenderer",
          T: () => playerCaptionsTrackListRendererType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 51621377:
              r.playerCaptionsTrackListRenderer = playerCaptionsTrackListRendererType.internalBinaryRead(e, e.uint32(), n, r.playerCaptionsTrackListRenderer);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.playerCaptionsTrackListRenderer && playerCaptionsTrackListRendererType.internalBinaryWrite(e.playerCaptionsTrackListRenderer, t.tag(51621377, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    captionsType = new CaptionsMessageType,
    PlayerCaptionsTrackListRendererMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.player.PlayerCaptionsTrackListRenderer", [{
          no: 1,
          name: "captionTracks",
          kind: "message",
          repeat: 1,
          T: () => captionTrackType
        }, {
          no: 2,
          name: "audioTracks",
          kind: "message",
          repeat: 1,
          T: () => audioTrackType
        }, {
          no: 3,
          name: "translationLanguages",
          kind: "message",
          repeat: 1,
          T: () => DEFAULT_READ_OPTIONS
        }, {
          no: 4,
          name: "defaultAudioTrackIndex",
          kind: "scalar",
          opt: true,
          T: 5
        }, {
          no: 6,
          name: "defaultCaptionTrackIndex",
          kind: "scalar",
          opt: true,
          T: 5
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.captionTracks = [], t.audioTracks = [], t.translationLanguages = [], e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 1:
              r.captionTracks.push(captionTrackType.internalBinaryRead(e, e.uint32(), n));
              break;
            case 2:
              r.audioTracks.push(audioTrackType.internalBinaryRead(e, e.uint32(), n));
              break;
            case 3:
              r.translationLanguages.push(DEFAULT_READ_OPTIONS.internalBinaryRead(e, e.uint32(), n));
              break;
            case 4:
              r.defaultAudioTrackIndex = e.int32();
              break;
            case 6:
              r.defaultCaptionTrackIndex = e.int32();
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        for (let r = 0; r < e.captionTracks.length; r++) captionTrackType.internalBinaryWrite(e.captionTracks[r], t.tag(1, WireType.LengthDelimited).fork(), n).join();
        for (let r = 0; r < e.audioTracks.length; r++) audioTrackType.internalBinaryWrite(e.audioTracks[r], t.tag(2, WireType.LengthDelimited).fork(), n).join();
        for (let r = 0; r < e.translationLanguages.length; r++) DEFAULT_READ_OPTIONS.internalBinaryWrite(e.translationLanguages[r], t.tag(3, WireType.LengthDelimited).fork(), n).join();
        e.defaultAudioTrackIndex !== void 0 && t.tag(4, WireType.Varint).int32(e.defaultAudioTrackIndex), e.defaultCaptionTrackIndex !== void 0 && t.tag(6, WireType.Varint).int32(e.defaultCaptionTrackIndex);
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    playerCaptionsTrackListRendererType = new PlayerCaptionsTrackListRendererMessageType,
    CaptionTrackMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.player.CaptionTrack", [{
          no: 1,
          name: "baseUrl",
          kind: "scalar",
          T: 9
        }, {
          no: 2,
          name: "name",
          kind: "message",
          T: () => textLabel
        }, {
          no: 3,
          name: "vssId",
          kind: "scalar",
          T: 9
        }, {
          no: 4,
          name: "languageCode",
          kind: "scalar",
          T: 9
        }, {
          no: 5,
          name: "kind",
          kind: "scalar",
          opt: true,
          T: 9
        }, {
          no: 6,
          name: "rtl",
          kind: "scalar",
          opt: true,
          T: 8
        }, {
          no: 7,
          name: "isTranslatable",
          kind: "scalar",
          T: 8
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.baseUrl = "", t.vssId = "", t.languageCode = "", t.isTranslatable = false, e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 1:
              r.baseUrl = e.string();
              break;
            case 2:
              r.name = textLabel.internalBinaryRead(e, e.uint32(), n, r.name);
              break;
            case 3:
              r.vssId = e.string();
              break;
            case 4:
              r.languageCode = e.string();
              break;
            case 5:
              r.kind = e.string();
              break;
            case 6:
              r.rtl = e.bool();
              break;
            case 7:
              r.isTranslatable = e.bool();
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.baseUrl !== "" && t.tag(1, WireType.LengthDelimited).string(e.baseUrl), e.name && textLabel.internalBinaryWrite(e.name, t.tag(2, WireType.LengthDelimited).fork(), n).join(), e.vssId !== "" && t.tag(3, WireType.LengthDelimited).string(e.vssId), e.languageCode !== "" && t.tag(4, WireType.LengthDelimited).string(e.languageCode), e.kind !== void 0 && t.tag(5, WireType.LengthDelimited).string(e.kind), e.rtl !== void 0 && t.tag(6, WireType.Varint).bool(e.rtl), e.isTranslatable !== false && t.tag(7, WireType.Varint).bool(e.isTranslatable);
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    captionTrackType = new CaptionTrackMessageType,
    AudioTrackMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.player.AudioTrack", [{
          no: 2,
          name: "captionTrackIndices",
          kind: "scalar",
          repeat: 2,
          T: 5
        }, {
          no: 3,
          name: "defaultCaptionTrackIndex",
          kind: "scalar",
          opt: true,
          T: 5
        }, {
          no: 4,
          name: "forcedCaptionTrackIndex",
          kind: "scalar",
          opt: true,
          T: 5
        }, {
          no: 5,
          name: "visibility",
          kind: "scalar",
          opt: true,
          T: 5
        }, {
          no: 6,
          name: "hasDefaultTrack",
          kind: "scalar",
          opt: true,
          T: 8
        }, {
          no: 7,
          name: "hasForcedTrack",
          kind: "scalar",
          opt: true,
          T: 8
        }, {
          no: 8,
          name: "audioTrackId",
          kind: "scalar",
          opt: true,
          T: 9
        }, {
          no: 11,
          name: "captionsInitialState",
          kind: "scalar",
          opt: true,
          T: 5
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.captionTrackIndices = [], e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 2:
              if (o === WireType.LengthDelimited)
                for (let g = e.int32() + e.pos; e.pos < g;) r.captionTrackIndices.push(e.int32());
              else r.captionTrackIndices.push(e.int32());
              break;
            case 3:
              r.defaultCaptionTrackIndex = e.int32();
              break;
            case 4:
              r.forcedCaptionTrackIndex = e.int32();
              break;
            case 5:
              r.visibility = e.int32();
              break;
            case 6:
              r.hasDefaultTrack = e.bool();
              break;
            case 7:
              r.hasForcedTrack = e.bool();
              break;
            case 8:
              r.audioTrackId = e.string();
              break;
            case 11:
              r.captionsInitialState = e.int32();
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        for (let r = 0; r < e.captionTrackIndices.length; r++) t.tag(2, WireType.Varint).int32(e.captionTrackIndices[r]);
        e.defaultCaptionTrackIndex !== void 0 && t.tag(3, WireType.Varint).int32(e.defaultCaptionTrackIndex), e.forcedCaptionTrackIndex !== void 0 && t.tag(4, WireType.Varint).int32(e.forcedCaptionTrackIndex), e.visibility !== void 0 && t.tag(5, WireType.Varint).int32(e.visibility), e.hasDefaultTrack !== void 0 && t.tag(6, WireType.Varint).bool(e.hasDefaultTrack), e.hasForcedTrack !== void 0 && t.tag(7, WireType.Varint).bool(e.hasForcedTrack), e.audioTrackId !== void 0 && t.tag(8, WireType.LengthDelimited).string(e.audioTrackId), e.captionsInitialState !== void 0 && t.tag(11, WireType.Varint).int32(e.captionsInitialState);
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    audioTrackType = new AudioTrackMessageType,
    TranslationLanguageMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.player.TranslationLanguage", [{
          no: 1,
          name: "languageCode",
          kind: "scalar",
          T: 9
        }, {
          no: 2,
          name: "languageName",
          kind: "message",
          T: () => textLabel
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.languageCode = "", e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 1:
              r.languageCode = e.string();
              break;
            case 2:
              r.languageName = textLabel.internalBinaryRead(e, e.uint32(), n, r.languageName);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.languageCode !== "" && t.tag(1, WireType.LengthDelimited).string(e.languageCode), e.languageName && textLabel.internalBinaryWrite(e.languageName, t.tag(2, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    DEFAULT_READ_OPTIONS = new An,
    $n = class extends MessageType {
      constructor() {
        super("youtube.response.player.AdSlot", [{
          no: 424701016,
          name: "render",
          kind: "message",
          T: () => adSlotRenderType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 424701016:
              r.render = adSlotRenderType.internalBinaryRead(e, e.uint32(), n, r.render);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.render && adSlotRenderType.internalBinaryWrite(e.render, t.tag(424701016, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    adSlotType = new AdSlotMessageType,
    AdSlotRenderMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.player.AdSlot.Render", [])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        return i ?? this.create()
      }
      internalBinaryWrite(e, t, n) {
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    adSlotRenderType = new AdSlotRenderMessageType;
  var SettingMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.setting.Setting", [{
          no: 6,
          name: "settingItems",
          kind: "message",
          repeat: 1,
          T: () => settingItemType
        }, {
          no: 7,
          name: "CollectionItems",
          kind: "message",
          jsonName: "CollectionItems",
          repeat: 1,
          T: () => settingItemType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.settingItems = [], t.collectionItems = [], e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 6:
              r.settingItems.push(settingItemType.internalBinaryRead(e, e.uint32(), n));
              break;
            case 7:
              r.collectionItems.push(settingItemType.internalBinaryRead(e, e.uint32(), n));
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        for (let r = 0; r < e.settingItems.length; r++) settingItemType.internalBinaryWrite(e.settingItems[r], t.tag(6, WireType.LengthDelimited).fork(), n).join();
        for (let r = 0; r < e.collectionItems.length; r++) settingItemType.internalBinaryWrite(e.collectionItems[r], t.tag(7, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    settingType = new SettingMessageType,
    SettingItemMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.setting.SettingItem", [{
          no: 88478200,
          name: "backgroundPlayBackSettingRenderer",
          kind: "message",
          T: () => backgroundPlaybackSettingRendererType
        }, {
          no: 66930374,
          name: "settingCategoryCollectionRenderer",
          kind: "message",
          T: () => settingCategoryCollectionRendererType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 88478200:
              r.backgroundPlayBackSettingRenderer = backgroundPlaybackSettingRendererType.internalBinaryRead(e, e.uint32(), n, r.backgroundPlayBackSettingRenderer);
              break;
            case 66930374:
              r.settingCategoryCollectionRenderer = settingCategoryCollectionRendererType.internalBinaryRead(e, e.uint32(), n, r.settingCategoryCollectionRenderer);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.backgroundPlayBackSettingRenderer && backgroundPlaybackSettingRendererType.internalBinaryWrite(e.backgroundPlayBackSettingRenderer, t.tag(88478200, WireType.LengthDelimited).fork(), n).join(), e.settingCategoryCollectionRenderer && settingCategoryCollectionRendererType.internalBinaryWrite(e.settingCategoryCollectionRenderer, t.tag(66930374, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    settingItemType = new SettingItemMessageType,
    BackgroundPlaybackSettingRendererMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.setting.BackgroundPlayBackSettingRenderer", [{
          no: 1,
          name: "name",
          kind: "message",
          T: () => textLabel
        }, {
          no: 2,
          name: "backgroundPlayback",
          kind: "scalar",
          T: 8
        }, {
          no: 3,
          name: "download",
          kind: "scalar",
          T: 8
        }, {
          no: 5,
          name: "trackingParams",
          kind: "scalar",
          T: 12
        }, {
          no: 9,
          name: "downloadQualitySelection",
          kind: "scalar",
          T: 8
        }, {
          no: 10,
          name: "smartDownload",
          kind: "scalar",
          T: 8
        }, {
          no: 14,
          name: "icon",
          kind: "message",
          T: () => iconType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.backgroundPlayback = false, t.download = false, t.trackingParams = new Uint8Array(0), t.downloadQualitySelection = false, t.smartDownload = false, e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 1:
              r.name = textLabel.internalBinaryRead(e, e.uint32(), n, r.name);
              break;
            case 2:
              r.backgroundPlayback = e.bool();
              break;
            case 3:
              r.download = e.bool();
              break;
            case 5:
              r.trackingParams = e.bytes();
              break;
            case 9:
              r.downloadQualitySelection = e.bool();
              break;
            case 10:
              r.smartDownload = e.bool();
              break;
            case 14:
              r.icon = iconType.internalBinaryRead(e, e.uint32(), n, r.icon);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.name && textLabel.internalBinaryWrite(e.name, t.tag(1, WireType.LengthDelimited).fork(), n).join(), e.backgroundPlayback !== false && t.tag(2, WireType.Varint).bool(e.backgroundPlayback), e.download !== false && t.tag(3, WireType.Varint).bool(e.download), e.trackingParams.length && t.tag(5, WireType.LengthDelimited).bytes(e.trackingParams), e.downloadQualitySelection !== false && t.tag(9, WireType.Varint).bool(e.downloadQualitySelection), e.smartDownload !== false && t.tag(10, WireType.Varint).bool(e.smartDownload), e.icon && iconType.internalBinaryWrite(e.icon, t.tag(14, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    backgroundPlaybackSettingRendererType = new BackgroundPlaybackSettingRendererMessageType,
    SettingCategoryCollectionRendererMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.setting.SettingCategoryCollectionRenderer", [{
          no: 2,
          name: "name",
          kind: "message",
          T: () => textLabel
        }, {
          no: 3,
          name: "subSettings",
          kind: "message",
          repeat: 1,
          T: () => subSettingType
        }, {
          no: 4,
          name: "categoryId",
          kind: "scalar",
          T: 5
        }, {
          no: 5,
          name: "icon",
          kind: "message",
          T: () => iconType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.subSettings = [], t.categoryId = 0, e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 2:
              r.name = textLabel.internalBinaryRead(e, e.uint32(), n, r.name);
              break;
            case 3:
              r.subSettings.push(subSettingType.internalBinaryRead(e, e.uint32(), n));
              break;
            case 4:
              r.categoryId = e.int32();
              break;
            case 5:
              r.icon = iconType.internalBinaryRead(e, e.uint32(), n, r.icon);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.name && textLabel.internalBinaryWrite(e.name, t.tag(2, WireType.LengthDelimited).fork(), n).join();
        for (let r = 0; r < e.subSettings.length; r++) subSettingType.internalBinaryWrite(e.subSettings[r], t.tag(3, WireType.LengthDelimited).fork(), n).join();
        e.categoryId !== 0 && t.tag(4, WireType.Varint).int32(e.categoryId), e.icon && iconType.internalBinaryWrite(e.icon, t.tag(5, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    settingCategoryCollectionRendererType = new SettingCategoryCollectionRendererMessageType,
    IconMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.setting.Icon", [{
          no: 1,
          name: "iconType",
          kind: "scalar",
          T: 5
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.iconType = 0, e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 1:
              r.iconType = e.int32();
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.iconType !== 0 && t.tag(1, WireType.Varint).int32(e.iconType);
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    iconType = new IconMessageType,
    SubSettingMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.setting.SubSetting", [{
          no: 61331416,
          name: "settingBooleanRenderer",
          kind: "message",
          T: () => settingBooleanRendererType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 61331416:
              r.settingBooleanRenderer = settingBooleanRendererType.internalBinaryRead(e, e.uint32(), n, r.settingBooleanRenderer);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.settingBooleanRenderer && settingBooleanRendererType.internalBinaryWrite(e.settingBooleanRenderer, t.tag(61331416, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    subSettingType = new SubSettingMessageType,
    SettingBooleanRendererMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.setting.SettingBooleanRenderer", [{
          no: 2,
          name: "title",
          kind: "message",
          T: () => textLabel
        }, {
          no: 3,
          name: "description",
          kind: "message",
          T: () => textLabel
        }, {
          no: 5,
          name: "enableServiceEndpoint",
          kind: "message",
          T: () => serviceEndpointType
        }, {
          no: 6,
          name: "disableServiceEndpoint",
          kind: "message",
          T: () => serviceEndpointType
        }, {
          no: 15,
          name: "itemId",
          kind: "scalar",
          T: 5
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.itemId = 0, e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 2:
              r.title = textLabel.internalBinaryRead(e, e.uint32(), n, r.title);
              break;
            case 3:
              r.description = textLabel.internalBinaryRead(e, e.uint32(), n, r.description);
              break;
            case 5:
              r.enableServiceEndpoint = serviceEndpointType.internalBinaryRead(e, e.uint32(), n, r.enableServiceEndpoint);
              break;
            case 6:
              r.disableServiceEndpoint = serviceEndpointType.internalBinaryRead(e, e.uint32(), n, r.disableServiceEndpoint);
              break;
            case 15:
              r.itemId = e.int32();
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.title && textLabel.internalBinaryWrite(e.title, t.tag(2, WireType.LengthDelimited).fork(), n).join(), e.description && textLabel.internalBinaryWrite(e.description, t.tag(3, WireType.LengthDelimited).fork(), n).join(), e.enableServiceEndpoint && serviceEndpointType.internalBinaryWrite(e.enableServiceEndpoint, t.tag(5, WireType.LengthDelimited).fork(), n).join(), e.disableServiceEndpoint && serviceEndpointType.internalBinaryWrite(e.disableServiceEndpoint, t.tag(6, WireType.LengthDelimited).fork(), n).join(), e.itemId !== 0 && t.tag(15, WireType.Varint).int32(e.itemId);
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    settingBooleanRendererType = new SettingBooleanRendererMessageType,
    ServiceEndpointMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.setting.ServiceEndpoint", [{
          no: 81212182,
          name: "setClientSettingEndpoint",
          kind: "message",
          T: () => setClientSettingEndpointType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 81212182:
              r.setClientSettingEndpoint = setClientSettingEndpointType.internalBinaryRead(e, e.uint32(), n, r.setClientSettingEndpoint);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.setClientSettingEndpoint && setClientSettingEndpointType.internalBinaryWrite(e.setClientSettingEndpoint, t.tag(81212182, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    serviceEndpointType = new ServiceEndpointMessageType,
    SetClientSettingEndpointMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.setting.SetClientSettingEndpoint", [{
          no: 1,
          name: "settingData",
          kind: "message",
          T: () => settingDataType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 1:
              r.settingData = settingDataType.internalBinaryRead(e, e.uint32(), n, r.settingData);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.settingData && settingDataType.internalBinaryWrite(e.settingData, t.tag(1, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    setClientSettingEndpointType = new SetClientSettingEndpointMessageType,
    SettingDataMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.setting.SettingData", [{
          no: 1,
          name: "clientSettingEnum",
          kind: "message",
          T: () => settingItemTypen
        }, {
          no: 3,
          name: "boolValue",
          kind: "scalar",
          T: 8
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.boolValue = false, e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 1:
              r.clientSettingEnum = clientSettingEnumType.internalBinaryRead(e, e.uint32(), n, r.clientSettingEnum);
              break;
            case 3:
              r.boolValue = e.bool();
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.clientSettingEnum && clientSettingEnumType.internalBinaryWrite(e.clientSettingEnum, t.tag(1, WireType.LengthDelimited).fork(), n).join(), e.boolValue !== false && t.tag(3, WireType.Varint).bool(e.boolValue);
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    settingDataType = new SettingDataMessageType,
    ClientSettingEnumMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.setting.ClientSettingEnum", [{
          no: 1,
          name: "item",
          kind: "scalar",
          T: 5
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.item = 0, e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 1:
              r.item = e.int32();
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.item !== 0 && t.tag(1, WireType.Varint).int32(e.item);
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    clientSettingEnumType = new ClientSettingEnumMessageType;
  var WatchMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.watch.Watch", [{
          no: 1,
          name: "contents",
          kind: "message",
          repeat: 1,
          T: () => watchContentType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return t.contents = [], e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 1:
              r.contents.push(watchContentType.internalBinaryRead(e, e.uint32(), n));
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        for (let r = 0; r < e.contents.length; r++) watchContentType.internalBinaryWrite(e.contents[r], t.tag(1, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    watchType = new WatchMessageType,
    WatchContentMessageType = class extends MessageType {
      constructor() {
        super("youtube.response.watch.Content", [{
          no: 2,
          name: "player",
          kind: "message",
          T: () => playerType
        }, {
          no: 3,
          name: "next",
          kind: "message",
          T: () => guideEntryRendererTypextType
        }])
      }
      create(e) {
        let t = globalThis.Object.create(this.messagePrototype);
        return e !== void 0 && mergePartial(this, t, e), t
      }
      internalBinaryRead(e, t, n, i) {
        let r = i ?? this.create(),
          c = e.pos + t;
        for (; e.pos < c;) {
          let [a, o] = e.tag();
          switch (a) {
            case 2:
              r.player = playerType.internalBinaryRead(e, e.uint32(), n, r.player);
              break;
            case 3:
              r.next = nextType.internalBinaryRead(e, e.uint32(), n, r.next);
              break;
            default:
              let s = n.readUnknownField;
              if (s === "throw") throw new globalThis.Error(`Unknown field ${a} (wire type ${o}) for ${this.typeName}`);
              let u = e.skip(o);
              s !== false && (s === true ? UnknownFieldHandler.onRead : s)(this.typeName, r, a, o, u)
          }
        }
        return r
      }
      internalBinaryWrite(e, t, n) {
        e.player && playerType.internalBinaryWrite(e.player, t.tag(2, WireType.LengthDelimited).fork(), n).join(), e.next && nextType.internalBinaryWrite(e.next, t.tag(3, WireType.LengthDelimited).fork(), n).join();
        let i = n.writeUnknownFields;
        return i !== false && (i == true ? UnknownFieldHandler.onWrite : i)(this.typeName, e, t), t
      }
    },
    watchContentType = new WatchContentMessageType;
  var EnvironmentBase = class {
      _times = new Map;
      name;
      isDebug;
      className;
      request;
      response;
      constructor(e, t, n) {
        this.name = e ?? "", this.isDebug = n ?.debug ?? false, e && this.debug(`${e} Start`), this.className = t ?? "", this.init()
      }
      static getInstandefineExport(e, t) {
        let n = "Surge";
        return typeof $loon < "u" ? n = "Loon" : typeof $task < "u" && (n = "QuanX"), se.instances[n] || (se.instances[n] = se.classNames[n](e, n, t)), se.instances[n]
      }
      createProxy(e) {
        return new Proxy(e, {
          get: this.getFn,
          set: this.setFn
        })
      }
      getFn(e, t, n) {
        return e[t]
      }
      setFn(e, t, n, i) {
        return e[t] = n, true
      }
      getJSON(e, t = {}) {
        let n = this.getVal(e);
        return n ? JSON.parse(n) : t
      }
      setJSON(e, t) {
        this.setVal(JSON.stringify(e), t)
      }
      msg(e = this.name, t = "", n = "", i) {}
      debug(e) {
        this.isDebug && (typeof e == "object" && (e = JSON.stringify(e)), console.log(e))
      }
      log(e) {
        typeof e == "object" && (e = JSON.stringify(e)), console.log(e)
      }
      timeStart(e) {
        this._times.set(e, Date.now())
      }
      timeEnd(e) {
        if (this._times.has(e)) {
          let t = this._times.get(e) ?? 0,
            n = Date.now() - t;
          this.debug(`${e}: ${n}ms`), this._times.delete(e)
        } else this.debug(`Timer with label ${e} does not exist.`)
      }
      exit() {
        $done({})
      }
      reject() {
        $done()
      }
      decodeParams(e) {
        return e
      }
    },
    v = se;
  defineExport(v, "instances", {}), defineExport(v, "classNames", {
    QuanX: (e, t, n) => new De(e, t, n),
    Surge: (e, t, n) => new ge(e, t, n),
    Loon: (e, t, n) => new sr(e, t, n)
  });
  var SurgeEnvironment = class extends v {
      getFn(e, t, n) {
        let i = Ae.clientAdapter[t] || t;
        return super.getFn(e, i, n)
      }
      setFn(e, t, n, i) {
        let r = Ae.clientAdapter[t] || t;
        return super.setFn(e, r, n, i)
      }
      init() {
        try {
          this.request = this.createProxy(definePropertyequest), this.response = this.createProxy(definePropertyesponse)
        } catch (e) {
          this.debug(e.toString())
        }
      }
      getVal(e) {
        return $persistentStore.read(e)
      }
      setVal(e, t) {
        $persistentStore.write(e, t)
      }
      msg(e = this.name, t = "", n = "", i) {
        let r = {};
        i && (r = {
          action: {
            "open-url": i
          }
        }), $notification.post(e, t, n, r)
      }
      async fetch(e) {
        return await new Promise((t, n) => {
          let {
            method: i,
            body: r,
            bodyBytes: c,
            ...a
          } = e, o = c ?? r, s = o instanceof Uint8Array;
          $httpClient[i.toLowerCase()]({ ...a,
            body: o,
            "binary-mode": s
          }, (u, g, b) => {
            u && n(u);
            let m = s ? "bodyBytes" : "body";
            t({
              status: g.status ?? g.statusCode,
              headers: g.headers,
              [m]: b
            })
          })
        })
      }
      done(e) {
        let t = e.response ?? e;
        t.bodyBytes && (t.body = t.bodyBytes, delete t.bodyBytes), $done(t)
      }
      decodeParams(e) {
        return typeof $argument == "string" && !$argument.includes("{{{") && Object.assign(e, JSON.parse($argument)), e
      }
    },
    ge = Ae;
  defineExport(ge, "clientAdapter", {
    bodyBytes: "body"
  });
  var QuanXEnvironment = class extends v {
      static transferBodyBytes(e, t) {
        return e instanceof ArrayBuffer ? t === "Uint8Array" ? new Uint8Array(e) : e : e instanceof Uint8Array && t === "ArrayBuffer" ? e.buffer.slidefineExport(e.byteOffset, e.byteLength + e.byteOffset) : e
      }
      init() {
        try {
          this.request = this.createProxy(definePropertyequest), this.response = this.createProxy(definePropertyesponse)
        } catch (e) {
          this.debug(e.toString())
        }
      }
      getFn(e, t, n) {
        let i = M.clientAdapter[t] || t,
          r = super.getFn(e, i, n);
        return t === "bodyBytes" && (r = M.transferBodyBytes(r, "Uint8Array")), r
      }
      setFn(e, t, n, i) {
        let r = M.clientAdapter[t] || t,
          c = n;
        return t === "bodyBytes" && (c = M.transferBodyBytes(c, "Uint8Array")), super.setFn(e, r, c, i)
      }
      getVal(e) {
        return $prefs.valueForKey(e)
      }
      setVal(e, t) {
        $prefs.setValueForKey(e, t)
      }
      msg(e = this.name, t = "", n = "", i) {
        $notify(e, t, n, {
          "open-url": i ?? ""
        })
      }
      async fetch(e) {
        return await new Promise(t => {
          let n = {
            url: "",
            method: "GET"
          };
          for (let [i, r] of Object.entries(e)) i === "id" ? n.sessionIndex = r : i === "bodyBytes" ? n.bodyBytes = M.transferBodyBytes(r, "ArrayBuffer") : n[i] = r;
          e.bodyBytes && delete n.body, $task.fetch(n).then(i => {
            let r = {
              status: 200,
              headers: {}
            };
            for (let [c, a] of Object.entries(i)) c === "sessionIndex" ? r.id = a : c === "bodyBytes" ? r.bodyBytes = M.transferBodyBytes(a, "Uint8Array") : c === "statusCode" ? r.status = a : r[c] = a;
            t(r)
          })
        })
      }
      done(e) {
        let t = e.response ?? e,
          n = {};
        for (let [i, r] of Object.entries(t)) i === "status" ? n.status = `HTTP/1.1 ${r}` : i === "bodyBytes" ? n.bodyBytes = M.transferBodyBytes(r, "ArrayBuffer") : n[i] = r;
        $done(n)
      }
    },
    De = M;
  defineExport(De, "clientAdapter", {
    id: "sessionIndex",
    status: "statusCode"
  });
  var LoonEnvironment = class extends ge {
    decodeParams(e) {
      if (typeof $argument < "u")
        for (let t of Object.keys(e)) {
          let n = $argument ?.[t];
          n !== void 0 && (e[t] = n)
        }
      return e
    }
  };
  var sharedEnv = envBase.getInstandefineExport("YouTube");

  function azHasShortsText(l) {
    try {
      return JSON.stringify(l).toLowerCase().includes('shorts')
    } catch (e) {
      return false
    }
  }

  function azHasSponsoredText(l) {
    try {
      return /(sponsored|promotion|promoted|advertiser|advertisement|广告|廣告|広告|赞助|贊助|賛助)/.test(JSON.stringify(l).toLowerCase())
    } catch (e) {
      return false
    }
  }

  function azHasShoppingText(l) {
    try {
      return /(shopping_(timely|description|carousel|content|item|stacked|expand|binary|event)|styled_product_carousel|single_product_item|paid_product_placement|alternating_shopping_content|product_image_shelf|merchandise_shelf|googleshopping|link\.coupang\.com|gstatic\.com\/shopping|utm_medium=product_shelf)/.test(JSON.stringify(l).toLowerCase())
    } catch (e) {
      return false
    }
  }

  function azIsReelShelf(l) {
    return !!l ?.shelfRenderer ?.richSectionContent ?.reelShelfRenderer
  }

  function azIsNonVideoItemSection(l) {
    let e = l ?.itemSectionRenderer ?.richItemContents;
    return Array.isArray(e) && e.length > 0 && !e.some(t => t ?.videoWithContextRenderer || UnknownFieldHandler.list(t).length > 0)
  }

  function azIsShelfLike(l) {
    return !!(l ?.shelfRenderer || l ?.musicDescriptionShelfRenderer)
  }

  function azIsChipsShelf(l) {
    try {
      let e = [99, 104, 105, 112, 115, 95, 115, 104, 101, 108, 102, 95, 99, 111, 110, 116, 101, 110, 116, 95],
        t = new BinaryWriter;
      sectionListSupportedRendererType.internalBinaryWrite(l, t, createWriteOptions());
      let n = t.finish(),
        i = n.length,
        r = e.length;
      for (let c = 0; c <= i - r; c++) {
        let a = true;
        for (let o = 0; o < r; o++)
          if (n[c + o] !== e[o]) {
            a = false;
            break
          }
        if (a) return true
      }
      return false
    } catch (e) {
      return false
    }
  }

  function azBytesContainPagead(l) {
    let e = [112, 97, 103, 101, 97, 100],
      t = l.length,
      n = e.length;
    for (let i = 0; i <= t - n; i++) {
      let r = true;
      for (let c = 0; c < n; c++)
        if (l[i + c] !== e[c]) {
          r = false;
          break
        }
      if (r) return true
    }
    return false
  }

  function azBytesMatch(l, e, t) {
    for (let n = 0; n < e.length; n++)
      if (l[t + n] !== e[n]) return false;
    return true
  }

  function azHasLibraryJunk(l) {
    let e = [
        [83, 80, 117, 110, 108, 105, 109, 105, 116, 101, 100],
        [70, 69, 109, 121, 95, 118, 105, 100, 101, 111, 115],
        [70, 69, 115, 116, 111, 114, 101, 102, 114, 111, 110, 116]
      ],
      t = [48602820, 79129962];
    try {
      let n = UnknownFieldHandler.list(l);
      if (!n || !n.length) return false;
      let i = n[0];
      if (!i || t.indexOf(i.no) < 0) return false;
      if (i.wireType !== 2 || !i.data || i.data.length < 10) return false;
      let r = i.data,
        c = r.length;
      for (let a = 0; a < e.length; a++) {
        let o = e[a],
          s = o.length;
        for (let u = 0; u <= c - s; u++)
          if (azBytesMatch(r, o, u)) return true
      }
      return false
    } catch (n) {
      return false
    }
  }

  function azDropPagedAdFromSectionList(l) {
    l.iterate(l.message, "sectionListRenderer", e => {
      let t = e.sectionListRenderer;
      if (!t) return;
      let n = UnknownFieldHandler.list(t);
      if (!n || !n.length) return;
      let i = [],
        r = false;
      for (let c = 0; c < n.length; c++) {
        let a = n[c];
        if (a.wireType === 2 && a.data && a.data.length > 20 && azBytesContainPagead(a.data)) {
          r = true;
          continue
        }
        i.push(a)
      }
      if (r) {
        t[UnknownFieldHandler.symbol] = i, l.needProcess = true
      }
    })
  }

  function azStripShoppingFromBytes(buf) {
    const NEEDLES = ["shopping_timely_shelf", "shopping_timely_shelf_content", "shopping_timely_shelf_split_content", "styled_product_carousel", "styled_product_carousel_item", "single_product_item", "shopping_description_shelf", "shopping_description_shelf_deprecated", "shopping_description_item", "alternating_shopping_content", "shopping_carousel", "shopping_carousel_transition", "shopping_item_card", "shopping_content_line", "shopping_content_line_item", "shopping_stacked_image", "shopping_binary_transition", "shopping_expand_transition", "shopping_event_carousel_item", "product_image_shelf", "merchandise_shelf", "paid_product_placement", "gstatic.com/shopping", "link.coupang.com", "utm_medium=product_shelf"];

    function bufIndexOfStr(b, str) {
      const m = str.length,
        n = b.length;
      if (n < m) return -1;
      const c0 = str.charCodeAt(0);
      for (let i = 0; i <= n - m; i++) {
        if (b[i] !== c0) continue;
        let ok = true;
        for (let j = 1; j < m; j++) {
          if (b[i + j] !== str.charCodeAt(j)) {
            ok = false;
            break;
          }
        }
        if (ok) return i;
      }
      return -1;
    }

    function containsAny(b) {
      for (let i = 0; i < NEEDLES.length; i++)
        if (bufIndexOfStr(b, NEEDLES[i]) >= 0) return true;
      return false;
    }

    function readVarint(b, p) {
      let r = 0,
        s = 0;
      const start = p;
      while (p < b.length) {
        const x = b[p++];
        r = (r | ((x & 0x7f) << s)) >>> 0;
        if ((x & 0x80) === 0) return [r, p];
        s += 7;
        if (s > 49) return [-1, start];
      }
      return [-1, start];
    }

    function createJsonReadOptionsiteVarint(out, v) {
      v = v >>> 0;
      while (v > 0x7f) {
        out.push((v & 0x7f) | 0x80);
        v = v >>> 7;
      }
      out.push(v & 0x7f);
    }

    function strip(buf, depth) {
      if (depth > 20) return {
        bytes: buf,
        modified: false,
        parseFail: false
      };
      if (!containsAny(buf)) return {
        bytes: buf,
        modified: false,
        parseFail: false
      };
      const out = [];
      let modified = false;
      let p = 0;
      const n = buf.length;
      while (p < n) {
        const tagStart = p;
        const r1 = readVarint(buf, p);
        const tag = r1[0],
          p1 = r1[1];
        if (tag < 0 || tag === 0) {
          // 解析失败：把剩余字节原样保留
          for (let i = p; i < n; i++) out.push(buf[i]);
          const u = new Uint8Array(out.length);
          for (let i = 0; i < out.length; i++) u[i] = out[i];
          return {
            bytes: u,
            modified,
            parseFail: true
          };
        }
        const wt = tag & 7;
        p = p1;
        if (wt === 0) {
          const r2 = readVarint(buf, p);
          if (r2[0] < 0) {
            for (let i = tagStart; i < n; i++) out.push(buf[i]);
            const u = new Uint8Array(out.length);
            for (let i = 0; i < out.length; i++) u[i] = out[i];
            return {
              bytes: u,
              modified,
              parseFail: true
            };
          }
          for (let i = tagStart; i < r2[1]; i++) out.push(buf[i]);
          p = r2[1];
        } else if (wt === 1) {
          if (p + 8 > n) {
            for (let i = tagStart; i < n; i++) out.push(buf[i]);
            break;
          }
          for (let i = tagStart; i < p + 8; i++) out.push(buf[i]);
          p += 8;
        } else if (wt === 5) {
          if (p + 4 > n) {
            for (let i = tagStart; i < n; i++) out.push(buf[i]);
            break;
          }
          for (let i = tagStart; i < p + 4; i++) out.push(buf[i]);
          p += 4;
        } else if (wt === 2) {
          const r2 = readVarint(buf, p);
          const len = r2[0],
            p2 = r2[1];
          if (len < 0 || p2 + len > n) {
            for (let i = tagStart; i < n; i++) out.push(buf[i]);
            const u = new Uint8Array(out.length);
            for (let i = 0; i < out.length; i++) u[i] = out[i];
            return {
              bytes: u,
              modified,
              parseFail: true
            };
          }
          const valStart = p2,
            valEnd = p2 + len;
          const value = buf.subarray ? buf.subarray(valStart, valEnd) : buf.slidefineExport(valStart, valEnd);
          if (containsAny(value)) {
            const sub = strip(value, depth + 1);
            if (!sub.parseFail && sub.modified && !containsAny(sub.bytes)) {
              modified = true;
              for (let i = tagStart; i < p1; i++) out.push(buf[i]); // tag
              writeVarint(out, sub.bytes.length);
              for (let i = 0; i < sub.bytes.length; i++) out.push(sub.bytes[i]);
            } else {
              // 整段丢弃
              modified = true;
            }
          } else {
            for (let i = tagStart; i < valEnd; i++) out.push(buf[i]);
          }
          p = valEnd;
        } else {
          // group 等，原样保留剩余
          for (let i = tagStart; i < n; i++) out.push(buf[i]);
          const u = new Uint8Array(out.length);
          for (let i = 0; i < out.length; i++) u[i] = out[i];
          return {
            bytes: u,
            modified,
            parseFail: true
          };
        }
      }
      const u = new Uint8Array(out.length);
      for (let i = 0; i < out.length; i++) u[i] = out[i];
      return {
        bytes: u,
        modified,
        parseFail: false
      };
    }
    return strip(buf, 0);
  }

  function azDropShoppingFromUnknown(l) {
    try {
      const list = UnknownFieldHandler.list(l.message);
      if (!list || !list.length) return;
      let any = false;

      function readVarintLocal(b, p) {
        let r = 0,
          s = 0;
        const start = p;
        while (p < b.length) {
          const x = b[p++];
          r = (r | ((x & 0x7f) << s)) >>> 0;
          if ((x & 0x80) === 0) return [r, p];
          s += 7;
          if (s > 49) return [-1, start];
        }
        return [-1, start];
      }

      function createJsonReadOptionsiteVarintLocal(out, v) {
        v = v >>> 0;
        while (v > 0x7f) {
          out.push((v & 0x7f) | 0x80);
          v = v >>> 7;
        }
        out.push(v & 0x7f);
      }
      for (let i = 0; i < list.length; i++) {
        const it = list[i];
        if (it.wireType !== 2 || !it.data || it.data.length < 20) continue;
        const lenInfo = readVarintLocal(it.data, 0);
        if (lenInfo[0] < 0 || lenInfo[1] + lenInfo[0] !== it.data.length) {
          let r;
          try {
            r = azStripShoppingFromBytes(it.data);
          } catch (e) {
            continue;
          }
          if (r.modified) {
            it.data = r.bytes;
            any = true;
          }
          continue;
        }
        const inner = it.data.subarray ? it.data.subarray(lenInfo[1]) : it.data.slidefineExport(lenInfo[1]);
        let r;
        try {
          r = azStripShoppingFromBytes(inner);
        } catch (e) {
          continue;
        }
        if (r.modified) {
          const out = [];
          writeVarintLocal(out, r.bytes.length);
          const newData = new Uint8Array(out.length + r.bytes.length);
          for (let k = 0; k < out.length; k++) newData[k] = out[k];
          newData.set(r.bytes, out.length);
          it.data = newData;
          any = true;
        }
      }
      if (any) l.needProcess = true;
    } catch (e) {}
  }

  function azDropAdsFromUnknown(l) {
    let e = UnknownFieldHandler.list(l.message);
    for (let t = e.length - 1; t >= 0; t--) {
      let n = e[t];
      if (n.wireType !== 2 || !n.data || n.data.length < 1e4) continue;
      if (!azBytesContainPagead(n.data)) continue;
      try {
        let i = new BinaryReader(n.data),
          r = i.uint32(),
          c = i.pos + r,
          a = new BinaryWriter,
          o = false;
        for (; i.pos < c;) {
          let [s, u] = i.tag();
          if (s === 1 && u === 2) {
            let g = i.uint32(),
              b = i.pos;
            i.pos += g;
            let m = n.data.subarray(b, b + g);
            if (azBytesContainPagead(m)) {
              let textLabel = new BinaryReader(m),
                itemSectionRendererType = new BinaryWriter,
                ae = false;
              for (; S.pos < S.len;) {
                let [pe, qe] = S.tag();
                if (pe === 1 && qe === 2) {
                  let he = S.uint32(),
                    fe = S.pos;
                  S.pos += he;
                  let OBJECT_VALUES = m.subarray(fe, fe + he);
                  if (azBytesContainPagead(OBJECT_VALUES)) {
                    ae = true;
                    continue
                  }
                  Z.tag(1, WireType.LengthDelimited).uint32(he).raw(OBJECT_VALUES)
                } else {
                  let he = S.skip(qe);
                  Z.tag(pe, qe).raw(he)
                }
              }
              if (ae) {
                o = true;
                let pe = Z.finish();
                a.tag(1, WireType.LengthDelimited).uint32(pe.length).raw(pe);
                continue
              }
            }
            a.tag(1, WireType.LengthDelimited).uint32(g).raw(m)
          } else {
            let g = i.skip(u);
            a.tag(s, u).raw(g)
          }
        }
        if (o) {
          let s = a.finish(),
            u = new BinaryWriter;
          u.uint32(s.length).raw(s);
          let g = u.finish();
          l.message[UnknownFieldHandler.symbol] = e.filter((b, m) => m !== t);
          l.message[UnknownFieldHandler.symbol].push({
            no: n.no,
            wireType: n.wireType,
            data: g
          });
          l.needProcess = true
        }
      } catch (i) {}
    }
  }

  function azBytesContainChips(l) {
    let e = [99, 104, 105, 112, 115, 95, 115, 104, 101, 108, 102, 95, 99, 111, 110, 116, 101, 110, 116, 95],
      t = l.length,
      n = e.length;
    for (let i = 0; i <= t - n; i++) {
      let r = true;
      for (let c = 0; c < n; c++)
        if (l[i + c] !== e[c]) {
          r = false;
          break
        }
      if (r) return true
    }
    return false
  }

  function azDropChipsFromUnknown(l) {
    l.iterate(l.message, "sectionListRenderer", e => {
      let t = e.sectionListRenderer;
      if (!t) return;
      let n = UnknownFieldHandler.list(t);
      for (let i = n.length - 1; i >= 0; i--) {
        let r = n[i];
        if (r.wireType !== 2 || !r.data || r.data.length < 20) continue;
        if (!azBytesContainChips(r.data)) continue;
        try {
          let c = new BinaryReader(r.data),
            a = c.uint32(),
            o = c.pos + a,
            s = new BinaryWriter,
            u = false;
          for (; c.pos < o;) {
            let [g, b] = c.tag();
            if (g === 1 && b === 2) {
              let m = c.uint32(),
                textLabel = c.pos;
              c.pos += m;
              let P = r.data.subarray(S, S + m);
              if (azBytesContainChips(P)) {
                u = true;
                continue
              }
              s.tag(1, WireType.LengthDelimited).uint32(m).raw(P)
            } else c.skip(b)
          }
          if (u) {
            let g = s.finish(),
              b = new BinaryWriter;
            b.uint32(g.length).raw(g);
            let m = b.finish();
            t[UnknownFieldHandler.symbol] = n.filter((S, P) => P !== i);
            t[UnknownFieldHandler.symbol].push({
              no: r.no,
              wireType: r.wireType,
              data: m
            });
            l.needProcess = true
          }
        } catch (c) {}
      }
    })
  }

  function azShouldDropSection(l) {
    return azHasShortsText(l) || azHasSponsoredText(l) || azHasShoppingText(l) || azIsReelShelf(l) || azIsNonVideoItemSection(l) || azIsChipsShelf(l)
  }
  var ConfigProcessor = class {
    name;
    needProcess;
    needSave;
    message;
    version = "1.0-shopping1";
    whiteNo = [];
    blackNo = [];
    whiteEml = [];
    blackEml = ["inline_injection_entrypoint_layout.eml"];
    msgType;
    argument;
    constructor(e, t) {
      this.name = t, this.msgType = e, this.argument = this.decodeArgument(), w.isDebug = Boolean(this.argument.debug), w.debug(this.name);
      let n = w.getJSON("YouTubeAdvertiseInfo");
      w.debug(`currentVersion:  ${this.version}`), w.debug(`storedVersion:  ${n.version}`), n ?.version === this.version && Object.assign(this, n)
    }
    decodeArgument() {
      let e = {
        lyricLang: "off",
        captionLang: "off",
        blockUpload: true,
        blockImmersive: false,
        blockShorts: true,
        debug: false
      };
      return w.decodeParams(e)
    }
    fromBinary(e) {
      return e instanceof Uint8Array ? (this.message = this.msgType.fromBinary(e), w.debug(`bodyBytesSize: ${Math.floor(e.length/1024)} kb`), this) : (w.log("YouTube can not get binaryBody"), w.exit(), this)
    }
    toBinary() {
      return this.msgType.toBinary(this.message)
    }
    save() {
      if (this.needSave) {
        w.debug("Update Config");
        let e = {
          version: this.version,
          whiteNo: this.whiteNo,
          blackNo: this.blackNo,
          whiteEml: this.whiteEml,
          blackEml: this.blackEml
        };
        w.debug(e), w.setJSON(e, "YouTubeAdvertiseInfo")
      }
    }
    done() {
      if (this.save(), this.needProcess) {
        w.timeStart("toBinary");
        let e = this.toBinary();
        w.timeEnd("toBinary"), w.debug(`modifiedBodySize: ${Math.floor(e.length/1024)} kb`), w.done({
          bodyBytes: e
        })
      } else w.debug("use $.exit()"), w.exit()
    }
    iterate(e = {}, t, n) {
      let i = typeof e == "object" ? [e] : [];
      for (; i.length;) {
        let r = i.pop(),
          c = Object.keys(r);
        for (let a of c) {
          if (a === t && n(r)) return;
          typeof r[a] == "object" && i.push(r[a])
        }
      }
    }
  };

  function computeTicket(l) {
    let n = ".",
      i = "+-a^+6",
      r = "+-3^+b+-f",
      c, a, o;
    for (c = [], a = 0, o = 0; o < l.length; o++) {
      let s = l.charCodeAt(o);
      128 > s ? c[a++] = s : (2048 > s ? c[a++] = s >> 6 | 192 : ((s & 64512) == 55296 && o + 1 < l.length && (l.charCodeAt(o + 1) & 64512) == 56320 ? (s = 65536 + ((s & 1023) << 10) + (l.charCodeAt(++o) & 1023), c[a++] = s >> 18 | 240, c[a++] = s >> 12 & 63 | 128) : c[a++] = s >> 12 | 224, c[a++] = s >> 6 & 63 | 128), c[a++] = s & 63 | 128)
    }
    for (l = 406644, a = 0; a < c.length; a++) l += c[a], l = Dr(l, i);
    return l = Dr(l, r), l ^= 3293161072, 0 > l && (l = (l & 2147483647) + 2147483648), l %= 1e6, l.toString() + n + (l ^ 406644)
  }

  function transformTicket(l, e) {
    let t = "a",
      n = "+",
      i;
    for (let r = 0; r < e.length - 2; r += 3) i = e.charAt(r + 2), i = i >= t ? i.charCodeAt(0) - 87 : Number(i), i = e.charAt(r + 1) == n ? l >>> i : l << i, l = e.charAt(r) == n ? l + i & 4294967295 : l ^ i;
    return l
  }

  function buildTranslateUrl(l, e) {
    return `https://translate.google.com/translate_a/single?client=gtx&sl=auto&tl=${e}&hl=zh-CN&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&source=bh&ssel=0&tsel=0&kc=1&tk=${Xr(l)}&q=${encodeURIComponent(l)}`
  }
  var BrowseProcessor = class extends G {
      constructor(e = Pr, t = "Browse") {
        super(e, t)
      }
      async pure() {
        return this.iterate(this.message, "richItemContents", e => {
          let t = e.richItemContents;
          if (!Array.isArray(t)) return false;
          for (let n = t.length - 1; n >= 0; n--)(this.isAdvertise(t[n]) || azHasSponsoredText(t[n]) || azHasShoppingText(t[n]) || azHasLibraryJunk(t[n]) || this.argument.blockShorts && azHasShortsText(t[n])) && (e.richItemContents.splidefineExport(n, 1), this.needProcess = true)
        }), this.iterate(this.message, "sectionListSupportedRenderers", e => {
          let t = e.sectionListSupportedRenderers;
          if (!Array.isArray(t)) return false;
          for (let n = t.length - 1; n >= 0; n--)(azIsChipsShelf(t[n]) || azHasSponsoredText(t[n]) || azHasShoppingText(t[n]) || (this.argument.blockShorts && azShouldDropSection(t[n]))) && (t.splidefineExport(n, 1), this.needProcess = true)
        }), this.iterate(this.message, "engagementPanels", e => {
          let t = e.engagementPanels;
          if (!Array.isArray(t)) return false;
          for (let n = t.length - 1; n >= 0; n--)(azHasShoppingText(t[n]) || azHasSponsoredText(t[n])) && (t.splidefineExport(n, 1), this.needProcess = true)
        }), azDropChipsFromUnknown(this), azDropShoppingFromUnknown(this), azDropAdsFromUnknown(this), azDropPagedAdFromSectionList(this), await this.translate(), this
      }
      listUnknownFields(e) {
        return UnknownFieldHandler.list(e)
      }
      isAdvertise(e) {
        let t = this.listUnknownFields(e)[0];
        return t ? this.handleFieldNo(t) : this.handleFieldEml(e)
      }
      handleFieldNo(e) {
        let t = e.no;
        if (this.whiteNo.includes(t)) return false;
        if (this.blackNo.includes(t)) return true;
        let n = this.checkBufferIsAd(e);
        return n ? this.blackNo.push(t) : this.whiteNo.push(t), this.needSave = true, n
      }
      handleFieldEml(e) {
        let t = false,
          n = "";
        return this.iterate(e, "renderInfo", i => {
          if (n = i.renderInfo ?.layoutRender ?.eml ?.split("|") ?.[0] ?? "", this.whiteEml.includes(n)) t = false;
          else if (this.blackEml.includes(n) || /shorts(?!_pivot_item)/.test(n) || /(shopping_(timely|description|carousel|content|item|stacked|expand|binary|event)|styled_product_carousel|single_product_item|paid_product_placement|product_image_shelf|merchandise_shelf|alternating_shopping_content)/.test(n)) t = true;
          else {
            let r = i ?.videoInfo ?.videoContext ?.videoContent;
            r && (t = this.checkUnknownFiled(r), t ? this.blackEml.push(n) : this.whiteEml.push(n), this.needSave = true)
          }
          return true
        }), t
      }
      checkBufferIsAd(e) {
        if (!e || e.data.length < 1e3) return false;
        let t = e.data,
          n = [112, 97, 103, 101, 97, 100],
          i = t.length,
          r = n.length,
          c = new Int32Array(256).fill(r + 1);
        for (let o = 0; o < r; o++) c[n[o]] = r - o;
        let a = 0;
        for (; a <= i - r;) {
          if (t[a] === n[0] && t[a + 1] === n[1] && t[a + 2] === n[2] && t[a + 3] === n[3] && t[a + 4] === n[4] && t[a + 5] === n[5]) return true;
          a += c[t[a + r]] || r + 1
        }
        return false
      }
      checkUnknownFiled(e) {
        return e ? this.listUnknownFields(e) ?.some(n => this.checkBufferIsAd(n)) ?? false : false
      }
      getBrowseId() {
        let e = "";
        return this.iterate(this.message ?.responseContext, "key", t => {
          if (t.key === "browse_id") return e = t.value, true
        }), e
      }
      async translate() {
        let e = this.argument.lyricLang ?.trim();
        if (!(this.name === "Browse" && this.getBrowseId().startsWith("MPLYt")) || e === "off") return;
        let t = "",
          n, i = false;
        if (this.iterate(this.message, "timedLyricsContent", o => (n = o.timedLyricsContent, t = o.timedLyricsContent.runs.map(s => s.text).join(`
`), i = true, true)), i || this.iterate(this.message, "description", o => (n = o.description.runs[0], t = o.description.runs[0].text, i = true, true)), !i) return;
        let r = e.split("-")[0],
          c = Ar(t, e),
          a = await w.fetch({
            method: "GET",
            url: c
          });
        if (a.status === 200 && a.body) {
          let o = JSON.parse(a.body),
            s = " & Translated by Google",
            u = o[2].includes(r);
          n.text ? (n.text = o[0].map(g => u ? g[0] : g[1] + g[0] || "").join(`\r
`), this.iterate(this.message, "footer", g => (g.footer.runs[0].text += s, true))) : n.runs.length <= o[0].length && (n.runs.forEach((g, b) => {
            g.text = u ? o[0][b][0] : g.text + `
${o[0][b][0]}`
          }), n.footerLabel += s), this.needProcess = true
        }
      }
    },
    be = class extends oe {
      constructor(e = ee, t = "Next") {
        super(e, t)
      }
    },
    ke = class extends G {
      constructor(e = re, t = "Player") {
        super(e, t)
      }
      async pure() {
        return this.removeAd(), this.addPremiumAbility(), this.needProcess = true, this
      }
      removeAd() {
        this.message.adPlacements ?.length && (this.message.adPlacements.length = 0), this.message.adSlots ?.length && (this.message.adSlots.length = 0), delete this.message ?.playbackTracking ?.pageadViewthroughconversion
      }
      addPremiumAbility() {
        let ps = this.message.playabilityStatus;
        if (!ps) return;
        if (!ps.pictureInPictureRender || !ps.pictureInPictureRender.pictureInPictureAbility || ps.pictureInPictureRender.pictureInPictureAbility.active !== true) ps.pictureInPictureRender = fe.create({
          pictureInPictureAbility: {
            active: true,
            f4: 0,
            f6: 0,
            f8: 1
          }
        });
        if (!ps.backgroundPlayerRender || !ps.backgroundPlayerRender.backgroundAbility || ps.backgroundPlayerRender.backgroundAbility.active !== true) ps.backgroundPlayerRender = pe.create({
          backgroundAbility: {
            active: true
          }
        })
      }
      addTranslateCaption() {
        let e = this.argument.captionLang;
        e !== "off" && this.iterate(this.message, "captionTracks", t => {
          let n = t.captionTracks,
            i = t.audioTracks;
          if (Array.isArray(n)) {
            let c = {
                [e]: 2,
                en: 1
              },
              a = -1,
              o = 0;
            for (let s = 0; s < n.length; s++) {
              let u = n[s],
                g = c[u.languageCode];
              g && g > a && (a = g, o = s), u.isTranslatable = true
            }
            if (a !== 2) {
              let s = he.create({
                baseUrl: n[o].baseUrl + `&tlang=${e}`,
                name: {
                  runs: [{
                    text: `@Enhance (${e})`
                  }]
                },
                vssId: `.${e}`,
                languageCode: e
              });
              n.push(s)
            }
            if (Array.isArray(i)) {
              let s = a === 2 ? o : n.length - 1;
              for (let u of i) u.captionTrackIndices ?.includes(s) || u.captionTrackIndices.push(s), u.defaultCaptionTrackIndex = s, u.captionsInitialState = 3
            }
          }
          let r = {
            de: "Deutsch",
            ru: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
            fr: "Fran\xE7ais",
            fil: "Filipino",
            ko: "\uD55C\uAD6D\uC5B4",
            ja: "\u65E5\u672C\u8A9E",
            en: "English",
            vi: "Ti\u1EBFng Vi\u1EC7t",
            "zh-Hant": "\u4E2D\u6587\uFF08\u7E41\u9AD4\uFF09",
            "zh-Hans": "\u4E2D\u6587\uFF08\u7B80\u4F53\uFF09",
            und: "@VirgilClyne"
          };
          return t.translationLanguages = Object.entries(r).map(([c, a]) => DEFAULT_READ_OPTIONS.create({
            languageCode: c,
            languageName: {
              runs: [{
                text: a
              }]
            }
          })), true
        })
      }
    },
    $e = class extends oe {
      constructor(e = Cr, t = "Search") {
        super(e, t)
      }
    },
    je = class extends G {
      constructor(e = Ur, t = "Shorts") {
        super(e, t)
      }
      async pure() {
        let e = this.message.entries ?.length;
        if (e)
          for (let t = e - 1; t >= 0; t--) this.message.entries[t].command ?.reelWatchEndpoint ?.overlay || (this.message.entries.splidefineExport(t, 1), this.needProcess = true);
        return this
      }
    },
    Ve = class extends G {
      constructor(e = Er, t = "Guide") {
        super(e, t)
      }
      async pure() {
        let e = ["SPunlimited"];
        return this.argument.blockUpload && e.push("FEuploads"), this.argument.blockImmersive && e.push("FEmusic_immersive"), this.argument.blockShorts && e.push("FEshorts"), this.iterate(this.message, "rendererItems", t => {
          for (let n = t.rendererItems.length - 1; n >= 0; n--) {
            let i = t.rendererItems[n] ?.iconRender ?.browseId ?? t.rendererItems[n] ?.labelRender ?.browseId;
            i && e.includes(i) && (t.rendererItems.splidefineExport(n, 1), this.needProcess = true)
          }
        }), this
      }
    },
    Me = class extends G {
      constructor(e = Lr, t = "Setting") {
        super(e, t)
      }
      async pure() {
        this.iterate(this.message.settingItems, "categoryId", t => {
          if (t.categoryId === 10135) {
            let n = me.create({
              settingBooleanRenderer: {
                itemId: 0,
                enableServiceEndpoint: {
                  setClientSettingEndpoint: {
                    settingData: {
                      clientSettingEnum: {
                        item: 151
                      },
                      boolValue: true
                    }
                  }
                },
                disableServiceEndpoint: {
                  setClientSettingEndpoint: {
                    settingData: {
                      clientSettingEnum: {
                        item: 151
                      },
                      boolValue: false
                    }
                  }
                }
              }
            });
            t.subSettings.push(n)
          }
        });
        let e = J.create({
          backgroundPlayBackSettingRenderer: {
            backgroundPlayback: true,
            download: true,
            downloadQualitySelection: true,
            smartDownload: true,
            icon: {
              iconType: 1093
            }
          }
        });
        return this.message.settingItems.push(e), this.needProcess = true, this
      }
    },
    ve = class extends G {
      player;
      next;
      constructor(e = Fr, t = "Watch") {
        super(e, t), this.player = new ke, this.next = new be
      }
      async pure() {
        for (let e of this.message.contents) e.player && (this.player.message = e.player, await this.player.pure()), e.next && (this.next.message = e.next, await this.next.pure()), this.needProcess = true;
        return this
      }
    };
  var PROCESSOR_MAP = new Map([
    ["browse", oe],
    ["next", be],
    ["player", ke],
    ["search", $e],
    ["reel_watch_sequence", je],
    ["guide", Ve],
    ["get_setting", Me],
    ["get_watch", ve]
  ]);

  function getProcessorForUrl(l) {
    for (let [e, t] of Yr.entries())
      if (l.includes(e)) return new t;
    return null
  }
  async function main() {
    let l = or(w.request.url);
    if (l) {
      let e = w.response.bodyBytes;
      w.timeStart("fromBinary"), l.fromBinary(e), w.timeEnd("fromBinary"), w.timeStart("modify"), await l.pure(), w.timeEnd("modify"), l.done()
    } else w.msg("YouTube Enhance", "\u811A\u672C\u9700\u8981\u66F4\u65B0", "\u5916\u90E8\u8D44\u6E90 -> \u5168\u90E8\u66F4\u65B0"), w.exit()
  }
  qr().catch(l => {
    console.log(l.message), w.exit()
  });
})();
