/**
 * Parse classical Chinese texts and extract name-worthy content
 * Outputs structured markdown files for the naming skill
 */
const fs = require('fs');
const path = require('path');

const BASE = 'C:/Users/liuyl/chinese-baby-naming/temp_dl';
const OUT_DIR = 'C:/Users/liuyl/chinese-baby-naming/references/classical';

// Ensure output directory exists
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ========== Character suitability judgment ==========
// Characters commonly used in Chinese names with positive connotations
const NAME_CHARS = new Set(
  '婷淑婉珍瑶琼瑾瑜玥琳琪琮璧璇玑环碧玉翡翠琳琅珊琥珀琪玮瑛琦' +
  '芷蕊蕙兰荷莲梅菊桃杏柳梧松柏桐楠桦桂枫蓉茉萱葳蕤芬芳香菲' +
  '清溪涵澈澜澄润泽深海江河流湖浩瀚淼潇淑净洁源淳泓滢沄湉' +
  '晴明晖曦曜晨晞昭煦暖昕旸时景星辰月云霓霞露霜雪雨岚' +
  '安乐宁康泰和顺怡恬悦恩慈惠柔慧敏睿智知书学礼文艺雅' +
  '嘉善良贤淑德贞仪美华丽倩妍姝嫣姣妙娉婷婉静娴' +
  '鸿志怀思慕悠远景旷达道德正则中平允谦益敬' +
  '天如亦可初相与为能知时行生'
);

// Characters that are especially beautiful for girl names
const GIRL_CHARS = new Set(
  '婷淑婉珍瑶琼瑾瑜玥琳琪琮碧芷蕊蕙兰荷莲梅菊' +
  '清溪涵澈澜澄润芬芳香菲萱茉葳蕤蓉' +
  '晴明晖曦昭煦昕旸景星月霞露霜雪' +
  '安宁静逸怡恬悦慈惠柔慧敏倩姝嫣妍' +
  '婉娴妤娉婷姣妙丽'
);

// ========== Helper: extract name phrases from text lines ==========
function extractNameContent(lines, source, meta = {}) {
  const results = [];
  for (const line of lines) {
    // Skip empty lines
    if (!line || typeof line !== 'string') continue;
    const trimmed = line.trim();
    if (trimmed.length < 2) continue;

    // Find name-worthy characters in this line
    for (let i = 0; i < trimmed.length; i++) {
      const ch = trimmed[i];
      // Skip punctuation and common function characters
      // Skip punctuation and common function characters
      if (/[　-〿＀-￯—…·s“”‘’]/.test(ch)) continue;
      if (NAME_CHARS.has(ch) || GIRL_CHARS.has(ch)) {
        // Extract a meaningful phrase around the character
        const start = Math.max(0, i - 2);
        const end = Math.min(trimmed.length, i + 3);
        let phrase = trimmed.slice(start, end);
        // Clean up punctuation at edges
        phrase = phrase.replace(/^[，。、；：？！""''（）【】《》—…·\s]+/, '')
                       .replace(/[，。、；：？！""''（）【】《》—…·\s]+$/, '');

        results.push({
          char: ch,
          context: phrase,
          full_line: trimmed,
          source,
          ...meta
        });
        break; // Only first name-char per line to avoid duplicates
      }
    }
  }
  return results;
}

// ========== Process 诗经 (Shi Jing) ==========
function processShiJing() {
  const data = JSON.parse(fs.readFileSync(path.join(BASE, 'shijing.json'), 'utf8'));
  const entries = [];
  for (const poem of data) {
    const lines = poem.content.map(l => l.replace(/[，。；：？！、]/g, '，').trim());
    const extracted = extractNameContent(lines, '诗经', {
      chapter: poem.chapter,
      section: poem.section,
      title: poem.title
    });
    entries.push(...extracted);
  }
  return entries;
}

