/* ============================================================
   map.js — GIS Map Module (Leaflet.js + Esri Satellite)
   AI-Based Disaster Response Optimization System
   ============================================================ */

let mapInit = false;
let allMarkers = [], allLayers = [], routeLines = [], heatCircles = [];
let showRoutes = true, showHeatmap = true, currentFilter = 'all';

function initMap() {
  mapInit = true;
  const map = L.map('map', { center:[22.5,82.0], zoom:5, preferCanvas:true, zoomControl:false });

  /* ── Tile Layer Definitions ── */
  const tileSets = {
    satellite: {
      base:   L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                {attribution:'Esri', maxZoom:19, opacity:1}),
      labels: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
                {attribution:'Esri Labels', maxZoom:19, opacity:0.85, pane:'overlayPane'})
    },
    dark: {
      base:   L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
                {subdomains:'abcd', maxZoom:20, opacity:0.9}),
      labels: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png',
                {subdomains:'abcd', maxZoom:20, opacity:0.7, pane:'overlayPane'})
    },
    terrain: {
      base:   L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
                {subdomains:'abc', maxZoom:17, opacity:0.95}),
      labels: null
    },
    hybrid: {
      base:   L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                {maxZoom:19, opacity:0.92}),
      labels: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
                {subdomains:'abcd', maxZoom:20, opacity:0.9, pane:'overlayPane'})
    },
    topo: {
      base:   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                {maxZoom:19, opacity:0.85}),
      labels: null
    },
    night: {
      base:   L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
                {subdomains:'abcd', maxZoom:20, opacity:1}),
      labels: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png',
                {subdomains:'abcd', maxZoom:20, opacity:0.5, pane:'overlayPane'})
    }
  };

  window._tileSets   = tileSets;
  window._currentBase   = tileSets.satellite.base;
  window._currentLabels = tileSets.satellite.labels;
  tileSets.satellite.base.addTo(map);
  tileSets.satellite.labels.addTo(map);
  L.control.zoom({position:'topright'}).addTo(map);
  window._map = map;

  /* ── Heatmap Zones ── */
  const floodZones    = [{lat:26.1,lng:91.7,r:80000},{lat:16.5,lng:80.6,r:55000},{lat:25.3,lng:89.4,r:45000},{lat:23.8,lng:90.2,r:35000}];
  const wildfireZones = [{lat:31.1,lng:77.2,r:40000},{lat:32.2,lng:76.3,r:28000}];
  const cycloneZones  = [{lat:20.9,lng:85.1,r:90000}];

  floodZones.forEach(z => {
    const c = L.circle([z.lat,z.lng],{radius:z.r,color:'#63b3ed',fillColor:'#63b3ed',fillOpacity:0.12,weight:1,opacity:0.5});
    c._layerType='flood'; allLayers.push(c); heatCircles.push(c); c.addTo(map);
  });
  wildfireZones.forEach(z => {
    const c = L.circle([z.lat,z.lng],{radius:z.r,color:'#fc8181',fillColor:'#fc8181',fillOpacity:0.14,weight:1,opacity:0.5});
    c._layerType='wildfire'; allLayers.push(c); heatCircles.push(c); c.addTo(map);
  });
  cycloneZones.forEach(z => {
    const c = L.circle([z.lat,z.lng],{radius:z.r,color:'#b794f4',fillColor:'#b794f4',fillOpacity:0.09,weight:1,opacity:0.4});
    c._layerType='cyclone'; allLayers.push(c); heatCircles.push(c); c.addTo(map);
  });

  /* ── Cyclone Path ── */
  const cycloneForecast = [[13.5,84.0],[14.8,83.2],[16.2,82.1],[17.5,81.0],[18.9,79.8],[20.0,78.5],[20.9,77.2]];
  const cp = L.polyline(cycloneForecast,{color:'#b794f4',dashArray:'10,6',weight:2.5,opacity:0.9});
  cp._layerType='cyclone'; allLayers.push(cp); cp.addTo(map);
  cycloneForecast.map((p,i)=>[p[0]-i*0.25,p[1]]).concat;
  [cycloneForecast.map((p,i)=>[p[0]-i*0.25,p[1]]),
   cycloneForecast.map((p,i)=>[p[0]+i*0.15,p[1]])].forEach(pts => {
    const l = L.polyline(pts,{color:'#b794f4',weight:1,opacity:0.25,dashArray:'4,8'});
    l._layerType='cyclone'; allLayers.push(l); l.addTo(map);
  });

  /* ── Rescue Routes ── */
  [[[19.1,72.9],[18.9,72.8],'#fc8181'],[[19.1,72.9],[20.9,85.1],'#f6ad55'],
   [[28.6,77.2],[30.4,79.4],'#68d391'],[[22.5,88.3],[26.1,91.7],'#68d391'],
   [[17.7,83.3],[20.9,85.1],'#63b3ed'],[[17.7,83.3],[16.5,80.6],'#63b3ed'],
   [[28.6,77.2],[26.9,75.8],'#68d391']].forEach(([from,to,col]) => {
    const line = L.polyline([from,to],{color:col,weight:1.8,opacity:0.6,dashArray:'6,5'});
    line._isRoute=true; routeLines.push(line); line.addTo(map);
  });

  /* ── Markers ── */
  markerData.forEach(m => {
    const color = m.type==='cyclone'?'#b794f4':m.type==='flood'?'#63b3ed':m.type==='earthquake'?'#f6ad55':m.type==='wildfire'?'#fc8181':m.type==='shelter'?'#68d391':'#e2e8f0';
    const isCritical = m.severity==='critical', isHigh = m.severity==='high';
    const size = isCritical?22:isHigh?17:m.type==='rescue'?15:13;
    const glow = size*2;
    const emoji = m.type==='cyclone'?'🌀':m.type==='flood'?'🌊':m.type==='earthquake'?'🌍':m.type==='wildfire'?'🔥':m.type==='shelter'?'🏕️':'🚁';

    const rings = isCritical
      ? `<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:${glow+22}px;height:${glow+22}px;border:2px solid ${color};border-radius:50%;animation:ringPulse 2s ease-out infinite;opacity:0"></div>
         <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:${glow+10}px;height:${glow+10}px;border:1.5px solid ${color};border-radius:50%;animation:ringPulse 2s ease-out infinite .7s;opacity:0"></div>`
      : isHigh
      ? `<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:${glow+12}px;height:${glow+12}px;border:1px solid ${color};border-radius:50%;animation:ringPulse 3s ease-out infinite;opacity:0"></div>`
      : '';

    const icon = L.divIcon({
      html:`<div style="position:relative;width:${glow+34}px;height:${glow+34}px;display:flex;align-items:center;justify-content:center">
              ${rings}
              <div style="width:${size}px;height:${size}px;background:${color};border:${isCritical?2.5:1.5}px solid rgba(255,255,255,${isCritical?.9:.6});border-radius:50%;box-shadow:0 0 ${size}px ${color}cc,0 0 ${size*2.5}px ${color}55;animation:markerPulse ${isCritical?1.4:2.5}s ease-in-out infinite"></div>
              ${isCritical||isHigh?`<div style="position:absolute;top:-1px;right:3px;font-size:9px">${emoji}</div>`:''}
            </div>`,
      className:'', iconAnchor:[(glow+34)/2,(glow+34)/2]
    });

    const marker = L.marker([m.lat,m.lng],{icon}).addTo(map);
    marker._layerType = m.type || m.markerType;
    allMarkers.push(marker);

    marker.bindPopup(`
      <div style="font-family:'Space Grotesk',sans-serif;min-width:210px;background:#0a0f1e;color:#e2e8f0;border-radius:10px;overflow:hidden">
        <div style="background:${color}28;border-bottom:1px solid ${color}55;padding:10px 14px">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:20px">${emoji}</span>
            <div>
              <div style="font-weight:700;font-size:13px">${m.name||m.type}</div>
              ${m.severity?`<div style="font-size:10px;color:${color};font-weight:700;letter-spacing:.5px;margin-top:2px">${m.severity.toUpperCase()}</div>`:''}
            </div>
          </div>
        </div>
        <div style="padding:10px 14px;font-size:12px;line-height:1.9">
          ${m.loc?`<div>📍 <span style="color:#aaa">${m.loc}</span></div>`:''}
          ${m.affected?`<div>👥 <b>${m.affected}</b> affected</div>`:''}
          ${m.teams?`<div>🚁 <b>${m.teams}</b> rescue teams</div>`:''}
          ${m.capacity?`<div>🏕️ Capacity: <b>${m.capacity}</b></div>`:''}
          ${m.desc?`<div style="margin-top:6px;color:#aaa;font-size:11px">${m.desc}</div>`:''}
        </div>
      </div>`,{className:'dark-popup',maxWidth:270});

    marker.on('click',()=>{
      const sc = m.severity==='critical'?'#fc8181':m.severity==='high'?'#f6ad55':m.severity==='moderate'?'#63b3ed':'#68d391';
      document.getElementById('zone-info').innerHTML=`
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
          <span style="font-size:20px">${emoji}</span>
          <div>
            <div style="font-weight:700;font-size:13px;color:#e2e8f0">${m.name||m.type}</div>
            ${m.severity?`<span style="font-size:10px;padding:2px 8px;border-radius:10px;background:${sc}22;color:${sc};font-weight:700">${m.severity.toUpperCase()}</span>`:''}
          </div>
        </div>
        ${m.loc?`<div style="font-size:11px;color:#718096;margin-bottom:3px">📍 ${m.loc}</div>`:''}
        ${m.affected?`<div style="font-size:12px;margin-bottom:2px">👥 <b style="color:#e2e8f0">${m.affected}</b> affected</div>`:''}
        ${m.teams?`<div style="font-size:12px;margin-bottom:2px">🚁 <b style="color:#e2e8f0">${m.teams}</b> teams deployed</div>`:''}
        ${m.capacity?`<div style="font-size:12px;margin-bottom:2px">🏕️ Capacity: <b style="color:#e2e8f0">${m.capacity}</b></div>`:''}
        ${m.desc?`<div style="font-size:11px;color:#718096;margin-top:6px">${m.desc}</div>`:''}
        <button onclick="window._map&&window._map.flyTo([${m.lat},${m.lng}],9,{duration:1.5})"
          style="margin-top:10px;background:rgba(99,179,237,0.15);border:1px solid rgba(99,179,237,0.4);color:#63b3ed;padding:5px 12px;border-radius:6px;font-size:11px;cursor:pointer;width:100%">🔍 Zoom to Zone</button>`;
    });
  });

  /* ── Radar Sweeps ── */
  addRadarSweep(map,20.9,85.1,'#b794f4');
  addRadarSweep(map,26.1,91.7,'#63b3ed');

  /* ── Inject Popup + Animation Styles ── */
  const s = document.createElement('style');
  s.textContent=`
    @keyframes ringPulse{0%{transform:translate(-50%,-50%) scale(.5);opacity:.9}100%{transform:translate(-50%,-50%) scale(2);opacity:0}}
    @keyframes markerPulse{0%,100%{opacity:1}50%{opacity:.55}}
    @keyframes radarSweep{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    .dark-popup .leaflet-popup-content-wrapper{background:#0a0f1e!important;border:1px solid rgba(99,179,237,0.3)!important;border-radius:10px!important;box-shadow:0 8px 40px rgba(0,0,0,.7)!important;padding:0}
    .dark-popup .leaflet-popup-content{margin:0!important}
    .dark-popup .leaflet-popup-tip{background:#0a0f1e!important}
    .dark-popup .leaflet-popup-close-button{color:#718096!important;top:6px!important;right:8px!important;font-size:16px!important}`;
  document.head.appendChild(s);

  startTickerFeed();
  startSatClock();
}

