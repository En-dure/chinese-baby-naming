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
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;500;600;700&family=Ma+Shan+Zheng&family=Liu+Jian+Mao+Cao&display=swap" rel="stylesheet">
<style>
:root{
  --ink:#2b2b2b;
  --ink2:#5a5a5a;
  --ink3:#8a8a8a;
  --paper:#f7f3ec;
  --paper2:#efe9df;
  --card:#fffdf8;
  --vermilion:#b4392f;
  --vermilion2:#d4584e;
  --jade:#5c7a6b;
  --jade2:#7a9a8a;
  --gold:#a8853e;
  --gold2:#c9a867;
  --border:#e0d6c6;
  --shadow:0 2px 16px rgba(43,25,15,.05);
  --shadow2:0 4px 24px rgba(43,25,15,.08);
  --r:14px;
  --r-s:8px;
  --serif:'Noto Serif SC',serif;
  --brush:'Ma Shan Zheng',cursive;
  --sans:'Noto Sans SC','PingFang SC','Microsoft YaHei',sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box}
html{font-size:14px;-webkit-font-smoothing:antialiased}
body{font-family:var(--sans);background:var(--paper);color:var(--ink);min-height:100vh}
a{color:inherit;text-decoration:none}

/* ====== 顶部 ====== */
.hero{
  background:linear-gradient(135deg,#3a342c 0%,#5a4a3a 100%);
  color:#f7f3ec;
  padding:2.5rem 2rem 2rem;
  text-align:center;
  position:relative;
  overflow:hidden;
}
.hero::before{
  content:'';
  position:absolute;inset:0;
  background:radial-gradient(circle at 30% 50%,rgba(184,57,47,.08),transparent 60%);
  pointer-events:none;
}
.hero .title{
  font-family:var(--serif);
  font-weight:300;
  font-size:2.2rem;
  letter-spacing:.4rem;
  margin-bottom:.3rem;
}
.hero .title span{color:var(--gold2)}
.hero .sub{font-size:.85rem;opacity:.7;letter-spacing:.1rem}
.hero .seal{
  display:inline-block;
  background:var(--vermilion);
  color:#fff;
  font-family:var(--brush);
  width:2.5rem;height:2.5rem;
  border-radius:6px;
  line-height:2.5rem;
  font-size:1rem;
  vertical-align:middle;
  margin:0 .3rem;
  transform:rotate(-3deg);
}

/* ====== 布局 ====== */
.wrap{display:flex;gap:1.5rem;max-width:1280px;margin:0 auto;padding:1.5rem;align-items:flex-start}
.sidebar{
  width:260px;flex-shrink:0;
  position:sticky;top:1.5rem;
  display:flex;flex-direction:column;gap:1rem;
}
.card{background:var(--card);border-radius:var(--r);padding:1.2rem 1.4rem;box-shadow:var(--shadow)}
.card h3{
  font-family:var(--serif);font-weight:500;font-size:.95rem;color:var(--gold);
  margin-bottom:.8rem;padding-bottom:.6rem;border-bottom:1px solid var(--border);
  display:flex;align-items:center;gap:.5rem;
}
.card h3::before{content:'';width:4px;height:14px;background:var(--vermilion);border-radius:2px;display:inline-block}

/* 筛选chips */
.chips{display:flex;flex-wrap:wrap;gap:.35rem}
.chip{
  padding:.28rem .7rem;border-radius:18px;
  border:1px solid var(--border);background:var(--paper);
  cursor:pointer;font-size:.78rem;color:var(--ink2);
  transition:all .18s;user-select:none;
}
.chip:hover{border-color:var(--gold2);color:var(--ink)}
.chip.active{background:var(--ink);color:#f7f3ec;border-color:var(--ink)}
.chip.active.wx-gold{background:var(--gold)}
.chip.active.wx-jade{background:var(--jade)}
.chip.danger{border-color:var(--vermilion2);color:var(--vermilion2)}
.chip.danger.active{background:var(--vermilion);color:#fff;border-color:var(--vermilion)}

/* 八字 */
.bazi-input{
  width:100%;font-family:var(--serif);font-size:1.1rem;
  padding:.5rem .6rem;border:1px solid var(--border);
  border-radius:var(--r-s);background:var(--paper);
  text-align:center;letter-spacing:.3rem;color:var(--ink);
}
.bazi-input:focus{outline:none;border-color:var(--gold);box-shadow:0 0 0 3px rgba(168,133,62,.1)}
.bazi-pillars{display:flex;gap:.3rem;margin-top:.5rem;justify-content:center}
.bazi-pillars span{
  font-family:var(--serif);font-size:.85rem;
  padding:.15rem .5rem;border-radius:4px;
}
.bazi-pillars .set{background:var(--paper2);color:var(--ink)}
.bazi-pillars .unset{background:var(--paper);color:var(--ink3)}
.xiyong{
  margin-top:.6rem;padding:.5rem .6rem;
  background:var(--paper);border-radius:var(--r-s);
  font-size:.78rem;line-height:1.6;color:var(--ink2);
}
.xiyong b{color:var(--ink)}
.xiyong .wx-gold{color:var(--gold)}
.xiyong .wx-jade{color:var(--jade)}
.xiyong .wx-vermilion{color:var(--vermilion)}

/* 主区域 */
.main{flex:1;min-width:0}
.main-top{
  background:var(--card);border-radius:var(--r);padding:1.2rem 1.5rem;
  box-shadow:var(--shadow);margin-bottom:1rem;
  display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap;
}

/* 姓名组装 */
.name-assemble{display:flex;align-items:baseline;gap:.5rem}
.name-assemble .xing{
  font-family:var(--serif);font-weight:500;
  font-size:2rem;color:var(--gold);
}
.name-assemble .slot{
  font-family:var(--serif);font-size:2rem;
  width:2.6rem;text-align:center;
  border:none;border-bottom:2px solid var(--border);
  background:transparent;color:var(--ink);cursor:pointer;
  transition:border-color .2s;line-height:1.4;
}
.name-assemble .slot.filled{border-bottom-color:var(--vermilion)}
.name-assemble .slot:empty::before{content:'·';color:var(--ink3)}
.name-assemble .slot:hover{border-bottom-color:var(--gold2)}

/* 五格 */
.wuge-row{display:flex;gap:.6rem;margin-left:auto;flex-wrap:wrap}
.wg{text-align:center;padding:.3rem .6rem;background:var(--paper);border-radius:var(--r-s);min-width:3rem}
.wg .v{display:block;font-family:var(--serif);font-weight:600;font-size:1.05rem;line-height:1.2}
.wg .l{font-size:.62rem;color:var(--ink3);letter-spacing:.1rem}
.wg .v.ji{color:var(--jade)}
.wg .v.xiong{color:var(--vermilion)}
.wg .v.idle{color:var(--ink3)}

/* 选中名字卡 */
.name-result{margin-bottom:1rem;min-height:0}
.name-card{
  display:inline-flex;align-items:center;gap:.8rem;
  background:var(--card);border-radius:var(--r);
  padding:.7rem 1.2rem;box-shadow:var(--shadow2);
  margin-right:.8rem;
}
.name-card .full-name{font-family:var(--serif);font-weight:500;font-size:1.3rem;letter-spacing:.15rem}
.name-card .wuge-sum{font-size:.72rem;color:var(--ink3)}
.name-card .all-ji{color:var(--jade);font-weight:600}

/* 工具栏 */
.toolbar{display:flex;align-items:center;gap:.8rem;margin-bottom:.8rem;flex-wrap:wrap}
.tool-count{font-size:.82rem;color:var(--ink3)}
.tool-count b{color:var(--ink);font-family:var(--serif)}

/* 字格 */
.grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(64px,1fr));
  gap:.5rem;
}
.cell{
  background:var(--card);border-radius:var(--r-s);
  padding:.5rem .3rem .4rem;text-align:center;
  box-shadow:var(--shadow);cursor:pointer;
  transition:all .15s;position:relative;overflow:hidden;
}
.cell:hover{transform:translateY(-2px);box-shadow:var(--shadow2)}
.cell.sel{
  background:var(--vermilion);color:#fff;
}
.cell.sel .meta{color:rgba(255,255,255,.8)}
.cell .ch{
  font-family:var(--serif);font-weight:500;
  font-size:1.5rem;display:block;line-height:1.3;
}
.cell .py{
  font-size:.58rem;color:var(--ink3);
  display:block;line-height:1.2;
}
.cell .meta{font-size:.6rem;color:var(--ink3);display:block;margin-top:.1rem}
.cell .wx-tag{
  position:absolute;top:3px;left:3px;
  font-size:.5rem;padding:0 3px;border-radius:3px;
  line-height:1.3;
}
.cell .wx-tag.金{background:rgba(168,133,62,.2);color:var(--gold)}
.cell .wx-tag.木{background:rgba(92,122,107,.2);color:var(--jade)}
.cell .wx-tag.水{background:rgba(74,139,194,.2);color:#4a8bc2}
.cell .wx-tag.火{background:rgba(184,57,47,.2);color:var(--vermilion)}
.cell .wx-tag.土{background:rgba(139,90,43,.2);color:#8b5a2b}

/* 详情面板 */
.detail-overlay{
  position:fixed;inset:0;background:rgba(0,0,0,.35);
  z-index:100;display:none;align-items:center;justify-content:center;
  backdrop-filter:blur(2px);
}
.detail-overlay.show{display:flex}
.detail-box{
  background:var(--card);border-radius:var(--r);
  width:480px;max-width:90vw;padding:2rem 2.5rem;
  box-shadow:0 8px 40px rgba(0,0,0,.15);
  position:relative;animation:popIn .25s ease;
}
@keyframes popIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
.detail-box .close-btn{
  position:absolute;top:1rem;right:1.2rem;
  background:none;border:none;font-size:1.4rem;color:var(--ink3);cursor:pointer;
}
.detail-box .char-display{
  text-align:center;margin-bottom:1.2rem;
}
.detail-box .char-display .big{
  font-family:var(--serif);font-weight:500;
  font-size:5rem;line-height:1;color:var(--ink);
}
.detail-box .char-display .py-big{
  font-size:.9rem;color:var(--ink3);margin-top:.3rem;
}
.detail-box .info-list{display:grid;grid-template-columns:auto 1fr;gap:.6rem 1rem;font-size:.9rem}
.detail-box .info-list dt{color:var(--ink3);text-align:right}
.detail-box .info-list dd{font-family:var(--serif)}
.detail-box .source-quote{
  margin-top:1rem;padding:.8rem 1rem;
  background:var(--paper);border-radius:var(--r-s);
  border-left:3px solid var(--gold2);
  font-family:var(--serif);font-size:.85rem;line-height:1.7;color:var(--ink2);
}
.detail-box .acts{margin-top:1.2rem;display:flex;gap:.6rem}
.btn{
  padding:.5rem 1.4rem;border-radius:var(--r-s);border:1px solid var(--ink);
  background:transparent;color:var(--ink);cursor:pointer;font-size:.85rem;
  transition:all .18s;font-family:var(--sans);
}
.btn:hover{background:var(--ink);color:#f7f3ec}
.btn.pri{background:var(--vermilion);color:#fff;border-color:var(--vermilion)}
.btn.pri:hover{background:var(--vermilion2)}

/* 空状态 */
.empty{text-align:center;padding:3rem;color:var(--ink3)}

@media(max-width:900px){
  .wrap{flex-direction:column;padding:1rem}
  .sidebar{width:100%;position:relative;flex-direction:row;flex-wrap:wrap}
  .sidebar .card{flex:1;min-width:140px}
}
</style>
</head>
<body>

<div class="hero">
  <div class="title">起名 <span class="seal">刘</span> 女孩</div>
  <div class="sub">笔画 · 五行 · 五格 · 八字 · 经典出处</div>
</div>

<div class="wrap">
<!-- 侧栏 -->
<aside class="sidebar">
  <div class="card">
    <h3>八字</h3>
    <input class="bazi-input" id="baziInput" value="丙午" placeholder="输入四柱">
    <div class="bazi-pillars">
      <span id="yP" class="set">丙午</span>
      <span id="mP" class="unset">——</span>
      <span id="dP" class="unset">——</span>
      <span id="hP" class="unset">——</span>
    </div>
    <div class="xiyong" id="xiyongDisplay">仅年柱已定，补全后自动推算</div>
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
      <span class="chip active" data-g="女" onclick="gndr('女',this)">女</span>
      <span class="chip" data-g="通用" onclick="gndr('通用',this)">通用</span>
      <span class="chip" data-g="男" onclick="gndr('男',this)">男</span>
    </div>
  </div>
  <div class="card">
    <h3>排除</h3>
    <div class="chips" id="excludeChips"></div>
  </div>
  <div class="card">
    <h3>五格组合</h3>
    <div style="font-size:.8rem;color:var(--ink3);line-height:1.8">
      <span style="color:var(--vermilion)">★</span> <b>10+14</b> 最优<br>
      8+16 · 9+15 · 10+7<br>
      8+10 · 10+6 · 6+12
    </div>
  </div>
</aside>

<!-- 主区 -->
<main class="main">
  <div class="main-top">
    <div class="name-assemble">
      <span class="xing">刘</span>
      <span class="slot" id="slotA" data-idx="0"></span>
      <span class="slot" id="slotB" data-idx="1"></span>
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

<!-- 详情弹窗 -->
<div class="detail-overlay" id="detailOverlay" onclick="closeDetail(event)">
  <div class="detail-box" id="detailBox"></div>
</div>

<script>
const DATA = ${json};
const S = 15;
const JI = new Set([1,3,5,6,7,8,11,13,15,16,17,18,21,23,24,25,29,31,32,33,35,37,39,41,45,47,48,52,55,57,61,63,65,67,68,81]);
const WX_GAN = {甲:'木',乙:'木',丙:'火',丁:'火',戊:'土',己:'土',庚:'金',辛:'金',壬:'水',癸:'水'};
const WX_ZHI = {子:'水',丑:'土',寅:'木',卯:'木',辰:'土',巳:'火',午:'火',未:'土',申:'金',酉:'金',戌:'土',亥:'水'};

let fil = {s:[],w:[],st:[],g:['女'],xF:false,xL:false};
let nA='',nB='',sel=null;

document.getElementById('totalCount').textContent = DATA.length;
buildChips();render();updBazi();
document.getElementById('baziInput').addEventListener('input', updBazi);

function buildChips(){
  const strokes=[...new Set(DATA.map(c=>c.s))].sort((a,b)=>a-b);
  const sc=document.getElementById('strokeChips');
  strokes.forEach(s=>{const e=document.createElement('span');e.className='chip';e.textContent=s+'画';e.onclick=()=>{tgl('s',s,e);render()};sc.appendChild(e);});
  const wx=[...new Set(DATA.map(c=>c.w))].filter(Boolean);
  const wc=document.getElementById('wxChips');
  const wxClass={金:'wx-gold',木:'wx-jade',水:'wx-jade',火:'',土:''};
  wx.forEach(w=>{const e=document.createElement('span');e.className='chip '+wxClass[w]||'';e.textContent=w;e.onclick=()=>{tgl('w',w,e);render()};wc.appendChild(e);});
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
function gndr(v,e){document.querySelectorAll('#genderChips .chip').forEach(c=>c.classList.remove('active'));e.classList.add('active');fil.g=[v];render();}

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
    if(c.p)inner+='<span class="py">'+c.p.replace(/\\d/g,'')+'</span>';
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
  html+='<dt>笔画</dt><dd>'+c.s+' 画</dd>';
  html+='<dt>五行</dt><dd>'+(c.w||'—')+'</dd>';
  if(c.m)html+='<dt>释义</dt><dd>'+c.m+'</dd>';
  html+='<dt>字频</dt><dd>'+(c.freq===1?'常用字':'次常用字')+'</dd>';
  if(c.gender)html+='<dt>性别</dt><dd>'+c.gender+'</dd>';
  html+='</dl>';
  if(c.src)html+='<div class="source-quote">📖 '+c.src+'</div>';
  html+='<div class="acts"><button class="btn pri" onclick="addName(sel)">放入姓名</button></div>';
  box.innerHTML=html;
  document.getElementById('detailOverlay').classList.add('show');
}
function closeDetail(e){
  if(e&&e.target.id!=='detailOverlay'&&e.type!=='click')return;
  document.getElementById('detailOverlay').classList.remove('show');
}

function addName(c){
  if(!nA){nA=c.c;updSlots()}
  else if(!nB){nB=c.c;updSlots()}
  else{nB=c.c;updSlots()}
  closeDetail();render();
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

// ====== 八字 ======
function parseBazi(input){
  const raw=input.replace(/[\\s,，、]/g,'');
  const pillars=[];
  for(let i=0;i<raw.length&&i<8;i+=2)pillars.push(raw.slice(i,i+2));
  return{
    yG:pillars[0]?.[0]||'',yZ:pillars[0]?.[1]||'',
    mG:pillars[1]?.[0]||'',mZ:pillars[1]?.[1]||'',
    dG:pillars[2]?.[0]||'',dZ:pillars[2]?.[1]||'',
    hG:pillars[3]?.[0]||'',hZ:pillars[3]?.[1]||''
  };
}
function updBazi(){
  const bz=parseBazi(document.getElementById('baziInput').value);
  const xy=document.getElementById('xiyongDisplay');
  const labels=[
    [bz.yG+bz.yZ,'yP'],[bz.mG+bz.mZ,'mP'],
    [bz.dG+bz.dZ,'dP'],[bz.hG+bz.hZ,'hP']
  ];
  labels.forEach(([txt,id])=>{
    const el=document.getElementById(id);
    el.textContent=txt||'——';
    el.className=txt?'set':'unset';
  });
  if(!bz.dG){xy.innerHTML='仅年柱已定，补全后自动推算';return;}
  const el={金:0,木:0,水:0,火:0,土:0};
  [bz.yG,bz.mG,bz.dG,bz.hG,bz.yZ,bz.mZ,bz.dZ,bz.hZ].filter(Boolean).forEach(ch=>{
    const wx=WX_GAN[ch]||WX_ZHI[ch]||'';if(wx)el[wx]++;
  });
  const order=['金','木','水','火','土'];
  const stats=order.map(k=>k+el[k]).join(' · ');
  const dayEl=WX_GAN[bz.dG]||'';
  let xi='',ji='';
  if(dayEl==='金'){xi='土 金';ji=el['火']>el['金']?'火 水 木':'火';}
  else if(dayEl==='木'){xi='水 木';ji='金 土';}
  else if(dayEl==='水'){xi='金 水';ji='土 火';}
  else if(dayEl==='火'){xi='木 火';ji='水 金';}
  else if(dayEl==='土'){xi='火 土';ji='木 水';}
  const pillars=[bz.yG+bz.yZ,bz.mG+bz.mZ,bz.dG+bz.dZ,bz.hG+bz.hZ].filter(p=>p.length===2).join(' ');
  xy.innerHTML='日主 <b>'+bz.dG+'</b> '+stats+'<br>喜 <span class="wx-gold">'+(xi||'—')+'</span> · 忌 <span class="wx-vermilion">'+(ji||'—')+'</span>';
}
</script>
</body>
</html>`;

fs.writeFileSync('naming.html', html, 'utf8');
console.log(`✅ naming.html (${html.length} bytes)`);