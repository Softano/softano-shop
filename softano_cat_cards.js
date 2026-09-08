/* =====================================================================
   SOFTANO.EU — KATEGORIE-KACHELN v4 (08.09.2026)
   ---------------------------------------------------------------------
   Einbindung: Website -> Design -> JavaScript-Code, EINE Zeile:
     <script src="https://cdn.jsdelivr.net/gh/Softano/softano-shop@HASH/
                  softano_cat_cards.js" defer></script>
   Das Feld ist zeichenbegrenzt, deshalb liegt der Code hier und nicht dort.

   WAS ES TUT
   Ecwid rendert in der Kachel nur Bild, Ribbon, Name, SKU, Preis und
   Knopf. Der Name traegt die gesamte Technik als Fliesstext ueber sechs
   Zeilen ("... 16-Core OEM 64Bit Mehrsprachig Dauerlizenz") — lesbar,
   aber nicht erfassbar.

   Dieses Skript ersetzt die ANZEIGE des Namens durch die Struktur der
   Produktseite: Produktlinie klein und tuerkis, Variante gross, darunter
   Edition, Lizenzumfang und Lizenzform als Chips.

   Der Produktname im Katalog wird NICHT angetastet. Er bleibt fuer
   Suche, Rechnungen, Lizenzzertifikate und Suchmaschinen vollstaendig
   erhalten — er wird nur optisch ersetzt und bleibt als title-Attribut
   und fuer Vorlesegeraete lesbar.

   WOHER DIE WERTE KOMMEN
   Aus einer EINZIGEN Abfrage pro Seite an die Ecwid-Schnittstelle, mit
   dem oeffentlichen Token der Custom App und lang= aus dem Pfad. Die
   Werte kommen dadurch bereits uebersetzt zurueck; keine eigene
   Uebersetzungstabelle noetig.

   BEKANNTE EIGENHEIT: "Licence channel" und das Altmerkmal "Lizenzform"
   liefern denselben Wert. Doppelte Chips werden deshalb aussortiert,
   sonst stuende dort "CSP · CSP".
   ===================================================================== */
