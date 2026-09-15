// 精选起名用字库
// 核心: wuxing-char-lib.md 的188字(已验证五行/笔画/释义/性别/风格)
// 补充: 按意象主题手挑的真正入名雅字(用Unihan补笔画/拼音，经典补出处，部首法补五行)
const fs = require('fs');
const path = require('path');

// ====== 补充字(不在wuxing-lib里) — 按主题，全部为真正入名的雅字 ======
const SUPP = [
  { t:'温婉', g:'女', c:'婉婷娴婧姝姣媛婵娉娜婕妩嫣嫒嫦娆媞娟媚娥妙嫣婵婉婷妍姝娴婧' },
  { t:'花草', g:'女', c:'兰蕙芬茵茹茉莲梅桃菊蕊莎莺芍芙萍茜葵蔷茗苑若芝蕊蕾若芷蕙兰芬' },
  { t:'宝玉', g:'通', c:'瑛璇碧莹珊琅璧瑰瑗璟珰玲珑琉珞琬琰珂珠珩琮璠琼琦琪瑶琚琬' },
  { t:'清泠', g:'女', c:'澈澜涟漪泠沁湘洛淼洁涣汶沂沅泱洵洹涤涴淙淞淡淠渊湛湫溟潇潋瀚漫洛泠淳' },
  { t:'光影', g:'通', c:'曜晖昕昶绚绮绫绸缦缇煜炜熠灿焕晏晔昀烨炫烁旭昱晗彤晟曦明晓朗' },
  { t:'德慧', g:'通', c:'敏聪智念慈善仁义谦良贤惠明念慈善良德仁义信诚谦让温良贤惠' },
  { t:'祥和', g:'通', c:'静和泰祥福嘉恬愉畅宁泰瑞福安和祥嘉恬愉畅宁' },
  { t:'天地', g:'通', c:'宙寰旻霆鸿翔逸远岭川谷霞霄霁霏巍嵩岳峥嵘雯霓月星辰岚峰' },
  { t:'雅韵', g:'通', c:'雅韵琴瑟箫韶章翰墨辞赋咏歌谣笛筝篁笙簧雅韵诗书琴瑟箫韶华文翰墨辞赋咏歌谣' },
  { t:'明丽', g:'女', c:'媚灿烂丽娇艳彩芬明媚灿烂妍丽娇艳华彩芬' },
];

// ====== 加载 Unihan 笔画 ======
const strokes = JSON.parse(fs.readFileSync(path.join(__dirname,'..','temp_dl','unihan-strokes.json')));

// ====== 拼音 ======
const pinyinMap = {};
const readContent = fs.readFileSync(path.join(__dirname,'..','temp_dl','Unihan_Readings.txt'),'utf8');
for (const line of readContent.split('\n')) {
  if (line.startsWith('#') || !line.trim()) continue;
  const parts = line.split('\t');
  if (parts.length < 3 || parts[1] !== 'kMandarin') continue;
  const cp = parseInt(parts[0].slice(2), 16);
  if (cp < 0x4E00 || cp > 0x9FFF) continue;
  pinyinMap[String.fromCodePoint(cp)] = parts[2].trim();
}

// ====== wuxing-char-lib (核心188字，已验证) ======
const wxContent = fs.readFileSync(path.join(__dirname,'..','references','wuxing-char-lib.md'),'utf8');
const wxData = {};
for (const line of wxContent.split('\n')) {
  if (!line.startsWith('| ') || line.includes('|---') || line.includes('字 |笔')) continue;
  const p = line.split('|').map(x=>x.trim());
  if (p.length < 9) continue;
  const ch = p[1];
  if (!ch || ch.length !== 1) continue;
  const stroke = parseInt(p[2].replace(/[※◆\s]/g,'').replace(/\(.*\)/g,''));
  if (isNaN(stroke)) continue;
  const wuxing = p[3].replace(/[※◆\s\/].*$/,'').trim();
  const meaning = ((p[5]||'')+'；'+(p[6]||'')).replace(/；$/,'');
  wxData[ch] = { stroke, wuxing, meaning, gender: p[8], style: p[7]||'', fenqi: p[2].includes('※'), landajie: p[2].includes('◆') };
}

