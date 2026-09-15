const fs = require('fs');
const path = require('path');

console.log('加载 Unihan 数据...');

// ====== 1. 解析 kTGH (通用规范汉字表字频序号) ======
const tghContent = fs.readFileSync(path.join(__dirname,'..','temp_dl','Unihan_OtherMappings.txt'),'utf8');
const tghMap = {};
for (const line of tghContent.split('\n')) {
  if (line.startsWith('#') || !line.trim()) continue;
  const parts = line.split('\t');
  if (parts.length < 3 || parts[1] !== 'kTGH') continue;
  const cp = parseInt(parts[0].slice(2), 16);
  if (cp < 0x4E00 || cp > 0x9FFF) continue;
  const char = String.fromCodePoint(cp);
  const seq = parseInt(parts[2].replace('2013:',''));
  tghMap[char] = seq;
}

// ====== 2. 解析 kMandarin (拼音) ======
const readContent = fs.readFileSync(path.join(__dirname,'..','temp_dl','Unihan_Readings.txt'),'utf8');
const pinyinMap = {};
const defMap = {};
for (const line of readContent.split('\n')) {
  if (line.startsWith('#') || !line.trim()) continue;
  const parts = line.split('\t');
  if (parts.length < 3) continue;
  const cp = parseInt(parts[0].slice(2), 16);
  if (cp < 0x4E00 || cp > 0x9FFF) continue;
  const char = String.fromCodePoint(cp);
  if (parts[1] === 'kMandarin' && !pinyinMap[char]) {
    pinyinMap[char] = parts[2].trim();
  }
  if (parts[1] === 'kDefinition' && !defMap[char]) {
    defMap[char] = parts[2].trim();
  }
}

// ====== 3. 笔画数据 ======
const strokeMap = JSON.parse(fs.readFileSync(path.join(__dirname,'..','temp_dl','unihan-strokes.json')));

// ====== 4. 五行字库 (已验证五行/释义/性别) ======
const wxContent = fs.readFileSync(path.join(__dirname,'..','references','wuxing-char-lib.md'),'utf8');
const wxData = {};
for (const line of wxContent.split('\n')) {
  if (!line.startsWith('| ') || line.includes('|---') || line.includes('字 |笔')) continue;
  const parts = line.split('|').map(p=>p.trim());
  if (parts.length < 9) continue;
  const ch = parts[1];
  if (!ch || ch.length !== 1) continue;
  const stroke = parseInt(parts[2].replace(/[※◆\s]/g,''));
  if (isNaN(stroke)) continue;
  const wuxing = parts[3].replace(/[※◆\s\/].*$/,'').trim();
  const meaning = ((parts[5]||'')+'；'+(parts[6]||'')).replace(/；$/,'');
  const gender = parts[8];
  const style = parts[7]||'';
  wxData[ch] = { stroke, wuxing, meaning, gender, style, fenqi: parts[2].includes('※'), landajie: parts[2].includes('◆') };
}

// ====== 5. 经典诗词源 + 出处标注 ======
console.log('加载经典诗词语料...');
const sj = JSON.parse(fs.readFileSync(path.join(__dirname,'..','temp_dl','shijing.json')));
const cc = JSON.parse(fs.readFileSync(path.join(__dirname,'..','temp_dl','chuci.json')));
const ly = JSON.parse(fs.readFileSync(path.join(__dirname,'..','temp_dl','lunyu.json')));
const mz = JSON.parse(fs.readFileSync(path.join(__dirname,'..','temp_dl','mengzi.json')));
const tang = JSON.parse(fs.readFileSync(path.join(__dirname,'..','temp_dl','tang300.json')));
const sc0 = JSON.parse(fs.readFileSync(path.join(__dirname,'..','temp_dl','songci_0.json')));
const sc1k = JSON.parse(fs.readFileSync(path.join(__dirname,'..','temp_dl','songci_1k.json')));
const qzw = JSON.parse(fs.readFileSync(path.join(__dirname,'..','temp_dl','qianziwen.json')));
const sl = JSON.parse(fs.readFileSync(path.join(__dirname,'..','temp_dl','shenglvqimeng.json')));

