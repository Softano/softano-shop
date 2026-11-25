/* =====================================================================
   SOFTANO.EU — CI-PANEL v29 (Custom-App-Variante, hydration-safe)
   ---------------------------------------------------------------------
   Auslieferung ueber Custom App #2 (custom-app-123703327-2) mit Scope
   customize_storefront. KEIN DOM-Eingriff ausserhalb der Sidebar.

   Gegenueber v13 geaendert:
   1. CHIP "Lizenzmodell" ENTFAELLT im Panel. Grund: Der Wert
      ("Dauerlizenz") stand wortgleich in der Chip-Leiste unter der
      Beschreibung, nur wenige Zentimeter darunter — zwei fast gleiche
      Chip-Reihen sahen nach einem Darstellungsfehler aus. Das Merkmal
      Uebrig im Panel: Plattform und Sprachversion.
      NACHTRAG 25.11.2026: Der Chip bleibt weg, aber "model" ist aus
      HIDE_KEYS ENTFERNT - das Merkmal erscheint jetzt wieder im
      Datenblatt. Grund: Nachdem "MPN" aus dem Datenblatt genommen
      wurde, blieben ueberall UNGERADE Merkmalszahlen (212 Produkte
      mit 9, 57 mit 5, 6 mit 3), und die zweispaltige Tabelle liess
      den letzten Eintrag allein in seiner Zeile stehen. Lizenzmodell
      ist das einzige verborgene Merkmal, das bei ALLEN 275 Produkten
      gepflegt und dreisprachig uebersetzt ist, und das einzige, das
      in keinem Kasten und keinem Chip daneben steht. Damit sind alle
      275 Produkte gerade: 9->10, 5->6, 3->4. Dass der Wert bei 251
      Produkten auch im Beschreibungstext vorkommt, ist bewusst in
      Kauf genommen - Prosa im Lesefluss gegen Tabelle zum
      Ueberfliegen. Plattform und Nutzungsdauer waeren schlechter:
      die stehen als Chip bzw. Kastenzeile auf DEMSELBEN Bildschirm.
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
    offer:     ["Offer type", "Angebotsart", "Τύπος προσφοράς"],
    /* v29: Auszeichnung am Kaufpunkt. Der Text steht im Merkmalswert,
       nicht hier - so kann er je Produkt und je Sprache im Ecwid
       gesetzt werden, ohne dass dieses Skript angefasst wird. */
    tipp:      ["Recommendation", "Empfehlung", "Πρόταση"]
  };

  /* Alles, was das Panel selbst zeigt ODER bewusst unterdrueckt, wird aus
     der Rohliste entfernt.
     "model" (Lizenzmodell) ist seit 25.11.2026 NICHT mehr hier drin und
     erscheint deshalb wieder im Datenblatt — siehe Kopfkommentar Punkt 1.
     WARNUNG: Wer es wieder hier eintraegt, macht die Merkmalszahl bei
     allen 275 Produkten wieder ungerade und zerreisst die letzte
     Tabellenzeile. Vorher die Zahlen pruefen. */
  var HIDE_KEYS = ["line", "variant", "condition", "channel", "edition",
                   "quantity", "platform", "language",
                   "activation", "downgrade", "term", "offer", "tipp"];

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
    /* LIEFERZEIT: steht bei JEDEM Produkt im Datenblatt.
       Historie: Am 22.09.2026 wurde sie bei Produkten mit Angebotsart
       (Proxmox, Acronis, Veeam, Aruba) ausgeblendet, weil die technischen
       Daten dort kurz waren und die Wiederholung zum Panel auffiel.
       Am 25.11.2026 zurueckgenommen: Seit "Lizenzmodell" wieder im
       Datenblatt steht, sind diese 57 Datenblaetter nicht mehr kurz, und
       die Ausblendung machte ihre Merkmalszahl ungerade (5) - die
       zweispaltige Tabelle liess die letzte Zeile halb stehen. Ohne sie
       haben ALLE 275 Produkte eine gerade Zahl (212x10, 57x6, 6x4) und
       werden gleich behandelt. Die Doppelung zum Panel besteht bei den
       212 Microsoft-Produkten ohnehin seit immer und ist dort gewollt:
       siehe Kommentar bei ANFRAGE oben.
       WARNUNG: Wer hier wieder nach Angebotsart ausblendet, macht 57
       Produkte wieder ungerade. Vorher die Zahlen pruefen. */
    var keys = HIDE_KEYS.slice();
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

    /* v29: Auszeichnung steht an erster Stelle der Reihe, direkt ueber
       dem Kaufbereich - dort, wo der Kunde sich entscheidet. */
    var tipp = attr("tipp");
    var tbdg = tipp
      ? '<span class="sof-bdg tipp">' + esc(tipp) + "</span>"
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
      (badge || lfchip || abdg || tbdg
        ? '<div class="sof-badges">' + tbdg + badge + abdg + lfchip + "</div>" : "") +
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
    /* Auf Pre-Owned-Seiten zeigt der Kasten nicht dieselbe Lizenz, sondern
       das passende naechste Produkt — dort steht sein Name im Titel. */
    var nameSlot = box.querySelector("[data-sof-po-name]");
    if (nameSlot) nameSlot.textContent = p.name || "";
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


  /* ---- Paket-Kasten fuellen (.sof-po mit data-sof-po-pos) — 03.10.2026 --
     Dreizehn Produkte vergleichen sich nicht mit EINER gebrauchten Lizenz,
     sondern mit einer Zusammenstellung: "Server 16 Core + 4x 2-Core Add-On".
     Der gewoehnliche Kasten kann nur ein Ziel, deshalb standen dort bis
     jetzt feste Preise im Text — bei 31005 sogar die eines 16-Kern-Servers
     auf einer 24-Kern-Seite.
     Im Text steht nur noch, WAS zusammengerechnet wird; die Zahlen setzt
     das Skript. data-sof-po-pos="33000:1,33010:4" = Artikelnummer:Stueck.
     Die Wortteile ("+", "je", "=") bleiben in der Beschreibung, damit jede
     Sprache ihre eigene Formulierung behaelt.
     Verglichen wird gegen den EIGENEN Verkaufspreis der Seite, nicht gegen
     einen Streichpreis — sonst sieht die Ersparnis groesser aus als sie ist. */
  function buildPaket() {
    var box = document.querySelector(".sof-po[data-sof-po-pos]");
    if (!box || box.getAttribute("data-sof-fertig") === "1") return;
    var tok = null;
    try { tok = Ecwid.getAppPublicToken("custom-app-123703327-2"); } catch (e) {}
    if (!tok) return;
    var roh = (document.querySelector(".product-details__product-sku") || {}).textContent || "";
    var eigen = (roh.match(/\d{4,6}/) || [])[0];
    if (!eigen) return;
    box.setAttribute("data-sof-fertig", "1");
    var pos = box.getAttribute("data-sof-po-pos").split(",").map(function (x) {
      var t = x.split(":"); return { sku: t[0].trim(), n: parseInt(t[1], 10) || 1 };
    });
    var hol = function (sku) {
      return fetch("https://app.ecwid.com/api/v3/123703327/products?keyword=" + encodeURIComponent(sku) +
                   "&lang=" + lang() + "&token=" + tok)
        .then(function (r) { return r.json(); })
        .then(function (d) { return (d.items || []).filter(function (y) { return y.sku === sku; })[0] || null; })
        .catch(function () { return null; });
    };
    Promise.all([hol(eigen)].concat(pos.map(function (p) { return hol(p.sku); })))
      .then(function (liste) {
        var selbst = liste[0], teile = liste.slice(1);
        if (!selbst || teile.some(function (x) { return !x; })) return;   /* lieber kein Kasten als ein halber */
        var summe = 0;
        for (var i = 0; i < teile.length; i++) {
          var stk = teile[i].defaultDisplayedPrice || teile[i].price || 0;
          if (!stk) return;
          summe += stk * pos[i].n;
          var slot = box.querySelector("[data-sof-po-p" + i + "]");
          if (slot) slot.textContent = geld(stk);
        }
        var alt = selbst.defaultDisplayedPrice || selbst.price || 0;
        var setz = function (sel, wert) { var e = box.querySelector(sel); if (e) e.textContent = wert; };
        setz("[data-sof-po-summe]", geld(summe));
        setz("[data-sof-po-neu]", geld(summe));
        if (alt > summe) {
          setz("[data-sof-po-rabatt]", "−" + Math.round((1 - summe / alt) * 100) + "%");
          setz("[data-sof-po-sparen]", geld(alt - summe).replace(/,00 /, " ") + (lang() === "de" ? " sparen" : ""));
          setz("[data-sof-po-alt]", geld(alt));
        } else {
          var b = box.querySelector(".sof-po-badge"); if (b) b.remove();
          var a2 = box.querySelector("[data-sof-po-alt]"); if (a2) a2.remove();
        }
        var knoepfe = box.querySelectorAll("[data-sof-po-link]");
        for (var k = 0; k < knoepfe.length; k++) {
          var ziel = teile[k]; if (!ziel || !ziel.url) continue;
          var link = ziel.url.replace(/^(https?:\/\/[^\/]+)\/(?:de|el|en)\//, "$1/");
          if (lang() !== "en") link = link.replace(/^(https?:\/\/[^\/]+)\//, "$1/" + lang() + "/");
          knoepfe[k].setAttribute("href", link);
        }
        box.removeAttribute("hidden");
      });
  }

  /* ---- Preisstaffel fuellen (.sof-staffel) — 24.09.2026 -----------------
     Im Text stehen nur die Artikelnummern der Pakete mit ihrer Stueckzahl,
     z. B. data-sof-staffel="30390:1,30391:5,30392:10,30393:50".
     Preis, Stueckpreis und Ersparnis gegenueber dem Einzelkauf rechnet das
     Skript aus den Katalogpreisen. Grund: 28 von 42 Staffeln nannten die
     Preise einer anderen Produktreihe. Das Paket, auf dessen Seite man
     steht, wird hervorgehoben und bekommt keinen Knopf. */
  function buildStaffel() {
    var box = document.querySelector(".sof-staffel[data-sof-staffel]");
    if (!box || box.getAttribute("data-sof-fertig") === "1") return;
    var tok = null;
    try { tok = Ecwid.getAppPublicToken("custom-app-123703327-2"); } catch (e) {}
    if (!tok) return;
    box.setAttribute("data-sof-fertig", "1");
    var paare = box.getAttribute("data-sof-staffel").split(",").map(function (x) {
      var t = x.split(":"); return { sku: t[0].trim(), menge: parseInt(t[1], 10) || 1 };
    });
    var eigen = (document.querySelector(".product-details__product-sku") || {}).textContent || "";
    /* v27: Ein- und Mehrzahl kommen BEIDE aus der Beschreibung. Vorher
       schnitt das Skript die Endung vom Plural ab (/e[rn]$/) — daraus
       wurde "Benutz", und im Englischen und Griechischen aenderte sich
       gar nichts ("/ users", "/ χρήστες"). Keine Regel mehr, die auf
       Wortendungen prueft. Fehlt die neue Angabe, bleibt die Mehrzahl
       stehen — lieber unscharf als falsch. */
    var einheit = box.getAttribute("data-sof-einheit") || "";
    var einheit1 = box.getAttribute("data-sof-einheit1") || einheit;
    var wort = { de: ["Ersparnis", "sparen", "Zum Paket"], en: ["saving", "saved", "To the pack"],
                 el: ["όφελος", "όφελος", "Στο πακέτο"] }[lang()] || ["", "", ""];
    /* v27: "5er-Pack" stand fest im Skript und erschien so auch auf den
       englischen und griechischen Seiten. */
    function packname(n) {
      if (lang() === "en") return n + "-pack";
      if (lang() === "el") return "Πακέτο " + n;
      return n + "er-Pack";
    }
    Promise.all(paare.map(function (p) {
      return fetch("https://app.ecwid.com/api/v3/123703327/products?keyword=" + encodeURIComponent(p.sku) +
                   "&lang=" + lang() + "&token=" + tok)
        .then(function (r) { return r.json(); })
        .then(function (d) {
          var x = (d.items || []).filter(function (y) { return y.sku === p.sku; })[0];
          return x ? { sku: p.sku, menge: p.menge, preis: x.defaultDisplayedPrice || x.price || 0, url: x.url || "" } : null;
        }).catch(function () { return null; });
    })).then(function (liste) {
      liste = liste.filter(Boolean);
      var einzel = liste.filter(function (x) { return x.menge === 1; })[0];
      var karten = liste.filter(function (x) { return x.menge > 1 && x.preis > 0; });
      if (!karten.length) return;
      var html = "";
      for (var i = 0; i < karten.length; i++) {
        var k = karten[i];
        var stueck = k.preis / k.menge;
        var sparen = einzel ? (einzel.preis * k.menge - k.preis) : 0;
        var aktiv = eigen.indexOf(k.sku) >= 0;
        var link = k.url.replace(/^(https?:\/\/[^\/]+)\/(?:de|el|en)\//, "$1/");
        if (lang() !== "en") link = link.replace(/^(https?:\/\/[^\/]+)\//, "$1/" + lang() + "/");
        html += '<div class="sof-st-karte' + (aktiv ? " sof-st-aktiv" : "") + '">' +
          '<div class="sof-st-name">' + esc(packname(k.menge)) + "</div>" +
          '<div class="sof-st-menge">' + k.menge + " " + esc(k.menge === 1 ? einheit1 : einheit) + "</div>" +
          '<div class="sof-st-preis"><b>' + geld(k.preis) + "</b><i>= " + geld(stueck) + " / " + esc(einheit1) + "</i></div>" +
          (sparen > 0 ? '<div class="sof-st-sparen">' + geld(sparen) + " " + wort[1] + "</div>" : "") +
          (aktiv ? "" : '<a href="' + link + '">' + wort[2] + "</a>") +
          "</div>";
      }
      box.innerHTML = html;
      box.removeAttribute("hidden");
    });
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
    buildPaket();
    buildStaffel();
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

/* =====================================================================
   SOFTANO.EU — LEBENDE PREISE IN DEN EMPFEHLUNGSKAESTEN   (25.11.2026)
   ---------------------------------------------------------------------
   WARUM ES DAS GIBT
   In den Empfehlungskaesten ("Unsere Empfehlung", "Die ganze Suite statt
   Einzellizenzen") stehen drei Arten von Betraegen: der Preis des
   empfohlenen Produkts, die Summe mehrerer Einzellizenzen und die
   Differenz zwischen beiden. Diese Zahlen standen frueher fest im
   Beschreibungstext. Nach jeder Preisaenderung im Backend waren sie
   falsch — am 25.11. waren es 243 veraltete Betraege auf einmal.

   WIE ES ARBEITET
   Im Text steht nur noch ein Platzhalter, der die SKU nennt und die
   zuletzt bekannte Zahl als sichtbaren Rueckfallwert enthaelt:

     <span data-sofp-sku="20004">249,95 €</span>
     <span data-sofp-summe="20300,20310,20320">359,85 €</span>
     <span data-sofp-diff="20300,20310|20004">109,90 €</span>

   Dieses Skript liest die SKUs, holt die heutigen Preise ueber die
   oeffentliche Produkt-API und schreibt die Betraege neu. Kommt die
   Abfrage nicht durch — kein Token, kein Netz, SKU unbekannt — bleibt
   der Rueckfallwert stehen. Der Kunde sieht nie eine leere Stelle.

   ZWEI STOLPERSTEINE, DIE HIER ABSICHTLICH GELOEST SIND

   1. NAMENSRAUM. Die Produktkacheln tragen bereits ein Attribut
      data-sof-preis, dort steht aber ein PREIS drin, keine SKU
      (siehe softano_cat_cards.js). Deshalb heissen die Platzhalter hier
      data-sofp-* und werden zusaetzlich nur INNERHALB von .sof-empf
      gesucht. Beide Mechaniken koennen sich so nicht begegnen.
      NICHT auf data-sof-* zurueckbenennen.

   2. MEHRWERTSTEUER. Der Shop rechnet mit Bruttopreisen und
      automatischer Steuerermittlung; Ecwid zeigt dem Besucher je nach
      Standort einen anderen Betrag als den eingetragenen. Die API
      liefert immer den eingetragenen Bruttopreis. Ohne Korrektur stuende
      im Kasten 159,95 €, waehrend die Seite daneben 128,99 € zeigt.
      Deshalb wird aus dem aktuellen Produkt ein Faktor gebildet
      (angezeigter Preis geteilt durch eingetragenen Preis) und auf alle
      Betraege im Kasten angewendet. Laesst sich der Faktor nicht sicher
      bestimmen, bleibt er 1 und es wird brutto gezeigt.
   ===================================================================== */
(function () {
  var STORE = "123703327";
  var APP   = "custom-app-123703327-2";
  /* Nur im Empfehlungskasten suchen — siehe Stolperstein 1 */
  var MERKMALE = ".sof-empf [data-sofp-sku], .sof-empf [data-sofp-summe], " +
                 ".sof-empf [data-sofp-diff]";
  var PREIS_ORTE = [".product-details__product-price .ec-price-item",
                    ".product-details__product-price",
                    ".product-details-module__price .ec-price-item",
                    ".ec-price-item"];
  var preise = {};        /* sku -> Promise<Zahl|null> */
  var seitenProdukt = null;   /* productId der laufenden Seite */
  var faktorCache = null;     /* Promise<Zahl> */

  function sprache() {
    try { if (Ecwid.getStorefrontLang) return Ecwid.getStorefrontLang(); } catch (e) {}
    var p = location.pathname;
    if (/^\/de(\/|$)/.test(p)) return "de";
    if (/^\/el(\/|$)/.test(p)) return "el";
    return "en";
  }

  function geld(v, lg) {
    var ort = lg === "en" ? "en-GB" : (lg === "el" ? "el-GR" : "de-DE");
    try {
      return new Intl.NumberFormat(ort, { minimumFractionDigits: 2,
                                          maximumFractionDigits: 2 }).format(v) + " €";
    } catch (e) { return v.toFixed(2) + " €"; }
  }

  /* "1.234,56 €" oder "1,234.56 €" -> 1234.56 */
  function zahl(txt) {
    if (!txt) return null;
    var s = String(txt).replace(/[^\d.,]/g, "");
    if (!s) return null;
    var k = s.lastIndexOf(","), pkt = s.lastIndexOf(".");
    var tr = Math.max(k, pkt);
    if (tr > -1 && s.length - tr - 1 === 2) {
      s = s.slice(0, tr).replace(/[.,]/g, "") + "." + s.slice(tr + 1);
    } else {
      s = s.replace(/[.,]/g, "");
    }
    var v = parseFloat(s);
    return isFinite(v) ? v : null;
  }

  function token() {
    try { return Ecwid.getAppPublicToken(APP) || null; } catch (e) { return null; }
  }

  function holeNach(feld, wert, tok) {
    var u = "https://app.ecwid.com/api/v3/" + STORE + "/products?" + feld + "=" +
            encodeURIComponent(wert) +
            "&responseFields=items(sku,price,defaultDisplayedPrice)&token=" + tok;
    return fetch(u)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        var it = d && d.items && d.items[0];
        if (!it) return null;
        var p = it.defaultDisplayedPrice;
        return (typeof p === "number") ? p : (typeof it.price === "number" ? it.price : null);
      })
      .catch(function () { return null; });
  }

  function hole(sku, tok) {
    if (!preise[sku]) preise[sku] = holeNach("sku", sku, tok);
    return preise[sku];
  }

  /* Das strukturierte Datenblatt der Seite nennt SKU und den Preis, den
     dieser Besucher sieht — zuverlaessiger als jede CSS-Auswahl. */
  function seitenDaten() {
    var s = document.querySelectorAll('script[type="application/ld+json"]');
    for (var i = 0; i < s.length; i++) {
      try {
        var j = JSON.parse(s[i].textContent);
        if (!j || j["@type"] !== "Product" || !j.sku) continue;
        var o = j.offers, pr = null;
        if (o) pr = parseFloat(o.price != null ? o.price : (o[0] && o[0].price));
        if (isFinite(pr) && pr > 0) return { sku: String(j.sku), gezeigt: pr };
      } catch (e) {}
    }
    return null;
  }

  /* Stolperstein 2: Verhaeltnis zwischen angezeigtem und eingetragenem Preis */
  function faktor(tok) {
    if (faktorCache) return faktorCache;
    faktorCache = (function () {
      var d = seitenDaten();
      var gezeigt = d ? d.gezeigt : null;
      if (gezeigt === null) {
        for (var i = 0; i < PREIS_ORTE.length && gezeigt === null; i++) {
          var e = document.querySelector(PREIS_ORTE[i]);
          if (e) gezeigt = zahl(e.textContent);
        }
      }
      if (!gezeigt) return Promise.resolve(1);
      var brutto = d ? hole(d.sku, tok)
                     : (seitenProdukt ? holeNach("productId", seitenProdukt, tok)
                                      : Promise.resolve(null));
      return brutto.then(function (b) {
        if (typeof b !== "number" || b <= 0) return 1;
        var f = gezeigt / b;
        /* nur plausible Steuerunterschiede zulassen */
        return (f > 0.3 && f < 1.6) ? f : 1;
      });
    })();
    return faktorCache;
  }

  function listeSumme(liste, tok) {
    var skus = String(liste).split(",").filter(Boolean);
    return Promise.all(skus.map(function (s) { return hole(s.trim(), tok); }))
      .then(function (w) {
        var su = 0;
        for (var i = 0; i < w.length; i++) {
          if (typeof w[i] !== "number") return null;   /* eine Luecke => gar nichts schreiben */
          su += w[i];
        }
        return su;
      });
  }

  function fuellen() {
    var el = document.querySelectorAll(MERKMALE);
    if (!el.length) return;
    var tok = token();
    if (!tok) return;                       /* Rueckfallwerte bleiben stehen */
    var lg = sprache();

    for (var i = 0; i < el.length; i++) {
      (function (n) {
        if (n.getAttribute("data-sofp-fertig") === "1") return;
        n.setAttribute("data-sofp-fertig", "1");

        var einzel = n.getAttribute("data-sofp-sku");
        var summe  = n.getAttribute("data-sofp-summe");
        var diff   = n.getAttribute("data-sofp-diff");
        var p;

        if (einzel) {
          p = hole(einzel.trim(), tok);
        } else if (summe) {
          p = listeSumme(summe, tok);
        } else if (diff) {
          var teile = String(diff).split("|");
          if (teile.length !== 2) return;
          p = Promise.all([listeSumme(teile[0], tok), listeSumme(teile[1], tok)])
                .then(function (w) {
                  if (typeof w[0] !== "number" || typeof w[1] !== "number") return null;
                  return Math.abs(w[0] - w[1]);
                });
        } else { return; }

        Promise.all([p, faktor(tok)]).then(function (w) {
          var wert = w[0], f = w[1];
          if (typeof wert !== "number" || !isFinite(wert)) return;  /* Rueckfallwert behalten */
          var neu = geld(wert * f, lg);
          if (n.textContent !== neu) n.textContent = neu;
        }).catch(function () {});
      })(el[i]);
    }
  }

  /* Die Beschreibung wird nachgeladen, deshalb mehrfach nachsehen. */
  function schub() {
    var n = 0;
    (function schritt() {
      fuellen();
      if (++n < 25) setTimeout(schritt, 200);
    })();
  }

  function neueSeite(page) {
    preise = {}; faktorCache = null;
    seitenProdukt = (page && page.productId) || null;
    schub();
  }

  function anmelden() {
    if (Ecwid.OnPageLoaded) Ecwid.OnPageLoaded.add(neueSeite);
    if (Ecwid.OnPageSwitch) Ecwid.OnPageSwitch.add(neueSeite);
    schub();
  }
  function start() {
    if (window.Ecwid && Ecwid.OnAPILoaded) { Ecwid.OnAPILoaded.add(anmelden); return; }
    var n = 0;
    (function warten() {
      if (window.Ecwid && Ecwid.OnAPILoaded) { Ecwid.OnAPILoaded.add(anmelden); return; }
      if (n++ < 100) setTimeout(warten, 100);
    })();
  }
  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start);
})();
