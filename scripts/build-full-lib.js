const fs = require('fs');
const path = require('path');

// ====== 1. Load all data sources ======
console.log('Loading sources...');

// Unihan strokes
const unihan = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', 'temp_dl', 'unihan-strokes.json')
));

// Existing wuxing-char-lib data
const wxContent = fs.readFileSync(
  path.join(__dirname, '..', 'references', 'wuxing-char-lib.md'), 'utf8'
);

// Classical poetry sources
const sj = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'temp_dl', 'shijing.json')));
const cc = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'temp_dl', 'chuci.json')));
const ly = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'temp_dl', 'lunyu.json')));
const mz = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'temp_dl', 'mengzi.json')));
const tang = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'temp_dl', 'tang300.json')));
const sc0 = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'temp_dl', 'songci_0.json')));
const sc1k = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'temp_dl', 'songci_1k.json')));

// ====== 2. Build wuxing-data map (for characters with verified 五行) ======
const wxData = {};
let currentSection = '';

for (const line of wxContent.split('\n')) {
  if (line.startsWith('## ')) { currentSection = line.replace('## ', '').trim(); continue; }
  if (!line.startsWith('| ') || line.includes('|---|---') || 
      (line.includes('字') && line.includes('笔画') && line.includes('五行'))) continue;
  const parts = line.split('|').map(p => p.trim());
  if (parts.length < 9) continue;
  const ch = parts[1];
  if (!ch || ch.length !== 1) continue;
  
  const strokeRaw = parts[2].replace(/[※◆\s]/g, '');
  const stroke = parseInt(strokeRaw);
  if (isNaN(stroke)) continue;
  
  const wuxing = parts[3].replace(/[※◆\s\/].*$/, '').trim();
  const meaning = ((parts[5] || '') + '；' + (parts[6] || '')).replace(/；$/, '');
  const gender = parts[8];
  const style = parts[7] || '';
  const hasFenqi = parts[2].includes('※');
  const hasLandajie = parts[2].includes('◆');
  
  wxData[ch] = { stroke, wuxing, meaning, gender, style, fenqi: hasFenqi, landajie: hasLandajie };
}

// ====== 3. Extract all characters from classical sources ======
const allChars = new Set();

function addChars(text) {
  for (const ch of text) {
    if (ch >= '\u4e00' && ch <= '\u9fff') allChars.add(ch);
  }
}

for (const p of sj) p.content.forEach(l => addChars(l));
for (const p of cc) p.content.forEach(l => addChars(l));
for (const c of ly) c.paragraphs.forEach(l => addChars(l));
for (const c of mz) c.paragraphs.forEach(l => addChars(l));
for (const cat of tang.content) for (const p of cat.content) (p.paragraphs||[]).forEach(l => addChars(l));
for (const arr of [sc0, sc1k]) for (const p of arr) (p.paragraphs||[]).forEach(l => addChars(l));

// ====== 4. Also build source annotations ======
const charSources = {};
function addSource(ch, line, src) {
  if (!charSources[ch]) charSources[ch] = [];
  if (charSources[ch].length < 1) { // keep only 1 source
    charSources[ch].push(line.trim().slice(0, 24) + ' — ' + src);
  }
}

// Sources for characters that pass the filter
const targetChars = new Set();
const skipChars = new Set(
  '之乎者也以其而于则与及乃所为此焉何亦或虽但如若因故乃惟岂且矣哉兮焉尔' +
  '但尚苟纵倘耶欤诸焉兮矣尔乎些'
);

for (const ch of allChars) {
  if (!skipChars.has(ch) && ch.length === 1 && unihan[ch] && unihan[ch] <= 30) {
    targetChars.add(ch);
  }
}

// Annotate from poetry
for (const p of sj) {
  for (const line of p.content) {
    if (line.length > 2) {
      for (const ch of line) {
        if (targetChars.has(ch) && !charSources[ch]) {
          addSource(ch, line, '诗经·' + p.title);
        }
      }
    }
  }
}
for (const p of cc) {
  for (const line of p.content) {
    if (line.length > 2) {
      for (const ch of line) {
        if (targetChars.has(ch) && !charSources[ch]) {
          addSource(ch, line, '楚辞·' + (p.title||''));
        }
      }
    }
  }
}
for (const cat of tang.content) {
  for (const p of cat.content) {
    for (const line of p.paragraphs||[]) {
      if (line.length > 2) {
        for (const ch of line) {
          if (targetChars.has(ch) && !charSources[ch]) {
            addSource(ch, line, '唐诗·' + (p.title||cat.title));
          }
        }
      }
    }
  }
}
for (const arr of [sc0, sc1k]) {
  for (const p of arr) {
    for (const line of p.paragraphs||[]) {
      if (line.length > 2) {
        for (const ch of line) {
          if (targetChars.has(ch) && !charSources[ch]) {
            addSource(ch, line, '宋词·' + (p.rhythmic||''));
          }
        }
      }
    }
  }
}

// ====== 5. Build final dataset ======
const result = [];

for (const ch of targetChars) {
  const s = unihan[ch];
  if (!s || s > 30) continue; // skip >30 stroke (too complex for names)
  
  const wx = wxData[ch];
  
  // Determine tags from style
  const tags = [];
  if (wx) {
    if (wx.style.includes('柔美')) tags.push('温婉');
    if (wx.style.includes('书卷')) tags.push('知性');
    if (wx.style.includes('自然')) tags.push('自然');
    if (wx.style.includes('大气')) tags.push('大气');
    if (wx.style.includes('现代')) tags.push('现代');
    
    // Determine star rating based on gender suitability
    if (wx.gender === '女') tags.push('♀');
    else if (wx.gender === '男') tags.push('♂');
  }

  result.push({
    c: ch,
    s: s,
    w: wx ? wx.wuxing : '',
    m: wx ? wx.meaning : '',
    src: charSources[ch] ? charSources[ch][0] : '',
    star: wx ? (wx.gender === '女' ? 4 : wx.gender === '通用' ? 3 : 2) : 2,
    fenqi: wx ? wx.fenqi : false,
    landajie: wx ? wx.landajie : false,
    tags: tags,
    gender: wx ? wx.gender : ''
  });
}

// Sort by stroke then by character
result.sort((a, b) => a.s - b.s || a.c.localeCompare(b.c));

console.log('总字数:', result.length);

// Stats
const byStroke = {};
for (const d of result) {
  byStroke[d.s] = (byStroke[d.s] || 0) + 1;
}
console.log('笔画分布:');
for (const [s, c] of Object.entries(byStroke).sort((a,b) => parseInt(a[0])-parseInt(b[0]))) {
  console.log('  ' + s + '画: ' + c + ' 字');
}

// Key combination spaces
const combos = [[10,14],[8,16],[9,15],[10,7],[8,10],[10,6],[6,12],[10,10],[12,12],[8,14],[6,14],[14,14]];
console.log('\n关键组合空间:');
for (const [a,b] of combos) {
  const ca = byStroke[a] || 0;
  const cb = byStroke[b] || 0;
  console.log('  ' + a + '+' + b + ' = ' + ca + '×' + cb + ' = ' + (ca*cb) + ' 组');
}

fs.writeFileSync(
  path.join(__dirname, '..', 'references', 'chars-data.json'), 
  JSON.stringify(result)
);
console.log('\n✅ 已写入 references/chars-data.json');