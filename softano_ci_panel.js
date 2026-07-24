/* =====================================================================
   SOFTANO.EU — CI-PANEL v12 (Custom-App-Variante, hydration-safe)
   ---------------------------------------------------------------------
   AUSLIEFERUNG NEU: NICHT mehr über das Instant-Site-Custom-JS-Feld,
   sondern über eine Custom-App mit Scope customize_storefront. Ecwid lädt
   das Script dann im Storefront-Lifecycle (via app.ecwid.com/script.js?ID),
   nicht daneben — der von Ecwid empfohlene, router-sichere Weg.

   Gegenüber v11 geändert:
   - Card-Badge (Pre-Owned auf Kategorie-Karten) ENTFERNT: wird jetzt nativ
     über Ecwid-Ribbons gelöst. Kein Eingriff mehr ins Kategorie-Grid.
   - boot() wartet auf Ecwid.OnAPILoaded und registriert erst dann die
     Seiten-Hooks (OnPageLoaded/OnPageSwitch). Sauberer Einstieg im
     Custom-App-Kontext.
   - Panel-Logik (Eyebrow/Titel-Split, Tech-Chips, Facts-Grid, Attribut-
     Ausblendung, sofLizenzform) UNVERÄNDERT gegenüber v11.

   Router-Schutz bleibt: /cart, /checkout, /pages/ werden nie angefasst;
   Änderungen laufen NUR nach der Hydration (OnPageLoaded), ausschließlich an
   der Produkt-Sidebar; idempotent; bounded rAF-Nachzieh-Check.
   ===================================================================== */
(function () {
  "use strict";
  if (window.__SOF_PANEL__) return;
  window.__SOF_PANEL__ = true;

  /* ---- Seiten, die NIE angefasst werden dürfen (Router-Schutz) ---- */
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

  /* ---- Attribut-Titel, die als Kundentext NIE sichtbar sein dürfen ---- */
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

  /* ---- Facts-Grid im Kopf ---- */
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

  /* ---- Kern: einmal scannen. Guard schützt Router-Seiten. Nur Sidebar. ---- */
  function scan() {
    if (isBlockedPage()) return;                     // Cart/Checkout/Pages nie anfassen
    hideAttrRows();
    buildHead();
  }

  /* Nach einem Page-Event kann das DOM noch nachladen. Statt Dauer-Observer:
     ein paar rAF-getaktete Wiederholungen, dann Stopp. Berührt nur die
     Sidebar; läuft nicht während, sondern nach der Hydration. */
  function scanBurst() {
    if (isBlockedPage()) return;
    var tries = 0, max = 20;                         // ~20 Frames (<0.4s), dann fertig
    (function step() {
      scan();
      var side = document.querySelector(".product-details__sidebar");
      var panelDone = side ? side.querySelector(".sof-panel-head") : true;
      if (panelDone || ++tries >= max) return;
      requestAnimationFrame(step);
    })();
  }

  /* ---- Boot: erst wenn die Ecwid-JS-API bereit ist, Seiten-Hooks setzen.
     OnPageLoaded/OnPageSwitch feuern NACH der Hydration -> router-sicher. ---- */
  function register() {
    if (Ecwid.OnPageLoaded) Ecwid.OnPageLoaded.add(scanBurst);
    if (Ecwid.OnPageSwitch) Ecwid.OnPageSwitch.add(scanBurst);
    // Falls das Script erst nach dem ersten OnPageLoaded geladen wurde und die
    // Produktseite bereits steht: einmal sicher nachziehen (nie während Hydration,
    // da die Sidebar dann schon gerendert ist).
    if (document.querySelector(".product-details__sidebar")) scanBurst();
  }
  function boot() {
    if (window.Ecwid && Ecwid.OnAPILoaded) { Ecwid.OnAPILoaded.add(register); return; }
    // Fallback (im Custom-App-Kontext eigentlich nicht nötig)
    var n = 0;
    (function wait() {
      if (window.Ecwid && Ecwid.OnAPILoaded) { Ecwid.OnAPILoaded.add(register); return; }
      if (n++ < 100) setTimeout(wait, 100);
    })();
  }

  if (document.body) boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();
