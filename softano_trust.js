/* =====================================================================
   SOFTANO.EU — BERATUNGSKASTEN & FAKTEN-LEISTE v3 (10.09.2026)
   ---------------------------------------------------------------------
   Einbindung: Website -> Design -> JavaScript-Code, eine Zeile mit
   <script src="...softano_trust.js" defer></script>

   ZWEI BAUSTEINE auf Kategorieseiten:
   1. Beratungskasten rechts neben der Kategoriebeschreibung. Dort ist
      im Seitenaufbau eine Luecke; die Beschreibung nutzt nur die linke
      Haelfte der Breite.
   2. Fakten-Leiste ueber den Produkten: drei Zusagen, die sonst nur auf
      der Startseite stehen.

   KEIN DOM-UMBAU AUSSERHALB DIESER BEIDEN STELLEN. Der Kasten wird als
   zweites Kind in .grid__description gehaengt (die hat genau ein Kind),
   die Leiste vor .grid__products gesetzt. Beides ist idempotent.

   MITARBEITERBILDER — so werden sie spaeter ergaenzt:
   Unten steht die Liste TEAM. Solange sie leer ist, zeigt der Kasten
   vier gezeichnete Silhouetten. Sobald die Verantwortlichen feststehen:
     1. Portraits ins Repo unter  team/<name>.jpg  legen
        (quadratisch, mind. 400x400, Gesicht mittig — die Bilder werden
        als Kreis beschnitten)
     2. Hier eintragen:  TEAM = [
          { name: "Anna",     datei: "anna.jpg" },
          { name: "Dimitris", datei: "dimitris.jpg" }, ...  ]
   Fehlt eine Datei, erscheint automatisch wieder die Silhouette — die
   Seite bricht also nie, auch wenn ein Bild fehlt oder umbenannt wird.
   ===================================================================== */