// ========== Process 楚辞 (Chu Ci) ==========
function processChuCi() {
  const data = JSON.parse(fs.readFileSync(path.join(BASE, 'chuci.json'), 'utf8'));
  const entries = [];
  for (const poem of data) {
    const lines = poem.content.map(l => l.replace(/[，。；：？！、]/g, '，').trim());
    const extracted = extractNameContent(lines, '楚辞', {
      author: poem.author,
      title: poem.title
    });
    entries.push(...extracted);
  }
  return entries;
}

// ========== Process 论语 (Lun Yu) ==========
function processLunYu() {
  const data = JSON.parse(fs.readFileSync(path.join(BASE, 'lunyu.json'), 'utf8'));
  const entries = [];
  for (const chap of data) {
    const lines = chap.paragraphs.map(l => l.replace(/[，。；：？！、」』「『]/g, '，').trim());
    const extracted = extractNameContent(lines, '论语', {
      chapter: chap.chapter
    });
    entries.push(...extracted);
  }
  return entries;
}

// ========== Process 孟子 (Meng Zi) ==========
function processMengZi() {
  const data = JSON.parse(fs.readFileSync(path.join(BASE, 'mengzi.json'), 'utf8'));
  const entries = [];
  for (const chap of data) {
    const lines = chap.paragraphs.map(l => l.replace(/[，。；：？！、」』「『]/g, '，').trim());
    const extracted = extractNameContent(lines, '孟子', {
      chapter: chap.chapter
    });
    entries.push(...extracted);
  }
  return entries;
}

// ========== Process 唐诗三百首 (Tang Poems) ==========
function processTangPoems() {
  const data = JSON.parse(fs.readFileSync(path.join(BASE, 'tang300.json'), 'utf8'));
  const entries = [];
  for (const category of data.content) {
    for (const poem of category.content) {
      const lines = (poem.paragraphs || []).map(l => l.replace(/[，。；：？！、]/g, '，').trim());
      const extracted = extractNameContent(lines, '唐诗', {
        author: poem.author,
        title: poem.chapter,
        type: category.type
      });
      entries.push(...extracted);
    }
  }
  return entries;
}

// ========== Process 宋词 (Song Ci) ==========
function processSongCi(filePath, label) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const entries = [];
  for (const poem of data) {
    const lines = (poem.paragraphs || []).map(l => l.replace(/[，。；：？！、]/g, '，').trim());
    const extracted = extractNameContent(lines, '宋词', {
      author: poem.author,
      rhythmic: poem.rhythmic || ''
    });
    entries.push(...extracted);
  }
  return entries;
}

// ========== Process 千字文 (Thousand Character Classic) ==========
function processQianZiWen() {
  const data = JSON.parse(fs.readFileSync(path.join(BASE, 'qianziwen.json'), 'utf8'));
  const entries = [];
  for (const line of data.paragraphs) {
    const trimmed = line.trim();
    if (trimmed.length < 3) continue;
    // 千字文的句子是4字一句
    const chars = [];
    for (let i = 0; i < trimmed.length; i++) {
      if (NAME_CHARS.has(trimmed[i]) || GIRL_CHARS.has(trimmed[i])) {
        chars.push(trimmed[i]);
      }
    }
    if (chars.length > 0) {
      entries.push({
        chars: [...new Set(chars)],
        context: trimmed,
        source: '千字文',
        author: data.author
      });
    }
  }
  return entries;
}

// ========== Process 声律启蒙 (Sheng Lü Qi Meng) ==========
function processShengLv() {
  const data = JSON.parse(fs.readFileSync(path.join(BASE, 'shenglvqimeng.json'), 'utf8'));
  const entries = [];
  for (const vol of data.content) {
    for (const chap of vol.content) {
      const lines = chap.paragraphs.map(l => l.replace(/[，。；：？！、]/g, '，').trim());
      const extracted = extractNameContent(lines, '声律启蒙', {
        chapter: chap.chapter
      });
      entries.push(...extracted);
    }
  }
  return entries;
}

