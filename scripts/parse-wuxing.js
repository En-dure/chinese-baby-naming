/**
 * Improved version: extract wuxing character classifications from all sources
 */
const fs = require('fs');
const path = require('path');

const BASE = 'C:/Users/liuyl/chinese-baby-naming/temp_dl';
const OUT = 'C:/Users/liuyl/chinese-baby-naming/references/classical/wuxing-classics.md';

// Read all sources
const sj = JSON.parse(fs.readFileSync(path.join(BASE, 'shijing.json'), 'utf8'));
const cc = JSON.parse(fs.readFileSync(path.join(BASE, 'chuci.json'), 'utf8'));
const tang = JSON.parse(fs.readFileSync(path.join(BASE, 'tang300.json'), 'utf8'));
const sc0 = JSON.parse(fs.readFileSync(path.join(BASE, 'songci_0.json'), 'utf8'));
const sc1k = JSON.parse(fs.readFileSync(path.join(BASE, 'songci_1k.json'), 'utf8'));

// Extract all unique characters from all sources
const allTexts = [];

// 诗经
for (const poem of sj) {
  for (const line of poem.content) {
    for (const ch of line) {
      if (ch >= '\u4e00' && ch <= '\u9fff') allTexts.push(ch);
    }
  }
}

// 楚辞
for (const poem of cc) {
  for (const line of poem.content) {
    for (const ch of line) {
      if (ch >= '\u4e00' && ch <= '\u9fff') allTexts.push(ch);
    }
  }
}

// 唐诗
for (const cat of tang.content) {
  for (const poem of cat.content) {
    for (const line of poem.paragraphs || []) {
      for (const ch of line) {
        if (ch >= '\u4e00' && ch <= '\u9fff') allTexts.push(ch);
      }
    }
  }
}

// 宋词
for (const arr of [sc0, sc1k]) {
  for (const poem of arr) {
    for (const line of poem.paragraphs || []) {
      for (const ch of line) {
        if (ch >= '\u4e00' && ch <= '\u9fff') allTexts.push(ch);
      }
    }
  }
}

// Count frequencies
const freq = {};
for (const ch of allTexts) {
  freq[ch] = (freq[ch] || 0) + 1;
}

// Filter to naming-relevant characters (appear at least 2 times)
const relevantChars = Object.keys(freq).filter(ch => freq[ch] >= 2);

// ====== Comprehensive 五行 classification ======
// Multiple classification strategies, combined
const wuxing = { '金': [], '木': [], '水': [], '火': [], '土': [] };

// Strategy 1: Radical-based (most authoritative)
const radicalMap = {
  // 金 (Metal)
  '金': '金', '钅': '金', '刂': '金', '刀': '金', '酉': '金', '辛': '金',
  '戌': '金', '革': '金', '斤': '金', '戈': '金', '戋': '金',
  // 木 (Wood)
  '木': '木', '艹': '木', '竹': '木', '禾': '木', '米': '木', '耒': '木',
  '桑': '木', '林': '木', '森': '木', '丨': '木',
  // 水 (Water)
  '氵': '水', '冫': '水', '雨': '水', '水': '水', '川': '水',
  '辶': '水', '廴': '水', '灥': '水',
  // 火 (Fire)
  '火': '火', '灬': '火', '日': '火', '月': '火', '心': '火', '忄': '火',
  '光': '火', '赤': '火', '炎': '火',
  // 土 (Earth)
  '土': '土', '山': '土', '石': '土', '田': '土', '玉': '土', '王': '土',
  '阝': '土', '阜': '土', '邑': '土', '瓦': '土', '穴': '土',
  '宀': '土', '广': '土', '一': '土', '厂': '土',
};

// Strategy 2: Meaning-based (characters with strong semantic association)
const meaningMap = {
  // 金
  '剑': '金', '锋': '金', '铭': '金', '锐': '金', '钢': '金', '铁': '金',
  '钧': '金', '铎': '金', '铃': '金', '钟': '金', '鉴': '金',
  // 木
  '乔': '木', '楚': '木', '樊': '木', '荣': '木', '华': '木',
  // 水
  '泉': '水', '海': '水', '河': '水', '江': '水', '湖': '水', '溪': '水',
  '泽': '水', '源': '水', '浩': '水', '瀚': '水', '潇': '水', '湘': '水',
  '渊': '水', '波': '水', '浪': '水', '涛': '水', '潮': '水',
  '洁': '水', '净': '水', '清': '水', '澈': '水', '澄': '水', '润': '水',
  '泓': '水', '湉': '水', '淳': '水', '淑': '水', '湄': '水',
  // 火
  '照': '火', '煌': '火', '焕': '火', '炳': '火', '炜': '火', '灿': '火',
  '霁': '火', '朗': '火', '晓': '火',
  // 土
  '城': '土', '垣': '土', '堤': '土', '桥': '土', '砥': '土',
  '瑞': '土', '瑜': '土', '瑾': '土', '瑶': '土', '玉': '土',
  '碧': '土', '玺': '土',
};

function getWuxing(char) {
  // Try radical first (check each radical)
  for (const [rad, wx] of Object.entries(radicalMap)) {
    if (char.includes(rad)) return wx;
  }
  // Then meaning
  if (meaningMap[char]) return meaningMap[char];
  return null;
}

for (const ch of relevantChars) {
  const wx = getWuxing(ch);
  if (wx && wuxing[wx]) {
    wuxing[wx].push(ch);
  }
}

// Generate output
const lines = [];
lines.push('# 经典常用字五行归属参考（全量版）');
lines.push('');
lines.push('> 从《诗经》《楚辞》《唐诗三百首》《宋词》中提取高频起名用字，');
lines.push('> 按部首优先、字义辅助的原则归入五行。');
lines.push('> 适用笔画口径：《康熙字典》繁体。');
lines.push('');

for (const [wx, chars] of Object.entries(wuxing)) {
  // Sort by frequency (most common first)
  const sorted = chars.sort((a, b) => (freq[b] || 0) - (freq[a] || 0));
  lines.push(`### ${wx}行（${sorted.length}字）`);
  lines.push('');
  lines.push(sorted.join('、'));
  lines.push('');
}

// Also add character-frequency appendix
lines.push('---');
lines.push('## 起名高频字经典出现频次');
lines.push('');
lines.push('| 字 | 五行 | 出现次数 |');
lines.push('|---|---|---|');

// Top 50 naming-relevant chars by frequency
const namingChars = '清明月安宁静和慧明智信舒逸涵韵晴曦昭煦晨晞昕芷' +
  '蕊蕙兰荷莲梅菊桃杏梧桐楠枫蓉茉萱葳蕤芬芳菲瑶琼瑾瑜' +
  '玥琳琪琮璧璇玑碧玉珊琥珀芝琦玮瑛淑婉珍婷妤娴婵姝嫣';

const topChars = [];
for (const ch of namingChars) {
  if (freq[ch]) {
    topChars.push({ char: ch, freq: freq[ch], wx: getWuxing(ch) || '?' });
  }
}
topChars.sort((a, b) => b.freq - a.freq);

for (const entry of topChars) {
  lines.push(`| ${entry.char} | ${entry.wx} | ${entry.freq} |`);
}

lines.push('');

fs.writeFileSync(OUT, lines.join('\n'), 'utf8');
console.log(`✅ wuxing-classics.md: ${lines.length} lines, ${Object.values(wuxing).reduce((a,b)=>a+b.length,0)} total chars`);
for (const [wx, chars] of Object.entries(wuxing)) {
  console.log(`   ${wx}: ${chars.length} chars`);
}