const allChars = new Set();
function addChars(t){for(const ch of t){if(ch>='\u4e00'&&ch<='\u9fff')allChars.add(ch);}}
for (const p of sj) p.content.forEach(l=>addChars(l));
for (const p of cc) p.content.forEach(l=>addChars(l));
for (const c of ly) c.paragraphs.forEach(l=>addChars(l));
for (const c of mz) c.paragraphs.forEach(l=>addChars(l));
for (const cat of tang.content) for (const p of cat.content) (p.paragraphs||[]).forEach(l=>addChars(l));
for (const arr of [sc0,sc1k]) for (const p of arr) (p.paragraphs||[]).forEach(l=>addChars(l));
qzw.paragraphs.forEach(l=>addChars(l));
for (const v of sl.content) for (const c of v.content) c.paragraphs.forEach(l=>addChars(l));

console.log('经典语料唯一汉字:', allChars.size);

// 虚词排除
const skipChars = new Set(
  '之乎者也以其而于则与及乃所为此焉何亦或虽但如若因故惟岂且矣哉兮尔尚苟纵倘耶欤诸焉' +
  '了的是不有在个上下来到说看会着过被把给让叫请' + // 现代虚词
  '么呢吧啊呀哦哈嘿嗯哇呐' // 语气词
);

// 字义不雅、不适合入名的字排除
const uglyChars = new Set(
  '病疾痛苦死亡丧哭泣悲愁恼怒恨怨仇敌煞鬼魔妖丑陋脏臭腐朽烂破败坏恶毒害' +
  '灾祸殃凶煞残废疯癞癣疥疮痣瘤癌瘤疾疫瘟疟痢' +
  '贫穷困乏破产负债饿饥渴寒冻暑炎燥湿霉锈' +
  '凶杀戳宰屠戮斩砍剁劈刺戳捅割剥剖' +
  '盗贼偷骗诈拐骗坑蒙拐抢掠劫霸占抢夺' +
  '奴婢妾娼妓龟蛋屁屎尿粪痰脓血脓疤' +
  '蠢笨傻呆痴愚鲁莽卤氓劣孬歹丑陋' +
  '猪狗鼠猫蛇蝎蛙蝇蚊蚤蟑蛛蜘蛛蝉蠕蛆' + // 不雅动物
  '鬼魔妖煞魅魑魍魉魑魅魍魉' + // 鬼怪
  '叹呜哀悼哭泣泪涕悲愁忧闷怅惘' + // 悲愁类
  '输败负差劣逊弱衰疲乏累倦困'
);

// ====== 6. 构建字库 ======
// 筛选标准：
//   1. 在经典诗词中出现（有文化底蕴）
//   2. 在《通用规范汉字表》一二级字表内（常用，不生僻）
//   3. 笔画 ≤ 24（太复杂的不适合名字）
//   4. 不是虚词/不雅字

const targetChars = new Set();
for (const ch of allChars) {
  if (skipChars.has(ch)) continue;
  if (uglyChars.has(ch)) continue;
  const seq = tghMap[ch];
  if (!seq) continue; // 不在通用规范汉字表内，太生僻
  if (seq > 6500) continue; // 只取一二级常用字（6500字以内）
  const s = strokeMap[ch];
  if (!s || s > 24) continue;
  targetChars.add(ch);
}

console.log('筛选后字数:', targetChars.size);

// ====== 7. 出处标注 ======
const charSources = {};
function addSource(ch, line, src) {
  if (!charSources[ch]) charSources[ch] = [];
  if (charSources[ch].length < 1) {
    charSources[ch].push(line.trim().slice(0,28) + ' — ' + src);
  }
}

