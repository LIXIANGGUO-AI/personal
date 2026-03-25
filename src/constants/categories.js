// ============================================
// CATEGORIES CONFIG
// 修改这里来自定义桌面图标
// notion_category 必须和 Notion 数据库 Category 字段的 Select 值完全一致
// ============================================

export const CATEGORIES = [
  {
    id: 'writings',
    label: 'Writings',
    labelCn: '文字',
    notion_category: 'Writings',
    type: 'text',          // 'gallery' | 'flipbook' | 'text'
    icon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="6" width="24" height="28" rx="2" stroke="currentColor" stroke-width="1.5"/>
      <line x1="13" y1="13" x2="27" y2="13" stroke="currentColor" stroke-width="1.2"/>
      <line x1="13" y1="18" x2="27" y2="18" stroke="currentColor" stroke-width="1.2"/>
      <line x1="13" y1="23" x2="22" y2="23" stroke="currentColor" stroke-width="1.2"/>
      <path d="M22 28 L26 24 L28 26 L24 30 L22 28Z" stroke="currentColor" stroke-width="1.2"/>
    </svg>`,
  },
  {
    id: 'images',
    label: 'Images',
    labelCn: '图像',
    notion_category: 'Images',
    type: 'gallery',
    icon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="8" width="28" height="22" rx="2" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="14" cy="16" r="3" stroke="currentColor" stroke-width="1.2"/>
      <path d="M6 26 L14 18 L20 24 L26 19 L34 26" stroke="currentColor" stroke-width="1.2"/>
    </svg>`,
  },
  {
    id: 'documents',
    label: 'Documents',
    labelCn: '文件',
    notion_category: 'Documents',
    type: 'document',
    icon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 6 H25 L32 13 V34 H10 V6Z" stroke="currentColor" stroke-width="1.5"/>
      <path d="M25 6 V13 H32" stroke="currentColor" stroke-width="1.5"/>
      <line x1="15" y1="19" x2="27" y2="19" stroke="currentColor" stroke-width="1.2"/>
      <line x1="15" y1="24" x2="27" y2="24" stroke="currentColor" stroke-width="1.2"/>
    </svg>`,
  },
  {
    id: 'moving',
    label: 'Moving',
    labelCn: '影像',
    notion_category: 'Moving',
    type: 'video',
    icon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="10" width="24" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/>
      <path d="M28 15 L36 11 V27 L28 23 V15Z" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="10" cy="19" r="1.5" fill="currentColor"/>
      <circle cx="16" cy="19" r="1.5" fill="currentColor"/>
    </svg>`,
  },
  {
    id: 'timeline',
    label: 'Timeline',
    labelCn: '时间轴',
    notion_category: null,    // 跨分类汇总，不对应单一 Notion 分类
    type: 'timeline',
    icon: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="4" x2="20" y2="36" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="20" cy="10" r="2.5" stroke="currentColor" stroke-width="1.2"/>
      <line x1="20" y1="10" x2="30" y2="10" stroke="currentColor" stroke-width="1.2"/>
      <circle cx="20" cy="20" r="2.5" stroke="currentColor" stroke-width="1.2"/>
      <line x1="20" y1="20" x2="30" y2="20" stroke="currentColor" stroke-width="1.2"/>
      <circle cx="20" cy="30" r="2.5" stroke="currentColor" stroke-width="1.2"/>
      <line x1="20" y1="30" x2="30" y2="30" stroke="currentColor" stroke-width="1.2"/>
    </svg>`,
  },
];

// ============================================
// MUSIC CONFIG — 网易云外链格式（需在国内网络环境下可用）
// ============================================
export const MUSIC_TRACKS = [
  {
    title: 'Sleepy Lagoon',
    url: 'https://music.163.com/song/media/outer/url?id=5224241.mp3',
    id: 1,
  },
  {
    title: 'Sisyphus',
    url: 'https://music.163.com/song/media/outer/url?id=1342985969.mp3',
    id: 2,
  },
  {
    title: 'Down for You',
    url: 'https://music.163.com/song/media/outer/url?id=26281741.mp3',
    id: 3,
  },
  {
    title: 'Solitude',
    url: 'https://music.163.com/song/media/outer/url?id=1983431370.mp3',
    id: 4,
  },
  {
    title: 'Walk on Water',
    url: 'https://music.163.com/song/media/outer/url?id=406737612.mp3',
    id: 5,
  },
  {
    title: 'Golden Tears',
    url: 'https://music.163.com/song/media/outer/url?id=3312815773.mp3',
    id: 6,
  },
];

// ============================================
// BACKGROUNDS — 按 G 键循环切换（图片 or 视频均可）
// type: 'image' | 'video'
// ============================================
export const BACKGROUNDS = [
  {
    id: 'bg1',
    type: 'image',
    url: 'https://raw.githubusercontent.com/LIXIANGGUO-AI/images/main/Gemini_Generated_Image_7agnv67agnv67agn.png',
  },
  {
    id: 'bg2',
    type: 'image',
    url: 'https://raw.githubusercontent.com/LIXIANGGUO-AI/images/main/Gemini_Generated_Image_cq1olacq1olacq1o.png',
  },
  {
    id: 'bg3',
    type: 'image',
    url: 'https://raw.githubusercontent.com/LIXIANGGUO-AI/images/main/Gemini_Generated_Image_rrxqmmrrxqmmrrxq.png',
  },
  {
    id: 'bg4',
    type: 'image',
    url: 'https://raw.githubusercontent.com/LIXIANGGUO-AI/images/main/Gemini_Generated_Image_rz9r0srz9r0srz9r.png',
  },
  {
    id: 'bg5',
    type: 'image',
    url: 'https://raw.githubusercontent.com/LIXIANGGUO-AI/images/main/Gemini_Generated_Image_455ao9455ao9455a.png',
  },
];

// 兼容旧代码的默认背景（取第一张）
export const BG_IMAGE_URL = BACKGROUNDS[0].url;

// ============================================
// NOTION API CONFIG — 在 .env 文件里设置
// VITE_NOTION_DATABASE_ID=你的数据库ID
// ============================================
