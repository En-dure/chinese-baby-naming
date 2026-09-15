const fs = require('fs');
const json = fs.readFileSync('references/chars-data.json', 'utf8');

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>起名 · 刘姓女孩</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;500;600;700&family=Ma+Shan+Zheng&display=swap" rel="stylesheet">
<style>
:root{
  --ink:#2b2b2b;--ink2:#5a5a5a;--ink3:#8a8a8a;
  --paper:#f7f3ec;--paper2:#efe9df;--card:#fffdf8;
  --vermilion:#b4392f;--vermilion2:#d4584e;
  --jade:#5c7a6b;--jade2:#7a9a8a;
  --gold:#a8853e;--gold2:#c9a867;
  --border:#e0d6c6;
  --shadow:0 2px 16px rgba(43,25,15,.05);
  --shadow2:0 4px 24px rgba(43,25,15,.08);
  --r:14px;--r-s:8px;
  --serif:'Noto Serif SC',serif;
  --brush:'Ma Shan Zheng',cursive;
  --sans:'Noto Sans SC','PingFang SC','Microsoft YaHei',sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box}
html{font-size:14px;-webkit-font-smoothing:antialiased}
body{font-family:var(--sans);background:var(--paper);color:var(--ink);min-height:100vh}

.hero{background:linear-gradient(135deg,#3a342c 0%,#5a4a3a 100%);color:#f7f3ec;padding:2.2rem 2rem 1.8rem;text-align:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 30% 50%,rgba(184,57,47,.08),transparent 60%);pointer-events:none}
.hero .title{font-family:var(--serif);font-weight:300;font-size:2.1rem;letter-spacing:.4rem;margin-bottom:.3rem}
.hero .title span{color:var(--gold2)}
.hero .sub{font-size:.82rem;opacity:.7;letter-spacing:.1rem}
.hero .seal{display:inline-block;background:var(--vermilion);color:#fff;font-family:var(--brush);width:2.4rem;height:2.4rem;border-radius:6px;line-height:2.4rem;font-size:1rem;vertical-align:middle;margin:0 .3rem;transform:rotate(-3deg)}

.wrap{display:flex;gap:1.5rem;max-width:1280px;margin:0 auto;padding:1.5rem;align-items:flex-start}
.sidebar{width:270px;flex-shrink:0;position:sticky;top:1.5rem;max-height:calc(100vh - 3rem);overflow-y:auto;display:flex;flex-direction:column;gap:1rem}
.sidebar::-webkit-scrollbar{width:6px}
.sidebar::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}
.card{background:var(--card);border-radius:var(--r);padding:1.1rem 1.3rem;box-shadow:var(--shadow)}
.card h3{font-family:var(--serif);font-weight:500;font-size:.92rem;color:var(--gold);margin-bottom:.7rem;padding-bottom:.5rem;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:.5rem}
.card h3::before{content:'';width:4px;height:14px;background:var(--vermilion);border-radius:2px;display:inline-block}

/* 八字区 */
.bz-field{margin-bottom:.6rem}
.bz-field label{display:block;font-size:.72rem;color:var(--ink3);margin-bottom:.25rem}
.bz-input{width:100%;font-family:var(--serif);font-size:.95rem;padding:.45rem .6rem;border:1px solid var(--border);border-radius:var(--r-s);background:var(--paper);color:var(--ink)}
.bz-input:focus{outline:none;border-color:var(--gold);box-shadow:0 0 0 3px rgba(168,133,62,.1)}
select.bz-input{cursor:pointer}
.bz-pillars{display:flex;gap:.4rem;margin-top:.6rem;justify-content:center}
.bz-pillars .pz{font-family:var(--serif);font-size:.88rem;padding:.2rem .55rem;border-radius:6px;background:var(--paper2);color:var(--ink);text-align:center}
.bz-pillars .pz .lb{display:block;font-size:.58rem;color:var(--ink3);letter-spacing:.1rem}
.bz-pillars .pz.empty{background:var(--paper);color:var(--ink3)}
.xiyong{margin-top:.7rem;padding:.6rem .7rem;background:var(--paper);border-radius:var(--r-s);font-size:.76rem;line-height:1.7;color:var(--ink2)}
.xiyong b{color:var(--ink)}
.wxcount{display:flex;gap:.3rem;margin-top:.4rem;flex-wrap:wrap}
.wxcount span{font-size:.7rem;padding:.1rem .4rem;border-radius:4px}
.wxcount .金{background:rgba(168,133,62,.18);color:var(--gold)}
.wxcount .木{background:rgba(92,122,107,.18);color:var(--jade)}
.wxcount .水{background:rgba(74,139,194,.18);color:#4a8bc2}
.wxcount .火{background:rgba(184,57,47,.18);color:var(--vermilion)}
.wxcount .土{background:rgba(139,90,43,.18);color:#8b5a2b}

.chips{display:flex;flex-wrap:wrap;gap:.3rem}
.chip{padding:.25rem .65rem;border-radius:18px;border:1px solid var(--border);background:var(--paper);cursor:pointer;font-size:.76rem;color:var(--ink2);transition:all .18s;user-select:none}
.chip:hover{border-color:var(--gold2);color:var(--ink)}
.chip.active{background:var(--ink);color:#f7f3ec;border-color:var(--ink)}
.chip.danger{border-color:var(--vermilion2);color:var(--vermilion2)}
.chip.danger.active{background:var(--vermilion);color:#fff;border-color:var(--vermilion)}

.main{flex:1;min-width:0}
.main-top{background:var(--card);border-radius:var(--r);padding:1.1rem 1.4rem;box-shadow:var(--shadow);margin-bottom:1rem;display:flex;align-items:center;gap:1.4rem;flex-wrap:wrap}
.name-assemble{display:flex;align-items:baseline;gap:.4rem}
.name-assemble .xing{font-family:var(--serif);font-weight:500;font-size:1.9rem;color:var(--gold)}
.name-assemble .slot{font-family:var(--serif);font-size:1.9rem;width:2.5rem;text-align:center;border:none;border-bottom:2px solid var(--border);background:transparent;color:var(--ink);cursor:pointer;transition:border-color .2s;line-height:1.4}
.name-assemble .slot.filled{border-bottom-color:var(--vermilion)}
.name-assemble .slot:empty::before{content:'·';color:var(--ink3)}
.name-assemble .slot:hover{border-bottom-color:var(--gold2)}
.wuge-row{display:flex;gap:.5rem;margin-left:auto;flex-wrap:wrap}
.wg{text-align:center;padding:.28rem .55rem;background:var(--paper);border-radius:var(--r-s);min-width:2.8rem}
.wg .v{display:block;font-family:var(--serif);font-weight:600;font-size:1rem;line-height:1.2}
.wg .l{font-size:.58rem;color:var(--ink3);letter-spacing:.1rem}
.wg .v.ji{color:var(--jade)}
.wg .v.xiong{color:var(--vermilion)}
.wg .v.idle{color:var(--ink3)}

.name-result{margin-bottom:1rem}
.name-card{display:inline-flex;align-items:center;gap:.8rem;background:var(--card);border-radius:var(--r);padding:.65rem 1.1rem;box-shadow:var(--shadow2);margin-right:.6rem}
.name-card .full-name{font-family:var(--serif);font-weight:500;font-size:1.25rem;letter-spacing:.15rem}
.name-card .wuge-sum{font-size:.7rem;color:var(--ink3)}
.name-card .all-ji{color:var(--jade);font-weight:600}

.toolbar{display:flex;align-items:center;gap:.8rem;margin-bottom:.7rem;flex-wrap:wrap}
.tool-count{font-size:.8rem;color:var(--ink3)}
.tool-count b{color:var(--ink);font-family:var(--serif)}
.btn{padding:.4rem 1rem;border-radius:var(--r-s);border:1px solid var(--ink);background:transparent;color:var(--ink);cursor:pointer;font-size:.8rem;transition:all .18s;font-family:var(--sans)}
.btn:hover{background:var(--ink);color:#f7f3ec}
.btn.pri{background:var(--vermilion);color:#fff;border-color:var(--vermilion)}
.btn.pri:hover{background:var(--vermilion2)}

.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(62px,1fr));gap:.45rem}
.cell{background:var(--card);border-radius:var(--r-s);padding:.45rem .25rem .35rem;text-align:center;box-shadow:var(--shadow);cursor:pointer;transition:all .15s;position:relative}
.cell:hover{transform:translateY(-2px);box-shadow:var(--shadow2)}
.cell.sel{background:var(--vermilion);color:#fff}
.cell.sel .meta{color:rgba(255,255,255,.8)}
.cell .ch{font-family:var(--serif);font-weight:500;font-size:1.45rem;display:block;line-height:1.3}
.cell .py{font-size:.55rem;color:var(--ink3);display:block;line-height:1.2}
.cell .meta{font-size:.58rem;color:var(--ink3);display:block;margin-top:.05rem}
.cell .wx-tag{position:absolute;top:3px;left:3px;font-size:.5rem;padding:0 3px;border-radius:3px;line-height:1.3}
.cell .wx-tag.金{background:rgba(168,133,62,.2);color:var(--gold)}
.cell .wx-tag.木{background:rgba(92,122,107,.2);color:var(--jade)}
.cell .wx-tag.水{background:rgba(74,139,194,.2);color:#4a8bc2}
.cell .wx-tag.火{background:rgba(184,57,47,.2);color:var(--vermilion)}
.cell .wx-tag.土{background:rgba(139,90,43,.2);color:#8b5a2b}

.detail-overlay{position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:100;display:none;align-items:center;justify-content:center;backdrop-filter:blur(2px)}
.detail-overlay.show{display:flex}
.detail-box{background:var(--card);border-radius:var(--r);width:460px;max-width:90vw;padding:1.8rem 2.2rem;box-shadow:0 8px 40px rgba(0,0,0,.15);position:relative;animation:popIn .25s ease}
@keyframes popIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
.detail-box .close-btn{position:absolute;top:.8rem;right:1.1rem;background:none;border:none;font-size:1.3rem;color:var(--ink3);cursor:pointer}
.detail-box .char-display{text-align:center;margin-bottom:1rem}
.detail-box .char-display .big{font-family:var(--serif);font-weight:500;font-size:4.5rem;line-height:1;color:var(--ink)}
.detail-box .char-display .py-big{font-size:.85rem;color:var(--ink3);margin-top:.25rem}
.detail-box .info-list{display:grid;grid-template-columns:auto 1fr;gap:.5rem 1rem;font-size:.88rem}
.detail-box .info-list dt{color:var(--ink3);text-align:right}
.detail-box .info-list dd{font-family:var(--serif)}
.detail-box .source-quote{margin-top:.9rem;padding:.7rem .9rem;background:var(--paper);border-radius:var(--r-s);border-left:3px solid var(--gold2);font-family:var(--serif);font-size:.82rem;line-height:1.7;color:var(--ink2)}
.detail-box .acts{margin-top:1rem;display:flex;gap:.5rem}
.empty{text-align:center;padding:2.5rem;color:var(--ink3)}

@media(max-width:900px){.wrap{flex-direction:column;padding:1rem}.sidebar{width:100%;position:relative;max-height:none;flex-direction:row;flex-wrap:wrap}.sidebar .card{flex:1;min-width:140px}}
</style>
</head>
<body>
<div class="hero">
  <div class="title">起名 <span class="seal">刘</span> 女孩</div>
  <div class="sub">生辰八字 · 五行喜用 · 五格数理 · 经典出处</div>
</div>
<div class="wrap">
<aside class="sidebar">
  <div class="card">
    <h3>生辰八字</h3>
    <div class="bz-field">
      <label>出生日期（公历）</label>
      <input class="bz-input" type="date" id="bzDate" value="2027-01-02" min="2026-12-15" max="2027-01-10">
    </div>
    <div class="bz-field">
      <label>出生时辰</label>
      <select class="bz-input" id="bzHour">
        <option value="-1">未知 / 不填</option>
        <option value="0">子时 23-1点</option>
        <option value="1">丑时 1-3点</option>
        <option value="2">寅时 3-5点</option>
        <option value="3">卯时 5-7点</option>
        <option value="4">辰时 7-9点</option>
        <option value="5">巳时 9-11点</option>
        <option value="6" selected>午时 11-13点</option>
        <option value="7">未时 13-15点</option>
        <option value="8">申时 15-17点</option>
        <option value="9">酉时 17-19点</option>
        <option value="10">戌时 19-21点</option>
        <option value="11">亥时 21-23点</option>
      </select>
    </div>
    <div class="bz-pillars" id="bzPillars">
      <div class="pz empty"><span id="pYear">——</span><span class="lb">年</span></div>
      <div class="pz empty"><span id="pMonth">——</span><span class="lb">月</span></div>
      <div class="pz empty"><span id="pDay">——</span><span class="lb">日</span></div>
      <div class="pz empty"><span id="pHour">——</span><span class="lb">时</span></div>
    </div>
    <div class="xiyong" id="xiyongDisplay">选择日期与时辰后自动推算</div>
  </div>
  <div class="card">
    <h3>笔画</h3>
    <div class="chips" id="strokeChips"></div>
  </div>
  <div class="card">
    <h3>五行</h3>
    <div class="chips" id="wxChips"></div>
  </div>
  <div class="card">
    <h3>风格</h3>
    <div class="chips" id="styleChips"></div>
  </div>
  <div class="card">
    <h3>性别</h3>
    <div class="chips" id="genderChips">
      <span class="chip" data-g="女" onclick="gndr('女',this)">女</span>
      <span class="chip" data-g="通用" onclick="gndr('通用',this)">通用</span>
      <span class="chip" data-g="男" onclick="gndr('男',this)">男</span>
    </div>
  </div>
  <div class="card">
    <h3>排除</h3>
    <div class="chips" id="excludeChips"></div>
  </div>
  <div class="card">
    <h3>五格大吉组合</h3>
    <div style="font-size:.78rem;color:var(--ink2);line-height:1.9">
      刘=15画（康熙）<br>
      <span style="color:var(--vermilion)">★</span> <b>10+14</b> 天人地外总全吉<br>
      <b>8+16</b> · <b>9+15</b> · <b>10+7</b><br>
      <b>8+10</b> · <b>10+6</b> · <b>6+12</b>
    </div>
  </div>
</aside>
<main class="main">
  <div class="main-top">
    <div class="name-assemble">
      <span class="xing">刘</span>
      <span class="slot" id="slotA"></span>
      <span class="slot" id="slotB"></span>
    </div>
    <div class="wuge-row" id="wugeRow">
      <div class="wg"><span class="v idle" id="g1">—</span><span class="l">天</span></div>
      <div class="wg"><span class="v idle" id="g2">—</span><span class="l">人</span></div>
      <div class="wg"><span class="v idle" id="g3">—</span><span class="l">地</span></div>
      <div class="wg"><span class="v idle" id="g4">—</span><span class="l">外</span></div>
      <div class="wg"><span class="v idle" id="g5">—</span><span class="l">总</span></div>
    </div>
    <button class="btn" onclick="clrName()">清空</button>
  </div>
  <div class="name-result" id="nameResult"></div>
  <div class="toolbar">
    <span class="tool-count">显示 <b id="showCount">0</b> 字 / 共 <b id="totalCount">0</b></span>
  </div>
  <div class="grid" id="grid"></div>
</main>
</div>
<div class="detail-overlay" id="detailOverlay" onclick="closeDetail(event)">
  <div class="detail-box" id="detailBox"></div>
</div>
<script>
const DATA = ${json};
const S = 15;
const JI = new Set([1,3,5,6,7,8,11,13,15,16,17,18,21,23,24,25,29,31,32,33,35,37,39,41,45,47,48,52,55,57,61,63,65,67,68,81]);
const GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const WX_GAN = {甲:'木',乙:'木',丙:'火',丁:'火',戊:'土',己:'土',庚:'金',辛:'金',壬:'水',癸:'水'};
const WX_ZHI = {子:'水',丑:'土',寅:'木',卯:'木',辰:'土',巳:'火',午:'火',未:'土',申:'金',酉:'金',戌:'土',亥:'水'};

// 节气表(2026-2027，只列"节"，月柱分界)
// 各节对应其后的月支
// 月支 index: 子=0 丑=1 寅=2 ... 亥=11 (与ZHI数组一致)
const JIEQI = [
  {d:'2026-12-07', z:0},   // 大雪→子月
  {d:'2027-01-05', z:1},   // 小寒→丑月
  {d:'2027-02-04', z:2},   // 立春→寅月(新年)
];

let fil = {s:[],w:[],st:[],g:[],xF:false,xL:false};
let nA='',nB='',sel=null;

document.getElementById('totalCount').textContent = DATA.length;
buildChips();render();
document.getElementById('bzDate').addEventListener('change',calcBazi);
document.getElementById('bzHour').addEventListener('change',calcBazi);
calcBazi();

function buildChips(){
  const strokes=[...new Set(DATA.map(c=>c.s))].sort((a,b)=>a-b);
  const sc=document.getElementById('strokeChips');
  strokes.forEach(s=>{const e=document.createElement('span');e.className='chip';e.textContent=s+'画';e.onclick=()=>{tgl('s',s,e);render()};sc.appendChild(e);});
  const wx=[...new Set(DATA.map(c=>c.w))].filter(Boolean);
  const wc=document.getElementById('wxChips');
  wx.forEach(w=>{const e=document.createElement('span');e.className='chip';e.textContent=w;e.onclick=()=>{tgl('w',w,e);render()};wc.appendChild(e);});
  const styles=['温婉','知性','自然','大气','现代'];
  const stc=document.getElementById('styleChips');
  styles.forEach(st=>{const e=document.createElement('span');e.className='chip';e.textContent=st;e.onclick=()=>{tgl('st',st,e);render()};stc.appendChild(e);});
  const exc=document.getElementById('excludeChips');
  [{k:'xF',l:'笔画分歧 ⚠'},{k:'xL',l:'烂大街 ✗'}].forEach(o=>{
    const e=document.createElement('span');e.className='chip danger';e.textContent=o.l;
    e.onclick=()=>{fil[o.k]=!fil[o.k];e.classList.toggle('active');render()};
    exc.appendChild(e);
  });
}
function tgl(g,v,e){const a=fil[g];const i=a.indexOf(v);i>=0?a.splice(i,1):a.push(v);e.classList.toggle('active');}
function gndr(v,e){const i=fil.g.indexOf(v);if(i>=0)fil.g.splice(i,1);else fil.g.push(v);e.classList.toggle('active');render();}

function fdata(){
  let r=[...DATA];
  if(fil.s.length)r=r.filter(c=>fil.s.includes(c.s));
  if(fil.w.length)r=r.filter(c=>fil.w.includes(c.w));
  if(fil.st.length)r=r.filter(c=>c.tags.some(t=>fil.st.includes(t)));
  if(fil.xF)r=r.filter(c=>!c.fenqi);
  if(fil.xL)r=r.filter(c=>!c.landajie);
  if(fil.g.length)r=r.filter(c=>!c.gender||fil.g.includes(c.gender));
  return r;
}

function render(){
  const a=fdata(),g=document.getElementById('grid');g.innerHTML='';
  document.getElementById('showCount').textContent=a.length;
  a.forEach(c=>{
    const e=document.createElement('div');e.className='cell'+(c.c===nA||c.c===nB?' sel':'');
    let inner='<span class="ch">'+c.c+'</span>';
    if(c.p)inner+='<span class="py">'+c.p+'</span>';
    inner+='<span class="meta">'+c.s+'画'+(c.w?' · '+c.w:'')+'</span>';
    if(c.w)inner+='<span class="wx-tag '+c.w+'">'+c.w+'</span>';
    e.innerHTML=inner;
    e.onclick=()=>showDetail(c);
    e.ondblclick=()=>addName(c);
    g.appendChild(e);
  });
  if(!a.length)g.innerHTML='<div class="empty">无匹配字，请调整筛选</div>';
  updWuge();updNameCard();
}

function showDetail(c){
  sel=c;
  const box=document.getElementById('detailBox');
  let html='<button class="close-btn" onclick="closeDetail()">×</button>';
  html+='<div class="char-display"><div class="big">'+c.c+'</div><div class="py-big">'+(c.p||'')+'</div></div>';
  html+='<dl class="info-list">';
  html+='<dt>笔画</dt><dd>'+c.s+' 画（康熙）</dd>';
  html+='<dt>五行</dt><dd>'+(c.w||'待定')+'</dd>';
  if(c.m)html+='<dt>释义</dt><dd>'+c.m+'</dd>';
  if(c.gender)html+='<dt>性别</dt><dd>'+c.gender+'</dd>';
  html+='<dt>风格</dt><dd>'+(c.tags.join('、')||'—')+'</dd>';
  html+='</dl>';
  if(c.src)html+='<div class="source-quote">📖 '+c.src+'</div>';
  html+='<div class="acts"><button class="btn pri" onclick="addName(sel)">放入姓名</button></div>';
  box.innerHTML=html;
  document.getElementById('detailOverlay').classList.add('show');
}
function closeDetail(e){
  if(e&&e.target.id!=='detailOverlay'&&e.target.classList&&!e.target.classList.contains('detail-overlay'))return;
  document.getElementById('detailOverlay').classList.remove('show');
}

function addName(c){
  if(!nA){nA=c.c}
  else if(!nB){nB=c.c}
  else{nB=c.c}
  updSlots();closeDetail();render();
}
function updSlots(){
  const a=document.getElementById('slotA'),b=document.getElementById('slotB');
  a.textContent=nA;a.className='slot'+(nA?' filled':'');
  b.textContent=nB;b.className='slot'+(nB?' filled':'');
}
function clrName(){nA='';nB='';updSlots();render();}
document.getElementById('slotA').onclick=()=>{nA='';updSlots();render()};
document.getElementById('slotB').onclick=()=>{nB='';updSlots();render()};

function gs(c){const f=DATA.find(x=>x.c===c);return f?f.s:0}
function updWuge(){
  const a=gs(nA),b=gs(nB);
  const v=[S+1,S+a,a+b,b+1,S+a+b];
  ['g1','g2','g3','g4','g5'].forEach((id,i)=>{
    const e=document.getElementById(id);
    if(v[i]>0){e.textContent=v[i];e.className='v '+(JI.has(v[i])?'ji':'xiong')}
    else{e.textContent='—';e.className='v idle'}
  });
}
function updNameCard(){
  const c=document.getElementById('nameResult');
  if(!nA&&!nB){c.innerHTML='';return}
  const a=gs(nA),b=gs(nB),t=S+a+b;
  const name='刘'+(nA||'')+(nB||'');
  let sum='天'+(S+1)+' · 人'+(S+a)+' · 地'+(a+b)+' · 外'+(b+1)+' · 总'+t;
  const allJi=JI.has(S+1)&&JI.has(S+a)&&JI.has(a+b)&&JI.has(b+1)&&JI.has(t);
  c.innerHTML='<div class="name-card"><span class="full-name">'+name+'</span><span class="wuge-sum">'+sum+(allJi?' <span class="all-ji">五格全吉</span>':'')+'</span></div>';
}

// ====== 八字计算 ======
function jdn(y,m,d){
  // 公历→儒略日数(0时)
  const a=Math.floor((14-m)/12);
  const yy=y+4800-a;
  const mm=m+12*a-3;
  return d+Math.floor((153*mm+2)/5)+365*yy+Math.floor(yy/4)-Math.floor(yy/100)+Math.floor(yy/400)-32045;
}
function gzOf(seq){return GAN[seq%10]+ZHI[seq%12]}

function calcBazi(){
  const dateStr=document.getElementById('bzDate').value;
  const hour=parseInt(document.getElementById('bzHour').value);
  const xy=document.getElementById('xiyongDisplay');
  if(!dateStr){xy.innerHTML='请选择日期';return;}
  const [y,mo,d]=dateStr.split('-').map(Number);
  const dateStr2=dateStr;

  // 年柱: 当年立春(≈02-04)后用当年，之前用上一年
  const lichun = y+'-02-04';
  const yearBase = dateStr2 >= lichun ? y : y-1;
  let yearGanIdx=((yearBase-4)%10+10)%10;
  let yearZhiIdx=((yearBase-4)%12+12)%12;
  const yearGz=gzOf(yearGanIdx*6+yearZhiIdx); // 简化：干支序号=同序
  // 正确算年柱序号: n%10=ganIdx, n%12=zhiIdx
  let ySeq=yearGanIdx%5===yearZhiIdx%5?yearGanIdx:-1;
  // 直接组合
  const yearPillar=GAN[yearGanIdx]+ZHI[yearZhiIdx];

  // 月柱: 找当前日期落在哪个节之后
  let monthZhi=-1;
  for(let i=JIEQI.length-1;i>=0;i--){
    if(dateStr2>=JIEQI[i].d){monthZhi=JIEQI[i].z;break;}
  }
  if(monthZhi<0){monthZhi=2;} // 默认寅月(立春后第一个月往前)
  // 月干: 五虎遁 寅月起干=(年干%5)*2+2
  const yinGan=((yearGanIdx%5)*2+2)%10;
  // 月支到寅的偏移: 寅=2, 从寅算起 monthOffset=monthZhi-2 (mod 12)
  const monthOffset=((monthZhi-2)%12+12)%12;
  const monthGanIdx=(yinGan+monthOffset)%10;
  const monthPillar=GAN[monthGanIdx]+ZHI[monthZhi];

  // 日柱: JDN公式
  const jd=jdn(y,mo,d);
  const daySeq=(jd+49)%60;
  const dayPillar=gzOf(daySeq);
  const dayGanIdx=daySeq%10;

  // 时柱: 五鼠遁
  let hourPillar='——',hourGanIdx=-1;
  if(hour>=0){
    const ziGan=((dayGanIdx%5)*2)%10; // 子时干
    hourGanIdx=(ziGan+hour)%10;
    hourPillar=GAN[hourGanIdx]+ZHI[hour];
  }

  // 显示四柱
  document.getElementById('pYear').textContent=yearPillar;
  document.getElementById('pMonth').textContent=monthPillar;
  document.getElementById('pDay').textContent=dayPillar;
  document.getElementById('pHour').textContent=hourPillar;
  document.querySelectorAll('#bzPillars .pz').forEach((p,i)=>{
    p.className='pz'+(i===3&&hour<0?' empty':'');
  });

  // 五行统计 + 喜用神
  const el={金:0,木:0,水:0,火:0,土:0};
  [yearPillar,monthPillar,dayPillar,hourPillar].forEach(pz=>{
    if(pz==='——')return;
    const g=pz[0],z=pz[1];
    if(WX_GAN[g])el[WX_GAN[g]]++;
    if(WX_ZHI[z])el[WX_ZHI[z]]++;
  });
  const dayGan=dayPillar[0];
  const dayWx=WX_GAN[dayGan];
  // 月令旺衰判断
  const monthZhiStr=ZHI[monthZhi];
  const monthWx=WX_ZHI[monthZhiStr];
  // 日主在月令的旺衰: 同五行=旺, 生我=相, 我生=休, 克我=囚, 我克=死
  const sheng={木:{生我:水,我生:火,克我:金,我克:土},火:{生我:木,我生:土,克我:水,我克:金},土:{生我:火,我生:金,克我:木,我克:水},金:{生我:土,我生:水,克我:火,我克:木},水:{生我:金,我生:木,克我:土,我克:火}};
  const rel=sheng[dayWx];
  let strength;
  if(monthWx===dayWx)strength='旺';
  else if(monthWx===rel['生我'])strength='相';
  else if(monthWx===rel['我生'])strength='休';
  else if(monthWx===rel['克我'])strength='囚';
  else if(monthWx===rel['我克'])strength='死';

  // 身旺(旺/相)喜克泄耗(官杀/食伤/财), 身弱(休/囚/死)喜生扶(印/比劫)
  let xi='',ji='';
  if(strength==='旺'||strength==='相'){
    // 喜: 克我(官杀)、我克(财)、我生(食伤)
    xi=rel['克我']+' '+rel['我克']+' '+rel['我生'];
    ji=dayWx+' '+rel['生我']; // 忌比劫、印
  }else{
    // 身弱喜: 生我(印)、同我(比劫)
    xi=rel['生我']+' '+dayWx;
    ji=rel['我克']+' '+rel['我生']+' '+rel['克我'];
  }

  const order=['金','木','水','火','土'];
  const wxc=order.map(k=>'<span class="'+k+'">'+k+el[k]+'</span>').join('');
  xy.innerHTML='日主 <b>'+dayGan+'('+dayWx+')</b> 生于'+monthZhiStr+'月，<b>'+strength+'</b><br>'+
    '五行：'+wxc+'<br>'+
    '喜用：<b>'+xi+'</b> · 忌：<b style="color:var(--vermilion)">'+ji+'</b><br>'+
    '<span style="color:var(--ink3);font-size:.68rem">※ 喜用为程序粗判，精确需命理师综合四柱</span>';
}
</script>
</body>
</html>`;

fs.writeFileSync('naming.html', html, 'utf8');
console.log('✅ naming.html ('+(html.length/1024).toFixed(0)+'KB)');