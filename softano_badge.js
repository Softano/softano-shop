/* =====================================================================
   SOFTANO.EU — ZUSTAND-BADGE v1 (Phase 1: nur Volumen-Server, 33 SKUs)
   Setzt "Pre-Owned" oben rechts auf Produktkarten in Kategorie-Listen.
   Quelle: generierte SKU-Liste (Klassifizierung v3, Zustand=Pre-Owned).
   Greift NICHT ins Homepage-Karussell (dort steht keine SKU im DOM).
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
    var host = card.querySelector(".grid-product__wrap-inner") || card;
    host.classList.add("sof-cond-host");
    var b = document.createElement("span");
    b.className = "sof-cond";
    b.textContent = LABEL;
    host.appendChild(b);
  }

  function scan() {
    var cards = document.querySelectorAll(".grid-product");
    for (var i = 0; i < cards.length; i++) mark(cards[i]);
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
