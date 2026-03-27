/* ============================================================
   data.js — All application data
   AI-Based Disaster Response Optimization System
   ============================================================ */

const disasters = [
  {id:'D001',type:'cyclone',  name:'Cyclone Nilofar',         loc:'Maharashtra Coast',    severity:'critical', affected:'1.2M', teams:24, status:'active',     time:'2h ago',  lat:18.9, lng:72.8},
  {id:'D002',type:'flood',    name:'Brahmaputra Floods',      loc:'Assam, Northeast',     severity:'critical', affected:'840K', teams:18, status:'active',     time:'5h ago',  lat:26.1, lng:91.7},
  {id:'D003',type:'earthquake',name:'Uttarakhand Quake 5.8',  loc:'Chamoli, UK',          severity:'high',     affected:'12K',  teams:8,  status:'active',     time:'3h ago',  lat:30.4, lng:79.4},
  {id:'D004',type:'wildfire', name:'Himachal Forest Fire',    loc:'Shimla District',      severity:'high',     affected:'3.2K', teams:12, status:'contained',  time:'8h ago',  lat:31.1, lng:77.2},
  {id:'D005',type:'flood',    name:'Krishna River Flood',     loc:'Andhra Pradesh',       severity:'moderate', affected:'280K', teams:10, status:'active',     time:'12h ago', lat:16.5, lng:80.6},
  {id:'D006',type:'cyclone',  name:'Low Pressure BoB',        loc:'Odisha Coast',         severity:'high',     affected:'90K',  teams:6,  status:'monitoring', time:'1d ago',  lat:20.9, lng:85.1},
  {id:'D007',type:'earthquake',name:'Gujarat Tremor 4.2',     loc:'Bhuj, Gujarat',        severity:'moderate', affected:'5K',   teams:4,  status:'resolved',   time:'2d ago',  lat:23.2, lng:69.7},
];

const timeline = [
  {title:'Cyclone Warning Issued',   desc:'NDRF activated Level 3 protocol',      time:'14:22', color:'var(--danger)'},
  {title:'Evacuation Ordered',       desc:'1.2M residents in 5 districts',         time:'14:45', color:'var(--warning)'},
  {title:'Rescue Teams Deployed',    desc:'24 teams dispatched to coast',          time:'15:10', color:'var(--accent)'},
  {title:'Relief Camps Activated',   desc:'312 shelters opened',                  time:'15:30', color:'var(--success)'},
  {title:'Medical Teams Enroute',    desc:'48 medical units mobilized',            time:'16:00', color:'var(--teal)'},
  {title:'Supply Convoys Dispatched',desc:'200 trucks of relief material',         time:'16:15', color:'var(--purple)'},
];

const rescueUnits = [
  {icon:'🚁', name:'NDRF Team Alpha-7',         loc:'Mumbai Coastline',            status:'deployed', st:'ust-deployed'},
  {icon:'🚢', name:'Coast Guard Vessel CG-14',   loc:'Arabian Sea, 20km off coast', status:'enroute',  st:'ust-enroute'},
  {icon:'🚑', name:'Medical Response Unit 3',    loc:'Nashik District Camp',        status:'deployed', st:'ust-deployed'},
  {icon:'🛻', name:'Search & Rescue Team B',     loc:'Ratnagiri — Standby',         status:'ready',    st:'ust-ready'},
  {icon:'🚒', name:'Fire Brigade Unit F-9',      loc:'Shimla — Active',             status:'deployed', st:'ust-deployed'},
  {icon:'🚁', name:'Air Rescue Wing-2',          loc:'Bhopal Airport — Ready',      status:'ready',    st:'ust-ready'},
];

const resources = [
  {name:'Rescue Personnel', available:1480, total:2000,  color:'#63b3ed'},
  {name:'Medical Kits',     available:8200, total:10000, color:'#68d391'},
  {name:'Food Packages',    available:120000,total:200000,color:'#f6ad55'},
  {name:'Drinking Water (KL)',available:4500,total:8000, color:'#4fd1c7'},
  {name:'Boats & Rafts',    available:342,  total:500,   color:'#b794f4'},
  {name:'Helicopters',      available:28,   total:40,    color:'#fc8181'},
  {name:'Tents / Shelters', available:9800, total:15000, color:'#fbd38d'},
  {name:'Power Generators', available:180,  total:250,   color:'#9f7aea'},
];

const markerData = [
  ...disasters.map(d => ({...d, markerType:'disaster'})),
  {lat:26.9,lng:75.8, name:'Shelter Jaipur',        desc:'4,200 sheltered · Medical · Water',        markerType:'shelter',type:'shelter',capacity:'4,200'},
  {lat:17.4,lng:78.5, name:'Relief Camp Hyderabad',  desc:'12,000 sheltered · Food · Medical',        markerType:'shelter',type:'shelter',capacity:'12,000'},
  {lat:22.6,lng:88.4, name:'Medical Camp Kolkata',   desc:'Emergency hospital · 800 beds',            markerType:'shelter',type:'shelter',capacity:'800'},
  {lat:13.1,lng:80.3, name:'Shelter Chennai',         desc:'6,500 evacuated · Cyclone prep',           markerType:'shelter',type:'shelter',capacity:'6,500'},
  {lat:19.1,lng:72.9, name:'NDRF Base Mumbai',        desc:'Command center · 24 teams on standby',     markerType:'rescue', type:'rescue'},
  {lat:28.6,lng:77.2, name:'NDRF HQ Delhi',           desc:'National coordination center · 8 battalions',markerType:'rescue',type:'rescue'},
  {lat:22.5,lng:88.3, name:'Air Rescue Wing Kolkata', desc:'6 helicopters · 2 fixed-wing',             markerType:'rescue', type:'rescue'},
  {lat:17.7,lng:83.3, name:'Naval Station Vizag',     desc:'Coast Guard vessels · Submarine rescue',   markerType:'rescue', type:'rescue'},
];

const tickerMessages = [
  '🌀 CYCLONE NILOFAR: 180km/h winds · Maharashtra coast · ETA 4h 30min',
  '🌊 BRAHMAPUTRA: Water level +2.4m above danger mark · Assam',
  '🚁 NDRF ALPHA-7 deployed · 24 teams active · Mumbai sector',
  '🌍 EARTHQUAKE 5.8M · Chamoli UK · 12 aftershocks recorded',
  '🔥 WILDFIRE CONTAINED 60% · Shimla District · 12 units active',
  '⚠️ LOW PRESSURE BAY OF BENGAL · Odisha coast advisory issued',
  '✅ 4,200 evacuated safely · Nashik corridor · Operation SHIELD',
  '📡 INSAT-3DR: Cyclone eye diameter 45km · Strengthening',
  '🏥 312 medical camps operational · 48 deployed last 6 hours',
  '🚢 COAST GUARD CG-14 · Rescue operations active · 40nm offshore',
];
