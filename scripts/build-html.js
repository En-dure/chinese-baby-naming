const fs = require('fs');
const json = fs.readFileSync('references/chars-data.json', 'utf8');

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>刘姓女孩 · 起名选字</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#faf8f5;--card:#fff;--text:#2c2c2c;--text2:#8a8a8a;--gold:#b8860b;--gold2:#d4a574;--border:#e8e0d6;--shadow:0 2px 12px rgba(0,0,0,.06);--radius:12px;--font:'Noto Serif SC','STSong','SimSun',serif;--font-ui:'Noto Sans SC','PingFang SC','Microsoft YaHei',sans-serif}
html{font-size:15px}
body{font-family:var(--font-ui);background:var(--bg);color:var(--text);min-height:100vh}
header{background:linear-gradient(135deg,#8b6914,#b8860b);color:#fff;padding:1rem 2rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap}
header h1{font-family:var(--font);font-weight:400;font-size:1.4rem;letter-spacing:2px}
header .sub{font-size:.8rem;opacity:.8}
header .badge{background:rgba(255,255,255,.2);padding:.2rem .8rem;border-radius:20px;font-size:.8rem}
.layout{display:flex;gap:1.2rem;padding:1.2rem;max-width:1400px;margin:0 auto}
.sidebar{width:220px;flex-shrink:0;display:flex;flex-direction:column;gap:.8rem}
.sidebar section{background:var(--card);border-radius:var(--radius);padding:.8rem 1rem;box-shadow:var(--shadow)}
.sidebar h3{font-family:var(--font);font-size:.85rem;color:var(--gold);margin-bottom:.5rem;padding-bottom:.4rem;border-bottom:1px solid var(--border)}
.main{flex:1;display:flex;flex-direction:column;gap:.8rem;min-width:0}
.chips{display:flex;flex-wrap:wrap;gap:.3rem}
.chip{padding:.2rem .6rem;border-radius:20px;border:1px solid var(--border);background:var(--card);cursor:pointer;font-size:.78rem;transition:all .15s;user-select:none}
.chip:hover{border-color:var(--gold2)}
.chip.active{background:var(--gold);color:#fff;border-color:var(--gold)}
.chip.danger{border-color:#e74c3c;color:#e74c3c}
.chip.danger.active{background:#e74c3c;color:#fff;border-color:#e74c3c}
.name-builder{background:var(--card);border-radius:var(--radius);padding:1rem 1.2rem;box-shadow:var(--shadow);display:flex;align-items:center;gap:1rem;flex-wrap:wrap}
.name-builder .surname{font-family:var(--font);font-size:1.8rem;color:var(--gold)}
.slot{font-family:var(--font);font-size:1.8rem;width:2.2rem;text-align:center;border:none;border-bottom:2px dashed var(--border);background:transparent;outline:none;cursor:pointer;padding:0}
.slot.filled{border-bottom-color:var(--gold);color:var(--text)}
.slot::placeholder{font-size:.9rem;color:var(--text2);opacity:.4}
.wuge{display:flex;gap:.6rem;margin-left:auto;flex-wrap:wrap}
.wuge-item{text-align:center;font-size:.7rem;color:var(--text2);padding:.2rem .4rem;border-radius:6px;background:var(--bg)}
.wuge-item .num{display:block;font-family:var(--font);font-size:1rem;font-weight:600}
.num.ji{color:#27ae60}
.num.xiong{color:#e74c3c}
.name-cards{display:flex;gap:.8rem;flex-wrap:wrap;min-height:2px}
.name-card{background:var(--card);border-radius:var(--radius);padding:.6rem 1rem;box-shadow:var(--shadow);display:flex;align-items:center;gap:.6rem}
.name-card .n{font-family:var(--font);font-size:1.2rem;letter-spacing:2px}
.name-card .ws{font-size:.7rem;color:var(--text2)}
.stats{font-size:.78rem;color:var(--text2);padding:.2rem 0}
.char-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(56px,1fr));gap:.4rem}
.cell{background:var(--card);border-radius:8px;padding:.4rem;text-align:center;box-shadow:var(--shadow);cursor:pointer;transition:all .12s;position:relative}
.cell:hover{transform:translateY(-2px);box-shadow:0 3px 10px rgba(0,0,0,.1)}
.cell.sel{background:var(--gold);color:#fff}
.cell .ch{font-family:var(--font);font-size:1.3rem;display:block;line-height:1.3}
.cell .meta{font-size:.6rem;color:var(--text2);display:block}
.cell.sel .meta{color:rgba(255,255,255,.8)}
.cell .mark{position:absolute;top:1px;right:3px;font-size:.55rem}
.detail{background:var(--card);border-radius:var(--radius);padding:1rem 1.2rem;box-shadow:var(--shadow);display:none}
.detail.show{display:block}
.detail .big{font-family:var(--font);font-size:2.8rem;color:var(--gold);float:left;margin-right:1rem;line-height:1}
.detail .grid{display:grid;grid-template-columns:auto 1fr;gap:.2rem 1rem;font-size:.85rem}
.detail .grid dt{color:var(--text2)}
.detail .grid dd{font-family:var(--font)}
.detail .src{margin-top:.5rem;padding:.5rem;background:var(--bg);border-radius:6px;font-size:.75rem;line-height:1.5;color:var(--text2);font-style:italic}
.detail .acts{margin-top:.6rem;display:flex;gap:.4rem}
.btn{padding:.35rem .9rem;border-radius:6px;border:1px solid var(--gold);background:transparent;color:var(--gold);cursor:pointer;font-size:.82rem;transition:all .12s}
.btn:hover{background:var(--gold);color:#fff}
.btn.pri{background:var(--gold);color:#fff}
.btn.pri:hover{background:#9a7210}
@media(max-width:800px){.layout{flex-direction:column}.sidebar{width:100%;flex-direction:row;flex-wrap:wrap}.sidebar section{flex:1;min-width:150px}}
#baziInput:focus{outline:none;border-color:var(--gold)}
</style>
</head>
<body>

<header>
  <h1>刘姓女孩 · 起名选字</h1>
  <span class="sub">刘=15画（康熙）· 默认双名</span>
  <span class="badge" id="charCount">0 字</span>
</header>

<div class="layout">

<aside class="sidebar">
  <section>
    <h3>笔画</h3>
    <div class="chips" id="strokeChips"></div>
  </section>
  <section>
    <h3>五行</h3>
    <div class="chips" id="wxChips"></div>
  </section>
  <section>
    <h3>风格</h3>
    <div class="chips" id="styleChips"></div>
  </section>
  <section>
    <h3>排除</h3>
    <div class="chips" id="excludeChips"></div>
  </section>
  <section>
    <h3>性别</h3>
    <div class="chips" id="genderChips">
      <span class="chip active" data-g="女" onclick="gndr('女',this)">女</span>
      <span class="chip" data-g="通用" onclick="gndr('通用',this)">通用</span>
      <span class="chip" data-g="男" onclick="gndr('男',this)">男</span>
    </div>
  </section>
  <section>
    <h3>五格组合</h3>
    <div style="font-size:.75rem;color:var(--text2);line-height:1.6">
      ☆ <strong>10+14</strong> 最优<br>
      8+16 · 9+15 · 10+7<br>
      8+10 · 10+6 · 6+12
    </div>
  </section>
  <section id="baziPanel">
    <h3>八字 <span style="font-weight:400;font-size:.7rem;color:var(--text2)">直接输入</span></h3>
    <div style="font-size:.72rem;line-height:1.5">
      <input id="baziInput" type="text" value="丙午" 
        style="width:100%;font-family:var(--font);font-size:1rem;padding:.3rem;border:1px solid var(--border);border-radius:4px;text-align:center;letter-spacing:4px"
        placeholder="例: 丙午庚子辛巳戊子">
      <div style="display:flex;gap:2px;margin-top:4px;font-family:var(--font);font-size:.82rem;color:var(--text2)">
        <span id="yP" style="background:#f0e8d6;padding:1px 6px;border-radius:3px">丙午</span>
        <span id="mP" style="background:#f5f0e8;padding:1px 6px;border-radius:3px;color:#aaa">——</span>
        <span id="dP" style="background:#f5f0e8;padding:1px 6px;border-radius:3px;color:#aaa">——</span>
        <span id="hP" style="background:#f5f0e8;padding:1px 6px;border-radius:3px;color:#aaa">——</span>
      </div>
      <div id="xiyongDisplay" style="padding:.3rem;background:#f5f0e8;border-radius:4px;font-size:.7rem;margin-top:4px">
        仅年柱已定<br>补全后自动推算五行喜忌
      </div>
    </div>
  </section>
</aside>

<main class="main">

  <div class="name-builder">
    <span class="surname">刘</span>
    <input class="slot" id="slotA" placeholder="名A" maxlength="1" readonly>
    <input class="slot" id="slotB" placeholder="名B" maxlength="1" readonly>
    <div class="wuge" id="wugeBox">
      <div class="wuge-item"><span class="num" id="g1">—</span>天</div>
      <div class="wuge-item"><span class="num" id="g2">—</span>人</div>
      <div class="wuge-item"><span class="num" id="g3">—</span>地</div>
      <div class="wuge-item"><span class="num" id="g4">—</span>外</div>
      <div class="wuge-item"><span class="num" id="g5">—</span>总</div>
    </div>
    <button class="btn" onclick="clr()" style="margin-left:auto">清空</button>
  </div>

  <div class="name-cards" id="nameCards"></div>

  <div class="stats"><span id="showCount">显示 0 字</span></div>

  <div class="char-grid" id="grid"></div>

  <div class="detail" id="detail"></div>

</main>
</div>

<script>
const DATA = ${json};

const S = 15;
const JI = new Set([1,3,5,6,7,8,11,13,15,16,17,18,21,23,24,25,29,31,32,33,35,37,39,41,45,47,48,52,55,57,61,63,65,67,68,81]);

let fil = {s:[],w:[],st:[],xF:false,xL:false,g:[]};
let nA='',nB='',sel=null;

// ====== Init ======
document.getElementById('charCount').textContent = DATA.length + ' 字';
buildChips();
render();
document.getElementById('baziInput').addEventListener('input', updBazi);
updBazi();

function buildChips() {
  const strokes = [...new Set(DATA.map(c=>c.s))].sort((a,b)=>a-b);
  const sc = document.getElementById('strokeChips');
  strokes.forEach(s=>{
    const e=document.createElement('span');e.className='chip';e.textContent=s+'画';e.dataset.v=s;
    e.onclick=()=>{tgl('s',s,e);render()};sc.appendChild(e);
  });

  const wx = [...new Set(DATA.map(c=>c.w))].filter(Boolean);
  const wc = document.getElementById('wxChips');
  wx.forEach(w=>{
    const e=document.createElement('span');e.className='chip';e.textContent=w;e.dataset.v=w;
    e.onclick=()=>{tgl('w',w,e);render()};wc.appendChild(e);
  });

  const styles = ['温婉','知性','自然','大气','现代'];
  const stc = document.getElementById('styleChips');
  styles.forEach(st=>{
    const e=document.createElement('span');e.className='chip';e.textContent=st;e.dataset.v=st;
    e.onclick=()=>{tgl('st',st,e);render()};stc.appendChild(e);
  });

  const exc = document.getElementById('excludeChips');
  [{k:'xF',l:'分歧 ⚠️'},{k:'xL',l:'烂大街 🚫'}].forEach(o=>{
    const e=document.createElement('span');e.className='chip danger';e.textContent=o.l;e.dataset.k=o.k;
    e.onclick=()=>{fil[o.k]=!fil[o.k];e.classList.toggle('active');render()};
    exc.appendChild(e);
  });
}

function tgl(g,v,e) {
  const a=fil[g];const i=a.indexOf(v);
  i>=0?a.splice(i,1):a.push(v);
  e.classList.toggle('active');
}

function fdata() {
  let r=[...DATA];
  if(fil.s.length) r=r.filter(c=>fil.s.includes(c.s));
  if(fil.w.length) r=r.filter(c=>fil.w.includes(c.w));
  if(fil.st.length) r=r.filter(c=>c.tags.some(t=>fil.st.includes(t)));
  if(fil.xF) r=r.filter(c=>!c.fenqi);
  if(fil.xL) r=r.filter(c=>!c.landajie);
  if(fil.g.length) r=r.filter(c=>!c.gender || fil.g.includes(c.gender));
  return r;
}

// ====== 八字全柱 ======
const WX_GAN = {甲:'木',乙:'木',丙:'火',丁:'火',戊:'土',己:'土',庚:'金',辛:'金',壬:'水',癸:'水'};
const WX_ZHI = {子:'水',丑:'土',寅:'木',卯:'木',辰:'土',巳:'火',午:'火',未:'土',申:'金',酉:'金',戌:'土',亥:'水'};

function parseBazi(input) {
  // 解析用户输入的八字字符串
  // 支持: "丙午" / "丙午庚子" / "丙午庚子辛巳" / "丙午庚子辛巳戊子"
  // 每两字为一柱，先干后支
  const raw = input.replace(/[\s,，、]/g, '');
  const pillars = [];
  for (let i = 0; i < raw.length && i < 8; i += 2) {
    pillars.push(raw.slice(i, i+2));
  }
  
  const result = { pillars: pillars };
  const ganIdx = [0,2,4,6];
  const zhiIdx = [1,3,5,7];
  
  result.yG = pillars.length >= 1 ? pillars[0][0] || '' : '';
  result.yZ = pillars.length >= 1 ? pillars[0][1] || '' : '';
  result.mG = pillars.length >= 2 ? pillars[1][0] || '' : '';
  result.mZ = pillars.length >= 2 ? pillars[1][1] || '' : '';
  result.dG = pillars.length >= 3 ? pillars[2][0] || '' : '';
  result.dZ = pillars.length >= 3 ? pillars[2][1] || '' : '';
  result.hG = pillars.length >= 4 ? pillars[3][0] || '' : '';
  result.hZ = pillars.length >= 4 ? pillars[3][1] || '' : '';
  
  return result;
}

function updBazi() {
  const input = document.getElementById('baziInput').value;
  const bz = parseBazi(input);
  const xyEl = document.getElementById('xiyongDisplay');
  
  // 更新四柱显示
  const pEls = ['yP','mP','dP','hP'];
  const pLabels = [
    bz.yG+bz.yZ || '——',
    bz.mG+bz.mZ || '——',
    bz.dG+bz.dZ || '——',
    bz.hG+bz.hZ || '——'
  ];
  pEls.forEach((id,i) => {
    const el = document.getElementById(id);
    el.textContent = pLabels[i];
    el.style.background = pLabels[i] === '——' ? '#f5f0e8' : '#f0e8d6';
    el.style.color = pLabels[i] === '——' ? '#aaa' : 'inherit';
  });
  
  const dayMaster = bz.dG;
  if (!dayMaster) {
    xyEl.innerHTML = '仅年柱已定<br>补全后自动推算五行喜忌';
    return;
  }
  
  // 五行统计
  const el = {金:0,木:0,水:0,火:0,土:0};
  const all = [bz.yG,bz.mG,bz.dG,bz.hG,bz.yZ,bz.mZ,bz.dZ,bz.hZ].filter(Boolean);
  for (const ch of all) {
    const wx = WX_GAN[ch] || WX_ZHI[ch] || '';
    if (wx) el[wx] += 1;
  }
  
  const order = ['金','木','水','火','土'];
  const stats = order.map(k => k + el[k]).join(' · ');
  
  // 喜用神
  const dayEl = WX_GAN[dayMaster] || '';
  let xi = '', ji = '';
  if (dayEl === '金') {
    xi = '土 金'; ji = el['火'] > el['金'] ? '火 水 木' : '火';
  } else if (dayEl === '木') { xi = '水 木'; ji = '金 土';
  } else if (dayEl === '水') { xi = '金 水'; ji = '土 火';
  } else if (dayEl === '火') { xi = '木 火'; ji = '水 金';
  } else if (dayEl === '土') { xi = '火 土'; ji = '木 水'; }
  
  const pillars = [bz.yG+bz.yZ, bz.mG+bz.mZ, bz.dG+bz.dZ, bz.hG+bz.hZ].filter(p => p.length === 2).join(' ');
  xyEl.innerHTML =
    '日主<strong>' + dayMaster + '</strong><br>' +
    (pillars ? '四柱：' + pillars + '<br>' : '') +
    '<span style="font-size:.68rem">' + stats + '</span><br>' +
    '喜 <span style="color:#b8860b">' + (xi||'—') + '</span> · 忌 <span style="color:#999">' + (ji||'—') + '</span>';
}

function gndr(v,e) {
  const chips = document.querySelectorAll('#genderChips .chip');
  chips.forEach(c => c.classList.remove('active'));
  e.classList.add('active');
  fil.g = [v];
  render();
}

function render() {
  const a=fdata(),g=document.getElementById('grid');g.innerHTML='';
  document.getElementById('showCount').textContent='显示 '+a.length+' 字';
  document.getElementById('charCount').textContent=DATA.length+' 字（选 '+a.length+'）';
  a.forEach(c=>{
    const e=document.createElement('div');e.className='cell'+(c.c===nA||c.c===nB?' sel':'');
    e.innerHTML='<span class="ch">'+c.c+'</span><span class="meta">'+c.s+'画 '+c.w+'</span>'+(c.fenqi?'<span class="mark">⚠️</span>':'')+(c.landajie?'<span class="mark">🚫</span>':'');
    e.onclick=()=>{show(c)};
    e.ondblclick=()=>{add(c)};
    g.appendChild(e);
  });
  if(!a.length) g.innerHTML='<div style="padding:2rem;text-align:center;color:var(--text2)">无匹配字，调整筛选</div>';
  updWuge();updCards();
}

function show(c) {
  sel=c;const d=document.getElementById('detail');d.className='detail show';
  d.innerHTML='<div class="big">'+c.c+'</div><dl class="grid"><dt>笔画</dt><dd>'+c.s+'画</dd><dt>五行</dt><dd>'+c.w+'</dd><dt>释义</dt><dd>'+c.m+'</dd><dt>推荐</dt><dd>'+'★'.repeat(c.star)+(c.fenqi?' ⚠️':'\u3000')+(c.landajie?' 🚫':'')+'</dd></dl>'+(c.src?'<div class="src">📖 '+c.src+'</div>':'')+'<div class="acts"><button class="btn pri" onclick="add(sel)">加入姓名</button></div>';
}

function add(c) {
  if(!nA){nA=c.c;document.getElementById('slotA').value=nA;document.getElementById('slotA').className='slot filled'}
  else if(!nB){nB=c.c;document.getElementById('slotB').value=nB;document.getElementById('slotB').className='slot filled'}
  else{nB=c.c;document.getElementById('slotB').value=nB}
  render();
}

function clr(){nA='';nB='';document.getElementById('slotA').value='';document.getElementById('slotB').value='';
  ['slotA','slotB'].forEach(i=>document.getElementById(i).className='slot');render()}

document.getElementById('slotA').onclick=()=>{nA='';document.getElementById('slotA').value='';document.getElementById('slotA').className='slot';render()};
document.getElementById('slotB').onclick=()=>{nB='';document.getElementById('slotB').value='';document.getElementById('slotB').className='slot';render()};

function gs(c){const f=DATA.find(x=>x.c===c);return f?f.s:0}

function updWuge() {
  const a=gs(nA),b=gs(nB);
  const v=[S+1,S+a,a+b,b+1,S+a+b];
  ['g1','g2','g3','g4','g5'].forEach((id,i)=>{
    const e=document.getElementById(id);
    if(v[i]>0){e.textContent=v[i];e.className='num '+(JI.has(v[i])?'ji':'xiong')}
    else{e.textContent='—';e.className='num'}
  });
}

function updCards() {
  const c=document.getElementById('nameCards');
  if(!nA||!nB){c.innerHTML='';return}
  const a=gs(nA),b=gs(nB),t=S+a+b;
  const ji=JI.has(S+a)&&JI.has(a+b)&&JI.has(t)?' ✅ 全吉':'';
  c.innerHTML='<div class="name-card"><div><div class="n">刘'+nA+nB+'</div><div class="ws">人'+(S+a)+'·地'+(a+b)+'·总'+t+ji+'</div></div></div>';
}
</script>
</body>
</html>`;

fs.writeFileSync('naming-app.html', html, 'utf8');
console.log(`✅ naming-app.html (${html.length} bytes)`);