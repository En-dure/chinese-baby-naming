/**
 * Generate 刘姓女孩选字库 from existing wuxing-char-lib + classical sources
 * Output: references/name-chars-liu-girl.md
 */
const fs = require('fs');

const BASE = 'C:/Users/liuyl/chinese-baby-naming';
const WUXING_LIB = BASE + '/references/wuxing-char-lib.md';
const ALL_CLASSICS = BASE + '/references/classical/all-classics.md';
const GIRL_CLASSICS = BASE + '/references/classical/girl-classics.md';
const OUT = BASE + '/references/name-chars-liu-girl.md';

// ====== Read existing wuxing-char-lib.md ======
const wxContent = fs.readFileSync(WUXING_LIB, 'utf8');
const wxLines = wxContent.split('\n');

// Parse character entries from wuxing-char-lib.md
// Format: | 字 | 繁体笔画 | 五行 | 部首 | 本义 | 名字寓意 | 风格 | 性别 |
const charDb = {};
let currentWx = '';
for (const line of wxLines) {
  if (line.startsWith('## ')) {
    currentWx = line.replace('## ', '').trim();
    continue;
  }
  if (!line.startsWith('| ') || line.includes('字 |') || line.includes('---') || line.includes('字|')) continue;
  
  const parts = line.split('|').map(p => p.trim());
  if (parts.length < 9) continue;
  
  const char = parts[1];
  const stroke = parts[2].replace(/[※◆\s]/g, ''); // clean ※◆ marks
  const strokeNum = parseInt(stroke);
  if (!char || isNaN(strokeNum)) continue;
  
  const wuxing = parts[3].replace(/[※◆\s]/g, '');
  const radical = parts[4];
  const meaning = parts[5];
  const nameMeaning = parts[6];
  const style = parts[7];
  const gender = parts[8];
  const hasFenqi = parts[2].includes('※');
  const hasLandajie = parts[2].includes('◆');
  
  if (!charDb[strokeNum]) charDb[strokeNum] = [];
  charDb[strokeNum].push({
    char, stroke: strokeNum, wuxing, radical, meaning, nameMeaning, style, gender,
    hasFenqi, hasLandajie,
    // Will be filled from classics
    classicSource: '',
    girlScore: gender === '女' ? '★★★★' : gender === '通用' ? '★★★' : '★★'
  });
}

// ====== Read girl-classics for source annotations ======
const girlContent = fs.readFileSync(GIRL_CLASSICS, 'utf8');
const girlLines = girlContent.split('\n');

// Parse girl-classics: | 字 | 出处 |
// 出处 format: "诗句" — 源·篇名
const girlCharMap = {};
for (const line of girlLines) {
  if (!line.startsWith('| **')) continue;
  const match = line.match(/\|\s*\*\*(\S+)\*\*\s*\|\s*(.+?)\s*\|/);
  if (match) {
    girlCharMap[match[1]] = match[2];
  }
}

// ====== Read all-classics for additional source info ======
const allContent = fs.readFileSync(ALL_CLASSICS, 'utf8');
const allLines = allContent.split('\n');

// Simple parser: look for table rows with character + context + source
const charSources = {};
let currentSource = '';
for (const line of allLines) {
  if (line.startsWith('## ')) {
    currentSource = line.replace('## ', '').trim();
    continue;
  }
  if (!line.startsWith('| ') || line.includes('字 |')) continue;
  const parts = line.split('|').map(p => p.trim());
  if (parts.length < 3) continue;
  
  // First column is the character
  const ch = parts[1].replace(/\*\*/g, '');
  if (ch.length === 1 && ch >= '\u4e00' && ch <= '\u9fff') {
    if (!charSources[ch]) charSources[ch] = [];
    // Second column is context
    const context = parts[2] || '';
    // Source name is in currentSource
    if (context && charSources[ch].length < 2) {
      charSources[ch].push(`${currentSource}: “${context.slice(0, 20)}…”`);
    }
  }
}

// ====== Generate output ======
const lines = [];
lines.push('# 刘姓女孩起名选字库');
lines.push('');
lines.push('> 刘=15画（康熙繁体）。以下所有字均适合女孩名，按笔画分组方便五格匹配。');
lines.push('> 优先 10+14 组合（选字空间最大），其次 8+16、9+15、10+7、8+10、10+6、6+12。');
lines.push('');

// Target stroke counts for 刘姓 combos
const comboGroups = [
  { strokes: [6, 7], title: '6-7画：小笔画清爽型', combos: '10+6, 10+7' },
  { strokes: [8, 9], title: '8-9画：工整平衡型', combos: '8+16, 8+10, 9+15' },
  { strokes: [10], title: '10画：万能位（名A首选）', combos: '10+14, 10+7, 10+6' },
  { strokes: [12, 14], title: '12-14画：丰盈舒展型', combos: '10+14, 6+12' },
  { strokes: [15, 16], title: '15-16画：大气饱满型', combos: '8+16, 9+15' },
];

