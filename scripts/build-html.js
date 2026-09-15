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
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;500;600;700;900&family=Ma+Shan+Zheng&family=ZCOOL+XiaoWei&display=swap" rel="stylesheet">
<style>
:root{
  --ink:#26221d; --ink2:#5c554b; --ink3:#9a9186; --ink4:#c4bbb0;
  --paper:#f5efe4; --paper2:#ede5d6; --paper3:#e3d9c6;
  --card:#fdfaf3; --card2:#faf4e8;
  --cinnabar:#a8362c; --cinnabar2:#c44a3e; --cinnabar3:#d9695d;
  --gold:#9c7a35; --gold2:#b8924a; --gold3:#d4b06a;
  --jade:#557a6a; --jade2:#7a9a8a;
  --indigo:#3a5a7a;
  --line:#ddd1bc; --line2:#e8dec9;
  --sh1:0 1px 3px rgba(80,60,30,.05),0 1px 2px rgba(80,60,30,.03);
  --sh2:0 4px 14px rgba(80,60,30,.08),0 2px 6px rgba(80,60,30,.04);
  --sh3:0 8px 28px rgba(80,60,30,.12),0 4px 10px rgba(80,60,30,.06);
  --r:12px; --rs:7px;
  --serif:'Noto Serif SC',serif;
  --xw:'ZCOOL XiaoWei',serif;
  --brush:'Ma Shan Zheng',cursive;
  --sans:'Noto Sans SC','PingFang SC','Microsoft YaHei',sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box}
