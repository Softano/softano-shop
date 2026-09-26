/* =====================================================================
   SOFTANO.EU — CI-PANEL v24 (Custom-App-Variante, hydration-safe)
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
   3. v16 (08.09.): Griechische Anzeigenamen korrigiert. Im Backend
      heisst die Produktlinie "Σειρά" (nicht "Σειρά προϊόντος") und das
      Lizenzmodell "Μοντέλο αδειοδότησης" (nicht "Μοντέλο άδειας").
      Deshalb fehlte auf griechischen Seiten die Kopfzeile und das
      Lizenzmodell blieb in der Rohliste sichtbar. Die alten
      Schreibweisen bleiben als Rueckfalloption in der Liste stehen.
   4. Sonst unveraendert gegenueber v13.

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
    line:      ["Product line", "Produktlinie", "Σειρά", "Σειρά προϊόντος"],
    variant:   ["Variant", "Variante", "Παραλλαγή"],
    condition: ["Condition", "Zustand", "Κατάσταση"],
    channel:   ["Licence channel", "Lizenzform", "Κανάλι αδειοδότησης"],
    edition:   ["Edition", "Edition", "Edition"],
    quantity:  ["Licence quantity", "Lizenzumfang", "Εύρος αδειοδότησης",
                "Ποσότητα άδειας"],
    platform:  ["Platform", "Plattform", "Πλατφόρμα"],
    language:  ["Interface language", "Sprachversion", "Γλώσσα διεπαφής"],
    model:     ["Licence model", "Lizenzmodell", "Μοντέλο αδειοδότησης",
                "Μοντέλο άδειας"],
    activation:["Activation", "Aktivierung", "Ενεργοποίηση"],
    downgrade: ["Downgrade rights", "Downgrade-Rechte",
                "Δικαιώματα downgrade"],
    term:      ["Licence term", "Nutzungsdauer", "Διάρκεια χρήσης"],
    lzeit:     ["Delivery time", "Lieferzeit", "Χρόνος παράδοσης"],
    offer:     ["Offer type", "Angebotsart", "Τύπος προσφοράς"]
  };

  /* Alles, was das Panel selbst zeigt ODER bewusst unterdrueckt, wird aus
     der Rohliste entfernt. "model" steht hier weiterhin drin, obwohl es
     seit v14 keinen Chip mehr gibt — siehe Kopfkommentar Punkt 1. */
  var HIDE_KEYS = ["line", "variant", "condition", "channel", "edition",
                   "quantity", "platform", "language", "model",
                   "activation", "downgrade", "term", "offer"];

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

  /* Lieferzeit erscheint neben "Auf Lager", NICHT im Facts-Grid — dort
     waere sie eine von sechs gleichrangigen Angaben. Neben der
     Verfuegbarkeit steht sie da, wo der Blick ohnehin haengenbleibt,
     bevor er zum Kaufknopf geht. Sie bleibt deshalb aus HIDE_KEYS
     heraus und ist zusaetzlich im Datenblatt sichtbar.

     Orange statt gruen, wenn die Lieferzeit erst auf Anfrage feststeht.
     Geprueft wird nur der Textanfang, sonst wuerde "Datenträger auf
     Wunsch" bei den OEM-Lizenzen faelschlich als Anfrage gelesen. */
  var ANFRAGE = /^(Lieferzeit auf Anfrage|Delivery time on request|Χρόνος παράδοσης κατόπιν αιτήματος)/i;

  /* Neben der Verfuegbarkeit wird nur der Teil VOR dem Trennpunkt
     gezeigt — genau wie in der Kategoriekachel. Bei den OEM-Lizenzen
     stuende sonst der optionale Datentraeger mit in der Zeile, und der
     Block braeche auf zwei Zeilen um. An dieser Stelle zaehlt eine
     Frage: wann habe ich die Lizenz. Der vollstaendige Wert bleibt im
     Datenblatt unter "Technische Daten" und als Titel beim
     Darueberfahren erhalten. */
  function kurzLz(v) {
    return String(v).split("·")[0].replace(/[\s,;·-]+$/, "").trim();
  }

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
    /* Die LIEFERZEIT wird zusaetzlich ausgeblendet, wenn eine Angebotsart
       vorliegt (22.09.2026). Sie steht im Panel direkt unter "Auf Lager";
       bei Abonnements (Proxmox, Acronis, Veeam) sind die technischen Daten
       kurz, und die Wiederholung fiel dort auf. Bei Microsoft (keine
       Angebotsart) bleibt sie stehen. Dieselbe Regel wie beim Zustand. */
    var keys = HIDE_KEYS.slice();
    if (attr("offer")) keys.push("lzeit");
    var rows = document.querySelectorAll(".details-product-attribute");
    for (var i = 0; i < rows.length; i++) {
      var t = rows[i].querySelector(".details-product-attribute__title");
      if (!t) continue;
      for (var k = 0; k < keys.length; k++) {
        if (matches(t.textContent, keys[k])) {
          rows[i].classList.add("sof-attr");
          break;
        }
      }
    }
  }

  /* ---- Lieferzeit neben "Auf Lager" ---- */
  function buildLieferzeit() {
    var ort = document.querySelector(".details-product-purchase__place");
    if (!ort || ort.querySelector(".sof-lz")) return;
    var v = attr("lzeit");
    if (!v) return;

    var kurz = kurzLz(v);
    var box = document.createElement("span");
    box.className = "sof-lz" + (ANFRAGE.test(kurz) ? " sof-lz--anfrage" : "");
    box.setAttribute("title", v);                 /* voller Wert */
    box.innerHTML = '<span class="sof-lz-dot"></span>' +
                    '<span class="sof-lz-tx">' + esc(kurz) + "</span>";
    ort.appendChild(box);
  }

  /* ---- Verweis auf die Gegenstueck-Variante ----
     Der Block steht als Platzhalter in der Beschreibung und traegt in
     data-sof-ziel, ob Neuanschaffung oder Verlaengerung gesucht wird.
     Die Adresse wird NICHT im Text hinterlegt, sondern hier gesucht —
     sonst braeche sie, sobald ein Produkt umbenannt wird und Ecwid
     eine neue Adresse vergibt. Wird kein Gegenstueck gefunden, bleibt
     der Block verborgen statt einen toten Verweis zu zeigen. */
  var VERL_ART = /^(Laufzeitverl|Renewal|Ανανέωση)/i;

  function buildSwitch() {
    var box = document.querySelector(".sof-switch[hidden]");
    if (!box) return;
    var a = box.querySelector("a");
    if (!a) return;

    var linie = attr("line"), edition = box.getAttribute("data-sof-edition");
    var suchtVerl = box.getAttribute("data-sof-ziel") === "verl";
    if (!linie || !edition) return;

    var token;
    try { token = Ecwid.getAppPublicToken("custom-app-123703327-2"); } catch (e) { return; }
    if (!token) return;

    var lg = lang();
    var u = "https://app.ecwid.com/api/v3/123703327/products?keyword=" +
            encodeURIComponent(linie + " " + edition) +
            "&lang=" + lg + "&limit=50&token=" + token;

    fetch(u).then(function (r) { return r.json(); }).then(function (d) {
      var items = (d && d.items) || [];
      for (var i = 0; i < items.length; i++) {
        var at = items[i].attributes || [], line = null, vari = null, off = null;
        for (var k = 0; k < at.length; k++) {
          if (matchesName(at[k].name, "line"))    line = at[k].value;
          if (matchesName(at[k].name, "variant")) vari = at[k].value;
          if (matchesName(at[k].name, "offer"))   off  = at[k].value;
        }
        if (line !== linie || vari !== edition || !off) continue;
        if (VERL_ART.test(off) !== suchtVerl) continue;

        /* Ecwid liefert die Adresse ohne Sprachpraefix — hier ergaenzen,
           damit der Kunde in seiner Sprache bleibt. */
        var pfad;
        try { pfad = new URL(items[i].url).pathname; } catch (e) { pfad = items[i].url; }
        a.setAttribute("href", (lg === "en" ? "" : "/" + lg) + pfad);
        box.removeAttribute("hidden");
        return;
      }
    }).catch(function () { /* still: Block bleibt verborgen */ });
  }

  /* Wie matches(), aber fuer Merkmalsnamen aus der Schnittstelle —
     dort steht der Name ohne Doppelpunkt. */
  function matchesName(name, key) {
    var t = (name || "").replace(/\s*:\s*$/, "").trim();
    var names = ATTR[key] || [];
    for (var i = 0; i < names.length; i++) if (t === names[i]) return true;
    return false;
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

    /* Angebotsart als eigenes Badge. Bei Abonnements ist der
       Unterschied zwischen Neuanschaffung und Verlaengerung
       kaufentscheidend — er darf nicht nur im Produktnamen stehen. */
    var angebot = attr("offer");

    /* Der ZUSTAND wird nur gezeigt, wenn KEINE Angebotsart vorliegt.
       Begruendung: Die beiden schliessen einander aus. Wo es eine
       Angebotsart gibt (Abonnements), gibt es keine gebrauchte Ware —
       das Merkmal traegt dort nur den einen Wert "Neu" und stuende als
       zweites Badge neben "Neuanschaffung": dasselbe Wort fuer zwei
       verschiedene Dinge. Wo es Pre-Owned gibt (Microsoft), fehlt die
       Angebotsart, und der Zustand bleibt sichtbar.
       Der Zertifikatshinweis haengt weiter unten am Zustand selbst und
       ist von dieser Bedingung NICHT betroffen. */
    var badge = (zustand && !angebot)
      ? '<span class="sof-bdg ' + (isPO ? "pre" : "new") + '">' +
        esc(zustand) + "</span>"
      : "";
    var VERL_RE = /^(Laufzeitverl|Renewal|Ανανέωση)/i;
    var abdg = angebot
      ? '<span class="sof-bdg ' + (VERL_RE.test(angebot) ? "verl" : "neu") + '">' +
        esc(angebot) + "</span>"
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
      (badge || lfchip || abdg
        ? '<div class="sof-badges">' + badge + abdg + lfchip + "</div>" : "") +
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


  /* ---- Anfrage-Block (.sof-anfrage) — ab Veeam, 21.09.2026 ----------------
     Produkte, deren Dauerlizenz oder Verlaengerung nur auf Anfrage zu
     haben ist, tragen in der Beschreibung einen Block mit einem Knopf
     "Angebot anfordern". Der Knopf steht im Text mit href="#" und
     data-sof-b2b; die echte Adresse wird HIER zur Laufzeit gesetzt —
     dieselbe Regel wie beim Wechselblock: nie eine feste Adresse im Text.
     Ziel ist die bestehende B2B-Seite je Sprache (/b2b, /de/b2b, /el/b2b).
     Produktname und Artikelnummer werden als Parameter angehaengt; ob die
     B2B-Seite sie auswertet, haengt vom Formular dort ab. */
  function buildAnfrage() {
    var knoepfe = document.querySelectorAll(".sof-anfrage a[data-sof-b2b]");
    if (!knoepfe.length) return;
    var l = lang();
    var ziel = (l === "en" ? "" : "/" + l) + "/b2b";
    var name = (document.querySelector(".product-details__product-title") || {}).textContent || "";
    var sku = "";
    var skuEl = document.querySelector(".product-details__product-sku");
    if (skuEl) sku = (skuEl.textContent.match(/[0-9]{5,}/) || [""])[0];
    var q = [];
    if (name.trim()) q.push("produkt=" + encodeURIComponent(name.trim()));
    if (sku) q.push("sku=" + encodeURIComponent(sku));
    var href = ziel + (q.length ? "?" + q.join("&") : "");
    for (var i = 0; i < knoepfe.length; i++) {
      if (knoepfe[i].getAttribute("href") !== href) knoepfe[i].setAttribute("href", href);
    }
  }


  /* ---- Pre-Owned-Verweis fuellen (.sof-po) — 24.09.2026 -----------------
     Im Beschreibungstext steht nur die Artikelnummer des gebrauchten
     Produkts. Preis, Streichpreis, Rabatt, Ersparnis und die Adresse
     kommen HIER zur Laufzeit dazu — aus derselben Quelle wie die Kachel.
     Grund: Fest eingetragene Zahlen waren nach der ersten Preisaenderung
     falsch (30210 nannte 1.099,95/779,95 fuer ein Produkt zu 1.399,95).
     Der Block bleibt verborgen, wenn etwas fehlt — lieber kein Kasten
     als ein Kasten mit falschen Zahlen. */
  var poGeholt = {};
  function buildPreOwned() {
    var box = document.querySelector(".sof-po[data-sof-po-sku]");
    if (!box || box.getAttribute("data-sof-fertig") === "1") return;
    var sku = box.getAttribute("data-sof-po-sku");
    if (!sku) return;
    var tok = null;
    try { tok = Ecwid.getAppPublicToken("custom-app-123703327-2"); } catch (e) {}
    if (!tok) return;                               /* spaeterer Durchlauf */
    if (poGeholt[sku] === "laeuft") return;
    if (poGeholt[sku]) { fuelle(box, poGeholt[sku]); return; }
    poGeholt[sku] = "laeuft";
    fetch("https://app.ecwid.com/api/v3/123703327/products?keyword=" + encodeURIComponent(sku) +
          "&lang=" + lang() + "&token=" + tok)
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var p = (d.items || []).filter(function (x) { return x.sku === sku; })[0];
        if (!p) return;
        poGeholt[sku] = p;
        fuelle(box, p);
      })
      .catch(function () { poGeholt[sku] = null; });
  }
  function geld(n) {
    return n.toLocaleString(lang() === "en" ? "en-GB" : "de-DE",
      { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " \u20AC";
  }
  function fuelle(box, p) {
    var neu = p.defaultDisplayedPrice || p.price || 0;
    var alt = p.compareToPrice || 0;
    var link = p.url || "";
    if (!neu || !link) return;                      /* unvollstaendig: verborgen lassen */
    var setz = function (sel, wert) {
      var e = box.querySelector(sel); if (e) e.textContent = wert;
    };
    if (alt > neu) {
      setz("[data-sof-po-rabatt]", "\u2212" + Math.round((1 - neu / alt) * 100) + "%");
      setz("[data-sof-po-sparen]", geld(alt - neu).replace(/,00 /, " ") + (lang() === "de" ? " sparen" : ""));
      setz("[data-sof-po-alt]", geld(alt));
    } else {
      var b = box.querySelector(".sof-po-badge"); if (b) b.remove();
      var a2 = box.querySelector("[data-sof-po-alt]"); if (a2) a2.remove();
    }
    setz("[data-sof-po-neu]", geld(neu));
    /* Die Schnittstelle liefert die Adresse in der Grundsprache (ohne
       Kuerzel), auch wenn wir lang=de anfragen. Das Kuerzel wird deshalb
       hier gesetzt, sonst landet der Kunde auf der englischen Seite. */
    link = link.replace(/^(https?:\/\/[^\/]+)\/(?:de|el|en)\//, "$1/");
    if (lang() !== "en") link = link.replace(/^(https?:\/\/[^\/]+)\//, "$1/" + lang() + "/");
    var a = box.querySelector("[data-sof-po-link]");
    if (a) a.setAttribute("href", link);
    box.setAttribute("data-sof-fertig", "1");
    box.removeAttribute("hidden");
  }

  /* ---- Kern: einmal scannen. Guard schuetzt Router-Seiten. Nur Sidebar. ---- */
  function scan() {
    if (isBlockedPage()) return;
    hideAttrRows();
    buildHead();
    buildLieferzeit();
    buildSwitch();
    buildAnfrage();
    buildPreOwned();
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
