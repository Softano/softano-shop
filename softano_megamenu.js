/* =====================================================================
   SOFTANO.EU — MEGA-MENU v1 (Produktions-JS)
   Einfügen in: Ecwid-Admin > Website > Overview > Advanced website
   settings > Custom JavaScript code  (NEUER Block, vorhandene
   Sprach-Detection NICHT überschreiben — einfach darunter einfügen).
   Nur Desktop (>=921px). Mobil bleibt das native Ecwid-Menü aktiv.
   Hängt sich an die ECHTEN Ecwid-Header-Elemente; ersetzt nichts.
   ===================================================================== */
(function(){
  "use strict";
  if (window.__SOF_MEGA__) return; window.__SOF_MEGA__ = true;

  /* ---------- KONFIG ---------- */
  var TREE = [{"en": "Operating Systems & Server Licenses", "de": "Betriebssysteme & Server-Lizenzen", "el": "Λειτουργικά Συστήματα & Άδειες Server", "st": "", "c": [{"en": "Windows", "de": "Windows", "el": "Windows", "st": "", "c": [{"en": "Windows 11", "de": "Windows 11", "el": "Windows 11", "st": ""}, {"en": "Windows 10", "de": "Windows 10", "el": "Windows 10", "st": ""}]}, {"en": "Windows Server", "de": "Windows Server", "el": "Windows Server", "st": "", "c": [{"en": "Windows Server 2025", "de": "Windows Server 2025", "el": "Windows Server 2025", "st": ""}, {"en": "Windows Server 2022", "de": "Windows Server 2022", "el": "Windows Server 2022", "st": ""}, {"en": "Windows Server 2019", "de": "Windows Server 2019", "el": "Windows Server 2019", "st": ""}]}, {"en": "Microsoft SQL Server", "de": "Microsoft SQL Server", "el": "Microsoft SQL Server", "st": "", "c": [{"en": "SQL Server 2025", "de": "SQL Server 2025", "el": "SQL Server 2025", "st": ""}, {"en": "SQL Server 2022", "de": "SQL Server 2022", "el": "SQL Server 2022", "st": ""}, {"en": "SQL Server 2019", "de": "SQL Server 2019", "el": "SQL Server 2019", "st": ""}]}, {"en": "Windows Server Access Licenses CAL", "de": "Windows Server Zugriffslizenzen CAL", "el": "Άδειες πρόσβασης Windows Server CAL", "st": "", "c": [{"en": "Windows Server 2025 CAL", "de": "Windows Server 2025 CAL", "el": "Windows Server 2025 CAL", "st": ""}, {"en": "Windows Server 2022 CAL", "de": "Windows Server 2022 CAL", "el": "Windows Server 2022 CAL", "st": ""}, {"en": "Windows Server 2019 CAL", "de": "Windows Server 2019 CAL", "el": "Windows Server 2019 CAL", "st": ""}]}, {"en": "RDS Access Licenses CAL", "de": "RDS Zugriffslizenzen CAL", "el": "Άδειες πρόσβασης RDS CAL", "st": "", "c": [{"en": "Remote Desktop 2025 CAL", "de": "Remote Desktop 2025 CAL", "el": "Remote Desktop 2025 CAL", "st": ""}, {"en": "Remote Desktop 2022 CAL", "de": "Remote Desktop 2022 CAL", "el": "Remote Desktop 2022 CAL", "st": ""}, {"en": "Remote Desktop 2019 CAL", "de": "Remote Desktop 2019 CAL", "el": "Remote Desktop 2019 CAL", "st": ""}]}, {"en": "SQL Access Licenses CAL", "de": "SQL Zugriffslizenzen CAL", "el": "Άδειες πρόσβασης SQL CAL", "st": "", "c": [{"en": "SQL Server 2025 CAL", "de": "SQL Server 2025 CAL", "el": "SQL Server 2025 CAL", "st": ""}, {"en": "SQL Server 2022 CAL", "de": "SQL Server 2022 CAL", "el": "SQL Server 2022 CAL", "st": ""}, {"en": "SQL Server 2019 CAL", "de": "SQL Server 2019 CAL", "el": "SQL Server 2019 CAL", "st": ""}]}]}, {"en": "Office & Productivity", "de": "Office & Produktivität", "el": "Office & Παραγωγικότητα", "st": "", "c": [{"en": "Office Suites for Windows", "de": "Office Suiten für Windows", "el": "Σουίτες Office για Windows", "st": "", "c": [{"en": "Microsoft Office 2024", "de": "Microsoft Office 2024", "el": "Microsoft Office 2024", "st": ""}, {"en": "Microsoft Office 2021", "de": "Microsoft Office 2021", "el": "Microsoft Office 2021", "st": ""}, {"en": "Microsoft Office 2019", "de": "Microsoft Office 2019", "el": "Microsoft Office 2019", "st": ""}]}, {"en": "Office Suites for Mac", "de": "Office Suiten für Mac", "el": "Σουίτες Office για Mac", "st": "", "c": [{"en": "Microsoft Office 2024 for Mac", "de": "Microsoft Office 2024 für Mac", "el": "Microsoft Office 2024 για Mac", "st": ""}, {"en": "Microsoft Office 2021 for Mac", "de": "Microsoft Office 2021 für Mac", "el": "Microsoft Office 2021 για Mac", "st": ""}, {"en": "Microsoft Office 2019 for Mac", "de": "Microsoft Office 2019 für Mac", "el": "Microsoft Office 2019 για Mac", "st": ""}]}, {"en": "Office Applications", "de": "Office Einzelanwendungen", "el": "Μεμονωμένες εφαρμογές Office", "st": "", "c": [{"en": "Microsoft Word", "de": "Microsoft Word", "el": "Microsoft Word", "st": ""}, {"en": "Microsoft Excel", "de": "Microsoft Excel", "el": "Microsoft Excel", "st": ""}, {"en": "Microsoft Outlook", "de": "Microsoft Outlook", "el": "Microsoft Outlook", "st": ""}, {"en": "Microsoft PowerPoint", "de": "Microsoft PowerPoint", "el": "Microsoft PowerPoint", "st": ""}, {"en": "Microsoft Access", "de": "Microsoft Access", "el": "Microsoft Access", "st": ""}, {"en": "Microsoft Publisher", "de": "Microsoft Publisher", "el": "Microsoft Publisher", "st": ""}, {"en": "Microsoft OneNote", "de": "Microsoft OneNote", "el": "Microsoft OneNote", "st": ""}]}, {"en": "Microsoft Visio", "de": "Microsoft Visio", "el": "Microsoft Visio", "st": "", "c": [{"en": "Microsoft Visio 2024", "de": "Microsoft Visio 2024", "el": "Microsoft Visio 2024", "st": ""}, {"en": "Microsoft Visio 2021", "de": "Microsoft Visio 2021", "el": "Microsoft Visio 2021", "st": ""}, {"en": "Microsoft Visio 2019", "de": "Microsoft Visio 2019", "el": "Microsoft Visio 2019", "st": ""}]}, {"en": "Microsoft Project", "de": "Microsoft Project", "el": "Microsoft Project", "st": "", "c": [{"en": "Microsoft Project 2024", "de": "Microsoft Project 2024", "el": "Microsoft Project 2024", "st": ""}, {"en": "Microsoft Project 2021", "de": "Microsoft Project 2021", "el": "Microsoft Project 2021", "st": ""}, {"en": "Microsoft Project 2019", "de": "Microsoft Project 2019", "el": "Microsoft Project 2019", "st": ""}]}, {"en": "Microsoft Visual Studio", "de": "Microsoft Visual Studio", "el": "Microsoft Visual Studio", "st": "", "c": [{"en": "Microsoft Visual Studio 2026", "de": "Microsoft Visual Studio 2026", "el": "Microsoft Visual Studio 2026", "st": ""}, {"en": "Microsoft Visual Studio 2022", "de": "Microsoft Visual Studio 2022", "el": "Microsoft Visual Studio 2022", "st": ""}, {"en": "Microsoft Visual Studio 2019", "de": "Microsoft Visual Studio 2019", "el": "Microsoft Visual Studio 2019", "st": ""}]}]}, {"en": "Virtualization & Backup", "de": "Virtualisierung & Backup", "el": "Εικονικοποίηση & Backup", "st": "", "c": [{"en": "VMware", "de": "VMware", "el": "VMware", "st": "", "c": [{"en": "vSphere", "de": "vSphere", "el": "vSphere", "st": ""}, {"en": "Cloud Foundation", "de": "Cloud Foundation", "el": "Cloud Foundation", "st": ""}, {"en": "vSAN", "de": "vSAN", "el": "vSAN", "st": ""}]}, {"en": "Proxmox", "de": "Proxmox", "el": "Proxmox", "st": "", "c": [{"en": "Virtual Environment", "de": "Virtual Environment", "el": "Virtual Environment", "st": ""}, {"en": "Backup Server", "de": "Backup Server", "el": "Backup Server", "st": ""}, {"en": "Mail Gateway", "de": "Mail Gateway", "el": "Mail Gateway", "st": ""}]}, {"en": "Acronis", "de": "Acronis", "el": "Acronis", "st": "", "c": [{"en": "Cyber Protect", "de": "Cyber Protect", "el": "Cyber Protect", "st": ""}, {"en": "Cyber Protect Backup", "de": "Cyber Protect Backup", "el": "Cyber Protect Backup", "st": ""}, {"en": "Cloud Storage", "de": "Cloud Storage", "el": "Cloud Storage", "st": ""}, {"en": "True Image", "de": "True Image", "el": "True Image", "st": ""}]}, {"en": "Veeam", "de": "Veeam", "el": "Veeam", "st": "", "c": [{"en": "Data Platform", "de": "Data Platform", "el": "Data Platform", "st": ""}, {"en": "Backup for Microsoft 365", "de": "Backup for Microsoft 365", "el": "Backup for Microsoft 365", "st": ""}]}, {"en": "HPE Aruba", "de": "HPE Aruba", "el": "HPE Aruba", "st": "", "c": [{"en": "Central", "de": "Central", "el": "Central", "st": ""}]}]}, {"en": "Infrastructure & Server Hardware", "de": "Infrastruktur & Server-Hardware", "el": "Υποδομή & Server Hardware", "st": "", "c": [{"en": "Servers", "de": "Server", "el": "Server", "st": "NEU", "c": [{"en": "Rack Servers", "de": "Rack-Server", "el": "Rack Servers", "st": "NEU"}, {"en": "Tower Servers", "de": "Tower-Server", "el": "Tower Servers", "st": "NEU"}, {"en": "Blade Servers & Chassis", "de": "Blade-Server & Chassis", "el": "Blade Servers & Chassis", "st": "NEU"}]}, {"en": "Workstations", "de": "Workstations", "el": "Workstations", "st": "NEU"}, {"en": "Storage", "de": "Storage", "el": "Storage", "st": "NEU", "c": [{"en": "NAS", "de": "NAS", "el": "NAS", "st": "NEU"}, {"en": "SAN", "de": "SAN", "el": "SAN", "st": "NEU"}, {"en": "Tape / Backup", "de": "Tape / Backup", "el": "Tape / Backup", "st": "NEU"}]}, {"en": "Networking", "de": "Netzwerk", "el": "Δικτύωση", "st": "NEU", "c": [{"en": "Switches", "de": "Switches", "el": "Switches", "st": "NEU"}, {"en": "Firewalls", "de": "Firewalls", "el": "Firewalls", "st": "NEU"}, {"en": "Access Points", "de": "Access Points", "el": "Access Points", "st": "NEU"}]}, {"en": "Racks & UPS", "de": "Racks & USV", "el": "Racks & UPS", "st": "NEU"}, {"en": "Microsoft Surface", "de": "Microsoft Surface", "el": "Microsoft Surface", "st": "NEU"}]}];
  var FEAT = [{"slug": "windows-server-2025-standard-16-core-volume", "en": ["Microsoft Windows Server 2025 Standard 16-Core Volume 64-bit Multilingual Perpetual Licence", ""], "de": ["Microsoft Windows Server 2025 Standard 16-Core Volumen 64Bit Mehrsprachig Dauerlizenz", ""], "el": ["Microsoft Windows Server 2025 Standard 16-Core Volume 64Bit Πολύγλωσσο Μόνιμη Άδεια", ""], "sku": "33000", "lief": {"en": "Delivered same business day", "de": "Lieferung am selben Werktag", "el": "Παράδοση αυθημερόν"}, "bild": true}, {"slug": "office-2024-professional-plus", "en": ["Microsoft Office 2024 Professional Plus", ""], "de": ["Microsoft Office 2024 Professional Plus", ""], "el": ["Microsoft Office 2024 Professional Plus", ""], "sku": "20004", "lief": {"en": "Delivered in 5-15 minutes", "de": "Lieferung in 5-15 Minuten", "el": "Παράδοση σε 5-15 λεπτά"}, "bild": true}, {"sku": "63140", "slug": "acronis-cyber-protect-standard-workstation", "en": ["Acronis Cyber Protect Standard Workstation", ""], "de": ["Acronis Cyber Protect Standard Workstation", ""], "el": ["Acronis Cyber Protect Standard Workstation", ""], "lief": {"en": "Delivered in 1-3 business days", "de": "Lieferung in 1-3 Werktagen", "el": "Παράδοση σε 1-3 εργάσιμες"}, "bild": true}, {"anfrage": true, "tag": {"en": "ON REQUEST", "de": "AUF ANFRAGE", "el": "ΚΑΤΟΠΙΝ ΑΙΤΗΜΑΤΟΣ"}, "btn": {"en": "Send enquiry", "de": "Anfrage stellen", "el": "Υποβολή αιτήματος"}, "en": ["Server hardware built to your spec", "Rack, tower and blade servers, storage, networking and workstations — new or refurbished (A+). Tell us what you need and we will configure it."], "de": ["Server-Hardware nach Ihren Vorgaben", "Rack-, Tower- und Blade-Server, Storage, Netzwerk und Workstations — neu oder refurbished (A+). Sagen Sie uns, was Sie brauchen, wir konfigurieren es."], "el": ["Server hardware σύμφωνα με τις προδιαγραφές σας", "Rack, tower και blade servers, storage, δίκτυο και workstations — καινούρια ή refurbished (A+). Πείτε μας τι χρειάζεστε και το διαμορφώνουμε."]}];
  var I18N = {"btn": {"en": "View offer", "de": "Zum Angebot", "el": "Δείτε προσφορά"}, "tag": {"en": "TOPSELLER", "de": "TOPSELLER", "el": "TOPSELLER"}};
  // Optionale Slug-Korrekturen (falls ein bestehender Link nicht automatisch
  // gefunden wird): { "Exakter EN-Name": "ecwid-slug" }
  var SLUG_OVERRIDE = {"Windows Server Access Licenses CAL": "access-licenses-cal", "RDS Access Licenses CAL": "access-licenses-cal", "SQL Access Licenses CAL": "access-licenses-cal"};
  var DESK_MIN = 921;         // ab dieser Breite Mega-Menu aktiv
  var CLOSE_DELAY = 140;      // ms Puffer beim Wechsel Top-Punkt -> Panel
  /* ---------------------------- */

  function lang(){
    var p = location.pathname;
    if (/^\/de(\/|$)/.test(p)) return "de";
    if (/^\/el(\/|$)/.test(p)) return "el";
    var h = (document.documentElement.lang||"").toLowerCase();
    if (h.indexOf("de")===0) return "de";
    if (h.indexOf("el")===0) return "el";
    return "en";
  }
  function tx(o){ var L=lang(); return o[L]||o.en; }
  function nwLabel(){ var m={de:"BALD",en:"SOON",el:"\u03A3\u03A5\u039D\u03A4\u039F\u039C\u0391"}; return m[lang()]||m.en; }
  function norm(s){ return (s||"").replace(/\u00a0/g," ").replace(/\s+/g," ").trim().toLowerCase(); }
  function slugify(s){
    return (s||"").toLowerCase().replace(/&/g," ").replace(/[^a-z0-9]+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"");
  }
  function desk(){ return window.innerWidth >= DESK_MIN; }

  /* ---------- Link-Index aus dem nativen Menü harvesten ---------- */
  var byLabel={}, bySlug={};
  function harvest(menu){
    byLabel={}; bySlug={};
    var as = menu.querySelectorAll("a[href]");
    for (var i=0;i<as.length;i++){
      var a=as[i], href=a.getAttribute("href"); if(!href) continue;
      var lab=norm(a.textContent); if(lab && !(lab in byLabel)) byLabel[lab]=href;
      var m=href.match(/\/products\/([^\/?#]+)/);
      if(m){ var sg=m[1].toLowerCase(); if(!(sg in bySlug)) bySlug[sg]=href; }
    }
  }
  // liefert href (string) für existierende Kategorie, sonst null (=geplant/NEU)
  function hrefFor(node){
    var sg = SLUG_OVERRIDE[node.en] || slugify(node.en);
    var lab = norm(tx(node));
    // 1) Harvest (am genauesten, falls vorhanden)
    if (byLabel[lab]) return byLabel[lab];
    if (bySlug[sg]) return bySlug[sg];
    // 2) Bestehende Kategorie (nicht NEU): URL aus bestaetigtem Muster bauen
    if (node.st !== "NEU"){
      var L = lang();
      return location.origin + (L==="en" ? "" : "/"+L) + "/products/" + sg;
    }
    // 3) NEU/geplant: noch keine Seite -> nicht klickbar
    return null;
  }

  /* ---------- Panel-HTML ---------- */
  function esc(s){ return (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function linkEl(node, cls){
    var label=esc(tx(node)), href=hrefFor(node);
    var nw = node.st==="NEU" ? ' <span class="sof-nw">'+nwLabel()+'</span>' : "";
    if (href) return '<a class="'+cls+'" href="'+href+'">'+label+nw+'</a>';
    return '<span class="'+cls+' sof-soon" title="bald verfügbar">'+label+nw+'</span>';
  }
  function colHTML(l2){
    var kids = l2.c || [];
    var hasV = kids.some(function(l3){ return l3.c && l3.c.length; });
    var head = hrefFor(l2)? '<a class="sof-h" href="'+hrefFor(l2)+'">'+esc(tx(l2))+'</a>'
                          : '<span class="sof-h sof-soon">'+esc(tx(l2))+'</span>';
    var nw = l2.st==="NEU" ? ' <span class="sof-nw">'+nwLabel()+'</span>' : "";
    var body;
    if (hasV){
      var groups="";
      kids.forEach(function(l3){
        if (l3.c && l3.c.length){
          var items="";
          l3.c.forEach(function(l4){ items+='<li class="sof-l4">'+linkEl(l4,"sof-lnk")+'</li>'; });
          groups+='<div class="sof-vgrp"><div class="sof-sub">'+esc(tx(l3))+'</div><ul>'+items+'</ul></div>';
        } else {
          groups+='<div class="sof-vgrp"><ul><li>'+linkEl(l3,"sof-lnk")+'</li></ul></div>';
        }
      });
      body='<div class="sof-vgrps">'+groups+'</div>';
    } else {
      var inner="";
      kids.forEach(function(l3){ inner+='<li>'+linkEl(l3,"sof-lnk")+'</li>'; });
      body='<ul>'+inner+'</ul>';
    }
    return '<div class="sof-col" style="min-width:0">'+'<h4>'+head+nw+'</h4>'+body+'</div>';
  }
  function tileHTML(l2){
    var href=hrefFor(l2), nw=l2.st==="NEU"?' <span class="sof-nw">'+nwLabel()+'</span>':"";
    var body='<span>'+esc(tx(l2))+nw+'</span><span class="sof-ar">&#8594;</span>';
    if (href) return '<a class="sof-tile" href="'+href+'">'+body+'</a>';
    return '<span class="sof-tile sof-soon">'+body+'</span>';
  }
  /* ---- Werbekasten -------------------------------------------------------
     Produktkaesten tragen eine Artikelnummer. Preis, Streichpreis, Rabatt
     und Lieferzeit stehen NICHT im Code — sie werden beim ersten Oeffnen
     des Menues bei Ecwid geholt (siehe preiseHolen) und hier eingesetzt.
     So bleiben sie richtig, auch wenn du Preise aenderst. */
  function featHTML(i){
    var f=FEAT[i]; if(!f) return "";
    var txt=f[lang()]||f.en, img=!!f.bild, L=lang();
    var tagT=f.tag?(f.tag[L]||f.tag.en):tx(I18N.tag), btnT=f.btn?(f.btn[L]||f.btn.en):tx(I18N.btn);
    var href = f.anfrage ? (location.origin+(L==="en"?"":"/"+L)+"/b2b?thema=hardware")
             : f.slug    ? (location.origin+(L==="en"?"":"/"+L)+"/products/"+f.slug) : "#";
    /* Bildadresse steht NICHT im Code — sie kommt mit der Preisabfrage aus
       dem Shop. Aenderst du das Produktbild in Ecwid, aendert es sich hier mit. */
    var im = img ? '<img class="sof-fimg" data-sof-bild="'+esc(f.sku)+'" alt="" src="data:image/svg+xml;charset=utf8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'104\' height=\'150\'%3E%3C/svg%3E">' : '';
    var mitte = f.sku
      ? '<div class="sof-fpreis" data-sof-sku="'+esc(f.sku)+'">'
        +'<span class="sof-fp"></span><s class="sof-fuvp"></s><span class="sof-frab"></span></div>'
        +(f.lief?'<div class="sof-flief">'+esc(f.lief[L]||f.lief.en)+'</div>':'')
      : (txt[1] ? '<div class="sof-fs">'+esc(txt[1])+'</div>' : '');
    var textcol = '<div class="sof-ftext" style="max-width:none;flex:1 1 0%;min-width:0;display:flex;flex-direction:column;align-items:flex-start;">'
      +'<div class="sof-ftag">'+esc(tagT)+'</div>'
      +'<div class="sof-ft'+(txt[0].length>46?' sof-ft--lang':'')+'">'+esc(txt[0])+'</div>'
      +mitte
      +'<span class="sof-fbtn">'+esc(btnT)+'</span></div>';
    var cst = img ? ' style="flex:0 0 336px;flex-direction:row;align-items:center;gap:14px;padding:20px;min-height:282px;"' : '';
    return '<a class="sof-feat'+(img?' sof-hasimg':'')+(f.anfrage?' sof-fanfrage':'')+'" href="'+href+'"'+cst+'>'+textcol+im+'</a>';
  }

  /* ---- Preise holen ------------------------------------------------------
     Laeuft einmal je Browsersitzung und erst, wenn das Menue zum ersten Mal
     geoeffnet wird — wer nie ins Menue geht, loest keine Abfrage aus.
     Das Ergebnis liegt in sessionStorage, damit der naechste Seitenaufruf
     nichts mehr nachlaedt. Schlaegt die Abfrage fehl, bleiben die Zeilen
     leer; der Kasten funktioniert weiter. */
  var preiseLaeuft=false;
  function preiseEinsetzen(d){
    for (var sku in d){
      var p=d[sku];
      var felder=document.querySelectorAll('.sof-fpreis[data-sof-sku="'+sku+'"]');
      for (var i=0;i<felder.length;i++){
        var e=felder[i];
        e.querySelector(".sof-fp").textContent  = p.preis||"";
        e.querySelector(".sof-fuvp").textContent= p.uvp||"";
        e.querySelector(".sof-frab").textContent= p.rabatt||"";
        if(p.preis) e.classList.add("sof-fpreis--da");
      }
      var bi=document.querySelectorAll('.sof-fimg[data-sof-bild="'+sku+'"]');
      for (var k=0;k<bi.length;k++) if(p.bild){ bi[k].src=p.bild; bi[k].classList.add("sof-fimg--da"); }
    }
  }
  function preiseHolen(){
    if (preiseLaeuft) return; preiseLaeuft=true;
    var L=lang(), schl="sof-menupreise-"+L;
    try { var c=sessionStorage.getItem(schl);
          if(c){ preiseEinsetzen(JSON.parse(c)); return; } } catch(e){}
    var skus=[]; for (var i=0;i<FEAT.length;i++) if(FEAT[i].sku) skus.push(FEAT[i].sku);
    if(!skus.length) return;
    var tok=null;
    try { tok=Ecwid.getAppPublicToken("custom-app-123703327-2"); } catch(e){}
    if(!tok){ preiseLaeuft=false; return; }
    var daten={}, offen=skus.length;
    skus.forEach(function(sku){
      fetch("https://app.ecwid.com/api/v3/123703327/products?keyword="+encodeURIComponent(sku)
            +"&lang="+L+"&token="+tok)
      .then(function(r){ return r.json(); })
      .then(function(j){
        var p=(j.items||[]).filter(function(x){ return x.sku===sku; })[0];
        if(p){
          var uvp = p.compareToPriceFormatted || "";
          var rab = p.compareToPriceDiscountPercentFormatted
                 || (p.compareToPriceDiscountPercent ? "-"+p.compareToPriceDiscountPercent+"%" : "");
          daten[sku]={ preis: p.defaultDisplayedPriceFormatted || "",
                       uvp: uvp, rabatt: uvp?rab:"",
                       bild: p.hdThumbnailUrl || p.imageUrl || p.thumbnailUrl || "" };
        }
      })
      .catch(function(){})
      .then(function(){
        if(--offen===0){
          preiseEinsetzen(daten);
          try { sessionStorage.setItem(schl, JSON.stringify(daten)); } catch(e){}
        }
      });
    });
  }
  function hasKids(top){ return (top.c||[]).some(function(c){return c.c&&c.c.length;}); }
  function panelHTML(idx){
    var top=TREE[idx]; if(!top||!top.c) return "";
    var body = hasKids(top)
      ? '<div class="sof-cols'+(top.c.length<=5?' sof-cols--spread':'')+'">'+top.c.map(colHTML).join("")+'</div>'
      : '<div class="sof-tiles">'+top.c.map(tileHTML).join("")+'</div>';
    return '<div class="sof-mega">'+body+featHTML(idx)+'</div>';
  }

  /* ---------- Aufbau & Verdrahtung ---------- */
  function ready(cb){
    var n=0;
    (function poll(){
      var menu=document.querySelector(".ins-header__menu-inner") || document.querySelector(".ins-header__menu");
      var tops=menu && menu.querySelectorAll("a.ins-header__menu-link-title");
      if (menu && tops && tops.length){ cb(menu, tops); }
      else if (n++ < 80){ setTimeout(poll, 150); }
    })();
  }

  function init(menu, topLinks){
    var headerTile = document.querySelector(".ins-tile--header") || menu.closest(".ins-tile") || document.querySelector(".ins-header");
    if (!headerTile) return;
    headerTile.classList.add("sof-header");

    // Host fürs Panel — an BODY (kein Clipping durch Header-overflow)
    var host=document.createElement("div");
    host.className="sof-host"; host.id="sof-host";
    document.body.appendChild(host);
    // Spalten an Inhaltsbreite ausrichten -> gleichmaessige Abstaende (fix: Windows-Spalte)
    (function(){ var s=document.createElement("style"); s.textContent=".sof-mega .sof-col{min-width:0}"; (document.head||document.documentElement).appendChild(s); })();

    harvest(menu);
    hideNative(menu);
    // Top-Labels der umbenannten Punkte DAUERHAFT anzeigen (gegen Ecwid-Re-Render)
    (function(){
      var RL={0:1,2:1};
      function noTon(s){ return s.replace(/\u0386/g,"\u0391").replace(/\u0388/g,"\u0395").replace(/\u0389/g,"\u0397").replace(/\u038a/g,"\u0399").replace(/\u038c/g,"\u039f").replace(/\u038e/g,"\u03a5").replace(/\u038f/g,"\u03a9").replace(/\u03aa/g,"\u0399").replace(/\u03ab/g,"\u03a5"); }
      function setLbl(el,want){
        var i,n,tail;
        for(i=0;i<el.childNodes.length;i++){ n=el.childNodes[i];
          if(n.nodeType===3 && n.nodeValue.trim()){
            tail=(n.nodeValue.match(/\s+$/)||[""])[0];
            if(n.nodeValue!==want+tail) n.nodeValue=want+tail; return; } }
        el.insertBefore(document.createTextNode(want), el.firstChild);
      }
      function applyLabels(){
        var cur=(headerTile||document).querySelectorAll("a.ins-header__menu-link-title");
        for(var k in RL){ var idx=parseInt(k,10), el=cur[idx]; if(!el) continue;
          var want=noTon(tx(TREE[idx]).toUpperCase()); setLbl(el,want); }
      }
      applyLabels();
      try{ var mo=new MutationObserver(applyLabels);
           mo.observe(headerTile||document.body,{subtree:true,childList:true,characterData:true}); }catch(e){}
      setTimeout(applyLabels,300); setTimeout(applyLabels,1200); setTimeout(applyLabels,3000);
    })();

    // Natives Flyout robust ausblenden (klassen-unabhängig):
    // jedes Element in einem menu-link, das NICHT der Top-Link ist und
    // weitere Links enthält, wird hart versteckt.
    function hideNative(scope){
      var links=scope.querySelectorAll(".ins-header__menu-link");
      for(var i=0;i<links.length;i++){
        var kids=links[i].children;
        for(var j=0;j<kids.length;j++){
          var k=kids[j];
          if(k.matches && k.matches("a.ins-header__menu-link-title")) continue;
          if(k.querySelector && k.querySelector("a[href]")){
            k.style.setProperty("display","none","important");
            k.style.setProperty("visibility","hidden","important");
            k.style.setProperty("pointer-events","none","important");
          }
        }
      }
    }

    var openIdx=-1, timer=null;
    function open(idx){
      if(!desk()) return;
      if(idx===openIdx && host.firstChild) return;
      openIdx=idx;
      preiseHolen();
      // Panel-Breite an Header-Container ausrichten + fix unter den Header setzen
      var inner=document.querySelector(".ins-header__inner")||document.querySelector(".ins-header__wrap")||headerTile;
      var ir=inner.getBoundingClientRect();
      var hr=headerTile.getBoundingClientRect();
      host.style.top=Math.round(hr.bottom)+"px";
      host.innerHTML=panelHTML(idx);
      var mega=host.firstChild;
      if(mega){ mega.style.maxWidth=Math.round(ir.width)+"px"; mega.style.marginLeft="auto"; mega.style.marginRight="auto";
        // Notbremse: Panel nie hoeher als der Platz unter dem Header.
        // Sonst wird auf flachen Bildschirmen der untere Teil abgeschnitten.
        mega.style.maxHeight=Math.max(240, window.innerHeight - Math.round(hr.bottom) - 18)+"px"; }
      host.classList.add("sof-show");
      for(var i=0;i<items.length;i++){ items[i].classList.toggle("sof-active", i===idx); }
    }
    function close(){
      openIdx=-1; host.classList.remove("sof-show"); host.innerHTML="";
      for(var i=0;i<items.length;i++){ items[i].classList.remove("sof-active"); }
    }
    function schedClose(){ clearTimeout(timer); timer=setTimeout(close, CLOSE_DELAY); }
    function cancelClose(){ clearTimeout(timer); }

    // Top-Punkte (Reihenfolge = TREE-Reihenfolge)
    var items=[];
    for (var i=0;i<topLinks.length && i<TREE.length;i++){
      var li = topLinks[i].closest(".ins-header__menu-link") || topLinks[i].parentNode;
      items.push(li);
      (function(idx){
        li.addEventListener("mouseenter", function(){ cancelClose(); open(idx); });
        li.addEventListener("mouseleave", schedClose);
      })(i);
    }
    host.addEventListener("mouseenter", cancelClose);
    host.addEventListener("mouseleave", schedClose);
    document.addEventListener("keydown", function(e){ if(e.key==="Escape") close(); });
    window.addEventListener("resize", function(){ if(!desk()) close(); });

    // Sticky-Schatten
    var onScroll=function(){ headerTile.classList.toggle("sof-scrolled", window.scrollY>6); };
    window.addEventListener("scroll", onScroll, {passive:true}); onScroll();
  }

  function boot(){ try{ ready(init); }catch(e){ /* still: natives Menü bleibt */ } }
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