// 诗经优先标注（最典雅）
for (const p of sj) {
  for (const line of p.content) {
    if (line.length > 2) {
      for (const ch of line) {
        if (targetChars.has(ch) && !charSources[ch]) {
          addSource(ch, line, '《诗经·' + p.title + '》');
        }
      }
    }
  }
}
// 楚辞
for (const p of cc) {
  for (const line of p.content) {
    if (line.length > 2) {
      for (const ch of line) {
        if (targetChars.has(ch) && !charSources[ch]) {
          addSource(ch, line, '《楚辞·' + (p.title||'') + '》');
        }
      }
    }
  }
}
// 唐诗
for (const cat of tang.content) {
  for (const p of cat.content) {
    for (const line of p.paragraphs||[]) {
      if (line.length > 2) {
        for (const ch of line) {
          if (targetChars.has(ch) && !charSources[ch]) {
            addSource(ch, line, '《唐诗·' + (p.title||cat.title) + '》');
          }
        }
      }
    }
  }
}
// 宋词
for (const arr of [sc0,sc1k]) {
  for (const p of arr) {
    for (const line of p.paragraphs||[]) {
      if (line.length > 2) {
        for (const ch of line) {
          if (targetChars.has(ch) && !charSources[ch]) {
            addSource(ch, line, '《宋词·' + (p.rhythmic||'') + '》');
          }
        }
      }
    }
  }
}
// 论语/孟子
for (const c of ly) {
  for (const line of c.paragraphs) {
    if (line.length > 2) {
      for (const ch of line) {
        if (targetChars.has(ch) && !charSources[ch]) {
          addSource(ch, line, '《论语》');
        }
      }
    }
  }
}
for (const c of mz) {
  for (const line of c.paragraphs) {
    if (line.length > 2) {
      for (const ch of line) {
        if (targetChars.has(ch) && !charSources[ch]) {
          addSource(ch, line, '《孟子》');
        }
      }
    }
  }
}

// ====== 8. 组装最终数据 ======
const result = [];
for (const ch of targetChars) {
  const s = strokeMap[ch];
  const seq = tghMap[ch];
  const wx = wxData[ch];
  const pinyin = pinyinMap[ch] || '';
  
  const tags = [];
  if (wx) {
    if (wx.style.includes('柔美')) tags.push('温婉');
    if (wx.style.includes('书卷')) tags.push('知性');
    if (wx.style.includes('自然')) tags.push('自然');
    if (wx.style.includes('大气')) tags.push('大气');
    if (wx.style.includes('现代')) tags.push('现代');
  }
  
  result.push({
    c: ch,
    s: s,
    w: wx ? wx.wuxing : '',
    p: pinyin,
    m: wx ? wx.meaning : '',
    src: charSources[ch] ? charSources[ch][0] : '',
    star: wx ? (wx.gender==='女'?4 : wx.gender==='通用'?3 : 2) : 2,
    fenqi: wx ? wx.fenqi : false,
    landajie: wx ? wx.landajie : false,
    tags: tags,
    gender: wx ? wx.gender : '',
    freq: seq <= 3500 ? 1 : 2 // 一级=1(最常用), 二级=2(次常用)
  });
}

result.sort((a,b) => a.s - b.s || a.c.localeCompare(b.c));

console.log('最终字数:', result.length);
const byStroke = {};
for (const d of result) { byStroke[d.s] = (byStroke[d.s]||0)+1; }
console.log('笔画分布:');
for (const [s,c] of Object.entries(byStroke).sort((a,b)=>parseInt(a[0])-parseInt(b[0]))) {
  console.log('  '+s+'画: '+c+'字');
}
console.log('\n一级常用字:', result.filter(d=>d.freq===1).length);
console.log('二级次常用字:', result.filter(d=>d.freq===2).length);
console.log('有诗经出处:', result.filter(d=>d.src.includes('诗经')).length);
console.log('有拼音:', result.filter(d=>d.p).length);

fs.writeFileSync(path.join(__dirname,'..','references','chars-data.json'), JSON.stringify(result));
console.log('\n✅ 写入 references/chars-data.json');