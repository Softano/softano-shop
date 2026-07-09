/* =====================================================================
   SOFTANO.EU — ZUSTAND-BADGE v4 (Phase 1: nur Volumen-Server, 33 SKUs)
   Setzt "Pre-Owned" als zweites Label unter das "Live Delivery"-Ribbon
   auf Produktkarten in Kategorie-Listen.
   Quelle: generierte SKU-Liste (Klassifizierung v3, Zustand=Pre-Owned).
   Greift NICHT ins Homepage-Karussell (dort steht keine SKU im DOM).
   v2: haengt sich in .grid-product__label statt frei ueber die Karte.
   v3: blendet auf der Produktseite die Attributzeile "Lizenzform" aus
       (Ecwid rendert keine pro-Attribut-Klasse -> Textmatch noetig) und
       legt den Wert als data-sof-lizenzform auf <html> + window.SOF_LIZENZFORM ab.
   v4: Wert wird NUR bei echtem Seitenwechsel geleert. Ein Leerdurchlauf des
       MutationObservers (Ecwid/Vue rendert die Attributzeile kurz neu) darf
       den Wert nicht loeschen -- genau daran ist v3 gescheitert.
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

  /* Produktseite: Attributzeile "Lizenzform" verstecken + Wert exportieren */
  function resetAttr() {
    window.SOF_LIZENZFORM = null;
    document.documentElement.removeAttribute("data-sof-lizenzform");
  }

  function syncAttr() {
    var rows = document.querySelectorAll(".details-product-attribute");
    for (var i = 0; i < rows.length; i++) {
      var t = rows[i].querySelector(".details-product-attribute__title");
      var v = rows[i].querySelector(".details-product-attribute__value");
      if (!t || !v) continue;                       // Zeile gerade im Re-Render
      if (!/^\s*Lizenzform\s*:/.test(t.textContent || "")) continue;
      rows[i].classList.add("sof-attr");            // idempotent
      var val = (v.textContent || "").trim();
      if (!val) continue;
      window.SOF_LIZENZFORM = val;
      document.documentElement.setAttribute("data-sof-lizenzform", val);
    }
    /* Bewusst KEIN Loeschen im Leerfall -- siehe v4-Notiz oben. */
  }

  function scan() {
    var cards = document.querySelectorAll(".grid-product");
    for (var i = 0; i < cards.length; i++) mark(cards[i]);
    syncAttr();
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
    if (window.Ecwid && Ecwid.OnPageSwitch) Ecwid.OnPageSwitch.add(function () {
      resetAttr();                                  // nur hier ist Leeren korrekt
      sched();
    });
  }

  if (document.body) boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();