// ====== 经典出处 ======
const sj = JSON.parse(fs.readFileSync(path.join(__dirname,'..','temp_dl','shijing.json')));
const cc = JSON.parse(fs.readFileSync(path.join(__dirname,'..','temp_dl','chuci.json')));
const tang = JSON.parse(fs.readFileSync(path.join(__dirname,'..','temp_dl','tang300.json')));
const sc0 = JSON.parse(fs.readFileSync(path.join(__dirname,'..','temp_dl','songci_0.json')));
const sc1k = JSON.parse(fs.readFileSync(path.join(__dirname,'..','temp_dl','songci_1k.json')));
const ly = JSON.parse(fs.readFileSync(path.join(__dirname,'..','temp_dl','lunyu.json')));
const mz = JSON.parse(fs.readFileSync(path.join(__dirname,'..','temp_dl','mengzi.json')));

const charSrc = {};
function tagSrc(ch, line, src) {
  if (!charSrc[ch] && line.length > 2) charSrc[ch] = line.trim().slice(0,20) + ' — ' + src;
}
for (const p of sj) p.content.forEach(l => { for (const ch of l) tagSrc(ch, l, '《诗经·'+p.title+'》'); });
for (const p of cc) p.content.forEach(l => { for (const ch of l) tagSrc(ch, l, '《楚辞·'+(p.title||'')+'》'); });
for (const cat of tang.content) for (const p of cat.content) (p.paragraphs||[]).forEach(l => { for (const ch of l) tagSrc(ch, l, '《唐诗·'+(p.title||cat.title)+'》'); });
for (const arr of [sc0,sc1k]) for (const p of arr) (p.paragraphs||[]).forEach(l => { for (const ch of l) tagSrc(ch, l, '《宋词·'+(p.rhythmic||'')+'》'); });
for (const c of ly) c.paragraphs.forEach(l => { for (const ch of l) tagSrc(ch, l, '《论语》'); });
for (const c of mz) c.paragraphs.forEach(l => { for (const ch of l) tagSrc(ch, l, '《孟子》'); });

// ====== 五行推断(部首法) ======
function guessWuxing(ch) {
  if (wxData[ch] && wxData[ch].wuxing) return wxData[ch].wuxing;
  if (/氵|水|雨|冫/.test(ch)) return '水';
  if (/火|灬|日|光/.test(ch)) return '火';
  if (/木|艹|竹|禾/.test(ch)) return '木';
  if (/土|山|石|玉|王/.test(ch)) return '土';
  if (/金|钅|刂|刀|辛/.test(ch)) return '金';
  return '';
}

// ====== 组装: 先核心188字，再补充 ======
const seen = new Set();
const result = [];

// 核心188字
for (const ch of Object.keys(wxData)) {
  if (seen.has(ch)) continue;
  seen.add(ch);
  const wx = wxData[ch];
  const tags = [];
  if (wx.style) {
    if (wx.style.includes('柔美')) tags.push('温婉');
    if (wx.style.includes('书卷')) tags.push('知性');
    if (wx.style.includes('自然')) tags.push('自然');
    if (wx.style.includes('大气')) tags.push('大气');
    if (wx.style.includes('现代')) tags.push('现代');
  }
  result.push({
    c: ch, s: wx.stroke, w: wx.wuxing,
    p: (pinyinMap[ch]||'').replace(/\d+/g,''),
    m: wx.meaning, src: charSrc[ch]||'',
    star: wx.gender==='女'?4:wx.gender==='通用'?3:2,
    fenqi: wx.fenqi, landajie: wx.landajie,
    tags: [...new Set(tags)], gender: wx.gender, freq: 1
  });
}

// 补充字
for (const grp of SUPP) {
  for (const ch of grp.c) {
    if (seen.has(ch)) continue;
    seen.add(ch);
    const s = strokes[ch];
    if (!s) { console.log('⚠ 无笔画:', ch); continue; }
    const py = (pinyinMap[ch]||'').replace(/\d+/g,'');
    const tags = [grp.t];
    result.push({
      c: ch, s: s, w: guessWuxing(ch),
      p: py, m: '', src: charSrc[ch]||'',
      star: grp.g==='女'?3:2,
      fenqi: false, landajie: false,
      tags: [...new Set(tags)], gender: grp.g, freq: 1
    });
  }
}

result.sort((a,b) => a.s - b.s || a.c.localeCompare(b.c));
console.log('精选字数:', result.length);
const byStroke = {};
for (const d of result) byStroke[d.s] = (byStroke[d.s]||0)+1;
for (const [s,c] of Object.entries(byStroke).sort((a,b)=>+a[0]-+b[0])) console.log('  '+s+'画: '+c);
console.log('有拼音:', result.filter(d=>d.p).length);
console.log('有出处:', result.filter(d=>d.src).length);
console.log('有五行:', result.filter(d=>d.w).length);

fs.writeFileSync(path.join(__dirname,'..','references','chars-data.json'), JSON.stringify(result));
console.log('✅ 写入 references/chars-data.json');