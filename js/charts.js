/* ============================================================
   charts.js — Chart.js Visualizations Module
   AI-Based Disaster Response Optimization System
   ============================================================ */

function initDashboardCharts(){
  new Chart(document.getElementById('freqChart'),{
    type:'bar',
    data:{
      labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets:[
        {label:'Floods',     data:[2,1,0,3,8,12,18,21,14,6,2,1], backgroundColor:'rgba(99,179,237,0.6)'},
        {label:'Cyclones',   data:[0,0,0,1,2,4,6,8,10,7,3,1],   backgroundColor:'rgba(183,148,244,0.6)'},
        {label:'Earthquakes',data:[1,2,1,1,2,1,2,1,1,2,1,1],    backgroundColor:'rgba(246,173,85,0.6)'},
        {label:'Wildfires',  data:[3,4,5,6,8,4,2,1,2,3,2,1],    backgroundColor:'rgba(252,129,129,0.6)'},
      ]
    },
    options:{
      responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false}},
      scales:{
        x:{ticks:{color:'#718096',font:{size:10}},grid:{color:'rgba(99,179,237,0.08)'}},
        y:{ticks:{color:'#718096',font:{size:10}},grid:{color:'rgba(99,179,237,0.08)'}}
      }
    }
  });

  new Chart(document.getElementById('resourceChart'),{
    type:'doughnut',
    data:{
      labels:['Deployed','Available','Reserved'],
      datasets:[{data:[58,28,14],backgroundColor:['#fc8181','#63b3ed','#f6ad55'],borderWidth:0}]
    },
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},cutout:'65%'}
  });
}

function initResourceChart(){
  new Chart(document.getElementById('distChart'),{
    type:'bar',
    data:{
      labels:['North','South','East','West','Central','NE'],
      datasets:[
        {label:'Teams',     data:[32,28,41,19,22,18],backgroundColor:'rgba(99,179,237,0.7)'},
        {label:'Medical',   data:[18,22,35,12,16,14],backgroundColor:'rgba(104,211,145,0.7)'},
        {label:'Food Kits', data:[45,38,62,24,30,28],backgroundColor:'rgba(246,173,85,0.7)'},
      ]
    },
    options:{
      responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false}},
      scales:{
        x:{ticks:{color:'#718096',font:{size:10}},grid:{color:'rgba(99,179,237,0.06)'}},
        y:{ticks:{color:'#718096',font:{size:10}},grid:{color:'rgba(99,179,237,0.06)'}}
      }
    }
  });
}

let analyticsInited=false;
function initAnalyticsCharts(){
  if(analyticsInited)return; analyticsInited=true;

  new Chart(document.getElementById('trendChart'),{
    type:'line',
    data:{
      labels:['2020','2021','2022','2023','2024'],
      datasets:[
        {label:'Floods',     data:[38,42,35,48,54],borderColor:'#63b3ed',fill:false,tension:.4},
        {label:'Cyclones',   data:[18,22,19,25,28],borderColor:'#b794f4',fill:false,tension:.4},
        {label:'Earthquakes',data:[12,14,11,16,13],borderColor:'#f6ad55',fill:false,tension:.4},
        {label:'Wildfires',  data:[24,28,32,29,36],borderColor:'#fc8181',fill:false,tension:.4},
      ]
    },
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false}},
      scales:{x:{ticks:{color:'#718096'},grid:{color:'rgba(99,179,237,0.08)'}},y:{ticks:{color:'#718096'},grid:{color:'rgba(99,179,237,0.08)'}}}
    }
  });

  new Chart(document.getElementById('pieChart'),{
    type:'doughnut',
    data:{labels:['Floods','Earthquakes','Cyclones','Wildfires'],
      datasets:[{data:[38,24,21,17],backgroundColor:['#63b3ed','#f6ad55','#b794f4','#fc8181'],borderWidth:0}]
    },
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},cutout:'60%'}
  });

  new Chart(document.getElementById('responseChart'),{
    type:'line',
    data:{
      labels:['2020','2021','2022','2023','2024'],
      datasets:[{label:'Avg Response (min)',data:[28,24,20,16,12],borderColor:'#4fd1c7',fill:true,backgroundColor:'rgba(79,209,199,0.1)',tension:.4}]
    },
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},
      scales:{x:{ticks:{color:'#718096'},grid:{color:'rgba(99,179,237,0.08)'}},y:{ticks:{color:'#718096'},grid:{color:'rgba(99,179,237,0.08)'}}}
    }
  });

  new Chart(document.getElementById('costChart'),{
    type:'bar',
    data:{
      labels:['2020','2021','2022','2023','2024'],
      datasets:[{label:'Relief Cost',data:[1200,1580,1340,1890,2240],backgroundColor:'rgba(246,173,85,0.7)'}]
    },
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},
      scales:{x:{ticks:{color:'#718096'},grid:{color:'rgba(99,179,237,0.06)'}},y:{ticks:{color:'#718096'},grid:{color:'rgba(99,179,237,0.06)'}}}
    }
  });
}