html{font-size:14px;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
body{font-family:var(--sans);background:var(--paper);color:var(--ink);min-height:100vh;
  background-image:radial-gradient(circle at 12% 18%,rgba(156,122,53,.05),transparent 40%),radial-gradient(circle at 88% 82%,rgba(85,122,106,.05),transparent 40%);
}

.hero{position:relative;overflow:hidden;background:radial-gradient(ellipse at 20% 50%,rgba(168,54,44,.14),transparent 55%),radial-gradient(ellipse at 85% 60%,rgba(156,122,53,.12),transparent 50%),linear-gradient(135deg,#241f1a 0%,#3a3026 55%,#2b241d 100%);color:#f3ead9;padding:2.4rem 2rem 2rem;text-align:center}
.hero::after{content:'';position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:60%;height:1px;background:linear-gradient(90deg,transparent,rgba(212,176,106,.5),transparent)}
.hero .inner{position:relative;z-index:2;display:inline-flex;align-items:center;gap:1.1rem}
.hero .seal{background:var(--cinnabar);color:#f5ede0;font-family:var(--brush);width:3.2rem;height:3.2rem;display:flex;align-items:center;justify-content:center;font-size:1.5rem;border-radius:7px;transform:rotate(-4deg);box-shadow:0 0 0 2px rgba(245,237,224,.15) inset,0 4px 12px rgba(0,0,0,.25);position:relative}
.hero .seal::before{content:'';position:absolute;inset:3px;border:1px solid rgba(245,237,224,.25);border-radius:5px}
.hero .titlewrap{text-align:left}
.hero .title{font-family:var(--xw);font-weight:400;font-size:2rem;letter-spacing:.3rem;line-height:1;color:#f3ead9}
.hero .title em{font-style:normal;color:var(--gold3)}
.hero .sub{font-family:var(--serif);font-weight:300;font-size:.74rem;letter-spacing:.25rem;color:rgba(243,234,217,.6);margin-top:.5rem}
.hero .meta{position:absolute;top:1.3rem;right:1.6rem;font-family:var(--serif);font-size:.66rem;letter-spacing:.15rem;color:rgba(243,234,217,.4);writing-mode:vertical-rl}

.wrap{display:flex;gap:1.4rem;max-width:1320px;margin:0 auto;padding:1.4rem;align-items:flex-start}
.sidebar{width:266px;flex-shrink:0;position:sticky;top:1.4rem;max-height:calc(100vh - 2.8rem);overflow-y:auto;display:flex;flex-direction:column;gap:.85rem;padding-right:4px}
.sidebar::-webkit-scrollbar{width:5px}
.sidebar::-webkit-scrollbar-track{background:transparent}
.sidebar::-webkit-scrollbar-thumb{background:var(--line);border-radius:3px}
.sidebar::-webkit-scrollbar-thumb:hover{background:var(--gold2)}

.card{background:var(--card);border-radius:var(--r);padding:1rem 1.15rem;box-shadow:var(--sh1);border:1px solid var(--line2)}
.card h3{font-family:var(--serif);font-weight:600;font-size:.88rem;color:var(--ink);margin-bottom:.75rem;padding-bottom:.55rem;display:flex;align-items:center;gap:.5rem;border-bottom:1px solid var(--line2)}
.card h3::before{content:'';width:3px;height:13px;background:var(--cinnabar);border-radius:1px;flex-shrink:0}
.card h3 .en{font-family:var(--serif);font-weight:300;font-size:.62rem;color:var(--ink3);letter-spacing:.1rem;margin-left:auto;text-transform:uppercase}

.bz-field{margin-bottom:.55rem}
.bz-field label{display:block;font-size:.68rem;color:var(--ink3);margin-bottom:.2rem;letter-spacing:.05rem}
.bz-input{width:100%;font-family:var(--serif);font-size:.92rem;padding:.42rem .55rem;border:1px solid var(--line);border-radius:var(--rs);background:var(--paper);color:var(--ink);transition:all .18s}
.bz-input:focus{outline:none;border-color:var(--gold2);background:var(--card);box-shadow:0 0 0 3px rgba(156,122,53,.1)}
select.bz-input{cursor:pointer;appearance:none;background-image:linear-gradient(45deg,transparent 50%,var(--ink3) 50%),linear-gradient(135deg,var(--ink3) 50%,transparent 50%);background-position:calc(100% - 12px) calc(50% - 2px),calc(100% - 8px) calc(50% - 2px);background-size:4px 4px,4px 4px;background-repeat:no-repeat;padding-right:1.6rem}
.recommend-btn{width:100%;margin-top:.7rem;padding:.5rem;border-radius:var(--rs);border:none;background:linear-gradient(135deg,var(--cinnabar),var(--cinnabar2));color:#fff;cursor:pointer;font-size:.82rem;font-family:var(--sans);letter-spacing:.08rem;transition:all .18s;box-shadow:0 2px 8px rgba(168,54,44,.25)}
.recommend-btn:hover{transform:translateY(-1px);box-shadow:0 4px 14px rgba(168,54,44,.35)}
.recommend-btn:disabled{background:var(--ink4);box-shadow:none;cursor:not-allowed;opacity:.6}

.bz-pillars{display:flex;gap:.35rem;margin-top:.7rem;justify-content:space-between}
.bz-pillars .pz{flex:1;font-family:var(--serif);font-weight:500;font-size:.92rem;padding:.28rem .2rem;border-radius:6px;background:var(--card2);color:var(--ink);text-align:center;border:1px solid var(--line2);transition:all .2s}
.bz-pillars .pz .lb{display:block;font-size:.52rem;color:var(--ink3);letter-spacing:.15rem;margin-bottom:.1rem;font-weight:400}
.bz-pillars .pz.empty{color:var(--ink4)}
.bz-pillars .pz.has-val{background:linear-gradient(135deg,var(--card2),var(--paper2));border-color:var(--gold3)}

.xiyong{margin-top:.8rem;padding:.7rem .8rem;background:linear-gradient(135deg,var(--paper),var(--paper2));border-radius:var(--rs);font-size:.74rem;line-height:1.75;color:var(--ink2);border:1px solid var(--line2)}
.xiyong b{color:var(--ink);font-weight:600}
.wxcount{display:flex;gap:.25rem;margin-top:.45rem;flex-wrap:wrap}
.wxcount span{font-size:.66rem;padding:.12rem .42rem;border-radius:4px;font-family:var(--serif)}
.wxcount .金{background:rgba(156,122,53,.16);color:var(--gold)}
.wxcount .木{background:rgba(85,122,106,.16);color:var(--jade)}
.wxcount .水{background:rgba(58,90,122,.16);color:var(--indigo)}
.wxcount .火{background:rgba(168,54,44,.16);color:var(--cinnabar)}
.wxcount .土{background:rgba(139,90,43,.16);color:#8b5a2b}

.chips{display:flex;flex-wrap:wrap;gap:.28rem}
.chip{padding:.26rem .62rem;border-radius:16px;border:1px solid var(--line);background:var(--paper);cursor:pointer;font-size:.74rem;color:var(--ink2);transition:all .18s;user-select:none;line-height:1.2}
.chip:hover{border-color:var(--gold2);color:var(--ink);background:var(--card2)}
.chip.active{background:var(--ink);color:#f3ead9;border-color:var(--ink);box-shadow:0 1px 4px rgba(38,34,29,.25)}
.chip.danger{border-color:rgba(196,74,62,.4);color:var(--cinnabar)}
.chip.danger.active{background:var(--cinnabar);color:#fff;border-color:var(--cinnabar)}
.combo-note{font-size:.76rem;color:var(--ink2);line-height:1.9}
.combo-note b{color:var(--ink);font-family:var(--serif)}
.combo-note .star{color:var(--cinnabar)}

.main{flex:1;min-width:0}
.main-top{background:linear-gradient(135deg,var(--card),var(--card2));border-radius:var(--r);padding:1.2rem 1.5rem;box-shadow:var(--sh2);margin-bottom:1rem;display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap;border:1px solid var(--line2);position:relative;overflow:hidden}
.main-top::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,var(--cinnabar),var(--gold2))}
.name-assemble{display:flex;align-items:baseline;gap:.3rem}
.name-assemble .xing{font-family:var(--serif);font-weight:600;font-size:2.1rem;color:var(--gold);line-height:1}
.name-assemble .slot{font-family:var(--serif);font-weight:500;font-size:2.1rem;width:2.6rem;text-align:center;border:none;border-bottom:2px solid var(--line);background:transparent;color:var(--ink);cursor:pointer;transition:all .2s;line-height:1.1}
.name-assemble .slot.filled{border-bottom-color:var(--cinnabar)}
.name-assemble .slot:empty::before{content:'·';color:var(--ink4)}
.name-assemble .slot:hover{border-bottom-color:var(--gold2)}
.wuge-row{display:flex;gap:.4rem;margin-left:auto;flex-wrap:wrap}
.wg{text-align:center;padding:.32rem .5rem;background:var(--paper);border-radius:6px;min-width:2.9rem;border:1px solid var(--line2);transition:all .2s}
.wg .v{display:block;font-family:var(--serif);font-weight:700;font-size:1.02rem;line-height:1.2}
.wg .l{font-size:.54rem;color:var(--ink3);letter-spacing:.12rem;margin-top:.05rem}
.wg .v.ji{color:var(--jade)}
.wg .v.xiong{color:var(--cinnabar)}
.wg .v.idle{color:var(--ink4)}
.wg.ji-bg{background:rgba(85,122,106,.1);border-color:rgba(85,122,106,.3)}
.wg.xiong-bg{background:rgba(168,54,44,.08);border-color:rgba(168,54,44,.25)}

/* 推荐结果 */
.rec-section{margin-bottom:1rem}
.rec-section .rec-head{font-family:var(--serif);font-weight:600;font-size:.9rem;color:var(--ink);margin-bottom:.6rem;display:flex;align-items:center;gap:.5rem}
.rec-section .rec-head::before{content:'';width:3px;height:13px;background:var(--gold2);border-radius:1px}
.rec-section .rec-head .hint{font-weight:400;font-size:.72rem;color:var(--ink3)}
.rec-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:.6rem}
.rec-card{background:var(--card);border:1px solid var(--line2);border-radius:var(--rs);padding:.7rem .85rem;cursor:pointer;transition:all .18s;box-shadow:var(--sh1)}
.rec-card:hover{transform:translateY(-2px);box-shadow:var(--sh3);border-color:var(--gold2)}
.rec-card .rc-name{font-family:var(--serif);font-weight:600;font-size:1.25rem;letter-spacing:.12rem;color:var(--ink)}
.rec-card .rc-wuge{font-size:.66rem;color:var(--ink3);margin-top:.15rem}
.rec-card .rc-ji{color:var(--jade);font-weight:600}
.rec-card .rc-mean{font-size:.7rem;color:var(--ink2);margin-top:.35rem;line-height:1.5;font-family:var(--serif)}
.rec-card .rc-src{font-size:.64rem;color:var(--ink3);margin-top:.2rem}

/* 名字解读面板 */
.interpret{margin-bottom:1rem;background:linear-gradient(135deg,var(--card),var(--card2));border:1px solid var(--gold3);border-radius:var(--r);box-shadow:var(--sh2);overflow:hidden}
.interpret .ip-top{background:linear-gradient(135deg,#3a3026,#241f1a);color:#f3ead9;padding:1.3rem 1.6rem;text-align:center;position:relative}
.interpret .ip-top::after{content:'';position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:40%;height:1px;background:linear-gradient(90deg,transparent,var(--gold3),transparent)}
.interpret .ip-name{font-family:var(--serif);font-weight:600;font-size:2.4rem;letter-spacing:.2rem;line-height:1.1}
.interpret .ip-py{font-size:.78rem;color:rgba(243,234,217,.55);margin-top:.35rem;letter-spacing:.2rem}
.interpret .ip-tag{display:inline-block;margin-top:.5rem;font-size:.66rem;padding:.12rem .5rem;border-radius:10px;background:rgba(85,122,106,.25);color:#bfe3d0;letter-spacing:.08rem}
.interpret .ip-body{padding:1.1rem 1.4rem}
.interpret .ip-char{display:flex;gap:.8rem;padding:.7rem 0;border-bottom:1px dashed var(--line2)}
.interpret .ip-char:last-of-type{border-bottom:none}
.interpret .ip-char .ic-big{font-family:var(--serif);font-weight:600;font-size:1.8rem;color:var(--gold);flex-shrink:0;width:2.2rem;text-align:center;line-height:1.2}
.interpret .ip-char .ic-info{flex:1}
.interpret .ip-char .ic-line1{font-size:.76rem;color:var(--ink3);margin-bottom:.25rem}
.interpret .ip-char .ic-line1 b{color:var(--ink);font-family:var(--serif);font-weight:600}
.interpret .ip-char .ic-mean{font-family:var(--serif);font-size:.84rem;color:var(--ink2);line-height:1.65}
.interpret .ip-char .ic-src{font-size:.7rem;color:var(--ink3);margin-top:.2rem;font-family:var(--serif)}
.interpret .ip-wuge{margin-top:.6rem;padding:.6rem .8rem;background:var(--paper);border-radius:var(--rs);font-size:.74rem;color:var(--ink2);font-family:var(--serif)}
.interpret .ip-wuge b{color:var(--ink)}
.interpret .ip-wuge .ji-tag{color:var(--jade);font-weight:600}
.interpret .ip-zongyi{margin-top:.6rem;padding:.7rem .9rem;background:linear-gradient(135deg,var(--paper),var(--paper2));border-radius:var(--rs);border-left:3px solid var(--cinnabar);font-family:var(--serif);font-size:.82rem;line-height:1.8;color:var(--ink2)}
.interpret .ip-zongyi .zl{font-weight:600;color:var(--ink);font-size:.74rem;letter-spacing:.1rem;display:block;margin-bottom:.2rem}

.toolbar{display:flex;align-items:center;gap:.8rem;margin-bottom:.75rem;flex-wrap:wrap;padding:0 .2rem}
.tool-count{font-size:.78rem;color:var(--ink3)}
.tool-count b{color:var(--ink);font-family:var(--serif);font-weight:600}
.btn{padding:.42rem 1.1rem;border-radius:var(--rs);border:1px solid var(--ink);background:transparent;color:var(--ink);cursor:pointer;font-size:.78rem;transition:all .18s;font-family:var(--sans);letter-spacing:.05rem}
.btn:hover{background:var(--ink);color:#f3ead9}

.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(78px,1fr));gap:.55rem}
.cell{background:var(--card);border-radius:var(--rs);padding:.6rem .2rem .45rem;text-align:center;box-shadow:var(--sh1);cursor:pointer;transition:transform .18s cubic-bezier(.4,0,.2,1),box-shadow .18s,border-color .18s;position:relative;border:1px solid var(--line2);overflow:hidden}
.cell::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,transparent 40%,rgba(156,122,53,.06));opacity:0;transition:opacity .2s}
.cell:hover{transform:translateY(-3px);box-shadow:var(--sh3);border-color:var(--gold2)}
.cell:hover::before{opacity:1}
.cell.sel{background:linear-gradient(135deg,var(--cinnabar),var(--cinnabar2));color:#fff;border-color:var(--cinnabar)}
.cell.sel .py,.cell.sel .meta{color:rgba(255,255,255,.75)}
.cell.sel .wx-dot{opacity:.5}
.cell .ch{font-family:var(--serif);font-weight:500;font-size:1.7rem;display:block;line-height:1.25;color:inherit}
.cell .py{font-size:.56rem;color:var(--ink3);display:block;line-height:1.2;margin-top:.05rem;font-family:var(--sans)}
.cell .meta{font-size:.56rem;color:var(--ink3);display:block;margin-top:.08rem;letter-spacing:.02rem}
.cell .wx-dot{position:absolute;top:6px;right:6px;width:7px;height:7px;border-radius:50%;box-shadow:0 0 0 1.5px rgba(255,255,255,.7)}
.cell .wx-dot.金{background:var(--gold)} .cell .wx-dot.木{background:var(--jade)} .cell .wx-dot.水{background:var(--indigo)} .cell .wx-dot.火{background:var(--cinnabar)} .cell .wx-dot.土{background:#8b5a2b}

.detail-overlay{position:fixed;inset:0;background:rgba(38,34,29,.45);z-index:100;display:none;align-items:center;justify-content:center;backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}
.detail-overlay.show{display:flex;animation:fadeIn .2s ease}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.detail-box{background:var(--card);border-radius:16px;width:480px;max-width:92vw;padding:0;box-shadow:0 12px 48px rgba(38,34,29,.25);position:relative;overflow:hidden;animation:popIn .28s cubic-bezier(.34,1.56,.64,1)}
@keyframes popIn{from{opacity:0;transform:scale(.92) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
.detail-box .db-top{background:linear-gradient(135deg,#3a3026,#241f1a);color:#f3ead9;padding:1.8rem 2rem 1.4rem;text-align:center;position:relative}
.detail-box .db-top::after{content:'';position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:40%;height:1px;background:linear-gradient(90deg,transparent,var(--gold3),transparent)}
.detail-box .close-btn{position:absolute;top:.9rem;right:1.1rem;background:rgba(255,255,255,.12);border:none;width:1.6rem;height:1.6rem;border-radius:50%;font-size:1rem;color:#f3ead9;cursor:pointer;transition:background .18s}
.detail-box .close-btn:hover{background:rgba(255,255,255,.25)}
.detail-box .char-display .big{font-family:var(--serif);font-weight:500;font-size:5rem;line-height:1;color:#f3ead9}
.detail-box .char-display .py-big{font-size:.86rem;color:rgba(243,234,217,.6);margin-top:.3rem;letter-spacing:.15rem}
.detail-box .db-body{padding:1.4rem 2rem 1.6rem}
.detail-box .info-list{display:grid;grid-template-columns:auto 1fr;gap:.55rem 1rem;font-size:.88rem}
.detail-box .info-list dt{color:var(--ink3);text-align:right;font-family:var(--serif)}
.detail-box .info-list dd{font-family:var(--serif);color:var(--ink)}
.detail-box .source-quote{margin-top:1rem;padding:.75rem 1rem;background:var(--paper2);border-radius:var(--rs);border-left:3px solid var(--gold2);font-family:var(--serif);font-size:.82rem;line-height:1.8;color:var(--ink2)}
.detail-box .acts{margin-top:1.2rem;display:flex;gap:.6rem;justify-content:flex-end}
.empty{text-align:center;padding:3rem;color:var(--ink3);font-size:.9rem}

@media(max-width:920px){.wrap{flex-direction:column;padding:1rem}.sidebar{width:100%;position:relative;max-height:none;flex-direction:row;flex-wrap:wrap;padding-right:0}.sidebar .card{flex:1;min-width:150px}.hero .meta{display:none}.grid{grid-template-columns:repeat(auto-fill,minmax(68px,1fr))}}
</style>
</head>
<body>

<div class="hero">
  <div class="meta">辛金 · 喜土金</div>
  <div class="inner">
    <div class="seal">刘</div>
    <div class="titlewrap">
      <div class="title">为 <em>刘</em> 家女孩 起名</div>
      <div class="sub">生辰八字 · 五行喜用 · 五格数理 · 经典出处</div>
    </div>
  </div>
</div>

<div class="wrap">
<aside class="sidebar">
  <div class="card">
    <h3>生辰八字 <span class="en">bazi</span></h3>
    <div class="bz-field"><label>出生日期（公历）</label><input class="bz-input" type="date" id="bzDate" value="2027-01-02" min="2026-12-15" max="2027-01-10"></div>
    <div class="bz-field"><label>出生时辰</label>
      <select class="bz-input" id="bzHour">
        <option value="-1">未知 / 不填</option>
        <option value="0">子时 23–1点</option><option value="1">丑时 1–3点</option><option value="2">寅时 3–5点</option><option value="3">卯时 5–7点</option><option value="4">辰时 7–9点</option><option value="5">巳时 9–11点</option><option value="6" selected>午时 11–13点</option><option value="7">未时 13–15点</option><option value="8">申时 15–17点</option><option value="9">酉时 17–19点</option><option value="10">戌时 19–21点</option><option value="11">亥时 21–23点</option>
      </select>
    </div>
    <div class="bz-pillars" id="bzPillars">
      <div class="pz empty"><span class="lb">年</span><span id="pYear">——</span></div>
      <div class="pz empty"><span class="lb">月</span><span id="pMonth">——</span></div>
      <div class="pz empty"><span class="lb">日</span><span id="pDay">——</span></div>
      <div class="pz empty"><span class="lb">时</span><span id="pHour">——</span></div>
    </div>
    <div class="xiyong" id="xiyongDisplay">选择日期与时辰后自动推算</div>
    <button class="recommend-btn" id="recBtn" onclick="recommend()">根据八字推荐名字 →</button>
  </div>
  <div class="card"><h3>笔画 <span class="en">strokes</span></h3><div class="chips" id="strokeChips"></div></div>
  <div class="card"><h3>五行 <span class="en">wuxing</span></h3><div class="chips" id="wxChips"></div></div>
  <div class="card"><h3>风格 <span class="en">style</span></h3><div class="chips" id="styleChips"></div></div>
  <div class="card"><h3>性别 <span class="en">gender</span></h3><div class="chips" id="genderChips"><span class="chip" data-g="女" onclick="gndr('女',this)">女</span><span class="chip" data-g="通用" onclick="gndr('通用',this)">通用</span><span class="chip" data-g="男" onclick="gndr('男',this)">男</span></div></div>
  <div class="card"><h3>排除 <span class="en">exclude</span></h3><div class="chips" id="excludeChips"></div></div>
  <div class="card"><h3>五格大吉组合 <span class="en">wuge</span></h3><div class="combo-note">刘 = 15画（康熙）<br><span class="star">★</span> <b>10 + 14</b> 全吉最优<br><b>8 + 16</b> · <b>9 + 15</b> · <b>10 + 7</b><br><b>8 + 10</b> · <b>10 + 6</b> · <b>6 + 12</b></div></div>
</aside>

<main class="main">
  <div class="main-top">
    <div class="name-assemble"><span class="xing">刘</span><span class="slot" id="slotA"></span><span class="slot" id="slotB"></span></div>
    <div class="wuge-row" id="wugeRow">
      <div class="wg"><span class="v idle" id="g1">—</span><span class="l">天格</span></div>
      <div class="wg"><span class="v idle" id="g2">—</span><span class="l">人格</span></div>
      <div class="wg"><span class="v idle" id="g3">—</span><span class="l">地格</span></div>
      <div class="wg"><span class="v idle" id="g4">—</span><span class="l">外格</span></div>
      <div class="wg"><span class="v idle" id="g5">—</span><span class="l">总格</span></div>
    </div>
    <button class="btn" onclick="clrName()">清空</button>
  </div>

  <div id="recommendBox"></div>
  <div id="interpretBox"></div>

  <div class="toolbar"><span class="tool-count">显示 <b id="showCount">0</b> 字 · 共 <b id="totalCount">0</b></span></div>
  <div class="grid" id="grid"></div>
</main>
</div>

<div class="detail-overlay" id="detailOverlay" onclick="closeDetail(event)"><div class="detail-box" id="detailBox"></div></div>

<script>
const DATA = ${json};
const S = 15;
const JI = new Set([1,3,5,6,7,8,11,13,15,16,17,18,21,23,24,25,29,31,32,33,35,37,39,41,45,47,48,52,55,57,61,63,65,67,68,81]);
const GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const WX_GAN = {甲:'木',乙:'木',丙:'火',丁:'火',戊:'土',己:'土',庚:'金',辛:'金',壬:'水',癸:'水'};
const WX_ZHI = {子:'水',丑:'土',寅:'木',卯:'木',辰:'土',巳:'火',午:'火',未:'土',申:'金',酉:'金',戌:'土',亥:'水'};
const JIEQI = [{d:'2026-12-07',z:0},{d:'2027-01-05',z:1},{d:'2027-02-04',z:2}];
const COMBOS = [[10,14],[8,16],[9,15],[10,7],[8,10],[10,6],[6,12]];

let fil = {s:[],w:[],st:[],g:[],xF:false,xL:false};
let nA='',nB='',sel=null;
let currentXi=[]; // 当前喜用五行数组

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
    if(c.w)inner='<span class="wx-dot '+c.w+'"></span>'+inner;
    e.innerHTML=inner;
    e.onclick=()=>showDetail(c);
    e.ondblclick=()=>addName(c);
    g.appendChild(e);
  });
  if(!a.length)g.innerHTML='<div class="empty">无匹配字，请调整筛选</div>';
  updWuge();updInterpret();
}

function showDetail(c){
  sel=c;
  const box=document.getElementById('detailBox');
  let html='<button class="close-btn" onclick="closeDetail()">×</button>';
  html+='<div class="db-top"><div class="char-display"><div class="big">'+c.c+'</div><div class="py-big">'+(c.p||'')+'</div></div></div>';
  html+='<div class="db-body"><dl class="info-list">';
  html+='<dt>笔画</dt><dd>'+c.s+' 画（康熙）</dd>';
  html+='<dt>五行</dt><dd>'+(c.w||'待定')+'</dd>';
  if(c.m)html+='<dt>释义</dt><dd>'+c.m+'</dd>';
  if(c.gender)html+='<dt>性别</dt><dd>'+c.gender+'</dd>';
  html+='<dt>风格</dt><dd>'+(c.tags.join('、')||'—')+'</dd>';
  html+='</dl>';
  if(c.src)html+='<div class="source-quote">📖 '+c.src+'</div>';
  html+='<div class="acts"><button class="btn pri" onclick="addName(sel)">放入姓名</button></div>';
  html+='</div>';
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

function findChar(c){return DATA.find(x=>x.c===c)}
function updWuge(){
  const A=findChar(nA),B=findChar(nB);
  const sa=A?A.s:0, sb=B?B.s:0;
  const v=[S+1,S+sa,sa+sb,sb+1,S+sa+sb];
  ['g1','g2','g3','g4','g5'].forEach((id,i)=>{
    const e=document.getElementById(id);const wg=e.parentElement;
    if(v[i]>0){e.textContent=v[i];e.className='v '+(JI.has(v[i])?'ji':'xiong');wg.className='wg '+(JI.has(v[i])?'ji-bg':'xiong-bg')}
    else{e.textContent='—';e.className='v idle';wg.className='wg'}
  });
}

// ===== 名字解读面板 ======
function updInterpret(){
  const box=document.getElementById('interpretBox');
  if(!nA&&!nB){box.innerHTML='';return}
  const A=findChar(nA),B=findChar(nB);
  const sa=A?A.s:0,sb=B?B.s:0;
  const vals=[S+1,S+sa,sa+sb,sb+1,S+sa+sb];
  const allJi=vals.every(v=>JI.has(v));
  const name='刘'+(nA||'')+ (nB||'');
  const py=(A&&A.p?A.p:'')+(B&&B.p?' '+(B.p):'');
  let html='<div class="interpret"><div class="ip-top"><div class="ip-name">'+name+'</div>';
  if(py)html+='<div class="ip-py">'+py+'</div>';
  if(allJi)html+='<div class="ip-tag">五格全吉</div>';
  html+='</div><div class="ip-body">';
  // 字A
  if(A){
    html+='<div class="ip-char"><div class="ic-big">'+A.c+'</div><div class="ic-info>';
    html+='<div class="ic-line1"><b>'+A.c+'</b> · '+A.s+'画'+(A.w?' · 五行'+A.w:'')+(A.gender?' · '+A.gender:'')+'</div>';
    if(A.m)html+='<div class="ic-mean">'+A.m+'</div>';
    if(A.src)html+='<div class="ic-src">出处：'+A.src+'</div>';
    html+='</div></div>';
  }
  if(B){
    html+='<div class="ip-char"><div class="ic-big">'+B.c+'</div><div class="ic-info">';
    html+='<div class="ic-line1"><b>'+B.c+'</b> · '+B.s+'画'+(B.w?' · 五行'+B.w:'')+(B.gender?' · '+B.gender:'')+'</div>';
    if(B.m)html+='<div class="ic-mean">'+B.m+'</div>';
    if(B.src)html+='<div class="ic-src">出处：'+B.src+'</div>';
    html+='</div></div>';
  }
  // 五格
  html+='<div class="ip-wuge">五格：天<b>'+vals[0]+'</b> '+(JI.has(vals[0])?'<span class="ji-tag">吉</span>':'凶')+' · 人<b>'+vals[1]+'</b> '+(JI.has(vals[1])?'<span class="ji-tag">吉</span>':'凶')+' · 地<b>'+vals[2]+'</b> '+(JI.has(vals[2])?'<span class="ji-tag">吉</span>':'凶')+' · 外<b>'+vals[3]+'</b> '+(JI.has(vals[3])?'<span class="ji-tag">吉</span>':'凶')+' · 总<b>'+vals[4]+'</b> '+(JI.has(vals[4])?'<span class="ji-tag">吉</span>':'凶')+'</div>';
  // 综合寓意
  if(A&&B&&(A.m||B.m)){
    let zy='';
    if(A.m&&B.m)zy='「'+nA+'」'+A.m.replace(/[；;].*$/,'').slice(0,12)+'，配「'+nB+'」'+B.m.replace(/[；;].*$/,'').slice(0,12)+'，'+(allJi?'五格俱吉，':'')+'寓意相得益彰。';
    else zy=(A.m||B.m);
    html+='<div class="ip-zongyi"><span class="zl">综合寓意</span>'+zy+'</div>';
  }
  html+='</div></div>';
  box.innerHTML=html;
}

// ===== 根据八字推荐名字 ======
function charScore(c, xiList){
  let sc=0;
  if(xiList.includes(c.w)) sc+=3;
  if(c.gender==='女') sc+=2; else if(c.gender==='通用') sc+=1;
  if(c.m) sc+=1;
  if(c.src) sc+=1.5;
  if(c.landajie) sc-=3;
  if(c.fenqi) sc-=2;
  if(c.tags.includes('温婉')) sc+=0.5;
  return sc;
}
function isAllJi(sa,sb){
  const v=[S+1,S+sa,sa+sb,sb+1,S+sa+sb];
  return v.every(x=>JI.has(x));
}
function recommend(){
  const box=document.getElementById('recommendBox');
  if(currentXi.length===0){box.innerHTML='<div class="empty">请先选择出生日期与时辰</div>';return}
  // 按笔画建索引
  const byStroke={};
  DATA.forEach(c=>{if(!byStroke[c.s])byStroke[c.s]=[];byStroke[c.s].push(c)});
  const results=[];
  for(const [sa,sb] of COMBOS){
    if(!isAllJi(sa,sb)) continue;
    const listA=(byStroke[sa]||[]).filter(c=>currentXi.includes(c.w));
    const listB=(byStroke[sb]||[]).filter(c=>currentXi.includes(c.w));
    // 每个组合限制枚举量
    const A=listA.sort((x,y)=>charScore(y,currentXi)-charScore(x,currentXi)).slice(0,20);
    const B=listB.sort((x,y)=>charScore(y,currentXi)-charScore(x,currentXi)).slice(0,20);
    for(const a of A){
      for(const b of B){
        if(a.c===b.c) continue;
        results.push({a,b,sa,sb,score:charScore(a,currentXi)+charScore(b,currentXi)});
      }
    }
  }
  results.sort((x,y)=>y.score-x.score);
  const top=results.slice(0,12);
  if(top.length===0){box.innerHTML='<div class="empty">未找到符合喜用神五行的全吉组合，请放宽时辰或换字</div>';return}
  let html='<div class="rec-section"><div class="rec-head">根据八字推荐 <span class="hint">喜用「'+currentXi.join('·')+'」· 五格全吉 · 共 '+top.length+' 个</span></div><div class="rec-grid">';
  for(const r of top){
    const name='刘'+r.a.c+r.b.c;
    const v=[S+1,S+r.sa,r.sa+r.sb,r.sb+1,S+r.sa+r.sb];
    let mean='';
    if(r.a.m)mean+=r.a.c+':'+r.a.m.replace(/[；;].*$/,'').slice(0,10)+'　';
    if(r.b.m)mean+=r.b.c+':'+r.b.m.replace(/[；;].*$/,'').slice(0,10);
    let src='';
    if(r.a.src)src+=r.a.src.split('—')[0].trim()+'　';
    if(r.b.src)src+=r.b.src.split('—')[0].trim();
    html+='<div class="rec-card" data-a="'+r.a.c+'" data-b="'+r.b.c+'">';
    html+='<div class="rc-name">'+name+'</div>';
    html+='<div class="rc-wuge">天'+v[0]+' 人'+v[1]+' 地'+v[2]+' 外'+v[3]+' 总'+v[4]+' <span class="rc-ji">全吉</span></div>';
    if(mean)html+='<div class="rc-mean">'+mean+'</div>';
    if(src)html+='<div class="rc-src">📖 '+src+'</div>';
    html+='</div>';
  }
  html+='</div></div>';
  box.innerHTML=html;
  box.querySelectorAll('.rec-card').forEach(el=>el.onclick=()=>pickRec(el.dataset.a,el.dataset.b));
}
function pickRec(a,b){nA=a;nB=b;updSlots();render();document.getElementById('interpretBox').scrollIntoView({behavior:'smooth',block:'nearest'});}

// ===== 八字计算 ======
function jdn(y,m,d){const a=Math.floor((14-m)/12);const yy=y+4800-a;const mm=m+12*a-3;return d+Math.floor((153*mm+2)/5)+365*yy+Math.floor(yy/4)-Math.floor(yy/100)+Math.floor(yy/400)-32045}
function gzOf(seq){return GAN[seq%10]+ZHI[seq%12]}
function calcBazi(){
  const dateStr=document.getElementById('bzDate').value;
  const hour=parseInt(document.getElementById('bzHour').value);
  const xy=document.getElementById('xiyongDisplay');
  const recBtn=document.getElementById('recBtn');
  if(!dateStr){xy.innerHTML='请选择日期';return;}
  const [y,mo,d]=dateStr.split('-').map(Number);
  const lichun=y+'-02-04';
  const yearBase=dateStr>=lichun?y:y-1;
  let yearGanIdx=((yearBase-4)%10+10)%10;
  let yearZhiIdx=((yearBase-4)%12+12)%12;
  const yearPillar=GAN[yearGanIdx]+ZHI[yearZhiIdx];
  let monthZhi=2;
  for(let i=JIEQI.length-1;i>=0;i--){if(dateStr>=JIEQI[i].d){monthZhi=JIEQI[i].z;break;}}
  const yinGan=((yearGanIdx%5)*2+2)%10;
  const monthOffset=((monthZhi-2)%12+12)%12;
  const monthGanIdx=(yinGan+monthOffset)%10;
  const monthPillar=GAN[monthGanIdx]+ZHI[monthZhi];
  const jd=jdn(y,mo,d);
  const daySeq=(jd+49)%60;
  const dayPillar=gzOf(daySeq);
  const dayGanIdx=daySeq%10;
  let hourPillar='——';
  if(hour>=0){const ziGan=((dayGanIdx%5)*2)%10;const hourGanIdx=(ziGan+hour)%10;hourPillar=GAN[hourGanIdx]+ZHI[hour];}
  document.getElementById('pYear').textContent=yearPillar;
  document.getElementById('pMonth').textContent=monthPillar;
  document.getElementById('pDay').textContent=dayPillar;
  document.getElementById('pHour').textContent=hourPillar;
  const pzs=document.querySelectorAll('#bzPillars .pz');
  pzs.forEach((p,i)=>{const hasVal=(i<3)||(i===3&&hour>=0);p.className='pz'+(hasVal?' has-val':' empty');});
  const el={金:0,木:0,水:0,火:0,土:0};
  [yearPillar,monthPillar,dayPillar,hourPillar].forEach(pz=>{if(pz==='——')return;const g=pz[0],z=pz[1];if(WX_GAN[g])el[WX_GAN[g]]++;if(WX_ZHI[z])el[WX_ZHI[z]]++;});
  const dayGan=dayPillar[0];
  const dayWx=WX_GAN[dayGan];
  const monthZhiStr=ZHI[monthZhi];
  const monthWx=WX_ZHI[monthZhiStr];
  const sheng={木:{生我:水,我生:火,克我:金,我克:土},火:{生我:木,我生:土,克我:水,我克:金},土:{生我:火,我生:金,克我:木,我克:水},金:{生我:土,我生:水,克我:火,我克:木},水:{生我:金,我生:木,克我:土,我克:火}};
  const rel=sheng[dayWx];
  let strength;
  if(monthWx===dayWx)strength='旺';else if(monthWx===rel['生我'])strength='相';else if(monthWx===rel['我生'])strength='休';else if(monthWx===rel['克我'])strength='囚';else if(monthWx===rel['我克'])strength='死';
  let xi='',ji='';
  if(strength==='旺'||strength==='相'){xi=rel['克我']+' '+rel['我克']+' '+rel['我生'];ji=dayWx+' '+rel['生我'];}
  else{xi=rel['生我']+' '+dayWx;ji=rel['我克']+' '+rel['我生']+' '+rel['克我'];}
  // 保存喜用五行供推荐用
  currentXi=xi.split(/\\s+/).filter(Boolean);
  const order=['金','木','水','火','土'];
  const wxc=order.map(k=>'<span class="'+k+'">'+k+el[k]+'</span>').join('');
  xy.innerHTML='日主 <b>'+dayGan+'('+dayWx+')</b> 生于'+monthZhiStr+'月，<b>'+strength+'</b><br>五行：'+wxc+'<br>喜用：<b>'+xi+'</b> · 忌：<b style="color:var(--cinnabar)">'+ji+'</b><br><span style="color:var(--ink3);font-size:.66rem">※ 喜用为程序粗判，精确需命理师综合四柱</span>';
  document.querySelector('.hero .meta').textContent=dayGan+dayWx+' · 喜 '+xi.replace(/\\s/g,'');
  recBtn.disabled=false;
  recBtn.textContent='根据八字推荐名字（喜'+currentXi.join('·')+'）→';
  // 自动推荐一次
  recommend();
}
</script>
</body>
</html>`;

fs.writeFileSync('naming.html', html, 'utf8');
console.log('✅ naming.html ('+(html.length/1024).toFixed(0)+'KB)');