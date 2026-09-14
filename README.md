# Chinese Baby Naming Skill — 中国传统起名

一个基于 **八字（Ba Zi）、生肖（Zodiac）、三才五格（Wuge）、音律寓意（Phonetics）** 的传统中国起名 AI 技能。

## 功能

- **排八字（Ba Zi）** — 根据出生年月日时排出四柱，判断日主旺衰
- **定喜用神** — 分析五行强弱，确定需要补的五行元素
- **生肖适配** — 按生肖匹配宜用部首，避开相冲相害
- **三才五格** — 康熙繁体笔画计算五格数理，查81数吉凶 + 三才生克
- **音律寓意** — 平仄搭配、谐音审查、典故溯源、寓意解析
- **避开烂大街字** — 公安部近年姓名统计数据，避开梓涵/宇轩等泛滥字
- **五行参考字库** — 188字校准库，含笔画/五行/分歧/烂大街标注，选字可扩展
- **方言谐音审查** — 粵语/闽南语/吴语/客家话/四川话六大方言区谐音避坑
- **典故出处速查** — 诗经/楚辞/论语/周易/道德经/唐诗宋词高频典故字及原文出处

## 使用方式

本 skill 遵循通用 Agent Skill 规范（`SKILL.md` + `references/` 目录），兼容所有支持该规范的 AI 编码助手，包括但不限于 **pi、opencode** 等。

### 安装

将 `chinese-baby-naming/` 复制到你的 AI 助手的全局 skills 目录：

```bash
# pi / 通用全局目录（所有 agent 共享）
cp -r chinese-baby-naming ~/.agents/skills/

# 或 opencode 专属目录
cp -r chinese-baby-naming ~/.config/opencode/skills/
```

### 使用

安装后直接用自然语言提问，skill 会根据描述自动加载：

> "帮我给孩子起个名字，姓刘，2027年1月2日预产期，女娃"

> "分析一下'刘芷宁'这个名字好不好"

## Skill 文件结构

```
chinese-baby-naming/
├── SKILL.md               # 起名九步法流程 + 评分 + 反馈迭代
├── references/ganzhi.md              # 天干地支五行 + 四柱排盘 + 纳音五行
├── references/xiyongshen.md          # 定喜用神方法（三得法判旺衰）
├── references/zodiac-radicals.md     # 十二生肖宜忌部首 + 六冲六害三合六合 + 喜忌字例
├── references/wuge-81.md             # 五格计算 + 数理转五行 + 81数理完整表 + 姓氏笔画
├── references/phonetics.md           # 音律搭配规则 + 五行用字参照 + 谐音审查
├── references/popularity-avoid.md    # 2010-2025烂大街字清单 + 替代字表
├── references/wuxing-char-lib.md     # 188字五行参考字库（校准用，非限制选字范围）
├── references/dialect-homophones.md  # 六大方言区谐音审查 + 高危字总清单
├── references/classical-origins.md  # 诗经/楚辞/论语/周易等典故出处速查库
└── README.md
```

## 数据来源

- 天干地支五行：维基百科《天干地支》核查
- 81数理吉凶表：姓名学（五格剖象）通行版本
- 生肖宜忌：传统民俗起名通行参照
- 热门字排行榜：公安部历年全国姓名报告 / 各地警方公开数据 / 权威媒体报道
- 五行字库：起名网系字库（James88/qiming 双字典样本）+ 邵雍《梅花易数》字形象说，2026年9月逐字核验

## 重要说明

- **三才五格起源于日本**（熊崎健翁创立），非中国古典原创，学界视为伪科学
- **本 skill 定位为"民俗口径查表工具"**，非命理真理
- 笔画以《康熙字典》繁体为准
- 选字不限于字库中的188字，可扩展（部首法+字义法自判五行）

## License

MIT