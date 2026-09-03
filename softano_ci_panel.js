/* =====================================================================
   SOFTANO.EU — CI-PANEL v13 (Custom-App-Variante, hydration-safe)
   ---------------------------------------------------------------------
   Auslieferung wie v12: ueber eine Custom App mit Scope
   customize_storefront. Ecwid laedt das Script im Storefront-Lifecycle
   (via app.ecwid.com/script.js?ID), nicht daneben — der router-sichere
   Weg. KEIN DOM-Eingriff ausserhalb der Sidebar.

   Gegenueber v12 geaendert:
   - MERKMALSNAMEN: v12 suchte nach "Eyebrow", "Titel", "Kerne", "Limits".
     Diese Anzeigenamen gibt es nicht mehr. Neu wird nach allen drei
     Sprachfassungen gesucht, damit das Panel unabhaengig davon
     funktioniert, in welcher Sprache die Seite laeuft.
   - ECHTE WERTE STATT ANNAHMEN: v12 verdrahtete Sprache ("Mehrsprachig"),
     Lizenz ("Dauerhaft"), Architektur ("64-Bit") und die Aktivierung
     ueber eine Tabelle je Lizenzform fest. Alle vier stehen inzwischen
     als gepflegte Merkmale am Produkt und werden jetzt ausgelesen. Damit
     stimmt das Panel auch bei Abonnements (Proxmox) und bei Produkten
     ohne Lizenzform.
   - ZUSTAND: kommt jetzt aus dem Merkmal "Zustand" statt aus der
     Lizenzform abgeleitet zu werden. Wirkt dadurch auch bei den 77
     Produkten ohne Lizenzform.
   - "64-Bit" als Chip entfaellt ersatzlos: dafuer gibt es kein Merkmal,
     die Angabe waere eine unbelegte Behauptung.

   AUFTEILUNG (in ATTR/PANEL unten in einer Zeile aenderbar):
     Kopf   : Produktlinie, Variante
     Badges : Zustand, Lizenzform
     Chips  : Plattform, Sprachversion, Lizenzmodell
     Facts  : Edition, Lizenzumfang, Lizenzform, Aktivierung,
              Downgrade-Rechte, Nutzungsdauer
   Alles davon wird aus der nativen Attributliste ausgeblendet, damit
   nichts doppelt auf der Seite steht. Was NICHT im Panel landet, bleibt
   als Datenblatt unter der Beschreibung stehen: Hersteller,
   Produktfamilie, Version, Lizenzierung, Lieferart, Lieferumfang,
   Support & Updates.

   CSS: unveraendert v5.13 / v5.14b / v5.15 im Ecwid-Custom-CSS-Feld.
   ===================================================================== */