function addRadarSweep(map,lat,lng,color){
  const html=`<div style="position:relative;width:120px;height:120px">
    <div style="position:absolute;inset:0;border-radius:50%;border:1px solid ${color}44"></div>
    <div style="position:absolute;inset:8px;border-radius:50%;border:1px solid ${color}33"></div>
    <div style="position:absolute;top:50%;left:50%;width:50%;height:1px;background:linear-gradient(90deg,${color}cc,transparent);transform-origin:left center;animation:radarSweep 3s linear infinite"></div>
    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:6px;height:6px;border-radius:50%;background:${color}"></div>
  </div>`;
  const rm=L.marker([lat,lng],{icon:L.divIcon({html,className:'',iconAnchor:[60,60]}),interactive:false,zIndexOffset:-100}).addTo(map);
  rm._isRadar=true; rm._layerType=lat>25?'flood':'cyclone'; allLayers.push(rm);
}

function setMapStyle(style,btn){
  if(!window._map||!window._tileSets)return;
  document.querySelectorAll('.map-view-btn').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  if(window._currentBase)  window._map.removeLayer(window._currentBase);
  if(window._currentLabels)window._map.removeLayer(window._currentLabels);
  const ts=window._tileSets[style];
  ts.base.addTo(window._map); window._currentBase=ts.base;
  if(ts.labels){ts.labels.addTo(window._map);window._currentLabels=ts.labels;}
  else window._currentLabels=null;
  document.querySelector('#map').style.filter = style==='night'?'hue-rotate(100deg) saturate(0.3) brightness(0.7) contrast(1.4)':'none';
  setTimeout(()=>{allLayers.forEach(l=>{if(window._map.hasLayer(l))l.bringToFront();});allMarkers.forEach(m=>{if(window._map.hasLayer(m))m.bringToFront();});},200);
}

