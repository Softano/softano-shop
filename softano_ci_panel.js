/* =====================================================================
   SOFTANO.EU — CI-PANEL v15 (Custom-App-Variante, hydration-safe)
   ---------------------------------------------------------------------
   Auslieferung ueber Custom App #2 (custom-app-123703327-2) mit Scope
   customize_storefront. KEIN DOM-Eingriff ausserhalb der Sidebar.

   Gegenueber v13 geaendert:
   1. CHIP "Lizenzmodell" ENTFAELLT im Panel. Grund: Der Wert
      ("Dauerlizenz") stand wortgleich in der Chip-Leiste unter der
      Beschreibung, nur wenige Zentimeter darunter — zwei fast gleiche
      Chip-Reihen sahen nach einem Darstellungsfehler aus. Das Merkmal
      bleibt in HIDE_KEYS, wird also weiterhin aus der Rohliste
      ausgeblendet: die Angabe steht bereits zweimal im
      Beschreibungstext, eine dritte Stelle waere zu viel.
      Uebrig im Panel: Plattform und Sprachversion.
   2. ZERTIFIKAT-HINWEIS bei Pre-Owned. Direkt unter den Badges,
      oberhalb des Preises. Erscheint nur, wenn das Merkmal "Zustand"
      auf Pre-Owned/Refurbished steht — bei Neuware gar nicht.
      v15 (07.09.): Text gekuerzt, damit er in der ~340px breiten
      Seitenspalte in ALLEN drei Sprachen einzeilig bleibt, ohne die
      Schrift verkleinern zu muessen. "des Vorbesitzers" entfaellt —
      steht ausfuehrlich im Abschnitt "Rechtssichere Gebrauchtsoftware".
   3. Sonst unveraendert gegenueber v13.

   AUFTEILUNG (in ATTR/PANEL unten in einer Zeile aenderbar):
     Kopf   : Produktlinie, Variante
     Badges : Zustand, Lizenzform
     Hinweis: Loeschungszertifikat (nur Pre-Owned)
     Chips  : Plattform, Sprachversion
     Facts  : Edition, Lizenzumfang, Lizenzform, Aktivierung,
              Downgrade-Rechte, Nutzungsdauer

   CSS: v5.13 / v5.14b / v5.15 unveraendert, NEU v5.24 (Merkmalsliste,
   Zertifikat-Hinweis, Schatten) im Ecwid-Custom-CSS-Feld.
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

  /* ---- Die Anzeigenamen der Merkmale in allen drei Sprachen. ---- */
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

  /* Alles, was das Panel selbst zeigt ODER bewusst unterdrueckt, wird aus
     der Rohliste entfernt. "model" steht hier weiterhin drin, obwohl es
     seit v14 keinen Chip mehr gibt — siehe Kopfkommentar Punkt 1. */
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

  /* ---- Zertifikat-Hinweis, nur bei Pre-Owned (v14) ---- */
  var CERT = {
    de: "Inkl. Lizenz- und Löschungszertifikat",
    en: "Incl. licence and deletion certificate",
    el: "Πιστοποιητικό άδειας & διαγραφής"
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

    /* v14: nur noch Plattform und Sprachversion. Leere fallen weg. */
    var tchips = [attr("platform"), attr("language")]
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

    /* v14: Zertifikat-Hinweis, ausschliesslich bei Pre-Owned */
    var cert = isPO
      ? '<div class="sof-cert"><span class="sof-cert-ic" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" ' +
        'stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
        'stroke-linejoin="round"><path d="M9 12l2 2 4-4"/>' +
        '<circle cx="12" cy="12" r="9"/></svg></span>' +
        '<span class="sof-cert-tx">' + esc(pick(CERT)) + "</span></div>"
      : "";

    var head = document.createElement("div");
    head.className = "sof-panel-head";
    head.innerHTML =
      (eyebrow ? '<div class="sof-eyebrow">' + esc(eyebrow) + "</div>" : "") +
      (titel   ? '<div class="sof-title">'   + esc(titel)   + "</div>" : "") +
      (tchips  ? '<div class="sof-tchips">'  + tchips  + "</div>" : "") +
      (badge || lfchip
        ? '<div class="sof-badges">' + badge + lfchip + "</div>" : "") +
      cert;

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
