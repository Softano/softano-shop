/* =====================================================================
   SOFTANO.EU — KARTEN-BADGE ISOLIERT-TEST (nur Kategorie-Karten)
   ---------------------------------------------------------------------
   Zweck: klaeren, ob das Einfuegen des Pre-Owned-Labels auf Kategorie-
   Karten den Ecwid-Router bricht (Warenkorb/Popup) — oder ob nur die
   Sidebar-Panel-Injektion (badge.js v10/v11) das Problem war.
   KEIN Panel, KEIN Sidebar-Eingriff, KEIN body-MutationObserver.
   Trigger: Ecwid.OnPageLoaded / OnPageSwitch + kurzer rAF-Burst.
   Guard: auf Cart/Checkout/Pages gar nichts tun.
   Eigener Namespace __SOF_CARD__ (kollidiert nicht mit Produktiv-badge.js).
   ===================================================================== */
(function () {
  "use strict";
  if (window.__SOF_CARD__) return;
  window.__SOF_CARD__ = true;

  var LABEL = "Pre-Owned";            // in allen drei Sprachen identisch
  var PREOWNED = {};
  [ "33000","33010","33014","33030","33040","33044","33100","33110","33114","33130",
    "33140","33144","33150","33160","33164","33180","33190","33194","33200","33210",
    "33220","33230","33240","33250","33260","33270","33280","33410","33420","33430",
    "33440","33450","33460"
  ].forEach(function (s) { PREOWNED[s] = 1; });

  /* Router-Seiten NIE anfassen */
  function isBlockedPage() {
    var p = location.pathname;
    return /(^|\/)(cart|checkout)(\/|$)/.test(p) || /\/pages\//.test(p);
  }

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

  function scan() {
    if (isBlockedPage()) return;                          // Router-Seiten nie anfassen
    var cards = document.querySelectorAll(".grid-product");
    for (var i = 0; i < cards.length; i++) mark(cards[i]);
  }

  /* Nach Page-Event kann das DOM noch nachladen: ein paar rAF-Frames, dann Stopp.
     Beruehrt nur Kategorie-Karten; laeuft NACH der Hydration, nie mittendrin. */
  function scanBurst() {
    if (isBlockedPage()) return;
    var tries = 0, max = 20;                              // ~20 Frames (<0.4s)
    (function step() {
      scan();
      if (++tries >= max) return;
      requestAnimationFrame(step);
    })();
  }

  function boot() {
    scanBurst();
    if (window.Ecwid && Ecwid.OnPageLoaded) Ecwid.OnPageLoaded.add(scanBurst);
    if (window.Ecwid && Ecwid.OnPageSwitch) Ecwid.OnPageSwitch.add(scanBurst);
  }

  if (document.body) boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();
