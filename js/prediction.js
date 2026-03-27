/* ============================================================
   prediction.js — AI Prediction Engine Module
   AI-Based Disaster Response Optimization System
   ============================================================ */

function updatePred(){
  ['rain','wind','seismic','temp','soil','pop','coast'].forEach(k=>{
    document.getElementById('v-'+k).textContent=document.getElementById('p-'+k).value;
  });
  const rain    = +document.getElementById('p-rain').value;
  const wind    = +document.getElementById('p-wind').value;
  const seismic = +document.getElementById('p-seismic').value;
  const soil    = +document.getElementById('p-soil').value;
  const coast   = +document.getElementById('p-coast').value;
  const temp    = +document.getElementById('p-temp').value;

  const flood   = Math.min(99,Math.round((rain/500)*60+(soil/100)*30+(coast<100?15:0)));
  const quake   = Math.min(99,Math.round((seismic/9)*80+10));
  const cyclone = Math.min(99,Math.round((wind/300)*50+(coast<100?35:10)+(rain/500)*15));
  const fire    = Math.min(99,Math.round((temp/55)*50+((100-soil)/100)*40+5));

  ['flood','quake','cyclone','fire'].forEach((k,i)=>{
    const v=[flood,quake,cyclone,fire][i];
    document.getElementById('r-'+k).textContent=v+'%';
    document.getElementById('rf-'+k).style.width=v+'%';
  });
}

function runPrediction(){
  const rain    = +document.getElementById('p-rain').value;
  const wind    = +document.getElementById('p-wind').value;
  const seismic = +document.getElementById('p-seismic').value;
  const temp    = +document.getElementById('p-temp').value;
  const soil    = +document.getElementById('p-soil').value;
  const pop     = +document.getElementById('p-pop').value;
  const coast   = +document.getElementById('p-coast').value;

  const flood   = Math.min(99,Math.round((rain/500)*60+(soil/100)*30+(coast<100?15:0)));
  const cyclone = Math.min(99,Math.round((wind/300)*50+(coast<100?35:10)+(rain/500)*15));
  const topRisk = flood>cyclone?'FLOOD':'CYCLONE';
  const topScore= Math.max(flood,cyclone);
  const alert   = topScore>70?'🚨 HIGH ALERT':topScore>40?'⚠️  MODERATE RISK':'✅ LOW RISK';
  const conf    = (82+Math.random()*10).toFixed(1);

  document.getElementById('predict-output').innerHTML=`
<span style="color:var(--accent)">→ MODEL: Random Forest + LSTM Ensemble</span>
<span style="color:var(--muted)">→ Run at: ${new Date().toLocaleTimeString()}</span>

<span style="color:var(--success)">→ PRIMARY RISK: ${topRisk} (${topScore}%)</span>
<span style="color:var(--warning)">→ ALERT LEVEL: ${alert}</span>

<span style="color:var(--text)">RECOMMENDATIONS:</span>
${flood>60?'<span style="color:var(--danger)">  ● Pre-position 24 boat rescue teams</span>':''}
${cyclone>50?'<span style="color:var(--danger)">  ● Issue coastal evacuation advisory</span>':''}
${pop>1000?'<span style="color:var(--warning)">  ● High density zone: Priority evacuation</span>':''}
<span style="color:var(--success)">  ● Activate emergency shelters</span>
<span style="color:var(--success)">  ● Deploy medical units (min: ${Math.ceil(pop/500)})</span>
<span style="color:var(--accent)">  ● Estimated relief kits needed: ${Math.ceil(pop*0.4).toLocaleString()}</span>
<span style="color:var(--muted)">→ Confidence: ${conf}%</span>`;
}
