/* =====================================================================
   SOFTANO.EU — ZUSTAND-BADGE + CI-PANEL v11 (Phase 1: 33 Volumen-Server)
   ---------------------------------------------------------------------
   v11 (11.07.2026) — ROUTER-FIX:
   Der body-MutationObserver (subtree:true) aus v10 fuegte DOM in die
   Sidebar ein, waehrend Ecwids Cart/Page-Router hydratisierte -> Warenkorb
   und Rechtstexte oeffneten nicht (Popup-Frames, "Hydration mismatch").
   v11 entfernt den body-Observer komplett. Trigger ist jetzt NUR
   Ecwid.OnPageLoaded / OnPageSwitch (feuern NACH der Hydration) plus ein
   kurzer, begrenzter Nach-Zieh-Check (rAF-Retries), der ausschliesslich an
   der Produkt-Sidebar bzw. den Kategorie-Karten arbeitet.
   Zusaetzlich Guard ganz oben in scan(): auf /cart, /checkout, /pages/
   sofortiger Abbruch -> diese Seiten werden nie angefasst.
   Funktion (Karten-Badge, Panel-Kopf, Facts-Grid) unveraendert ggue. v10.
   ===================================================================== */
(function () {
  "use strict";
  if (window.__SOF_COND__) return;
  window.__SOF_COND__ = true;

  var LABEL = "Pre-Owned";            // in allen drei Sprachen identisch
  var PREOWNED = {};
  [ "33000","33010","33014","33030","33040","33044","33100","33110","33114","33130",
    "33140","33144","33150","33160","33164","33180","33190","33194","33200","33210",
    "33220","33230","33240","33250","33260","33270","33280","33410","33420","33430",
    "33440","33450","33460"
  ].forEach(function (s) { PREOWNED[s] = 1; });

  /* ---- Seiten, die NIE angefasst werden duerfen (Router-Schutz) ---- */
  function isBlockedPage() {
    var p = location.pathname;
    return /(^|\/)(cart|checkout)(\/|$)/.test(p) || /\/pages\//.test(p);
  }

  /* ---- Sprache aus dem Pfad (wie Megamenu) ---- */
  function lang() {
    var p = location.pathname;
    if (/^\/de(\/|$)/.test(p)) return "de";
    if (/^\/el(\/|$)/.test(p)) return "el";
    var h = (document.documentElement.lang || "").toLowerCase();
    if (h.indexOf("de") === 0) return "de";
    if (h.indexOf("el") === 0) return "el";
    return "en";
  }
  function pick(o) { return o[lang()] || o.en; }

  /* ---- Attribut-Titel, die als Kundentext NIE sichtbar sein duerfen ---- */
  var HIDE_ATTR = /^\s*(Lizenzform|Eyebrow|Titel|Edition|Kerne|Limits)\s*:/;

  /* ---- Ableitung Lizenzform -> Zustand + Chip ---- */
  var LF = {
    Retail:  { zustand: "Neu",       akt: "Online",     chip: { de: "Retail \u00b7 Vollversion",   en: "Retail \u00b7 full version",   el: "Retail \u00b7 \u03c0\u03bb\u03ae\u03c1\u03b7\u03c2 \u03ad\u03ba\u03b4\u03bf\u03c3\u03b7" },
               ltyp: { de: "Retail",           en: "Retail",           el: "Retail" } },
    CSP:     { zustand: "Neu",       akt: "Admin Center", chip: { de: "Volumenlizenz \u00b7 CSP",  en: "Volume licence \u00b7 CSP",    el: "\u0386\u03b4\u03b5\u03b9\u03b1 Volume \u00b7 CSP" },
               ltyp: { de: "Volumen (CSP)",    en: "Volume (CSP)",     el: "Volume (CSP)" } },
    OEM:     { zustand: "Neu",       akt: "Online",     chip: { de: "OEM \u00b7 System Builder",   en: "OEM \u00b7 System Builder",    el: "OEM \u00b7 System Builder" },
               ltyp: { de: "OEM (System Builder)", en: "OEM (System Builder)", el: "OEM (System Builder)" } },
    Volumen: { zustand: "Pre-Owned", akt: "MAK / KMS",  chip: { de: "Volumenlizenz \u00b7 MAK",    en: "Volume licence \u00b7 MAK",    el: "\u0386\u03b4\u03b5\u03b9\u03b1 Volume \u00b7 MAK" },
               ltyp: { de: "Volumen (Pre-Owned)", en: "Volume (pre-owned)", el: "Volume (Pre-Owned)" } }
  };
  var T = {
    perp: { de: "Dauerlizenz",  en: "Perpetual licence", el: "\u039c\u03cc\u03bd\u03b9\u03bc\u03b7 \u03ac\u03b4\u03b5\u03b9\u03b1" },
    mult: { de: "Mehrsprachig", en: "Multilingual",      el: "\u03a0\u03bf\u03bb\u03cd\u03b3\u03bb\u03c9\u03c3\u03c3\u03bf" },
    bits: { de: "64-Bit",       en: "64-bit",            el: "64-bit" },
    newB: { de: "Neu",          en: "New",               el: "\u039d\u03ad\u03b1" },
    poB:  { de: "Pre-Owned",    en: "Pre-Owned",         el: "Pre-Owned" },
    perm2:{ de: "Dauerhaft",    en: "Permanent",         el: "\u039c\u03cc\u03bd\u03b9\u03bc\u03b7" },
    kEd:  { de: "Edition",      en: "Edition",           el: "\u0388\u03ba\u03b4\u03bf\u03c3\u03b7" },
    kCo:  { de: "Kerne",        en: "Cores",             el: "\u03a0\u03c5\u03c1\u03ae\u03bd\u03b5\u03c2" },
    kLt:  { de: "Lizenztyp",    en: "Licence type",      el: "\u03a4\u03cd\u03c0\u03bf\u03c2 \u03ac\u03b4\u03b5\u03b9\u03b1\u03c2" },
    kLa:  { de: "Sprache",      en: "Language",          el: "\u0393\u03bb\u03ce\u03c3\u03c3\u03b1" },
    kAk:  { de: "Aktivierung",  en: "Activation",        el: "\u0395\u03bd\u03b5\u03c1\u03b3\u03bf\u03c0\u03bf\u03af\u03b7\u03c3\u03b7" },
    kLz:  { de: "Lizenz",       en: "Licence",           el: "\u0386\u03b4\u03b5\u03b9\u03b1" },
    kLm:  { de: "Limits",       en: "Limits",            el: "\u038c\u03c1\u03b9\u03b1" }
  };

  function skuOf(card) {
    var el = card.querySelector(".grid-product__sku");
    if (!el) return null;
    var m = (el.textContent || "").match(/(\d{4,6})/);   // "SKU: 33000" / "Art.-Nr.: 33000"
    return m ? m[1] : null;
  }

  function mark(card) {
    if (card.querySelector(".sof-cond")) return;          // idempotent
    var sku = skuOf(card);
    if (!sku || !PREOWNED[sku]) return;

    var box = card.querySelector(".grid-product__label");
    if (!box) {                                           // Karte ohne Ribbon: Container anlegen
      var wrap = card.querySelector(".grid-product__image-wrap");
      if (!wrap) return;
      box = document.createElement("div");
      box.className = "grid-product__label";
      wrap.appendChild(box);
    }
    box.classList.add("sof-cond-box");

    var el = document.createElement("div");
    el.className = "ec-label label--custom sof-cond";     // erbt Ecwids Label-Geometrie
    var txt = document.createElement("div");
    txt.className = "label_text";
    txt.textContent = LABEL;
    el.appendChild(txt);
    box.appendChild(el);                                  // unter das Ribbon
  }

  /* ---- Panel-Bausteine ---- */
  function esc(x){ return (x==null?"":String(x)).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

  /* liest ein Panel-Attribut ("Titel", "Eyebrow", ...) live aus dem DOM */
  function attr(name) {
    var re = new RegExp("^\\s*" + name + "\\s*:");
    var rows = document.querySelectorAll(".details-product-attribute");
    for (var i = 0; i < rows.length; i++) {
      var t = rows[i].querySelector(".details-product-attribute__title");
      var v = rows[i].querySelector(".details-product-attribute__value");
      if (t && v && re.test(t.textContent || "")) return (v.textContent || "").trim();
    }
    return null;
  }

  /* alle Panel-Attributzeilen ausblenden (Hersteller bleibt sichtbar) */
  function hideAttrRows() {
    var rows = document.querySelectorAll(".details-product-attribute");
    for (var i = 0; i < rows.length; i++) {
      var t = rows[i].querySelector(".details-product-attribute__title");
      if (t && HIDE_ATTR.test(t.textContent || "")) rows[i].classList.add("sof-attr");
    }
  }

  function buildHead() {
    var side = document.querySelector(".product-details__sidebar");
    if (!side) return;
    if (side.querySelector(".sof-panel-head")) return;      // idempotent
    var eyebrow = attr("Eyebrow"), titel = attr("Titel");
    if (!eyebrow && !titel) return;                          // kein Panel-Produkt
    if (titel) titel = titel.replace(/\s*\u00b7\s*/g, " ").trim();  // "Standard \u00b7 16-Core" -> "Standard 16-Core"

    var lf = window.sofLizenzform();
    var info = lf && LF[lf] ? LF[lf] : null;
    var isPO = info && info.zustand === "Pre-Owned";

    var tchips = [pick(T.bits), pick(T.mult), pick(T.perp)]
      .map(function (x) { return '<span>'+esc(x)+'</span>'; }).join("");
    var badge = info
      ? '<span class="sof-bdg '+(isPO?"pre":"new")+'">'+esc(isPO?pick(T.poB):pick(T.newB))+'</span>'
      : "";
    var lfchip = info ? '<span class="sof-bdg ch">'+esc(pick(info.chip))+'</span>' : "";

    var head = document.createElement("div");
    head.className = "sof-panel-head";
    head.innerHTML =
      (eyebrow ? '<div class="sof-eyebrow">'+esc(eyebrow)+'</div>' : "") +
      (titel   ? '<div class="sof-title">'+esc(titel)+'</div>'   : "") +
      '<div class="sof-tchips">'+tchips+'</div>' +
      '<div class="sof-badges">'+badge+lfchip+'</div>';

    var h1 = side.querySelector(".product-details__product-title");
    var sku = side.querySelector(".product-details__product-sku");
    var ref = sku || h1;
    if (ref && ref.parentNode) ref.parentNode.insertBefore(head, ref.nextSibling);
    else side.insertBefore(head, side.firstChild);
    side.classList.add("sof-panel-on");                     // CSS versteckt nativen h1
    fitTitle(head.querySelector(".sof-title"));
    buildFacts(side, info);
  }

  /* Titel schrittweise verkleinern, bis er in EINE Zeile passt (kein Umbruch) */
  function fitTitle(el) {
    if (!el) return;
    var sizes = [27, 25, 23, 21, 19];
    for (var i = 0; i < sizes.length; i++) {
      el.style.setProperty("font-size", sizes[i] + "px", "important");
      el.style.setProperty("white-space", "nowrap", "important");
      if (el.scrollWidth <= el.clientWidth) return;         // passt
    }
    el.style.setProperty("white-space", "normal", "important"); // Notfall: doch umbrechen
  }

  /* ---- Etappe 2: Facts-Grid im Kopf ---- */
  function fact(k, v) {
    return '<div class="sof-f"><div class="sof-fk">'+esc(k)+'</div><div class="sof-fv">'+esc(v)+'</div></div>';
  }
  function buildFacts(side, info) {
    var head = side.querySelector(".sof-panel-head");
    if (!head || head.querySelector(".sof-facts")) return;   // idempotent, im Kopf verankert

    var ed = attr("Edition"), co = attr("Kerne"), lm = attr("Limits");
    var rows = "";
    if (ed) rows += fact(pick(T.kEd), ed);
    if (co) rows += fact(pick(T.kCo), co);
    if (info) rows += fact(pick(T.kLt), pick(info.ltyp));
    rows += fact(pick(T.kLa), pick(T.mult));               // Sprache: konstant Mehrsprachig
    if (info) rows += fact(pick(T.kAk), info.akt);
    rows += fact(pick(T.kLz), pick(T.perm2));              // Lizenz: konstant Dauerhaft
    if (lm) rows += fact(pick(T.kLm), lm);
    if (!rows) return;

    var box = document.createElement("div");
    box.className = "sof-facts";
    box.innerHTML = rows;
    head.appendChild(box);                                 // ans Ende des Kopfes
  }

  /* Produktseite: Lizenzform live aus dem DOM lesen. Nie cachen. */
  function readLizenzform() {
    var rows = document.querySelectorAll(".details-product-attribute");
    for (var i = 0; i < rows.length; i++) {
      var t = rows[i].querySelector(".details-product-attribute__title");
      var v = rows[i].querySelector(".details-product-attribute__value");
      if (!t || !v) continue;                       // Zeile gerade im Re-Render
      if (!/^\s*Lizenzform\s*:/.test(t.textContent || "")) continue;
      return { row: rows[i], value: (v.textContent || "").trim() };
    }
    return null;
  }
  window.sofLizenzform = function () {
    var hit = readLizenzform();
    return hit ? hit.value : null;
  };

  /* ---- Kern: einmal scannen. Guard schuetzt Router-Seiten. ---- */
  function scan() {
    if (isBlockedPage()) return;                     // Cart/Checkout/Pages nie anfassen
    var cards = document.querySelectorAll(".grid-product");
    for (var i = 0; i < cards.length; i++) mark(cards[i]);
    hideAttrRows();
    buildHead();
  }

  /* Nach einem Page-Event kann das DOM noch nachladen. Statt Dauer-Observer:
     ein paar rAF-getaktete Wiederholungen, dann Stopp. Beruehrt nur Karten /
     Sidebar; laeuft nicht waehrend, sondern nach der Hydration. */
  function scanBurst() {
    if (isBlockedPage()) return;
    var tries = 0, max = 20;                         // ~20 Frames (<0.4s), dann fertig
    (function step() {
      scan();
      // fertig, sobald Panel steht ODER es keine Produktseite ist und Karten da sind
      var side = document.querySelector(".product-details__sidebar");
      var panelDone = side ? side.querySelector(".sof-panel-head") : true;
      if (panelDone || ++tries >= max) return;
      requestAnimationFrame(step);
    })();
  }

  function boot() {
    scanBurst();
    if (window.Ecwid && Ecwid.OnPageLoaded) Ecwid.OnPageLoaded.add(scanBurst);
    if (window.Ecwid && Ecwid.OnPageSwitch) Ecwid.OnPageSwitch.add(function () {
      // Bei jedem Seitenwechsel neu: alte Panel-Referenz ist weg, neu aufbauen
      scanBurst();
    });
  }

  if (document.body) boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();
