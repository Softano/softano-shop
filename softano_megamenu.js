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
  var TREE = [{"en": "Operating Systems", "de": "Betriebssysteme", "el": "Συστήματα Windows", "st": "", "c": [{"en": "Windows", "de": "Windows", "el": "Windows", "st": "", "c": [{"en": "Windows 11", "de": "Windows 11", "el": "Windows 11", "st": ""}, {"en": "Windows 10", "de": "Windows 10", "el": "Windows 10", "st": ""}]}]}, {"en": "Office & Organisation", "de": "Office & Organisation", "el": "Εφαρμογές Γραφείου", "st": "", "c": [{"en": "Office Suites for Windows", "de": "Office Suiten für Windows", "el": "Σουίτες Office για Windows", "st": "", "c": [{"en": "Microsoft Office 2024", "de": "Microsoft Office 2024", "el": "Microsoft Office 2024", "st": ""}, {"en": "Microsoft Office 2021", "de": "Microsoft Office 2021", "el": "Microsoft Office 2021", "st": ""}, {"en": "Microsoft Office 2019", "de": "Microsoft Office 2019", "el": "Microsoft Office 2019", "st": ""}]}, {"en": "Office Suites for Mac", "de": "Office Suiten für Mac", "el": "Σουίτες Office για Mac", "st": "", "c": [{"en": "Microsoft Office 2024 for Mac", "de": "Microsoft Office 2024 für Mac", "el": "Microsoft Office 2024 για Mac", "st": ""}, {"en": "Microsoft Office 2021 for Mac", "de": "Microsoft Office 2021 für Mac", "el": "Microsoft Office 2021 για Mac", "st": ""}, {"en": "Microsoft Office 2019 for Mac", "de": "Microsoft Office 2019 für Mac", "el": "Microsoft Office 2019 για Mac", "st": ""}]}, {"en": "Office Applications", "de": "Office Einzelanwendungen", "el": "Μεμονωμένες εφαρμογές Office", "st": "", "c": [{"en": "Microsoft Word", "de": "Microsoft Word", "el": "Microsoft Word", "st": ""}, {"en": "Microsoft Excel", "de": "Microsoft Excel", "el": "Microsoft Excel", "st": ""}, {"en": "Microsoft Outlook", "de": "Microsoft Outlook", "el": "Microsoft Outlook", "st": ""}, {"en": "Microsoft PowerPoint", "de": "Microsoft PowerPoint", "el": "Microsoft PowerPoint", "st": ""}, {"en": "Microsoft Access", "de": "Microsoft Access", "el": "Microsoft Access", "st": ""}, {"en": "Microsoft Publisher", "de": "Microsoft Publisher", "el": "Microsoft Publisher", "st": ""}, {"en": "Microsoft OneNote", "de": "Microsoft OneNote", "el": "Microsoft OneNote", "st": ""}]}, {"en": "Microsoft Visio", "de": "Microsoft Visio", "el": "Microsoft Visio", "st": "", "c": [{"en": "Microsoft Visio 2024", "de": "Microsoft Visio 2024", "el": "Microsoft Visio 2024", "st": ""}, {"en": "Microsoft Visio 2021", "de": "Microsoft Visio 2021", "el": "Microsoft Visio 2021", "st": ""}, {"en": "Microsoft Visio 2019", "de": "Microsoft Visio 2019", "el": "Microsoft Visio 2019", "st": ""}]}, {"en": "Microsoft Project", "de": "Microsoft Project", "el": "Microsoft Project", "st": "", "c": [{"en": "Microsoft Project 2024", "de": "Microsoft Project 2024", "el": "Microsoft Project 2024", "st": ""}, {"en": "Microsoft Project 2021", "de": "Microsoft Project 2021", "el": "Microsoft Project 2021", "st": ""}, {"en": "Microsoft Project 2019", "de": "Microsoft Project 2019", "el": "Microsoft Project 2019", "st": ""}]}, {"en": "Microsoft Visual Studio", "de": "Microsoft Visual Studio", "el": "Microsoft Visual Studio", "st": "", "c": [{"en": "Microsoft Visual Studio 2026", "de": "Microsoft Visual Studio 2026", "el": "Microsoft Visual Studio 2026", "st": ""}, {"en": "Microsoft Visual Studio 2022", "de": "Microsoft Visual Studio 2022", "el": "Microsoft Visual Studio 2022", "st": ""}, {"en": "Microsoft Visual Studio 2019", "de": "Microsoft Visual Studio 2019", "el": "Microsoft Visual Studio 2019", "st": ""}]}]}, {"en": "Server & Infrastructure", "de": "Server & Infrastruktur", "el": "Server & Υποδομές", "st": "", "c": [{"en": "Windows Server", "de": "Windows Server", "el": "Windows Server", "st": "", "c": [{"en": "Windows Server 2025", "de": "Windows Server 2025", "el": "Windows Server 2025", "st": ""}, {"en": "Windows Server 2022", "de": "Windows Server 2022", "el": "Windows Server 2022", "st": ""}, {"en": "Windows Server 2019", "de": "Windows Server 2019", "el": "Windows Server 2019", "st": ""}]}, {"en": "Microsoft SQL Server", "de": "Microsoft SQL Server", "el": "Microsoft SQL Server", "st": "", "c": [{"en": "SQL Server 2025", "de": "SQL Server 2025", "el": "SQL Server 2025", "st": ""}, {"en": "SQL Server 2022", "de": "SQL Server 2022", "el": "SQL Server 2022", "st": ""}, {"en": "SQL Server 2019", "de": "SQL Server 2019", "el": "SQL Server 2019", "st": ""}]}, {"en": "Access Licenses CAL", "de": "Zugriffslizenzen CAL", "el": "Άδειες πρόσβασης CAL", "st": "", "c": [{"en": "Windows Server 2025 CAL", "de": "Windows Server 2025 CAL", "el": "Windows Server 2025 CAL", "st": ""}, {"en": "Windows Server 2022 CAL", "de": "Windows Server 2022 CAL", "el": "Windows Server 2022 CAL", "st": ""}, {"en": "Windows Server 2019 CAL", "de": "Windows Server 2019 CAL", "el": "Windows Server 2019 CAL", "st": ""}, {"en": "Remote Desktop 2025 CAL", "de": "Remote Desktop 2025 CAL", "el": "Remote Desktop 2025 CAL", "st": ""}, {"en": "Remote Desktop 2022 CAL", "de": "Remote Desktop 2022 CAL", "el": "Remote Desktop 2022 CAL", "st": ""}, {"en": "Remote Desktop 2019 CAL", "de": "Remote Desktop 2019 CAL", "el": "Remote Desktop 2019 CAL", "st": ""}, {"en": "SQL Server 2025 CAL", "de": "SQL Server 2025 CAL", "el": "SQL Server 2025 CAL", "st": ""}, {"en": "SQL Server 2022 CAL", "de": "SQL Server 2022 CAL", "el": "SQL Server 2022 CAL", "st": ""}, {"en": "SQL Server 2019 CAL", "de": "SQL Server 2019 CAL", "el": "SQL Server 2019 CAL", "st": ""}]}, {"en": "Virtualization", "de": "Virtualisierung", "el": "Εικονικοποίηση", "st": "NEU", "c": [{"en": "VMware", "de": "VMware", "el": "VMware", "st": "NEU", "c": [{"en": "VMware vSphere", "de": "VMware vSphere", "el": "VMware vSphere", "st": "NEU"}, {"en": "VMware vSAN", "de": "VMware vSAN", "el": "VMware vSAN", "st": "NEU"}]}, {"en": "Proxmox Virtual Environment", "de": "Proxmox Virtual Environment", "el": "Proxmox Virtual Environment", "st": "NEU"}]}, {"en": "Backup & Recovery", "de": "Backup & Wiederherstellung", "el": "Backup & Ανάκτηση", "st": "NEU", "c": [{"en": "Veeam", "de": "Veeam", "el": "Veeam", "st": "NEU", "c": [{"en": "Veeam Backup Essentials", "de": "Veeam Backup Essentials", "el": "Veeam Backup Essentials", "st": "NEU"}, {"en": "Veeam Data Platform Foundation", "de": "Veeam Data Platform Foundation", "el": "Veeam Data Platform Foundation", "st": "NEU"}, {"en": "Veeam Data Platform Advanced", "de": "Veeam Data Platform Advanced", "el": "Veeam Data Platform Advanced", "st": "NEU"}]}, {"en": "Acronis", "de": "Acronis", "el": "Acronis", "st": "NEU", "c": [{"en": "Acronis Cyber Backup", "de": "Acronis Cyber Backup", "el": "Acronis Cyber Backup", "st": "NEU"}, {"en": "Acronis Cyber Protect", "de": "Acronis Cyber Protect", "el": "Acronis Cyber Protect", "st": "NEU"}, {"en": "Acronis Cloud Storage", "de": "Acronis Cloud Storage", "el": "Acronis Cloud Storage", "st": "NEU"}]}, {"en": "Proxmox Backup Server", "de": "Proxmox Backup Server", "el": "Proxmox Backup Server", "st": "NEU"}]}, {"en": "Network & Security", "de": "Netzwerk & Sicherheit", "el": "Δίκτυο & Ασφάλεια", "st": "NEU", "c": [{"en": "LANCOM", "de": "LANCOM", "el": "LANCOM", "st": "NEU", "c": [{"en": "LANCOM VPN Clients", "de": "LANCOM VPN-Clients", "el": "LANCOM VPN Clients", "st": "NEU"}, {"en": "LANCOM Management Cloud (LMC)", "de": "LANCOM Management Cloud (LMC)", "el": "LANCOM Management Cloud (LMC)", "st": "NEU"}, {"en": "LANCOM R&S UF Firewall", "de": "LANCOM R&S UF Firewall", "el": "LANCOM R&S UF Firewall", "st": "NEU"}]}, {"en": "Proxmox Mail Gateway", "de": "Proxmox Mail Gateway", "el": "Proxmox Mail Gateway", "st": "NEU"}]}, {"en": "Synology Licenses", "de": "Synology-Lizenzen", "el": "Άδειες Synology", "st": "NEU", "c": [{"en": "Virtual Machine Manager", "de": "Virtual Machine Manager", "el": "Virtual Machine Manager", "st": "NEU"}, {"en": "Surveillance / Camera Licenses", "de": "Überwachung / Kamera-Lizenzen", "el": "Άδειες επιτήρησης / κάμερας", "st": "NEU"}, {"en": "C2 Backup", "de": "C2 Backup", "el": "C2 Backup", "st": "NEU"}, {"en": "MailPlus", "de": "MailPlus", "el": "MailPlus", "st": "NEU"}]}]}, {"en": "Antivirus & Security", "de": "Virenschutz", "el": "Antivirus & Ασφάλεια", "st": "", "c": [{"en": "Endpoint Protection", "de": "Endpoint-Schutz", "el": "Προστασία τερματικών", "st": "NEU"}, {"en": "Business Antivirus", "de": "Business-Virenschutz", "el": "Επαγγελματικό Antivirus", "st": "NEU"}]}, {"en": "3D Architecture & CAD", "de": "3D-Architektur & CAD", "el": "3D & CAD", "st": "", "c": [{"en": "CAD Software", "de": "CAD-Software", "el": "Λογισμικό CAD", "st": "NEU"}, {"en": "3D Modeling", "de": "3D-Modellierung", "el": "3D μοντελοποίηση", "st": "NEU"}, {"en": "Rendering", "de": "Rendering", "el": "Rendering", "st": "NEU"}]}, {"en": "Hardware", "de": "Hardware", "el": "Hardware", "st": "", "c": [{"en": "Server (Rack & Tower)", "de": "Server (Rack & Tower)", "el": "Server (Rack & Tower)", "st": "NEU"}, {"en": "Storage & NAS", "de": "Storage & NAS", "el": "Αποθήκευση & NAS", "st": "NEU"}, {"en": "Components & Upgrades", "de": "Komponenten & Upgrades", "el": "Εξαρτήματα & Αναβαθμίσεις", "st": "NEU"}, {"en": "Microsoft Surface", "de": "Microsoft Surface", "el": "Microsoft Surface", "st": "NEU"}]}];
  var FEAT = [{"slug": "windows-11-professional", "en": ["Windows 11 Professional", "Category bestseller"], "de": ["Windows 11 Professional", "Topseller dieser Kategorie"], "el": ["Windows 11 Professional", "Δημοφιλέστερο της κατηγορίας"]}, {"slug": "office-2024-professional-plus", "en": ["Office 2024 Professional Plus", "Category bestseller"], "de": ["Office 2024 Professional Plus", "Topseller dieser Kategorie"], "el": ["Office 2024 Professional Plus", "Δημοφιλέστερο της κατηγορίας"]}, {"slug": "windows-server-2025-standard-16-core-volume", "en": ["Windows Server 2025 Standard", "Category bestseller"], "de": ["Windows Server 2025 Standard", "Topseller dieser Kategorie"], "el": ["Windows Server 2025 Standard", "Δημοφιλέστερο της κατηγορίας"]}, null, null, null];
  var I18N = {"btn": {"en": "View offer", "de": "Zum Angebot", "el": "Δείτε προσφορά"}, "tag": {"en": "TOPSELLER", "de": "TOPSELLER", "el": "TOPSELLER"}};
  // Optionale Slug-Korrekturen (falls ein bestehender Link nicht automatisch
  // gefunden wird): { "Exakter EN-Name": "ecwid-slug" }
  var SLUG_OVERRIDE = {};
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
    var inner="";
    (l2.c||[]).forEach(function(l3){
      if (l3.c && l3.c.length){
        inner+='<li class="sof-sub">'+esc(tx(l3))+'</li>';
        l3.c.forEach(function(l4){ inner+='<li class="sof-l4">'+linkEl(l4,"sof-lnk")+'</li>'; });
      } else {
        inner+='<li>'+linkEl(l3,"sof-lnk")+'</li>';
      }
    });
    var head = hrefFor(l2)? '<a class="sof-h" href="'+hrefFor(l2)+'">'+esc(tx(l2))+'</a>'
                          : '<span class="sof-h sof-soon">'+esc(tx(l2))+'</span>';
    var nw = l2.st==="NEU" ? ' <span class="sof-nw">'+nwLabel()+'</span>' : "";
    return '<div class="sof-col"><h4>'+head+nw+'</h4><ul>'+inner+'</ul></div>';
  }
  function tileHTML(l2){
    var href=hrefFor(l2), nw=l2.st==="NEU"?' <span class="sof-nw">'+nwLabel()+'</span>':"";
    var body='<span>'+esc(tx(l2))+nw+'</span><span class="sof-ar">&#8594;</span>';
    if (href) return '<a class="sof-tile" href="'+href+'">'+body+'</a>';
    return '<span class="sof-tile sof-soon">'+body+'</span>';
  }
  function featHTML(i){
    var f=FEAT[i]; if(!f) return "";
    var txt=f[lang()]||f.en, img=f.img;
    var im = img? '<img class="sof-fimg" src="'+img+'" alt="">':"";
    var L=lang(), href = f.slug ? (location.origin+(L==="en"?"":"/"+L)+"/products/"+f.slug) : "#";
    return '<a class="sof-feat'+(img?' sof-hasimg':'')+'" href="'+href+'">'+im
      +'<div class="sof-ftext"><div class="sof-ftag">'+esc(tx(I18N.tag))+'</div>'
      +'<div class="sof-ft">'+esc(txt[0])+'</div><div class="sof-fs">'+esc(txt[1])+'</div></div>'
      +'<span class="sof-fbtn">'+esc(tx(I18N.btn))+'</span></a>';
  }
  function hasKids(top){ return (top.c||[]).some(function(c){return c.c&&c.c.length;}); }
  function panelHTML(idx){
    var top=TREE[idx]; if(!top||!top.c) return "";
    var body = hasKids(top)
      ? '<div class="sof-cols">'+top.c.map(colHTML).join("")+'</div>'
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

    harvest(menu);
    hideNative(menu);

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
      // Panel-Breite an Header-Container ausrichten + fix unter den Header setzen
      var inner=document.querySelector(".ins-header__inner")||document.querySelector(".ins-header__wrap")||headerTile;
      var ir=inner.getBoundingClientRect();
      var hr=headerTile.getBoundingClientRect();
      host.style.top=Math.round(hr.bottom)+"px";
      host.innerHTML=panelHTML(idx);
      var mega=host.firstChild;
      if(mega){ mega.style.maxWidth=Math.round(ir.width)+"px"; mega.style.marginLeft="auto"; mega.style.marginRight="auto"; }
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