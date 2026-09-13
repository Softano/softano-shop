/* =====================================================================
   SOFTANO.EU — KATEGORIE-KACHELN v9 (13.09.2026)
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

  /* Merkmal "Lieferzeit" (angelegt 11.09.). Es ersetzt den frueheren
     festen Text "Digitale Lieferung": Der stimmte nur bei Software und
     waere bei Hardware schlicht falsch gewesen. */
  var LZEIT = { de: "Lieferzeit", en: "Delivery time", el: "Χρόνος παράδοσης" };

  /* Fuer die Kachel wird der Wert gekuerzt — die vollen Saetze sind
     dort zu lang. Abgeschnitten wird an zwei Stellen: am Trennpunkt
     (dahinter steht der optionale Datentraeger) und vor der
     Bestellzeit-Bedingung. Die vollstaendige Angabe bleibt auf der
     Produktseite und in den AGB. */
  /* Ohne \b beim griechischen Ausdruck: Die Wortgrenze in JavaScript
     kennt nur lateinische Buchstaben, bei "για παραγγελίες" greift sie
     nicht und die Bestellzeit bliebe in der Kachel stehen. */
  var KAPPEN = /\s*(·|\bbei Bestellung\b|\bfor orders\b|για παραγγελίες)/;
  function kurz(v) {
    return String(v).split(KAPPEN)[0].replace(/[\s,;·-]+$/, "").trim();
  }

  /* Orange statt gruen, wenn die Lieferzeit erst auf Anfrage feststeht.
     Geprueft wird die GEKUERZTE Fassung — sonst wuerde "Datenträger auf
     Wunsch" im Wert 3 faelschlich als Anfrage gelesen. */
  var ANFRAGE = /(auf Anfrage|on request|κατόπιν αιτήματος)/i;

  /* "ab" vor dem Preis, wenn ein Produkt Varianten hat. Der Grundpreis
     ist dann der guenstigste Einstieg — ohne den Zusatz liest ihn der
     Kunde als Festpreis und erlebt beim Umschalten eine Ueberraschung.
     Serverhero macht es genauso ("ab 370,00 €"). */
  var AB = { de: "ab", en: "from", el: "από" };
  var ELECTRO   = /^(elektronisch|electronic|ηλεκτρονικά)/i;
  var DELIV_TXT = {
    de: "Digitale Lieferung",
    en: "Digital delivery",
    el: "Ψηφιακή παράδοση"
  };

  /* Zustand: steuert den Zertifikatshinweis. Gleiche Logik wie im Panel
     auf der Produktseite, damit Kategorie und Produkt dasselbe sagen. */
  var COND      = { de: "Zustand", en: "Condition", el: "Κατάσταση" };
  var PRE_OWNED = /^(pre-?owned|refurbished)/i;
  var CERT_TXT  = {
    de: "Inkl. Löschzertifikat",
    en: "Incl. deletion certificate",
    el: "Με πιστοποιητικό διαγραφής"
  };

  function esc(x) {
    return (x == null ? "" : String(x))
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* Steht der Wert schon im Titel? Dann waere der Chip eine reine
     Wiederholung und faellt weg.

     Zahl UND Einheit muessen zusammen passen. Die Zahl allein reicht
     nicht: "5 Users" gegen "User-CAL 5-Pack" waere sonst eine
     Uebereinstimmung, weil die 5 im Titel vorkommt — der Chip fiele
     faelschlich weg. Geprueft wird deshalb Zahl + Wortstamm der
     Einheit: "16 Cores" trifft "Standard 16-Core" (16-cor),
     "5 Users" trifft "5-Pack" NICHT. */
  function inTitle(value, titleLower) {
    var probe = value.toLowerCase().replace(/\s+/g, " ").trim();
    if (!probe) return false;
    if (titleLower.indexOf(probe) !== -1) return true;      // wortgleich

    var m = probe.match(/^(\d+)\s*(\S+)/);                  // "16 cores"
    if (!m) return false;
    var zahl = m[1], stamm = m[2].slice(0, 3);
    if (stamm.length < 3) return false;
    var re = new RegExp(zahl + "[\\s·\\-]*" + stamm);
    return re.test(titleLower);
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

    /* Preis-Vorsatz bei Produkten mit Varianten */
    if (data.varianten) {
      var pv = wrap.querySelector(".grid-product__price-value, .grid-product__price-amount");
      if (pv && !pv.querySelector(".sof-c-ab")) {
        var ab = document.createElement("span");
        ab.className = "sof-c-ab";
        ab.textContent = (AB[lang()] || AB.en) + " ";
        pv.insertBefore(ab, pv.firstChild);
      }
    }

    /* Lieferzeit. Steht das Merkmal am Produkt, gewinnt es; sonst
       faellt die Kachel auf den alten Text zurueck, solange die
       Lieferzeit noch nicht ueberall gepflegt ist. */
    var lz = data.lieferzeit ? kurz(data.lieferzeit) : null;
    var txt = lz || (data.electro ? (DELIV_TXT[lang()] || DELIV_TXT.en) : null);
    if (txt) {
      var inner = wrap.querySelector(".grid-product__wrap-inner");
      if (inner && !inner.querySelector(".sof-c-del")) {
        var d = document.createElement("div");
        d.className = "sof-c-del" + (ANFRAGE.test(txt) ? " sof-c-del--anfrage" : "");
        d.setAttribute("title", data.lieferzeit || txt);   /* voller Wert */
        d.innerHTML = '<span class="sof-c-dot"></span>' + esc(txt);
        inner.appendChild(d);
      }
    }

    /* Loeschzertifikat: nur bei Pre-Owned. Der Kunde soll schon in der
       Uebersicht sehen, dass die guenstige Variante belegt uebertragen
       wird — nicht erst auf der Produktseite. */
    /* Die Zeile wird IMMER angelegt und bei Neuware nur unsichtbar
       geschaltet. Sonst waere die Pre-Owned-Karte eine Zeile hoeher, und
       weil der untere Block am Kartenrand verankert ist, saesse dort
       alles darueber — auch die Artikelnummer — auf anderer Hoehe. */
    var inner2 = wrap.querySelector(".grid-product__wrap-inner");
    if (inner2 && !inner2.querySelector(".sof-c-cert")) {
      var c2 = document.createElement("div");
      c2.className = "sof-c-cert" + (data.preOwned ? "" : " sof-c-cert--leer");
      c2.innerHTML = '<span class="sof-c-cdot"></span>' +
                     esc(CERT_TXT[lang()] || CERT_TXT.en);
      if (!data.preOwned) c2.setAttribute("aria-hidden", "true");
      inner2.appendChild(c2);
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
          var vr = (val(a, [VARIANT[lg], VARIANT.en]) || "").toLowerCase();
          for (var k = 0; k < set.length; k++) {
            var v = val(a, set[k]);
            if (!v || seen[v]) continue;   /* Licence channel == Lizenzform */
            seen[v] = 1;

            /* Chips, deren Wert bereits im Titel steht, weglassen. Bei
               Windows Server steht "Standard" und "16 Cores" wortgleich
               in der Variante darueber — die Wiederholung draengt den
               einzigen unterscheidenden Wert in eine zweite Zeile.
               Bei den Zugriffslizenzen ("User-CAL") traegt der
               Lizenzumfang dagegen echte Information und bleibt.
               Die Lizenzform ist IMMER dabei: sie ist das Merkmal, das
               sonst gleiche Produkte im Preis trennt. */
            var isChannel = (k === 2);
            if (!isChannel && inTitle(v, vr)) continue;
            chips.push({ value: v, channel: isChannel });
          }
          /* Streichpreis gegen tatsaechlichen Preis */
          var save = 0;
          var cmp = p.compareToPrice, now = p.defaultDisplayedPrice;
          if (cmp && now && cmp > now) {
            save = Math.round((1 - now / cmp) * 100);
            if (save < 1) save = 0;
          }
          var dl = val(a, [DELIV[lg], DELIV.en]);
          var cd = val(a, [COND[lg], COND.en]);

          paint(String(p.id), {
            line:    val(a, [LINE[lg],    LINE.en]),
            variant: val(a, [VARIANT[lg], VARIANT.en]),
            chips:   chips,
            save:    save,
            electro:  dl ? ELECTRO.test(dl.trim()) : false,
            lieferzeit: val(a, [LZEIT[lg], LZEIT.en]),
            varianten: !!(p.combinations && p.combinations.length),
            preOwned: cd ? PRE_OWNED.test(cd.trim()) : false
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