(function () {
  "use strict";

  var STORE = "123703327";
  var APP   = "custom-app-123703327-2";

  /* Nur Kategorie- und Suchseiten. Warenkorb und Kasse nie anfassen. */
  function isBlockedPage() {
    var p = location.pathname;
    return /(^|\/)(cart|checkout)(\/|$)/.test(p) || /\/pages\//.test(p);
  }

  function lang() {
    var p = location.pathname;
    if (/^\/de(\/|$)/.test(p)) return "de";
    if (/^\/el(\/|$)/.test(p)) return "el";
    return "en";
  }

  /* Anzeigenamen der Merkmale je Sprache. Reihenfolge = Chip-Reihenfolge.
     Mehrere Schreibweisen je Eintrag, weil die Anzeigenamen im Backend
     schon einmal abwichen (siehe Panel v16, griechische Fassung). */
  var KEYS = {
    de: [["Edition"], ["Lizenzumfang"], ["Lizenzform", "Licence channel"]],
    en: [["Edition"], ["Licence quantity"], ["Licence channel"]],
    el: [["Edition"], ["Εύρος αδειοδότησης", "Ποσότητα άδειας"],
         ["Κανάλι αδειοδότησης", "Lizenzform"]]
  };
  var LINE    = { de: "Produktlinie", en: "Product line", el: "Σειρά" };
  var VARIANT = { de: "Variante",     en: "Variant",      el: "Παραλλαγή" };

  /* Lieferart: entscheidet, ob der Sofortlieferung-Hinweis erscheint.
     Bewusst am Merkmal festgemacht und nicht an der Kategorie — sobald
     Hardware dazukommt, faellt der Hinweis dort automatisch weg. */
  var DELIV     = { de: "Lieferart", en: "Delivery", el: "Τρόπος παράδοσης" };
  var ELECTRO   = /^(elektronisch|electronic|ηλεκτρονικά)/i;
  var DELIV_TXT = {
    de: "Digitale Lieferung",
    en: "Digital delivery",
    el: "Ψηφιακή παράδοση"
  };

  function esc(x) {
    return (x == null ? "" : String(x))
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* Wert eines Merkmals holen, erste passende Schreibweise gewinnt */
  function val(attrs, names) {
    for (var i = 0; i < names.length; i++) {
      for (var j = 0; j < attrs.length; j++) {
        if (attrs[j].name === names[i] && attrs[j].value) return attrs[j].value;
      }
    }
    return null;
  }

  /* Alle Produkt-IDs der aktuellen Seite einsammeln */
  function idsOnPage() {
    var out = [], seen = {};
    var w = document.querySelectorAll(".grid-product__wrap[data-product-id]");
    for (var i = 0; i < w.length; i++) {
      var id = w[i].getAttribute("data-product-id");
      if (id && !seen[id]) { seen[id] = 1; out.push(id); }
    }
    return out;
  }

  /* Kachel umbauen. Idempotent: zweimal aufgerufen passiert nichts. */
  function paint(id, data) {
    var wrap = document.querySelector(
      '.grid-product__wrap[data-product-id="' + id + '"]');
    if (!wrap) return;
    var title = wrap.querySelector(".grid-product__title-inner");
    if (!title || title.querySelector(".sof-c-head")) return;

    var full = (title.textContent || "").trim();
    var L = data.line, V = data.variant;
    if (!L && !V) return;                       // ohne Kopf kein Umbau

    if (V) V = V.replace(/\s*·\s*/g, " ").trim();

    var chips = data.chips
      .map(function (c) {
        /* Die Lizenzform bekommt eine eigene Klasse: sie ist das
           Unterscheidungsmerkmal zwischen sonst gleichen Produkten und
           wird in der Kachel hervorgehoben. ALLE Auspraegungen gleich —
           eine einzelne hervorzuheben waere Lenkung, nicht Information. */
        var cls = c.channel ? ' class="sof-c-ch"' : "";
        return "<span" + cls + ">" + esc(c.value) + "</span>";
      })
      .join("");

    /* Der vollstaendige Name bleibt als title-Attribut erhalten, damit er
       beim Darueberfahren und fuer Vorlesegeraete verfuegbar bleibt. */
    title.setAttribute("title", full);
    title.innerHTML =
      '<span class="sof-c-head">' +
        (L ? '<span class="sof-c-line">' + esc(L) + "</span>" : "") +
        (V ? '<span class="sof-c-var">'  + esc(V) + "</span>" : "") +
        (chips ? '<span class="sof-c-chips">' + chips + "</span>" : "") +
      "</span>" +
      '<span class="sof-c-full">' + esc(full) + "</span>";
    wrap.classList.add("sof-card-on");

    /* Ersparnis in Prozent, direkt am Preis. Die Zahl kommt aus dem
       Katalog (Streichpreis gegen Verkaufspreis) und wird nicht
       geschaetzt. Dadurch hebt sich die guenstigste Variante von selbst
       hervor, ohne dass eine Lizenzform bevorzugt eingefaerbt wird. */
    if (data.save) {
      var pr = wrap.querySelector(".grid-product__price");
      if (pr && !pr.querySelector(".sof-c-save")) {
        var b = document.createElement("span");
        b.className = "sof-c-save";
        b.textContent = "−" + data.save + " %";
        pr.insertBefore(b, pr.firstChild);
      }
    }

    /* Sofortlieferung: nur bei elektronischer Lieferart. */
    if (data.electro) {
      var inner = wrap.querySelector(".grid-product__wrap-inner");
      if (inner && !inner.querySelector(".sof-c-del")) {
        var d = document.createElement("div");
        d.className = "sof-c-del";
        d.innerHTML = '<span class="sof-c-dot"></span>' +
                      esc(DELIV_TXT[lang()] || DELIV_TXT.en);
        inner.appendChild(d);
      }
    }
  }

  /* Eine Abfrage fuer die ganze Seite */
  var running = false;
  function load() {
    if (running || isBlockedPage()) return;
    var ids = idsOnPage();
    if (!ids.length) return;

    var token;
    try { token = Ecwid.getAppPublicToken(APP); } catch (e) { return; }
    if (!token) return;

    running = true;
    var lg = lang();
    var url = "https://app.ecwid.com/api/v3/" + STORE + "/products?productId=" +
              ids.join(",") + "&lang=" + lg + "&limit=100&token=" + token;

    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var items = d && d.items ? d.items : [];
        for (var i = 0; i < items.length; i++) {
          var p = items[i], a = p.attributes || [];
          var chips = [], seen = {};
          var set = KEYS[lg] || KEYS.en;
          for (var k = 0; k < set.length; k++) {
            var v = val(a, set[k]);
            /* Doppelte aussortieren: Licence channel und das Altmerkmal
               Lizenzform liefern denselben Wert. */
            if (v && !seen[v]) {
              seen[v] = 1;
              /* Der dritte Eintrag in KEYS ist die Lizenzform. */
              chips.push({ value: v, channel: (k === 2) });
            }
          }
          /* Streichpreis gegen tatsaechlichen Preis */
          var save = 0;
          var cmp = p.compareToPrice, now = p.defaultDisplayedPrice;
          if (cmp && now && cmp > now) {
            save = Math.round((1 - now / cmp) * 100);
            if (save < 1) save = 0;
          }
          var dl = val(a, [DELIV[lg], DELIV.en]);

          paint(String(p.id), {
            line:    val(a, [LINE[lg],    LINE.en]),
            variant: val(a, [VARIANT[lg], VARIANT.en]),
            chips:   chips,
            save:    save,
            electro: dl ? ELECTRO.test(dl.trim()) : false
          });
        }
      })
      .catch(function () { /* still: Kacheln bleiben wie von Ecwid geliefert */ })
      .then(function () { running = false; });
  }

  /* Nach einem Seitenwechsel laedt Ecwid die Kacheln nach. Statt eines
     Dauerbeobachters ein paar getaktete Versuche, dann Stopp. */
  function burst() {
    if (isBlockedPage()) return;
    var tries = 0;
    (function step() {
      if (idsOnPage().length) { load(); return; }
      if (++tries < 25) setTimeout(step, 200);
    })();
  }

  function register() {
    if (Ecwid.OnPageLoaded) Ecwid.OnPageLoaded.add(burst);
    if (Ecwid.OnPageSwitch) Ecwid.OnPageSwitch.add(burst);
    burst();
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
