/* =====================================================================
   SOFTANO.EU — ZUSTAND-BADGE v7 (Phase 1: nur Volumen-Server, 33 SKUs)
   Setzt "Pre-Owned" als zweites Label unter das "Live Delivery"-Ribbon
   auf Produktkarten in Kategorie-Listen.
   Quelle: generierte SKU-Liste (Klassifizierung v3, Zustand=Pre-Owned).
   Greift NICHT ins Homepage-Karussell (dort steht keine SKU im DOM).
   v2: haengt sich in .grid-product__label statt frei ueber die Karte.
   v3: blendet auf der Produktseite die Attributzeile "Lizenzform" aus
       (Ecwid rendert keine pro-Attribut-Klasse -> Textmatch noetig) und
       (Ecwid rendert keine pro-Attribut-Klasse -> Textmatch noetig).
   v5: KEIN globaler Cache mehr (Stale-Bug behoben, live aus DOM lesen).
   v7: Panel-Kopf an Prototyp-Optik angeglichen (bdg/tchips-Klassen).
   v6: CI-PANEL Etappe 1 (Kopf). Versteckt alle Panel-Attributzeilen ausser
       Hersteller, rendert Eyebrow/Titel-Split + Zustand-Badge + Lizenzform-
       Chip + statische Chips oberhalb des Preises. Attribute aus dem DOM.
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
    Retail:  { zustand: "Neu",       chip: { de: "Retail · Vollversion",   en: "Retail · full version",   el: "Retail · πλήρης έκδοση" } },
    CSP:     { zustand: "Neu",       chip: { de: "Volumenlizenz · CSP",    en: "Volume licence · CSP",    el: "Άδεια Volume · CSP" } },
    OEM:     { zustand: "Neu",       chip: { de: "OEM · System Builder",   en: "OEM · System Builder",    el: "OEM · System Builder" } },
    Volumen: { zustand: "Pre-Owned", chip: { de: "Volumenlizenz · MAK",    en: "Volume licence · MAK",    el: "Άδεια Volume · MAK" } }
  };
  var T = {
    perp: { de: "Dauerlizenz",  en: "Perpetual licence", el: "Μόνιμη άδεια" },
    mult: { de: "Mehrsprachig", en: "Multilingual",      el: "Πολύγλωσσο" },
    bits: { de: "64-Bit",       en: "64-bit",            el: "64-bit" },
    newB: { de: "Neu",          en: "New",               el: "Νέα" },
    poB:  { de: "Pre-Owned",    en: "Pre-Owned",         el: "Pre-Owned" }
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

  /* Datenquelle fuer Phase 2 (CI-Panel): immer aktuell, nie stale. */
  window.sofLizenzform = function () {
    var hit = readLizenzform();
    return hit ? hit.value : null;
  };

  function scan() {
    var cards = document.querySelectorAll(".grid-product");
    for (var i = 0; i < cards.length; i++) mark(cards[i]);
    hideAttrRows();
    buildHead();
  }

  var pending = false;
  function sched() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () { pending = false; scan(); });
  }

  function boot() {
    scan();
    new MutationObserver(sched).observe(document.body, { childList: true, subtree: true });
    if (window.Ecwid && Ecwid.OnPageLoaded) Ecwid.OnPageLoaded.add(sched);
    if (window.Ecwid && Ecwid.OnPageSwitch) Ecwid.OnPageSwitch.add(sched);
  }

  if (document.body) boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();