function filterLayer(type,btn){
  if(!window._map)return;
  currentFilter=type;
  document.querySelectorAll('.map-layer-btn').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  allMarkers.forEach(m=>{(type==='all'||m._layerType===type)?m.addTo(window._map):window._map.removeLayer(m);});
  allLayers.forEach(l=>{(type==='all'||l._layerType===type||l._isRadar)?l.addTo(window._map):window._map.removeLayer(l);});
}

function showAllLayers(){ filterLayer('all'); }

function toggleHeatmap(){
  showHeatmap=!showHeatmap;
  heatCircles.forEach(c=>showHeatmap?c.addTo(window._map):window._map.removeLayer(c));
  const btn=document.getElementById('heatmap-btn');
  btn.textContent=`🔥 Heatmap ${showHeatmap?'ON':'OFF'}`;
  btn.style.color=showHeatmap?'var(--accent)':'var(--muted)';
}

function toggleRoutes(){
  showRoutes=!showRoutes;
  routeLines.forEach(l=>showRoutes?l.addTo(window._map):window._map.removeLayer(l));
  const btn=document.getElementById('routes-btn');
  btn.textContent=`🛣️ Routes ${showRoutes?'ON':'OFF'}`;
  btn.style.color=showRoutes?'var(--accent)':'var(--muted)';
}

let tickerIdx=0;
function startTickerFeed(){
  const el=document.getElementById('ticker-text');
  if(!el)return;
  (function next(){
    if(!el)return;
    el.style.opacity='0';
    setTimeout(()=>{el.textContent=tickerMessages[tickerIdx%tickerMessages.length];tickerIdx++;el.style.opacity='1';el.style.transition='opacity .5s';},400);
  })();
  setInterval(()=>{
    const el=document.getElementById('ticker-text');
    if(!el)return;
    el.style.opacity='0';
    setTimeout(()=>{el.textContent=tickerMessages[tickerIdx%tickerMessages.length];tickerIdx++;el.style.opacity='1';},400);
  },4000);
}

function startSatClock(){
  setInterval(()=>{
    const el=document.getElementById('sat-time');
    if(el)el.textContent='Last sync: '+new Date().toLocaleTimeString('en-IN');
  },1000);
}