// ========== Main ==========
console.log('Processing classical texts...\n');

const results = {
  shijing: processShiJing(),
  chuci: processChuCi(),
  lunyu: processLunYu(),
  mengzi: processMengZi(),
  tang: processTangPoems(),
  songci0: processSongCi(path.join(BASE, 'songci_0.json'), '宋词(一)'),
  songci1k: processSongCi(path.join(BASE, 'songci_1k.json'), '宋词(二)'),
  qianziwen: processQianZiWen(),
  shenglv: processShengLv(),
  daxue: processSiShu('daxue.json', '大学'),
  zhongyong: processSiShu('zhongyong.json', '中庸')
};

function processSiShu(filename, label) {
  const data = JSON.parse(fs.readFileSync(path.join(BASE, filename), 'utf8'));
  const entries = [];
  const lines = (data.paragraphs || []).map(l => l.replace(/[，。；：？！、」』「『]/g, '，').trim());
  const extracted = extractNameContent(lines, label, {
    chapter: data.chapter || ''
  });
  return extracted;
}

console.log('Extracted entries:');
for (const [key, entries] of Object.entries(results)) {
  console.log(`  ${key}: ${entries.length} entries`);
}

// ========== Generate consolidated reference ==========
function generateMD() {
  const lines = [];
  
  lines.push('# 古典诗文起名参考库（全量版）');
  lines.push('');
  lines.push('> 本库从以下经典源中提取适用于中文起名的字词及原句：');
  lines.push('> 《诗经》(305篇) · 《楚辞》(65篇) · 《论语》(20章) · 《孟子》(14篇)');
  lines.push('> 《唐诗三百首》(320首) · 《宋词》(2000首) · 《千字文》 · 《声律启蒙》');
  lines.push('');
  lines.push('---');
  lines.push('');

  // 1. 诗经
  lines.push('## 《诗经》305篇 起名字库');
  lines.push('');
  lines.push('| 字 | 原句 | 篇名 | 章 |');
  lines.push('|---|---|---|---|');
  
  // Group by chapter for readability
  const byChapter = {};
  for (const e of results.shijing) {
    const ch = e.chapter || '其他';
    if (!byChapter[ch]) byChapter[ch] = [];
    byChapter[ch].push(e);
  }
  for (const [chapter, entries] of Object.entries(byChapter)) {
    lines.push(`| **${chapter}** | | | |`);
    const seen = new Set();
    for (const e of entries) {
      const key = e.char + e.title;
      if (seen.has(key)) continue;
      seen.add(key);
      lines.push(`| ${e.char} | ${e.context} | ${e.title} | ${e.section || ''} |`);
    }
  }
  
  lines.push('');

  // 2. 楚辞
  lines.push('## 《楚辞》65篇 起名字库');
  lines.push('');
  lines.push('| 字 | 原句 | 篇名 | 作者 |');
  lines.push('|---|---|---|---|');
  const seenChuci = new Set();
  for (const e of results.chuci) {
    const key = e.char + e.title;
    if (seenChuci.has(key)) continue;
    seenChuci.add(key);
    lines.push(`| ${e.char} | ${e.context} | ${e.title} | ${e.author || ''} |`);
  }
  lines.push('');

  // 3. 唐诗三百首
  lines.push('## 《唐诗三百首》起名字库');
  lines.push('');
  lines.push('| 字 | 原句 | 诗题 | 作者 |');
  lines.push('|---|---|---|---|');
  const seenTang = new Set();
  for (const e of results.tang) {
    const key = e.char + e.title + e.author;
    if (seenTang.has(key)) continue;
    seenTang.add(key);
    // Skip generic entries
    if (e.char === '不' || e.char === '之' || e.char === '以') continue;
    lines.push(`| ${e.char} | ${e.context} | ${e.title} | ${e.author || ''} |`);
  }
  lines.push('');

  // 4. 宋词
  lines.push('## 《宋词》起名字库（2000首选摘）');
  lines.push('');
  lines.push('| 字 | 原句 | 词牌 | 作者 |');
  lines.push('|---|---|---|---|');
  const seenSong = new Set();
  const allSongCi = [...results.songci0, ...results.songci1k];
  for (const e of allSongCi) {
    const key = e.char + e.rhythmic + e.author;
    if (seenSong.has(key)) continue;
    seenSong.add(key);
    if (e.char === '不' || e.char === '之' || e.char === '以' || e.char === '子') continue;
    lines.push(`| ${e.char} | ${e.context} | ${e.rhythmic || ''} | ${e.author || ''} |`);
  }
  lines.push('');

  // 5. 论语
  lines.push('## 《论语》起名字库');
  lines.push('');
  lines.push('| 字 | 原句 | 篇目 |');
  lines.push('|---|---|---|');
  const seenLy = new Set();
  for (const e of results.lunyu) {
    const key = e.char + e.chapter;
    if (seenLy.has(key)) continue;
    seenLy.add(key);
    if (e.char === '之' || e.char === '不' || e.char === '以' || e.char === '而') continue;
    lines.push(`| ${e.char} | ${e.context} | ${e.chapter || ''} |`);
  }
  lines.push('');

  // 6. 千字文
  lines.push('## 《千字文》起名字库');
  lines.push('');
  lines.push('> 千字文共1000个不重复汉字，以下为起名用途高频字及原句。');
  lines.push('');
  lines.push('| 字 | 原句 |');
  lines.push('|---|---|');
  for (const e of results.qianziwen) {
    for (const ch of e.chars) {
      lines.push(`| ${ch} | ${e.context} |`);
    }
  }
  lines.push('');

  // 7. 声律启蒙
  lines.push('## 《声律启蒙》起名字库');
  lines.push('');
  lines.push('| 字 | 原句 | 韵部 |');
  lines.push('|---|---|---|');
  for (const e of results.shenglv) {
    if (e.char === '不' || e.char === '之' || e.char === '以') continue;
    lines.push(`| ${e.char} | ${e.context} | ${e.chapter || ''} |`);
  }
  lines.push('');

  // 8. 孟子
  lines.push('## 《孟子》起名字库');
  lines.push('');
  lines.push('| 字 | 原句 | 篇目 |');
  lines.push('|---|---|---|');
  for (const e of results.mengzi) {
    if (e.char === '之' || e.char === '不' || e.char === '以' || e.char === '而') continue;
    lines.push(`| ${e.char} | ${e.context} | ${e.chapter || ''} |`);
  }
  lines.push('');

  // 9. 大学
  lines.push('## 《大学》起名字库');
  lines.push('');
  lines.push('| 字 | 原句 |');
  lines.push('|---|---|');
  for (const e of results.daxue) {
    if (e.char === '之' || e.char === '不' || e.char === '以' || e.char === '而') continue;
    lines.push(`| ${e.char} | ${e.context} |`);
  }
  lines.push('');

  // 10. 中庸
  lines.push('## 《中庸》起名字库');
  lines.push('');
  lines.push('| 字 | 原句 |');
  lines.push('|---|---|');
  for (const e of results.zhongyong) {
    if (e.char === '之' || e.char === '不' || e.char === '以' || e.char === '而') continue;
    lines.push(`| ${e.char} | ${e.context} |`);
  }

  return lines.join('\n');
}