for (const group of comboGroups) {
  lines.push(`## ${group.title}（${group.combos}）`);
  lines.push('');
  lines.push('| 字 | 笔画 | 五行 | 释义 | 出处 | 推荐 |');
  lines.push('|---|---|---|---|---|---|');
  
  for (const s of group.strokes) {
    if (!charDb[s]) continue;
    // Sort: girl chars first, then by wuxing
    const sorted = [...charDb[s]].sort((a, b) => {
      const aGirl = a.gender === '女' ? 0 : a.gender === '通用' ? 1 : 2;
      const bGirl = b.gender === '女' ? 0 : b.gender === '通用' ? 1 : 2;
      if (aGirl !== bGirl) return aGirl - bGirl;
      return a.char.localeCompare(b.char);
    });
    
    for (const entry of sorted) {
      // Skip obviously masculine chars for girl focus
      if (entry.gender === '男' && !'杰俊信修'.includes(entry.char)) continue;
      
      // Get classical source
      let source = girlCharMap[entry.char] || charSources[entry.char]?.[0] || '';
      // Clean up source
      source = source.replace(/<br>/g, '; ').slice(0, 40);
      
      let hasNote = '';
      if (entry.hasFenqi) hasNote += '⚠️';
      if (entry.hasLandajie) hasNote += '🚫';
      
      const girlStar = entry.girlScore;
      
      lines.push(`| ${entry.char} | ${entry.stroke} | ${entry.wuxing} | ${entry.nameMeaning || entry.meaning} | ${source || '—'} | ${girlStar}${hasNote} |`);
    }
  }
  lines.push('');
}

// ====== Also add a girl-char table sorted by meaning ======
lines.push('---');
lines.push('## 按意象主题速查');
lines.push('');
lines.push('### 🌸 温婉柔美');
lines.push('| 字 | 笔画 | 五行 | 出处 |');
lines.push('|---|---|---|---|');
for (const ch of '芷蕊蕙兰荷莲梅菊桃杏蓉茉萱葳蕤芬芳菲薇蕾蘅蕖荇菁'.split('')) {
  const found = findChar(ch);
  if (found) lines.push(`| ${ch} | ${found.stroke} | ${found.wuxing} | ${girlCharMap[ch] || charSources[ch]?.[0] || '—'} |`);
}
lines.push('');

lines.push('### 📖 知性书卷');
lines.push('| 字 | 笔画 | 五行 | 出处 |');
lines.push('|---|---|---|---|');
for (const ch of '知书礼文雅慧敏睿智思学言诗意勤悦恬惠谦谨诚'.split('')) {
  const found = findChar(ch);
  if (found) lines.push(`| ${ch} | ${found.stroke} | ${found.wuxing} | ${girlCharMap[ch] || charSources[ch]?.[0] || '—'} |`);
}
lines.push('');

lines.push('### 🌿 自然清朗');
lines.push('| 字 | 笔画 | 五行 | 出处 |');
lines.push('|---|---|---|---|');
for (const ch of '清溪涵澈澜澄润泽源淳泓湉淑洁净沚洺溪亭晴明晖曦昭煦晨晞昕'.split('')) {
  const found = findChar(ch);
  if (found) lines.push(`| ${ch} | ${found.stroke} | ${found.wuxing} | ${girlCharMap[ch] || charSources[ch]?.[0] || '—'} |`);
}
lines.push('');

lines.push('### 👑 大气明朗');
lines.push('| 字 | 笔画 | 五行 | 出处 |');
lines.push('|---|---|---|---|');
for (const ch of '安宁静逸怡恬悦恩慈惠柔敏倩姝妍妤娉婷婉娴'.split('')) {
  const found = findChar(ch);
  if (found) lines.push(`| ${ch} | ${found.stroke} | ${found.wuxing} | ${girlCharMap[ch] || charSources[ch]?.[0] || '—'} |`);
}
lines.push('');

function findChar(ch) {
  for (const entries of Object.values(charDb)) {
    const found = entries.find(e => e.char === ch);
    if (found) return found;
  }
  return null;
}

// ====== Write output ======
fs.writeFileSync(OUT, lines.join('\n'), 'utf8');
console.log(`✅ ${OUT}`);
console.log(`   ${lines.length} lines`);

// Count per stroke group
for (const group of comboGroups) {
  let count = 0;
  for (const s of group.strokes) {
    if (charDb[s]) count += charDb[s].filter(e => e.gender !== '男').length;
  }
  console.log(`   ${group.title}: ${count} chars`);
}