(function () {
  "use strict";

  /* ---- Router-Seiten nie anfassen ---- */
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

  /* ---- Die Anzeigenamen der Merkmale in allen drei Sprachen.
     Gesucht wird immer gegen ALLE Fassungen, nicht nur gegen die der
     aktuellen Sprache — so bleibt das Panel stabil, falls die
     Spracherkennung und der tatsaechlich gerenderte Name auseinander-
     laufen (z. B. auf praefixlosen Seiten). ---- */
  var ATTR = {
    line:      ["Product line", "Produktlinie", "Σειρά προϊόντος"],
    variant:   ["Variant", "Variante", "Παραλλαγή"],
    condition: ["Condition", "Zustand", "Κατάσταση"],
    channel:   ["Licence channel", "Lizenzform", "Κανάλι αδειοδότησης"],
    edition:   ["Edition", "Edition", "Edition"],
    quantity:  ["Licence quantity", "Lizenzumfang", "Εύρος αδειοδότησης",
                "Ποσότητα άδειας"],
    platform:  ["Platform", "Plattform", "Πλατφόρμα"],
    language:  ["Interface language", "Sprachversion", "Γλώσσα διεπαφής"],
    model:     ["Licence model", "Lizenzmodell", "Μοντέλο άδειας"],
    activation:["Activation", "Aktivierung", "Ενεργοποίηση"],
    downgrade: ["Downgrade rights", "Downgrade-Rechte",
                "Δικαιώματα downgrade"],
    term:      ["Licence term", "Nutzungsdauer", "Διάρκεια χρήσης"]
  };

  /* Alles, was das Panel selbst zeigt, wird aus der Rohliste entfernt. */
  var HIDE_KEYS = ["line", "variant", "condition", "channel", "edition",
                   "quantity", "platform", "language", "model",
                   "activation", "downgrade", "term"];

  /* ---- Beschriftungen im Facts-Grid ---- */
  var T = {
    kEd: { de: "Edition",          en: "Edition",          el: "Edition" },
    kQt: { de: "Lizenzumfang",     en: "Licence quantity", el: "Εύρος αδειοδότησης" },
    kLt: { de: "Lizenzform",       en: "Licence channel",  el: "Κανάλι αδειοδότησης" },
    kAk: { de: "Aktivierung",      en: "Activation",       el: "Ενεργοποίηση" },
    kDg: { de: "Downgrade-Rechte", en: "Downgrade rights", el: "Δικαιώματα downgrade" },
    kTe: { de: "Nutzungsdauer",    en: "Licence term",     el: "Διάρκεια χρήσης" }
  };

  /* ---- Zustand: welcher Wert bedeutet gebraucht? ---- */
  var PRE_OWNED = /^(pre-?owned|refurbished)/i;

  function esc(x) {
    return (x == null ? "" : String(x))
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* Prueft, ob eine Attribut-Ueberschrift zu einem Schluessel gehoert.
     Ecwid rendert "Name:" — der Doppelpunkt wird mitgeprueft. */
  function matches(title, key) {
    var t = (title || "").replace(/\s*:\s*$/, "").trim();
    var names = ATTR[key];
    for (var i = 0; i < names.length; i++) {
      if (t === names[i]) return true;
    }
    return false;
  }

  /* liest ein Panel-Merkmal live aus dem DOM */
  function attr(key) {
    var rows = document.querySelectorAll(".details-product-attribute");
    for (var i = 0; i < rows.length; i++) {
      var t = rows[i].querySelector(".details-product-attribute__title");
      var v = rows[i].querySelector(".details-product-attribute__value");
      if (!t || !v) continue;                       // Zeile gerade im Re-Render
      if (matches(t.textContent, key)) return (v.textContent || "").trim();
    }
    return null;
  }

  /* Rohzeilen ausblenden, die das Panel selbst zeigt */
  function hideAttrRows() {
    var rows = document.querySelectorAll(".details-product-attribute");
    for (var i = 0; i < rows.length; i++) {
      var t = rows[i].querySelector(".details-product-attribute__title");
      if (!t) continue;
      for (var k = 0; k < HIDE_KEYS.length; k++) {
        if (matches(t.textContent, HIDE_KEYS[k])) {
          rows[i].classList.add("sof-attr");
          break;
        }
      }
    }
  }

  function buildHead() {
    var side = document.querySelector(".product-details__sidebar");
    if (!side) return;
    if (side.querySelector(".sof-panel-head")) return;      // idempotent

    var eyebrow = attr("line"), titel = attr("variant");
    if (!eyebrow && !titel) return;                          // kein Panel-Produkt
    if (titel) titel = titel.replace(/\s*·\s*/g, " ").trim(); // "Standard · 16-Core"

    var zustand = attr("condition");
    var isPO = zustand ? PRE_OWNED.test(zustand) : false;

    /* Chips: nur echte Werte, keine Annahmen. Leere fallen weg. */
    var tchips = [attr("platform"), attr("language"), attr("model")]
      .filter(function (x) { return !!x; })
      .map(function (x) { return "<span>" + esc(x) + "</span>"; })
      .join("");

    var badge = zustand
      ? '<span class="sof-bdg ' + (isPO ? "pre" : "new") + '">' +
        esc(zustand) + "</span>"
      : "";

    var kanal = attr("channel");
    var lfchip = kanal
      ? '<span class="sof-bdg ch">' + esc(kanal) + "</span>"
      : "";

    var head = document.createElement("div");
    head.className = "sof-panel-head";
    head.innerHTML =
      (eyebrow ? '<div class="sof-eyebrow">' + esc(eyebrow) + "</div>" : "") +
      (titel   ? '<div class="sof-title">'   + esc(titel)   + "</div>" : "") +
      (tchips  ? '<div class="sof-tchips">'  + tchips  + "</div>" : "") +
      (badge || lfchip
        ? '<div class="sof-badges">' + badge + lfchip + "</div>" : "");

    var h1  = side.querySelector(".product-details__product-title");
    var sku = side.querySelector(".product-details__product-sku");
    var ref = sku || h1;
    if (ref && ref.parentNode) ref.parentNode.insertBefore(head, ref.nextSibling);
    else side.insertBefore(head, side.firstChild);
    side.classList.add("sof-panel-on");                     // CSS versteckt nativen h1
    fitTitle(head.querySelector(".sof-title"));
    buildFacts(side);
  }

  /* Titel schrittweise verkleinern, bis er in EINE Zeile passt */
  function fitTitle(el) {
    if (!el) return;
    var sizes = [27, 25, 23, 21, 19];
    for (var i = 0; i < sizes.length; i++) {
      el.style.setProperty("font-size", sizes[i] + "px", "important");
      el.style.setProperty("white-space", "nowrap", "important");
      if (el.scrollWidth <= el.clientWidth) return;
    }
    el.style.setProperty("white-space", "normal", "important");
  }

  /* ---- Facts-Grid im Kopf ---- */
  function fact(k, v) {
    return '<div class="sof-f"><div class="sof-fk">' + esc(k) +
           '</div><div class="sof-fv">' + esc(v) + "</div></div>";
  }
  function buildFacts(side) {
    var head = side.querySelector(".sof-panel-head");
    if (!head || head.querySelector(".sof-facts")) return;  // idempotent

    var paare = [
      [T.kEd, attr("edition")],
      [T.kQt, attr("quantity")],
      [T.kLt, attr("channel")],
      [T.kAk, attr("activation")],
      [T.kDg, attr("downgrade")],
      [T.kTe, attr("term")]
    ];
    var rows = "";
    for (var i = 0; i < paare.length; i++) {
      if (paare[i][1]) rows += fact(pick(paare[i][0]), paare[i][1]);
    }
    if (!rows) return;

    var box = document.createElement("div");
    box.className = "sof-facts";
    box.innerHTML = rows;
    head.appendChild(box);                                  // ans Ende des Kopfes
  }

  /* Rueckwaertskompatibel: andere Skripte durften window.sofLizenzform()
     abfragen. Bleibt erhalten, liest jetzt ueber die neuen Namen. */
  window.sofLizenzform = function () { return attr("channel"); };

  /* ---- Kern: einmal scannen. Guard schuetzt Router-Seiten. Nur Sidebar. ---- */
  function scan() {
    if (isBlockedPage()) return;
    hideAttrRows();
    buildHead();
  }

  /* Nach einem Page-Event kann das DOM noch nachladen. Statt Dauer-Observer:
     ein paar rAF-getaktete Wiederholungen, dann Stopp. */
  function scanBurst() {
    if (isBlockedPage()) return;
    var tries = 0, max = 20;
    (function step() {
      scan();
      var side = document.querySelector(".product-details__sidebar");
      var panelDone = side ? side.querySelector(".sof-panel-head") : true;
      if (panelDone || ++tries >= max) return;
      requestAnimationFrame(step);
    })();
  }

  /* ---- Boot: erst wenn die Ecwid-JS-API bereit ist ---- */
  function register() {
    if (Ecwid.OnPageLoaded) Ecwid.OnPageLoaded.add(scanBurst);
    if (Ecwid.OnPageSwitch) Ecwid.OnPageSwitch.add(scanBurst);
    if (document.querySelector(".product-details__sidebar")) scanBurst();
  }
  function boot() {
    if (window.Ecwid && Ecwid.OnAPILoaded) { Ecwid.OnAPILoaded.add(register); return; }
    var n = 0;
    (function wait() {
      if (window.Ecwid && Ecwid.OnAPILoaded) { Ecwid.OnAPILoaded.add(register); return; }
      if (n++ < 100) setTimeout(wait, 100);
    })();
  }

  if (document.body) boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();