(function () {
  "use strict";

  /* ---- Mitarbeiter. Leer lassen, bis die Portraits im Repo liegen. --- */
  var TEAM = [];                     /* siehe Kopfkommentar */
  var TEAM_SLOTS = 4;                /* so viele Kreise erscheinen */
  var BILD_BASIS =
    "https://cdn.jsdelivr.net/gh/Softano/softano-shop@main/team/";

  /* ---- Kontaktweg je Sprache. Bewusst allgemein, keine Durchwahlen. --
     Deutsch: kostenfreie deutsche Nummer. Englisch und Griechisch: die
     griechische Nummer, weil die 0800 nur aus Deutschland erreichbar
     ist — ein Auslaender liefe dort ins Leere. */
  var TEL = {
    de: { nummer: "0800 588 55 22",  link: "tel:0080058855222",
          hint: "[kostenfrei aus dem deutschen Festnetz]" },
    en: { nummer: "+30 2311 181662", link: "tel:+302311181662",
          hint: "[Greek landline rates]" },
    el: { nummer: "2311 181662",     link: "tel:+302311181662",
          hint: "[χρέωση ελληνικού σταθερού]" }
  };

  /* Zielseite des Knopfes, je Sprache */
  var B2B = { de: "/de/b2b", en: "/b2b", el: "/el/b2b" };

  /* ---- Texte. Die Fakten haengen am Sortiment, nicht am Shop:
     Software, Hardware und Komplettsysteme verlangen andere Zusagen.
     Erkannt wird das an der obersten Kategorie in der Brotkrumenleiste.
     Die Hardware-Zusagen sind bewusst vorsichtig formuliert — solange
     die Lieferanten nicht feststehen, versprechen wir weder Lagerware
     noch Lieferfristen. ------------------------------------------------ */
  var T = {
    de: {
      auge: "Beratung",
      titel: "Unsere Expertise – Ihr Vorteil",
      text: "Sprechen Sie direkt mit einem Lizenzexperten – kostenlos und unverbindlich.",
      knopf: "Beratung anfragen"
    },
    en: {
      auge: "Consulting",
      titel: "Our expertise – your advantage",
      text: "Talk directly to a licensing expert – free of charge and without obligation.",
      knopf: "Request advice"
    },
    el: {
      auge: "Συμβουλευτική",
      titel: "Η τεχνογνωσία μας – το πλεονέκτημά σας",
      text: "Μιλήστε απευθείας με έναν ειδικό αδειοδότησης – δωρεάν και χωρίς δέσμευση.",
      knopf: "Ζητήστε συμβουλή"
    }
  };

  var FAKTEN = {
    software: {
      de: [["Kostenlose Lizenzberatung", "Ausführlich und herstellerunabhängig"],
           ["Digitale Lieferung",        "Lizenzschlüssel und Zertifikat per E-Mail"],
           ["Geprüfte Lizenzen",         "Rechtssicher und auditkonform"]],
      en: [["Free licensing advice", "Thorough and vendor-independent"],
           ["Digital delivery",      "Licence key and certificate by e-mail"],
           ["Verified licences",     "Legally sound and audit-compliant"]],
      el: [["Δωρεάν συμβουλές αδειοδότησης", "Αναλυτικά και ανεξάρτητα"],
           ["Ψηφιακή παράδοση",              "Κλειδί και πιστοποιητικό με e-mail"],
           ["Ελεγμένες άδειες",              "Νομικά ασφαλείς και ελεγχόμενες"]]
    },
    hardware: {
      de: [["Kostenlose Konfigurationsberatung", "Passend zu Ihrer Infrastruktur"],
           ["Geprüfte Hardware",                 "Neuware und Refurbished"],
           ["Lieferung mit Nachweis",            "Rechnung und Herstellerunterlagen"]],
      en: [["Free configuration advice", "Matched to your infrastructure"],
           ["Verified hardware",         "New and refurbished"],
           ["Documented delivery",       "Invoice and manufacturer papers"]],
      el: [["Δωρεάν συμβουλές διαμόρφωσης", "Προσαρμοσμένες στην υποδομή σας"],
           ["Ελεγμένος εξοπλισμός",         "Καινούριος και refurbished"],
           ["Παράδοση με τεκμηρίωση",       "Τιμολόγιο και έγγραφα κατασκευαστή"]]
    },
    system: {
      de: [["Kostenlose Projektberatung", "Hardware und Lizenzen aus einer Hand"],
           ["Abgestimmt konfiguriert",    "Passend zum geplanten Einsatzzweck"],
           ["Rechtssichere Lizenzierung", "Auditkonform dokumentiert"]],
      en: [["Free project advice",     "Hardware and licences from one source"],
           ["Configured to purpose",   "Matched to the intended workload"],
           ["Compliant licensing",     "Documented and audit-ready"]],
      el: [["Δωρεάν συμβουλές έργου",   "Εξοπλισμός και άδειες από μία πηγή"],
           ["Στοχευμένη διαμόρφωση",    "Προσαρμοσμένη στη χρήση"],
           ["Συμβατή αδειοδότηση",      "Τεκμηριωμένη και έτοιμη για έλεγχο"]]
    }
  };

  /* Welches Sortiment? Die oberste Kategorie steht in der
     Brotkrumenleiste. Erkannt wird an Wortstaemmen, damit es in allen
     drei Sprachen ohne eigene Liste funktioniert. */
  var HARDWARE = /(hardware|infrastruktur|infrastructure|εξοπλισμ|υποδομ)/i;
  var SYSTEM   = /(komplett|complete|solution|ολοκληρωμ|συστήματα)/i;

  function sortiment() {
    var b = document.querySelector(".ec-breadcrumbs");
    var txt = b ? b.textContent : "";
    if (SYSTEM.test(txt))   return "system";
    if (HARDWARE.test(txt)) return "hardware";
    return "software";
  }

  function lang() {
    var p = location.pathname;
    if (/^\/de(\/|$)/.test(p)) return "de";
    if (/^\/el(\/|$)/.test(p)) return "el";
    return "en";
  }
  function t() { return T[lang()] || T.en; }

  function isBlockedPage() {
    var p = location.pathname;
    return /(^|\/)(cart|checkout)(\/|$)/.test(p) || /\/pages\//.test(p);
  }

  function esc(x) {
    return (x == null ? "" : String(x))
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* Gezeichnete Silhouette — braucht keine Datei und faellt nie aus. */
  function silhouette() {
    return '<svg viewBox="0 0 48 48" aria-hidden="true">' +
           '<circle cx="24" cy="18" r="8"/>' +
           '<path d="M8 44c0-8.8 7.2-14 16-14s16 5.2 16 14z"/></svg>';
  }

  function avatare() {
    var out = "", n = Math.max(TEAM.length, TEAM_SLOTS);
    for (var i = 0; i < n; i++) {
      var m = TEAM[i];
      if (m && m.datei) {
        /* Faellt die Datei aus, ersetzt onerror sie durch die
           Silhouette — die Seite bleibt also heil. */
        out += '<span class="sof-t-av" title="' + esc(m.name || "") + '">' +
               '<img src="' + BILD_BASIS + esc(m.datei) + '" alt="' +
               esc(m.name || "") + '" loading="lazy" ' +
               'onerror="this.parentNode.innerHTML=\'' +
               silhouette().replace(/'/g, "&#39;") + '\'">' +
               "</span>";
      } else {
        out += '<span class="sof-t-av sof-t-av--leer">' + silhouette() + "</span>";
      }
    }
    return out;
  }

  /* ---- 1. Beratungskasten -------------------------------------------- */
  function kasten() {
    var d = document.querySelector(".grid__description");
    if (!d || d.querySelector(".sof-t-box")) return;
    if (!d.querySelector(".grid__description-inner")) return;

    var x = t(), tel = TEL[lang()] || TEL.en;
    var box = document.createElement("aside");
    box.className = "sof-t-box";
    box.innerHTML =
      '<div class="sof-t-auge">' + esc(x.auge) + "</div>" +
      '<div class="sof-t-titel">' + esc(x.titel) + "</div>" +
      '<p class="sof-t-text">' + esc(x.text) + "</p>" +
      '<div class="sof-t-avs">' + avatare() + "</div>" +
      '<a class="sof-t-knopf" href="' + (B2B[lang()] || B2B.en) + '">' +
        esc(x.knopf) + '<span class="sof-t-pfeil">→</span></a>' +
      '<div class="sof-t-tel"><a href="' + tel.link + '">' +
        esc(tel.nummer) + "</a><span>" + esc(tel.hint) + "</span></div>";
    d.appendChild(box);
    d.classList.add("sof-t-on");
  }

  /* ---- 2. Fakten-Leiste ---------------------------------------------- */
  var ICONS = {
    beratung: '<path d="M12 3a9 9 0 0 0-9 9v4a3 3 0 0 0 3 3h1v-8H5v-1a7 7 0 0 1 14 0v1h-2v8h1a3 3 0 0 0 3-3v-4a9 9 0 0 0-9-9z"/>',
    lieferung: '<path d="M13 2 3 14h7l-1 8 10-12h-7z"/>',
    geprueft: '<path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" fill="none" stroke="currentColor" stroke-width="2"/><path d="m9 12 2 2 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  };

  function fakt(icon, titel, sub) {
    return '<div class="sof-f-item">' +
             '<span class="sof-f-ic"><svg viewBox="0 0 24 24">' + icon +
             "</svg></span>" +
             '<span class="sof-f-tx"><b>' + esc(titel) + "</b>" +
             "<i>" + esc(sub) + "</i></span></div>";
  }

  /* Die Leiste haengt unter dem Beschreibungstext, NICHT ueber den
     Produkten. Zwei Gruende: Auf den Ueberkategorieseiten
     (/products/office-productivity und die drei anderen) gibt es gar
     keine Produktliste, sondern nur Unterkategorien — dort fehlte sie
     sonst ganz. Und links unter dem Text stand eine leere Flaeche,
     weil der Beratungskasten rechts hoeher ist als der Text. Die
     Leiste fuellt sie. */
  function leiste() {
    var ziel = document.querySelector(".grid__description-inner");
    if (!ziel) {                       /* Kategorie ohne Beschreibung */
      var g = document.querySelector(".grid__products");
      if (!g || !g.parentNode) return;
      if (g.parentNode.querySelector(".sof-f-bar")) return;
      ziel = null;
    } else if (ziel.querySelector(".sof-f-bar")) return;

    var satz = (FAKTEN[sortiment()] || FAKTEN.software);
    var f = satz[lang()] || satz.en;
    var reihe = [ICONS.beratung, ICONS.lieferung, ICONS.geprueft];
    var bar = document.createElement("div");
    bar.className = "sof-f-bar";
    bar.innerHTML = f.map(function (e, i) {
      return fakt(reihe[i], e[0], e[1]);
    }).join("");

    if (ziel) {
      ziel.appendChild(bar);
    } else {
      var g2 = document.querySelector(".grid__products");
      if (g2 && g2.parentNode) g2.parentNode.insertBefore(bar, g2);
    }
  }

  function scan() {
    if (isBlockedPage()) return;
    kasten();
    leiste();
  }

  function burst() {
    if (isBlockedPage()) return;
    var n = 0;
    (function step() {
      scan();
      var fertig = document.querySelector(".sof-f-bar");
      if (fertig || ++n >= 25) return;
      setTimeout(step, 200);
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
