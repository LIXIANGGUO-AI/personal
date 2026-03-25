# The Archive — Digital Museum Portfolio

> 数字博物馆风格个人作品集，多窗口操作系统体验，Notion 数据驱动。

---

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 浏览器打开 http://localhost:5173
```

**默认使用 mock 数据**，不需要配置 Notion 就能看到完整效果。

---

## 项目结构

```
museum/
├── src/
│   ├── components/
│   │   ├── App.jsx           # 根组件，窗口状态管理
│   │   ├── Desktop.jsx       # 桌面图标层
│   │   ├── Window.jsx        # 可拖拽窗口容器
│   │   ├── GalleryView.jsx   # 图片画廊（两列瀑布流 + 灯箱）
│   │   ├── FlipBookView.jsx  # 翻书式文档预览
│   │   ├── TextReader.jsx    # 文字作品阅读器
│   │   └── MusicPlayer.jsx   # 右下角音乐组件
│   ├── hooks/
│   │   └── useNotion.js      # 数据获取 Hook（含缓存）
│   ├── constants/
│   │   └── categories.js     # 图标配置、背景图、音乐 URL
│   ├── data/
│   │   └── mockData.js       # 开发用 mock 数据
│   └── styles/
│       └── global.css        # 全局样式、设计变量
├── api/
│   └── notion.js             # Vercel Serverless Function
├── vercel.json
└── .env.example
```

---

## 个性化配置

### 1. 替换背景图片
打开 `src/constants/categories.js`，修改：
```js
export const BG_IMAGE_URL = '你的图片URL';
```
推荐使用 WebP 格式，宽度 1920px，文件大小控制在 500KB 以内。

### 2. 替换背景音乐
```js
export const MUSIC_URL  = '你的音频URL';  // mp3 或 ogg
export const MUSIC_TITLE = '曲目名称';
```

### 3. 修改作品类别
在 `src/constants/categories.js` 的 `CATEGORIES` 数组里增删条目：
```js
{
  id: 'photography',          // 唯一 ID（英文，无空格）
  label: 'Photography',       // 显示名称
  labelCn: '摄影',             // 中文副标题
  notion_category: 'Photography', // 必须与 Notion Category 字段值一致
  type: 'gallery',            // 'gallery' | 'flipbook' | 'text'
  icon: `<svg>...</svg>`,     // SVG 图标字符串
}
```

---

## 接入 Notion（上线前）

### Step 1 — 创建 Notion Integration
1. 访问 https://notion.so/my-integrations
2. 点击 "+ New integration"
3. 复制生成的 **Internal Integration Secret**

### Step 2 — 创建数据库
在 Notion 中创建一个新数据库，添加以下字段：

| 字段名 | 类型 | 说明 |
|--------|------|------|
| Title | Title（默认） | 作品名 |
| Category | Select | 与 `notion_category` 值对应 |
| Type | Select | image / pdf / text / video |
| Cover | Files & Media | 封面图 |
| Content | Files & Media / URL | 内容文件 |
| Year | Number | 年份 |
| Description | Text | 简介 |
| Featured | Checkbox | 是否置顶 |

### Step 3 — 连接 Integration 到数据库
数据库页面右上角 → `···` → `Connections` → 搜索并添加你的 Integration

### Step 4 — 获取数据库 ID
数据库 URL 格式：
```
https://notion.so/your-workspace/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx?v=...
                                  ↑ 这一段就是 Database ID
```

### Step 5 — 配置环境变量
复制 `.env.example` 为 `.env.local`：
```bash
cp .env.example .env.local
```
填入真实值：
```
NOTION_SECRET=secret_xxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxx
```

### Step 6 — 开启真实数据
打开 `src/hooks/useNotion.js`，将：
```js
const USE_MOCK = true;
```
改为：
```js
const USE_MOCK = false;
```

---

## 部署到 Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录并部署
vercel

# 在 Vercel 项目设置里添加环境变量：
# NOTION_SECRET      = secret_xxx
# NOTION_DATABASE_ID = xxx
```

或直接在 Vercel 网页端：
1. 导入 GitHub 仓库
2. Framework 选 **Vite**
3. 在 Project Settings → Environment Variables 添加两个变量
4. 部署

---

## 技术栈

| 库 | 用途 |
|----|------|
| React 18 | UI 框架 |
| Vite | 构建工具 |
| Framer Motion | 所有动画（窗口淡入、图标悬停） |
| react-rnd | 窗口拖拽与缩放 |
| react-pageflip | 翻书效果 |
| @notionhq/client | Notion API SDK |

---

## 响应式

- **桌面（> 1024px）**：完整多窗口拖拽体验
- **平板（768–1024px）**：窗口可拖拽，尺寸适配
- **手机（< 768px）**：点击图标从底部滑入全屏抽屉，禁用拖拽
