/* =====================================================================
   SOFTANO.EU — SPRACH-AUTO-WEITERLEITUNG v2 (router-sicher)
   ---------------------------------------------------------------------
   Ersetzt die alte Detection, die window.location.replace() bei JEDEM
   Seitenwechsel feuerte und Ecwids Cart/Page-Router zerlegte.
   v2 laeuft EINMAL, ganz frueh, ohne DOM-Eingriff, ohne Ecwid-Hooks.

   VERHALTEN (bestaetigt 11.07.2026):
   1. Nur beim allerersten Besuch (Cookie merkt sich "erledigt").
   2. Browsersprache: de* -> /de/ , el* -> /el/ , sonst -> bleibt (EN Default).
   3. Nutzerwille schlaegt Automatik: wer auf /de/ oder /el/ ist (auch nach
      manuellem Switch), bekommt das Cookie -> keine Auto-Umleitung mehr.
   4. Nur von der nackten Startseite "/" — nie von Deep-Links/Produktseiten.
   5. Nur echte Besucher — bekannte Bots (Googlebot etc.) werden NICHT umgeleitet.
   6. EN-Browser: keine Umleitung.

   SICHERHEIT:
   - Kein Ecwid.OnPageLoaded/OnPageSwitch, kein MutationObserver, kein DOM-Insert.
   - Guard: bricht sofort ab auf allem ausser exakt "/" (bzw. leer).
   - Setzt das "erledigt"-Cookie auch auf /de//el/, damit Nutzerwahl bleibt.

   >>> TEST_MODE = true  ->  leitet NICHT um, schreibt nur in die Konsole,
       was es tun WUERDE. Zum scharf schalten: TEST_MODE = false.
   ===================================================================== */
(function () {
  "use strict";

  var TEST_MODE = false;  // SCHARF: echte Weiterleitung aktiv (12.07.2026 verifiziert).

  var COOKIE = "sof_lang_done";
  var DEFAULT_LANG = "en";           // nackte Domain = EN

  // ---- Helfer ----
  function getCookie(name) {
    var m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
    return m ? decodeURIComponent(m[1]) : null;
  }
  function setCookie(name, val, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 864e5);
    document.cookie = name + "=" + encodeURIComponent(val) +
      "; expires=" + d.toUTCString() + "; path=/; SameSite=Lax";
  }
  function pathLang() {
    var p = location.pathname;
    if (/^\/de(\/|$)/.test(p)) return "de";
    if (/^\/el(\/|$)/.test(p)) return "el";
    return null;                     // praefixlos = Default/EN
  }
  function browserLang() {
    var l = (navigator.language || navigator.userLanguage || "").toLowerCase();
    if (l.indexOf("de") === 0) return "de";
    if (l.indexOf("el") === 0) return "el";
    return DEFAULT_LANG;
  }
  function isBot() {
    var ua = (navigator.userAgent || "").toLowerCase();
    return /bot|crawl|spider|slurp|bingpreview|googlebot|bingbot|duckduckbot|baiduspider|yandex|facebookexternalhit|twitterbot|linkedinbot|embedly|quora|pinterest|slackbot|whatsapp|telegrambot/.test(ua);
  }
  function isHomeRoot() {
    // exakt Startseite: "/" oder "" (manche Ecwid-Setups liefern "")
    var p = location.pathname;
    return p === "/" || p === "" || p === "/index.html";
  }

  // ---- Kernlogik ----
  function run() {
    var reason;

    // (A) Nutzer ist bereits auf einer Sprachseite -> Wille respektieren, Cookie setzen, fertig.
    var pl = pathLang();
    if (pl) {
      if (!getCookie(COOKIE)) {
        if (TEST_MODE) console.log("[SOF-LANG] Nutzer auf /" + pl + "/ -> Cookie 'erledigt' setzen (kein Redirect).");
        else setCookie(COOKIE, pl, 365);
      }
      return;
    }

    // (B) Ab hier: praefixlose Seite. Nur die Startseite darf umleiten.
    if (!isHomeRoot()) {
      if (TEST_MODE) console.log("[SOF-LANG] Praefixlose Nicht-Startseite (" + location.pathname + ") -> nichts tun (Deep-Link-Schutz).");
      return;
    }

    // (C) Schon erledigt? -> nie wieder automatisch.
    if (getCookie(COOKIE)) {
      if (TEST_MODE) console.log("[SOF-LANG] Cookie '" + COOKIE + "' vorhanden -> keine Auto-Umleitung.");
      return;
    }

    // (D) Bot? -> nicht umleiten (SEO-Schutz).
    if (isBot()) {
      if (TEST_MODE) console.log("[SOF-LANG] Bot erkannt -> keine Umleitung.");
      return;
    }

    // (E) Zielsprache aus Browser bestimmen.
    var want = browserLang();
    if (want === DEFAULT_LANG) {
      // EN: keine Umleitung, aber Cookie setzen (Erstbesuch abgehakt).
      if (TEST_MODE) console.log("[SOF-LANG] Browsersprache EN/sonst -> bleiben auf '/', Cookie setzen.");
      else setCookie(COOKIE, DEFAULT_LANG, 365);
      return;
    }

    // (F) DE oder EL: Ziel-URL bauen (Startseite der Sprache), Cookie setzen, umleiten.
    var target = location.origin + "/" + want + "/";
    if (TEST_MODE) {
      console.log("[SOF-LANG] WUERDE umleiten: Browser=" + want + " -> " + target + "  (TEST_MODE aktiv, keine echte Umleitung)");
      return;
    }
    setCookie(COOKIE, want, 365);
    // location.replace = kein History-Eintrag (Back-Button springt nicht zurueck auf "/").
    location.replace(target);
  }

  // So frueh wie moeglich, ohne auf Ecwid zu warten.
  try { run(); } catch (e) { if (TEST_MODE) console.log("[SOF-LANG] Fehler:", e); }
})();