const md = generateMD();
const outPath = path.join(OUT_DIR, 'all-classics.md');
fs.writeFileSync(outPath, md, 'utf8');
console.log(`\n✅ 主文件输出: ${outPath}`);
console.log(`   共 ${md.split('\n').length} 行`);

// ========== Also output a condensed "girl-name" reference ==========
function generateGirlRef() {
  const lines = [];
  lines.push('# 女孩起名 · 古典出处精选');
  lines.push('');
  lines.push('> 从全量库中筛选适合**女孩名**的字，附带经典出处。');
  lines.push('');

  // Collect all char+context entries
  const charMap = {};
  const songci = [...results.songci0, ...results.songci1k];
  const allEntries = [
    ...results.shijing.map(e => ({...e, source_short: '诗经'})),
    ...results.chuci.map(e => ({...e, source_short: '楚辞'})),
    ...results.tang.map(e => ({...e, source_short: '唐诗'})),
    ...songci.map(e => ({...e, source_short: '宋词'}))
  ];

  for (const e of allEntries) {
    if (!GIRL_CHARS.has(e.char)) continue;
    if (!charMap[e.char]) {
      charMap[e.char] = [];
    }
    if (charMap[e.char].length < 3) { // Keep max 3 contexts per char
      charMap[e.char].push(`"${e.context}" — ${e.source_short}·${e.title || e.rhythmic || ''}`);
    }
  }

  lines.push('| 字 | 出处 |');
  lines.push('|---|---|');
  const sortedChars = Object.keys(charMap).sort();
  for (const ch of sortedChars) {
    const ctx = charMap[ch].join('<br>');
    lines.push(`| **${ch}** | ${ctx} |`);
  }

  return lines.join('\n');
}

const girlMd = generateGirlRef();
const girlPath = path.join(OUT_DIR, 'girl-classics.md');
fs.writeFileSync(girlPath, girlMd, 'utf8');
console.log(`✅ 女孩精选输出: ${girlPath}`);
console.log(`   共 ${girlMd.split('\n').length} 行`);

// ========== Also create a character-五行 reference from classics ==========
function generateWuXingRef() {
  const lines = [];
  lines.push('# 经典常用字五行归属参考');
  lines.push('');
  lines.push('> 从经典中提取起名常用字的五行归属，辅助五格+五行匹配。');
  lines.push('');

  // Basic Wu Xing by radical
  const wuxingMap = {};
  const radicalWuxing = {
    '氵': '水', '冫': '水', '雨': '水', '水': '水',
    '火': '火', '灬': '火', '日': '火',
    '木': '木', '艹': '木', '竹': '木', '禾': '木', '米': '木', '耒': '木',
    '金': '金', '刂': '金', '钅': '金', '刀': '金', '酉': '金',
    '土': '土', '山': '土', '石': '土', '田': '土', '玉': '土', '王': '土',
    '月': '木', '心': '火', '忄': '火', '言': '水',
    '辶': '火', '阝': '土', '人': '水', '亻': '水', '一': '土', '宀': '火'
  };

  const allChars = new Set();
  const allSong = [...results.songci0, ...results.songci1k];
  const allEntries = [...results.shijing, ...results.chuci, ...results.tang, ...allSong];
  for (const e of allEntries) allChars.add(e.char);

  for (const ch of allChars) {
    // Determine wuxing by radical
    let wuxing = null;
    for (const [rad, wx] of Object.entries(radicalWuxing)) {
      if (ch.includes(rad)) {
        wuxing = wx;
        break;
      }
    }
    if (wuxing) {
      if (!wuxingMap[wuxing]) wuxingMap[wuxing] = [];
      wuxingMap[wuxing].push(ch);
    }
  }

  for (const [wx, chars] of Object.entries(wuxingMap)) {
    lines.push(`### ${wx}行字（${chars.length}个）`);
    lines.push('');
    lines.push(chars.sort().join('、'));
    lines.push('');
  }

  return lines.join('\n');
}

const wxMd = generateWuXingRef();
const wxPath = path.join(OUT_DIR, 'wuxing-classics.md');
fs.writeFileSync(wxPath, wxMd, 'utf8');
console.log(`✅ 五行归类输出: ${wxPath}`);
console.log(`   共 ${wxMd.split('\n').length} 行`);

console.log('\n✅ 全部完成！');