# ReadAny Code Wiki

> 本地优先的电子书阅读器 — 完整代码知识库

---

## 1. 项目概述

### 1.1 产品定位

ReadAny 是一款 **Local-first（本地优先）** 的跨平台电子书阅读器，核心特性包括：

- 📝 **标注与知识管理**：5色高亮、Markdown 笔记、多格式导出（MD/HTML/JSON/Obsidian/Notion）
- 🔊 **TTS（文本转语音）**：多引擎支持（Edge TTS / 浏览器TTS / DashScope 通义千问 / 小米 TTS / OpenAI 兼容接口）
- 📊 **阅读统计**：热力图、趋势图、连续阅读天数、徽章系统、目标追踪
- ☁️ **跨设备同步**：WebDAV / S3 / LAN 三后端，增量同步，冲突自动合并
- 📚 **格式支持**：EPUB · PDF · MOBI · AZW · AZW3 · FB2 · FBZ · CBZ · TXT · UMD
- 🎨 **个性化体验**：5种字体主题（CJK优化）、明暗模式、分页/滚动模式

### 1.2 关键决策记录（2024-06）

> 已移除 AI 功能（对话/RAG/技能/思维导图/向量/翻译），回归"纯粹的阅读工具"定位。已移除的模块包括：core 层 ai/、rag/、translation/ 目录，桌面端、移动端和 CLI 包中的相关代码。

### 1.3 开源协议

GPL-3.0-or-later — 衍生作品须以相同协议开源。

---

## 2. 技术栈总览

| 层级 | 技术 | 版本 |
|------|------|------|
| 语言 | TypeScript, Rust | TS ~5.8, Rust 2021 |
| 运行时 | Node.js 24, pnpm 9.15 | hoisted linker (RN兼容) |
| 桌面端 | Tauri 2 + Vite 7 + React 19 | Radix UI, Zustand |
| 移动端 | Expo 54 + React Native 0.81 | React Navigation, expo-dev-client |
| 文档站 | Astro 7 + Starlight | Tailwind CSS v4 |
| 数据库 | SQLite | Tauri rusqlite / expo-sqlite |
| 阅读器引擎 | foliate-js | 内置本地 fork |
| 代码检查 | Biome 1.9 | ESLint + Prettier 替代 |
| 状态管理 | Zustand 5 | 持久化：FS JSON / SQLite |
| 包管理 | pnpm workspace | patches: react-native-track-player |
| 图标 | Lucide | lucide-react / lucide-react-native |
| React 锁定 | 19.1.0 | pnpm overrides 全局统一 |

---

## 3. 仓库结构与 Monorepo 组织

```
/workspace/
├── packages/                    # pnpm workspace 包
│   ├── app/                     # 桌面端 (Tauri + Vite + React)
│   │   ├── src/                 # 前端源码 (React 组件/页面/Store)
│   │   │   ├── components/      # 通用 UI 组件
│   │   │   ├── hooks/           # 桌面端专用 hooks
│   │   │   ├── lib/             # 平台适配/阅读器/存储等
│   │   │   ├── pages/           # 4个主要页面 (Home/Reader/Notes/Stats)
│   │   │   ├── stores/          # Zustand stores (含本地持久化)
│   │   │   └── styles/
│   │   ├── src-tauri/           # Rust 后端
│   │   │   ├── src/
│   │   │   │   ├── db/          # SQLite schema 初始化
│   │   │   │   ├── sync/        # LAN 同步服务器 + Tauri commands
│   │   │   │   ├── storage.rs   # 数据目录解析
│   │   │   │   └── lib.rs       # Tauri Builder 注册入口
│   │   │   ├── Cargo.toml
│   │   │   └── tauri.conf.json
│   │   └── vite.config.ts
│   │
│   ├── app-expo/                # 移动端 (Expo + React Native)
│   │   ├── src/
│   │   │   ├── components/      # RN 组件 (library/reader/tts/stats/ui 等)
│   │   │   ├── screens/         # 页面 (Library/Reader/Notes/Stats/Settings)
│   │   │   ├── navigation/      # React Navigation (Tab + Stack)
│   │   │   ├── lib/             # 平台适配/阅读器/缓存/TTS 播放器
│   │   │   ├── stores/          # Zustand stores (移动端版本)
│   │   │   ├── hooks/           # 移动端专用 hooks
│   │   │   └── styles/          # ThemeContext + theme 定义
│   │   ├── modules/             # 自定义 Expo Native Modules
│   │   │   ├── system-tts-synthesis/   # iOS 系统 TTS 原生模块
│   │   │   └── volume-key-paging/      # 音量键翻页原生模块
│   │   ├── plugins/             # expo-config-plugins
│   │   ├── assets/reader/       # 打包好的 foliate-js reader.html
│   │   └── app.config.js
│   │
│   ├── core/                    # 核心共享库 (@readany/core)
│   │   └── src/
│   │       ├── types/           # 全局类型定义 (book/annotation/reading/font)
│   │       ├── db/              # 数据库访问层 (SQLite queries + migrations)
│   │       ├── stores/          # 通用 Zustand stores
│   │       ├── hooks/           # 通用 React hooks (含 reader hooks)
│   │       ├── services/        # IPlatformService 平台抽象接口
│   │       ├── sync/            # 同步核心 (3后端 + simple-sync 协议)
│   │       ├── tts/             # TTS 引擎/播放器/文本处理
│   │       ├── stats/           # 阅读统计服务 (报告/徽章/目标/连续天数)
│   │       ├── reader/          # 阅读器相关逻辑 (分页/进度/键盘/TOC)
│   │       ├── epub/            # EPUB 处理 (章节/检查/草稿/导出/TOC/元数据)
│   │       ├── pdf/             # PDF 章节处理
│   │       ├── export/          # 标注/笔记导出 (多格式)
│   │       ├── import/          # WebDAV 导入 + 去重逻辑
│   │       ├── knowledge/       # 全文搜索
│   │       ├── i18n/            # 国际化 (i18next)
│   │       ├── update/          # 应用更新检查
│   │       ├── feedback/        # 反馈服务
│   │       ├── events/          # 事件总线 (library-events)
│   │       └── utils/           # 工具函数 (ID生成/防抖节流/UMD转EPUB等)
│   │
│   ├── cli/                     # CLI 工具 (@readany/cli)
│   │   └── src/
│   │       ├── bin/readany.ts   # CLI 入口
│   │       ├── commands.ts      # 命令实现
│   │       ├── mcp.ts           # MCP 协议支持
│   │       └── skill.ts / tool-registry.ts
│   │
│   ├── feedback-worker/         # Cloudflare Worker 反馈服务
│   │   └── src/index.ts
│   │
│   └── foliate-js/              # 电子书阅读器 JS 引擎 (内置 fork)
│       ├── reader.js            # Reader 主类
│       ├── view.js              # 视图渲染
│       ├── epub.js / pdf.js     # 格式适配器
│       ├── paginator.js         # 分页器
│       ├── tts.js               # 阅读器内 TTS
│       └── reader.html          # 打包好的独立阅读器页面
│
├── website/                     # 官网 & 文档站 (Astro + Starlight)
│   └── src/components/          # Header/Footer/Features/Download 等
│
├── patches/                     # pnpm 补丁
│   └── react-native-track-player@4.1.2.patch
│
├── scripts/                     # 根级脚本
│   ├── bump-version.js          # 版本统一管理
│   └── quick-bump.js
│
├── docs/                        # 设计文档 (验收规格/同步设计/统计设计等)
├── assets/                      # 截图等静态资源
│
├── package.json                 # 根 workspace 配置 (scripts + overrides)
├── pnpm-workspace.yaml          # workspace: packages/* + website
├── biome.json                   # 代码规范 (linter + formatter)
├── tsconfig.json                # 全局 TS 配置 (extends expo/tsconfig.base)
└── AGENTS.md                    # 项目开发规范 (给 AI Agent 的规格)
```

---

## 4. 架构总览：分层设计

```
┌──────────────────────────────────────────────────────────┐
│                     Presentation Layer                    │
│  ┌─────────────────────┐    ┌─────────────────────────┐  │
│  │  Desktop (Tauri UI) │    │  Mobile (Expo RN UI)    │  │
│  │  React + Radix UI   │    │  React Navigation      │  │
│  └──────────┬──────────┘    └────────────┬────────────┘  │
│             │  Platform-specific         │               │
│             │  Hooks / Components /      │               │
│             │  Stores                    │               │
└─────────────┼────────────────────────────┼───────────────┘
              │                            │
┌─────────────▼────────────────────────────▼───────────────┐
│                   Core Layer (@readany/core)              │
│                                                            │
│  ┌─────────┐ ┌──────────┐ ┌────────┐ ┌────────────────┐  │
│  │  Stores │ │  Hooks   │ │  DB    │ │  Sync Engine   │  │
│  │(Zustand)│ │(React)   │ │(SQLite)│ │ 3 Backends     │  │
│  └────┬────┘ └────┬─────┘ └───┬────┘ └───────┬────────┘  │
│       │           │           │              │           │
│  ┌────▼───────────▼───────────▼──────────────▼────────┐  │
│  │              Business Logic Modules                │  │
│  │  TTS / Stats / Reader / EPUB / Export / Import /   │  │
│  │  Knowledge / i18n / Update / Feedback              │  │
│  └───────────────────────┬────────────────────────────┘  │
│                          │                               │
│              ┌───────────▼────────────┐                  │
│              │  IPlatformService      │                  │
│              │  (Platform Abstraction)│                  │
│              └───────────┬────────────┘                  │
└──────────────────────────┼───────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────┐
│                Platform Implementations                  │
│  ┌────────────────────────────┐ ┌──────────────────────┐  │
│  │  TauriPlatformService      │ │  ExpoPlatformService │  │
│  │  (Rust via Tauri plugins)  │ │  (Expo modules)      │  │
│  │  - FS / Dialog / SQL       │ │  - FS / SQLite       │  │
│  │  - HTTP / WebSocket        │ │  - Audio / Speech    │  │
│  │  - LAN Server (axum)       │ │  - Network / Crypto  │  │
│  └────────────────────────────┘ └──────────────────────┘  │
└──────────────────────────────────────────────────────────┘
              │                              │
┌─────────────▼──────────────┐  ┌───────────▼──────────────┐
│     Native (Tauri Rust)    │  │     Native (Expo RN)     │
│  - SQLite (rusqlite)       │  │  - System TTS (Swift)    │
│  - LAN HTTP (axum)         │  │  - Volume Key (Android)  │
│  - File Hash (sha2)        │  │  - Audio Track Player    │
└────────────────────────────┘  └──────────────────────────┘
```

### 4.1 架构核心原则

1. **平台无关核心层**：所有业务逻辑放在 `@readany/core`，通过 `IPlatformService` 抽象接口访问平台能力，核心层绝不直接依赖 Tauri/Expo API。
2. **Local-first**：数据默认存储在本地，同步是附加功能而非必需。
3. **双数据库**：
   - `readany.db`（主库，可同步）：books / highlights / notes / bookmarks / reading_sessions 等
   - `readany_local.db`（本地库，不同步）：向量化 chunks 等本地专属数据
4. **Zustand 双模式持久化**：
   - FS JSON 持久化（settings / tts / goals 等配置）
   - SQLite 持久化（annotation / reading-session 等大量数据）
5. **per-device 同步协议**：每设备写入独立文件，拉取其他设备文件后按时间戳合并（Last-Write-Wins），使用 tombstone 标记删除。

---

## 5. 核心包 @readany/core 详解

### 5.1 模块索引

| 模块目录 | 职责 | 关键导出 |
|---------|------|---------|
| [types/](file:///workspace/packages/core/src/types/) | 全局类型定义 | `Book` / `Highlight` / `Note` / `Bookmark` / `ReadingSession` / `ViewSettings` |
| [db/](file:///workspace/packages/core/src/db/) | 数据库访问层 | `initDatabase()` / `getDB()` / 各领域 CRUD queries / migrations |
| [stores/](file:///workspace/packages/core/src/stores/) | Zustand 状态管理 | `useAppStore` / `useSettingsStore` / `useTTSStore` / `useSyncStore` / `useAnnotationStore` 等 |
| [hooks/](file:///workspace/packages/core/src/hooks/) | React hooks | `useReadingSession` / `useAutoSync` / `useFoliateView` / `usePagination` |
| [services/](file:///workspace/packages/core/src/services/) | 平台抽象 | `IPlatformService` / `setPlatformService()` / `getPlatformService()` |
| [sync/](file:///workspace/packages/core/src/sync/) | 同步引擎 | `ISyncBackend` / `WebDavClient` / `runSimpleSync()` / 3 Backend 实现 |
| [tts/](file:///workspace/packages/core/src/tts/) | TTS 服务 | `EdgeTTSPlayer` / `BrowserTTSPlayer` / `DashScopeTTSPlayer` / 文本分片工具 |
| [stats/](file:///workspace/packages/core/src/stats/) | 阅读统计 | `ReadingStatsService` / `build*Report()` / `evaluateBadges()` / 目标/连续天数 |
| [reader/](file:///workspace/packages/core/src/reader/) | 阅读器逻辑 | `font-themes` / `keyboard shortcuts` / `pagination` / `progress` / `toc` |
| [epub/](file:///workspace/packages/core/src/epub/) | EPUB 处理 | `inspectEpubBytes()` / `createEpubDraft()` / `readEpubChapter*` / TOC / export |
| [pdf/](file:///workspace/packages/core/src/pdf/) | PDF 处理 | PDF 章节提取 |
| [export/](file:///workspace/packages/core/src/export/) | 导出服务 | `AnnotationExporter` / `NotesExporter` / `KnowledgeExporter` |
| [import/](file:///workspace/packages/core/src/import/) | 导入服务 | `WebDavImportService` / 去重逻辑 |
| [knowledge/](file:///workspace/packages/core/src/knowledge/) | 全文检索 | `searchKnowledge()` |
| [i18n/](file:///workspace/packages/core/src/i18n/) | 国际化 | `i18n` (i18next 实例) / `initI18nLanguage()` |
| [update/](file:///workspace/packages/core/src/update/) | 更新检查 | `UpdateChecker` |
| [feedback/](file:///workspace/packages/core/src/feedback/) | 反馈上报 | `FeedbackService` / 日志捕获 |
| [events/](file:///workspace/packages/core/src/events/) | 事件总线 | `onLibraryChanged()` / EventBus |
| [utils/](file:///workspace/packages/core/src/utils/) | 通用工具 | `generateId()` / `cn()` / `debounce()` / `throttle()` / `umd-to-epub` |

### 5.2 类型系统详解

#### Book（书籍）
定义于 [types/book.ts](file:///workspace/packages/core/src/types/book.ts)：
```typescript
interface Book {
  id: string;                    // UUID
  filePath: string;              // 本地文件路径
  format: BookFormat;            // epub|pdf|mobi|azw|azw3|cbz|fb2|fbz|txt|umd
  meta: BookMeta;                // 元数据（title/author/publisher/coverUrl 等）
  groupId?: string;              // 所属分组
  addedAt: number;               // 添加时间戳
  lastOpenedAt?: number;         // 最后打开时间
  updatedAt: number;             // 最后更新时间（同步用）
  deletedAt?: number;            // 软删除标记
  progress: number;              // 0-1 阅读进度
  currentCfi?: string;           // EPUB CFI 或 PDF page-N
  tags: string[];                // 标签
  fileHash?: string;             // 文件哈希（去重用）
  syncStatus: "local"|"remote"|"downloading";
}
```

#### Annotation（标注系统）
定义于 [types/annotation.ts](file:///workspace/packages/core/src/types/annotation.ts)：

| 类型 | 核心字段 | 用途 |
|-----|---------|------|
| `Highlight` | `cfi` (EPUB CFI range), `color` (5色), `text`, `note?` | 文字高亮 |
| `Note` | `title`, `content` (Markdown), `highlightId?`, `tags` | 独立笔记，可关联高亮 |
| `Bookmark` | `cfi`, `label?` | 书签 |

#### Reading Session（阅读会话）
定义于 [types/reading.ts](file:///workspace/packages/core/src/types/reading.ts)：
```typescript
interface ReadingSession {
  id: string;
  bookId: string;
  state: "ACTIVE" | "PAUSED" | "STOPPED";
  startedAt: number;
  endedAt?: number;
  totalActiveTime: number;   // ms，扣除暂停时间
  pagesRead: number;
  charactersRead?: number;
}
```

### 5.3 数据库层（DB）

文件位置：[packages/core/src/db/](file:///workspace/packages/core/src/db/)

#### 核心函数

| 函数 | 文件 | 说明 |
|-----|------|------|
| `initDatabase()` | [db-core.ts](file:///workspace/packages/core/src/db/db-core.ts) | 初始化主库 readany.db |
| `initLocalDatabase()` | db-core.ts | 初始化本地库 readany_local.db |
| `getDB()` | db-core.ts | 获取主库连接（懒加载，WAL/NORMAL PRAGMA） |
| `getLocalDB()` | db-core.ts | 获取本地库连接 |
| `getDeviceId()` | db-core.ts | 获取同步设备 ID（KV 持久化） |
| `nextSyncVersion()` | db-core.ts | 递增同步版本号 |
| `insertTombstone()` | db-core.ts | 写入删除墓碑 |

#### 数据库 Schema（主表）

Schema 同时在两端维护，须保持一致：
- Rust 端：[src-tauri/src/db/schema.rs](file:///workspace/packages/app/src-tauri/src/db/schema.rs)（Tauri 启动时建表）
- TS 端：[core/src/db/migrations.ts](file:///workspace/packages/core/src/db/migrations.ts)（移动端/运行时迁移）

| 表名 | 主键 | 核心列 | 说明 |
|-----|------|-------|------|
| `books` | id | file_path, format, title, author, progress, current_cfi, tags, file_hash, sync_version, last_modified_by | 书籍 |
| `highlights` | id | book_id(FK), cfi, text, color, note, updated_at | 高亮 |
| `notes` | id | book_id(FK), highlight_id, title, content(MD), tags | 笔记 |
| `bookmarks` | id | book_id(FK), cfi, label | 书签 |
| `book_groups` | id | name, sort_order | 分组 |
| `tags` + `book_tags` | id | 标签名 / 多对多 | 标签系统 |
| `reading_sessions` | id | book_id, started_at, ended_at, total_active_time, pages_read | 阅读会话 |
| `threads` / `messages` | id | AI对话线程/消息（保留表，已停用） | |
| `chunks` | id | book_id, chapter_index, content, embedding | 向量化 chunk（本地库） |
| `sync_tombstones` | (id, table_name) | deleted_at, device_id | 删除墓碑 |
| `sync_metadata` | key | value | 同步元数据 KV |

**同步表清单**（见 [simple-sync.ts](file:///workspace/packages/core/src/sync/simple-sync.ts) L46-L64）：
book_groups, books, highlights, notes, bookmarks, threads, messages, skills, tags, book_tags, reading_sessions。每表含 `sync_version` (递增) 和 `last_modified_by` (设备ID) 两列。

#### 查询模块

| 查询文件 | 内容 |
|---------|------|
| [book-queries.ts](file:///workspace/packages/core/src/db/book-queries.ts) | `getBooks()` / `getBook()` / `insertBook()` / `updateBook()` / `deleteBook()` / 去重查询 |
| [highlight-queries.ts](file:///workspace/packages/core/src/db/highlight-queries.ts) | `getHighlights()` / `getAllHighlightsWithBooks()` / `getHighlightStats()` + CRUD |
| [note-queries.ts](file:///workspace/packages/core/src/db/note-queries.ts) | `getNotes()` / `getAllNotes()` + CRUD |
| [bookmark-queries.ts](file:///workspace/packages/core/src/db/bookmark-queries.ts) | `getBookmarks()` + CRUD |
| [group-queries.ts](file:///workspace/packages/core/src/db/group-queries.ts) | 分组 CRUD |
| [session-queries.ts](file:///workspace/packages/core/src/db/session-queries.ts) | 会话 CRUD + 日期范围查询 |

### 5.4 状态管理（Zustand Stores）

所有 stores 定义于 [core/src/stores/](file:///workspace/packages/core/src/stores/)，并由桌面/移动端覆盖扩展本地 store。

| Store | 持久化方式 | 说明 | 关键状态/动作 |
|-------|-----------|------|--------------|
| `useAppStore` | 无 | 全局 UI 状态 | `tabs[]`, `activeTabId`, `addTab()`, `sidebarTab`, `settingsTab` |
| `useSettingsStore` | FS JSON | 应用设置 | `ReadSettings` (字体/分页/主题), 语言, 同步配置 |
| `useTTSStore` | FS JSON | TTS 状态 | `playState`, `currentVoice`, `profiles[]`, `play()/pause()/stop()` |
| `useSyncStore` | FS JSON | 同步状态 | `config`, `status`, `lastSyncAt`, `triggerSync()` |
| `useGoalsStore` | FS JSON | 阅读目标 | `dailyGoalMinutes`, `streak` |
| `useReaderStore` | 无 | 阅读器状态 | 打开的书籍, CFI, TOC |
| `useNotebookStore` | 无 | 笔记编辑器状态 | 待保存笔记草稿 |
| `useFontStore` | FS + 文件 | 自定义字体 | 字体文件管理, `@font-face` CSS 生成 |
| `useAnnotationStore` | SQLite | 标注数据 | highlights/notes/bookmarks, 统计 |
| `useReadingSessionStore` | SQLite | 阅读会话 | 当前会话, 开始/暂停/结束 |

持久化工具：[stores/persist.ts](file:///workspace/packages/core/src/stores/persist.ts) — 提供 `withPersist()` 包装器 + `debouncedSave()` / `flushAllWrites()`，窗口 `beforeunload` 时确保落盘。

### 5.5 平台抽象层 IPlatformService

定义于 [services/platform.ts](file:///workspace/packages/core/src/services/platform.ts)。这是核心层与具体平台之间的**唯一耦合点**。

```typescript
interface IPlatformService {
  // 平台标识
  readonly platformType: "desktop" | "mobile" | "web";

  // 文件系统 (核心)
  readFile(path: string): Promise<Uint8Array>;
  writeFile(path: string, data: Uint8Array): Promise<void>;
  readTextFile / writeTextFile / mkdir / exists / deleteFile;
  getDataDir(): Promise<string>;   // 用户数据根目录 (桌面可配置)
  getAppDataDir(): Promise<string>; // 系统 app 目录 (仅启动配置)
  convertFileSrc(path: string): string;

  // 文件选择
  pickFile(options?: FilePickerOptions): Promise<string | string[] | null>;

  // 数据库
  loadDatabase(path: string): Promise<IDatabase>;

  // 网络 (支持自定义 headers + 不安全证书 + 进度回调)
  fetch(url: string, options?: FetchOptions): Promise<Response>;
  downloadFile? / uploadFile? / createWebSocket?

  // 应用
  getAppVersion(): Promise<string>;
  checkUpdate?(): Promise<UpdateInfo | null>;
  installUpdate?(): Promise<void>;

  // KV 存储
  kvGetItem / kvSetItem / kvRemoveItem / kvGetAllKeys;

  // 剪贴板
  copyToClipboard(content: string): Promise<void>;

  // 文件分享/保存
  shareOrDownloadFile(content, filename, mimeType): Promise<string | null>;

  // LAN 同步
  isOnWifi? / getLocalIP? / startLANServer? / stopLANServer?;
}
```

**使用流程**：应用启动时必须先调用 `setPlatformService(impl)` 注册具体实现，核心代码通过 `getPlatformService()` 获取实例。

### 5.6 同步引擎详解

模块：[core/src/sync/](file:///workspace/packages/core/src/sync/)

#### 三后端架构

| 后端 | 实现文件 | 说明 |
|-----|---------|------|
| **WebDAV** | [webdav-backend.ts](file:///workspace/packages/core/src/sync/webdav-backend.ts), [webdav-client.ts](file:///workspace/packages/core/src/sync/webdav-client.ts) | 最常用；基于 HTTP PROPFIND/PUT/GET/MOVE，支持自定义路径、不安全证书、WiFi-only |
| **S3** | [s3-backend.ts](file:///workspace/packages/core/src/sync/s3-backend.ts) | 兼容 S3 的对象存储（使用 `@aws-sdk/client-s3`） |
| **LAN** | [lan-backend.ts](file:///workspace/packages/core/src/sync/lan-backend.ts), [lan-server.ts](file:///workspace/packages/core/src/sync/lan-server.ts) | 局域网 HTTP 服务器；桌面端用 Rust axum 实现，移动端作为客户端连接 |

统一接口：[ISyncBackend](file:///workspace/packages/core/src/sync/sync-backend.ts)（testConnection / ensureDirectories / put / get / listDir / delete / move / getJSON / putJSON）。

后端工厂：`sync-backend-factory.ts` — 根据 `SyncConfig.type` 构造对应实例。

#### Simple-Sync 协议

核心逻辑位于 [simple-sync.ts](file:///workspace/packages/core/src/sync/simple-sync.ts)。

**设计要点**（防止写冲突）：
1. **per-device 独立文件**：每台设备写入 `/readany/sync/device-{deviceId}.json`，不存在并发写同一文件问题。
2. **index.json**：全局索引，记录各设备文件的时间戳。
3. **Pull-then-Push**：
   - Pull：下载所有其他设备文件 → 按 `updated_at` 时间戳合并（Last-Write-Wins）→ 应用到本地 DB
   - Push：收集本地 `sync_version` 大于上次同步版本的变更 → 写入本设备 JSON → 更新 index
4. **Tombstones**：删除操作记录在 `sync_tombstones` 表（id + table_name + deleted_at + device_id），不会真的从同步文件中消失。
5. **Files sync**：书籍文件和封面通过 `sync-files.ts` 独立传输（支持并行限速 `parallelLimit`）。

**SyncAdapter**：[sync-adapter.ts](file:///workspace/packages/core/src/sync/sync-adapter.ts) 是平台适配接口，桌面端 [DesktopSyncAdapter](file:///workspace/packages/app/src/lib/sync/sync-adapter-desktop.ts) 和移动端 [MobileSyncAdapter](file:///workspace/packages/app-expo/src/lib/sync/sync-adapter-mobile.ts) 分别提供数据库路径、文件路径等平台专属信息。

**自动同步**：`hooks/use-auto-sync.ts` — 按配置的 `syncIntervalMins` 定时触发，支持 `wifiOnly` 检查。

### 5.7 TTS 系统

模块：[core/src/tts/](file:///workspace/packages/core/src/tts/)

#### 播放器实现（5种）

| Player | 文件 | 原理 | 特性 |
|--------|------|------|------|
| `EdgeTTSPlayer` | [tts-players.ts](file:///workspace/packages/core/src/tts/tts-players.ts) | 调用微软 Edge TTS 免费接口 | 100+ 多语言音色，MP3 流 |
| `BrowserTTSPlayer` | tts-players.ts | Web Speech API `speechSynthesis` | 零依赖，离线可用，质量较低 |
| `DashScopeTTSPlayer` | tts-players.ts | 阿里 DashScope (通义千问) API | 中文效果好，需 API Key |
| `XiaomiTTSPlayer` | tts-players.ts | 小米小爱 TTS HTTP 接口 | |
| `OpenAICompatibleTTSPlayer` | tts-players.ts | OpenAI TTS 兼容协议 | 通用适配 |

#### 移动端额外播放器

移动端使用 `react-native-track-player` 做后台播控，额外实现：
- `TrackPlayerSystemPlayer`（iOS 系统原生 TTS）
- `TrackPlayerEdgePlayer` / `TrackPlayerDashscopePlayer`（云端 TTS + TrackPlayer 播控）
- `ExpoSpeechPlayer`（Expo Speech 封装）
位于：[app-expo/src/lib/platform/](file:///workspace/packages/app-expo/src/lib/platform/)

#### 文本处理流水线

[text-utils.ts](file:///workspace/packages/core/src/tts/text-utils.ts)：
- `splitIntoChunks(text, maxLen)` — 按句子/段落切分为适合 TTS 的片段
- `cleanText()` — 清理脚注标记、HTML 残留
- `shouldSkipTTSNode()` — 判定 DOM 节点是否应跳过（页码、装饰符等）

[playback-cursor.ts](file:///workspace/packages/core/src/tts/playback-cursor.ts) — 维护当前播放位置与文本高亮同步。

[respeak.ts](file:///workspace/packages/core/src/tts/respeak.ts) — 参数变化（音色/语速）时重新朗读当前片段（防抖 500ms）。

### 5.8 阅读统计系统

模块：[core/src/stats/](file:///workspace/packages/core/src/stats/)

#### 核心服务

| 服务 | 文件 | 说明 |
|-----|------|------|
| `ReadingStatsService` | [reading-stats.ts](file:///workspace/packages/core/src/stats/reading-stats.ts) | 从 reading_sessions 聚合成统计数据 |
| `ReadingReportsService` | [reports-service.ts](file:///workspace/packages/core/src/stats/reports-service.ts) | 周期性报告生成（缓存 + 刷新策略） |

#### 报告构建器

[report-builder.ts](file:///workspace/packages/core/src/stats/report-builder.ts)：
- `buildDayReport(date)` — 日报
- `buildWeekReport(weekKey)` — 周报
- `buildMonthReport(monthKey)` — 月报
- `buildYearReport(year)` — 年报
- `buildLifetimeReport()` — 终生汇总
- `buildStatsSummary()` — 总览卡片
- `buildTopBooksFromFacts()` — 书籍排行
- `buildPeriodComparison()` — 环比对比

#### 成就系统

[badges.ts](file:///workspace/packages/core/src/stats/badges.ts) — 定义所有徽章：
- 分类 `BADGE_CATEGORIES`：阅读量 / 连续天数 / 书籍完成 / 标注 / TTS
- 徽章等级 `BadgeTier`：bronze / silver / gold / platinum
- 函数 `evaluateBadges(allFacts)` → `EarnedBadge[]`

#### 目标与连续天数

- [goals-service.ts](file:///workspace/packages/core/src/stats/goals-service.ts) — 每日阅读时长/页数目标进度计算
- [streak-service.ts](file:///workspace/packages/core/src/stats/streak-service.ts) — 连续阅读天数判定（含今日状态）
- [eta-service.ts](file:///workspace/packages/core/src/stats/eta-service.ts) — 书籍预计读完时间

#### 实时数据合并

- `live-facts.ts` — 将当前进行中的会话（未落盘）合并入每日 facts，UI 实时显示
- `live-reading-stats.ts` — 合并入 overall/book 统计视图

### 5.9 国际化（i18n）

基于 `i18next` + `react-i18next`：
- 入口：[core/src/i18n/index.ts](file:///workspace/packages/core/src/i18n/index.ts)
- `initI18nLanguage()` — 从 KV 读取用户设置的语言，回退系统语言，默认中文
- `changeAndPersistLanguage(lang)` — 切换并持久化

---

## 6. 桌面端架构详解（Tauri + React）

包路径：[packages/app/](file:///workspace/packages/app/)

### 6.1 前端结构

| 目录 | 说明 |
|-----|------|
| [src/pages/](file:///workspace/packages/app/src/pages/) | 4 个主页面组件 |
| | `Home.tsx` — 书库首页 |
| | `Reader.tsx` — 阅读器（iframe 加载 foliate-js reader.html） |
| | `Notes.tsx` — 标注/笔记管理 |
| | `Stats.tsx` — 阅读统计展示（D3 图表） |
| [src/components/](file:///workspace/packages/app/src/components/) | 共享 UI 组件 (layout, tts 等) |
| [src/stores/](file:///workspace/packages/app/src/stores/) | 桌面端扩展 stores |
| | `library-store.ts` — 书库列表 (内存 + DB) |
| | 其他：annotation-store / reader-store / tts-store / sync-store 等 |
| [src/lib/](file:///workspace/packages/app/src/lib/) | 平台适配层 |
| | `platform/tauri-platform-service.ts` — `IPlatformService` 的 Tauri 实现 |
| | `reader/` — 阅读器 iframe 桥接、文档加载、分页、字体主题 |
| | `sync/sync-adapter-desktop.ts` — 桌面同步适配器 |
| | `tts/` — 系统音色枚举、TTS 预览 |
| | `storage/desktop-library-root.ts` — 桌面可配置书库根目录迁移 |
| | `db/database.ts` — 前端 SQL schema & migrations (Tauri SQL plugin) |
| | `ruby/` — 拼音注音注入服务 |

### 6.2 启动流程

入口链：[index.html](file:///workspace/packages/app/index.html) → [main.tsx](file:///workspace/packages/app/src/main.tsx) → [App.tsx](file:///workspace/packages/app/src/App.tsx)

`main.tsx` 启动步骤：
1. 安装反馈日志捕获 `installFeedbackLogCapture()`
2. 设置反馈 Worker URL
3. **注册 TauriPlatformService** → `setPlatformService()`
4. 迁移历史桌面数据根目录配置
5. 初始化 i18n、恢复主题（localStorage：sepia/light/dark/system）
6. 注册 `beforeunload` → `flushAllWrites()` 确保状态持久化
7. 初始化数据库 → `useLibraryStore.loadBooks()` 加载书库
8. 订阅 `onLibraryChanged` 事件 → 刷新书库
9. 预加载 foliate-js 核心模块（缓存）
10. `<StrictMode>` 渲染 `<App />`

`App.tsx`：
- 模块加载时 `setSyncAdapter(new DesktopSyncAdapter())`
- `useAutoSync()` 启动自动同步定时器
- 渲染 `<AppLayout />` + `<Toaster />` + `<UpdateNotification />`

### 6.3 Rust 后端

入口：[src-tauri/src/lib.rs](file:///workspace/packages/app/src-tauri/src/lib.rs)

#### Tauri 插件注册

```rust
tauri::Builder::default()
  .plugin(tauri_plugin_single_instance::init(...))   // 单实例
  .plugin(tauri_plugin_opener::init())                // 打开外部链接
  .plugin(tauri_plugin_sql::Builder::new().build())   // SQLite
  .plugin(tauri_plugin_fs::init())                    // 文件系统
  .plugin(tauri_plugin_dialog::init())                // 文件对话框
  .plugin(tauri_plugin_updater::Builder::new().build()) // 更新
  .plugin(tauri_plugin_process::init())               // 进程
  .plugin(tauri_plugin_http::init())                  // HTTP (dangerous-settings)
  .plugin(tauri_plugin_websocket::init())             // WebSocket
  .plugin(tauri_plugin_window_state::Builder::new().build()) // 窗口状态记忆
```

#### 自定义 Tauri Commands

```rust
.invoke_handler(tauri::generate_handler![
    sync::commands::sync_vacuum_into,     // 数据库真空压缩（导入用）
    sync::commands::sync_integrity_check, // 数据完整性检查
    sync::commands::sync_hash_file,       // 文件 SHA-256 哈希
    sync::commands::get_local_ip,         // 本机 LAN IP
    sync::lan_server::start_lan_server,   // 启动 LAN 同步 HTTP 服务器 (axum)
    sync::lan_server::stop_lan_server,
    sync::lan_server::lan_server_respond, // 自定义响应缓冲
    readany_cli::readany_cli_run,         // CLI 子命令执行入口
])
```

#### 启动 setup 钩子

1. Windows/Linux 下禁用系统窗口装饰（自定义标题栏）
2. **同步初始化 SQLite 数据库**（Rust 端 rusqlite 执行 schema + 迁移）
3. 初始化 LAN 服务器全局状态

#### Rust 模块

| 文件 | 职责 |
|-----|------|
| [db/schema.rs](file:///workspace/packages/app/src-tauri/src/db/schema.rs) | SQLite schema 建表 + 迁移（Migration 1-7） |
| [sync/lan_server.rs](file:///workspace/packages/app/src-tauri/src/sync/lan_server.rs) | axum HTTP 服务器：上传/下载/列目录/删除 + CORS |
| [sync/commands.rs](file:///workspace/packages/app/src-tauri/src/sync/commands.rs) | 同步相关 Tauri commands |
| [storage.rs](file:///workspace/packages/app/src-tauri/src/storage.rs) | 解析数据目录（app_data_dir） |
| [readany_cli.rs](file:///workspace/packages/app/src-tauri/src/readany_cli.rs) | CLI 命令代理执行 |

### 6.4 阅读器渲染架构

桌面端 Reader 页面采用 **iframe 隔离** 方案：
1. `foliate-js/reader.html` 是一个完整独立页面（含阅读器全部逻辑）
2. React 端通过 iframe 加载该页面
3. 通过 `postMessage` + `iframe-event-handlers.ts` 桥接双向通信：
   - React → iframe：打开书籍、跳转 CFI、设置字体/主题、触发搜索
   - iframe → React：高亮选中、翻页进度、CFI 变化、TTS 需求
4. 关键文件：
   - [lib/reader/document-loader.ts](file:///workspace/packages/app/src/lib/reader/document-loader.ts) — 书籍文件加载注入
   - [lib/reader/iframe-event-handlers.ts](file:///workspace/packages/app/src/lib/reader/iframe-event-handlers.ts) — 事件桥接
   - [lib/reader/progress.ts](file:///workspace/packages/app/src/lib/reader/progress.ts) — 阅读进度计算与持久化

---

## 7. 移动端架构详解（Expo + React Native）

包路径：[packages/app-expo/](file:///workspace/packages/app-expo/)

### 7.1 与桌面端的差异

| 维度 | 桌面端 (Tauri) | 移动端 (Expo) |
|-----|---------------|---------------|
| UI 框架 | React + Radix UI (Web) | React Native + React Navigation |
| 导航 | Tab 单页切换 (CSS display) | Bottom Tabs + Native Stack |
| 阅读器 | iframe 加载 reader.html | WebView 加载 reader.html + 本地静态服务器 |
| 文件系统 | Tauri FS plugin (本地磁盘) | expo-file-system (app 沙盒) |
| 数据库 | Tauri SQL plugin (rusqlite) | expo-sqlite |
| TTS 播放 | HTML Audio / Web Speech | react-native-track-player (后台播控) + Expo AV + 原生模块 |
| 包管理补丁 | 无 | react-native-track-player (唯一 patch) |
| 原生代码 | Rust (src-tauri) | Swift + Gradle (modules/ + prebuild) |

### 7.2 启动流程

入口：[index.js](file:///workspace/packages/app-expo/index.js) → [App.tsx](file:///workspace/packages/app-expo/src/App.tsx)

`App.tsx` bootstrap 步骤：
1. Polyfill `AbortSignal.throwIfAborted` + `navigator.userAgent`（Hermes 缺失）
2. 安装反馈日志捕获
3. `SplashScreen.preventAutoHideAsync()` 保持原生启动屏
4. `useEffect` 异步 bootstrap：
   - 构造并注册 **ExpoPlatformService**
   - 注册 **MobileSyncAdapter**
   - `initDatabase()`（expo-sqlite）
   - 等 i18n 就绪 → `initI18nLanguage()`
   - 注册 RN 专属 `rnSessionEventSource`（阅读会话中断检测）
   - 配置 Audio 模式（后台播放 + 静默模式可播）
   - `TrackPlayer.setupPlayer()` + 配置通知栏能力（播放/暂停/上下曲）
   - 注册 TrackPlayer Remote 事件 → 桥接到 TTS Store（play/pause/stop/next/prev）
5. 隐藏原生启动屏，显示 React Native `<AnimatedSplash>` 自定义过渡动画
6. 嵌套结构：`<I18nextProvider>` → `<ThemeProvider>` → `AppInner`
7. `AppInner`：`NavigationContainer` + `RootNavigator` + `UpdateDialog` + `FloatingTTSBubble`

### 7.3 原生模块 (Expo Native Modules)

位于 [modules/](file:///workspace/packages/app-expo/modules/) 目录，通过 `expo-module.config.json` 注册。

| 模块 | 平台 | 说明 |
|-----|------|------|
| **system-tts-synthesis** | iOS (Swift) | `AVSpeechSynthesizer` 封装，提供更稳定的系统 TTS 播放，解决 expo-speech 在长文本/后台场景的问题 |
| **volume-key-paging** | Android (Kotlin) | 监听硬件音量键按下事件，实现音量键翻页（阅读器中可启用） |

配置插件：[plugins/withVolumeKeyPaging.js](file:///workspace/packages/app-expo/plugins/withVolumeKeyPaging.js) — expo prebuild 时注入 AndroidManifest 配置。

### 7.4 阅读器：本地 HTTP 服务器 + WebView

移动端不能直接 file:// 加载本地 HTML，因此使用 **本地静态服务器** 方案：
1. `@dr.pogodin/react-native-static-server` 在 `assets/reader/` 目录启动 HTTP 服务器
2. React Native WebView 加载 `http://localhost:{port}/reader.html`
3. 通过 WebView `injectJavaScript` + `onMessage` 桥接双向通信（等价桌面端 postMessage）
4. 关键文件：
   - [lib/reader/local-file-server.ts](file:///workspace/packages/app-expo/src/lib/reader/local-file-server.ts) — 本地服务器启动
   - [hooks/use-reader-bridge.ts](file:///workspace/packages/app-expo/src/hooks/use-reader-bridge.ts) — 桥接 hook
   - `scripts/build-reader.js` — 构建时把 foliate-js reader.html 打包到 assets/reader

### 7.5 导航结构

[navigation/RootNavigator.tsx](file:///workspace/packages/app-expo/src/navigation/RootNavigator.tsx)：
```
Native Stack Root
├── (Tab Navigator) — [navigation/TabNavigator.tsx]
│   ├── LibraryScreen    — 书库 (分组/标签/搜索/导入)
│   ├── ReaderScreen     — 阅读器（栈内推入）
│   ├── NotesScreen      — 标注/笔记列表
│   ├── StatsScreen      — 阅读统计
│   └── ProfileScreen    — 设置/关于/外观/字体/TTS/同步
├── Onboarding (首次启动向导)
├── BookDetailsScreen
├── ReaderScreen (全屏阅读器)
├── ReaderNoteViewModal
├── ReaderSettingsPanel (模态面板)
├── ReaderTOCPanel
├── BadgesScreen
├── FullScreenNotesScreen
├── NotesView
├── Settings 子页面栈
│   ├── AboutScreen
│   ├── AppearanceSettingsScreen
│   ├── FontSettingsScreen
│   ├── TTSSettingsScreen
│   ├── SyncSettingsScreen
│   └── Feedback 相关
```

### 7.6 TTS 后台播放

移动端 TTS 需要 **系统级后台音频** 能力，采用 `react-native-track-player`：
1. 把 TTS 音频片段（或占位静音片段）加入 TrackPlayer 队列
2. TrackPlayer 维护前台通知栏播放控制
3. 远程按钮事件（耳机/通知栏/锁屏）→ TTS Store 桥接 → 控制播放状态
4. `services/PlaybackService.ts` — TrackPlayer 播放服务注册
5. `lib/platform/track-player-*.ts` — 各 TTS 引擎专属 player 实现

### 7.7 主题系统

文件：[styles/ThemeContext.tsx](file:///workspace/packages/app-expo/src/styles/ThemeContext.tsx), [theme.ts](file:///workspace/packages/app-expo/src/styles/theme.ts)

提供 `ThemeProvider` + `useTheme()` hook，支持 light/dark/sepia 3模式 + 动态配色方案（background/card/foreground/border/primary 等 tokens）。

---

## 8. foliate-js 阅读器引擎

路径：[packages/foliate-js/](file:///workspace/packages/foliate-js/)（基于 johnfactotum/foliate-js 的内置 fork）

### 8.1 核心文件

| 文件 | 职责 |
|-----|------|
| [reader.js](file:///workspace/packages/foliate-js/reader.js) | **Reader 主类** — 协调 View + 格式适配器 + 状态管理 |
| [view.js](file:///workspace/packages/foliate-js/view.js) | 视图渲染 — 内容加载、CSS 注入、滚动/翻页交互 |
| [paginator.js](file:///workspace/packages/foliate-js/paginator.js) | 分页算法 — 将连续流内容切分为固定大小页 |
| [epub.js](file:///workspace/packages/foliate-js/epub.js) | EPUB 格式适配器 — 解析 OPF/Manifest/Spine, 渲染 XHTML |
| [pdf.js](file:///workspace/packages/foliate-js/pdf.js) | PDF 格式适配器 — 基于 pdfjs-dist |
| [mobi.js](file:///workspace/packages/foliate-js/mobi.js) | MOBI/AZW/AZW3 适配器 |
| [fb2.js](file:///workspace/packages/foliate-js/fb2.js) | FB2/FBZ FictionBook 适配器 |
| [comic-book.js](file:///workspace/packages/foliate-js/comic-book.js) | CBZ 漫画适配器 |
| [epubcfi.js](file:///workspace/packages/foliate-js/epubcfi.js) | EPUB CFI 解析与生成（定位、高亮锚点） |
| [tts.js](file:///workspace/packages/foliate-js/tts.js) | 阅读器内嵌 TTS 模块 |
| [search.js](file:///workspace/packages/foliate-js/search.js) | 书籍内全文搜索 |
| [footnotes.js](file:///workspace/packages/foliate-js/footnotes.js) | 脚注处理 |
| [text-walker.js](file:///workspace/packages/foliate-js/text-walker.js) | DOM 文本遍历器（用于 TTS 分段） |
| [progress.js](file:///workspace/packages/foliate-js/progress.js) | 位置→进度映射 |
| [fixed-layout.js](file:///workspace/packages/foliate-js/fixed-layout.js) | 固定版面（PDF/CBZ）缩放处理 |
| [overlayer.js](file:///workspace/packages/foliate-js/overlayer.js) | 高亮覆盖层 |
| [opds.js](file:///workspace/packages/foliate-js/opds.js) | OPDS 目录协议 |
| [dict.js](file:///workspace/packages/foliate-js/dict.js) | 字典协议 (dictd/StarDICT) |
| [reader.html](file:///workspace/packages/foliate-js/reader.html) | **打包好的独立阅读器页面**（桌面端 iframe / 移动端 WebView 直接加载） |

### 8.2 打包

`rollup.config.js` + `scripts/build` — 打包成浏览器可直接运行的单文件。移动端 `pnpm build:reader` 会把 reader.html 复制到 `app-expo/assets/reader/`。

---

## 9. CLI 工具 (@readany/cli)

路径：[packages/cli/](file:///workspace/packages/cli/)

CLI 为 ReadAny 提供脚本化操作能力，包括 MCP（Model Context Protocol）服务器模式。

### 9.1 命令清单

定义于 [src/commands.ts](file:///workspace/packages/cli/src/commands.ts)：

| 命令 | 说明 |
|-----|------|
| `readany doctor` | 环境诊断（检查 Node/pnpm/Rust 版本、依赖完整性） |
| `readany install` | 安装/初始化 (pnpm install + 配置检查) |
| `readany profiles` | 用户配置档案管理 |
| `readany skill` | 技能管理 |
| `readany mcp` | 以 MCP 服务器模式启动，stdio 传输 |
| `readany build` | 构建产物打包检查 |
| `readany version` | 版本信息 |
| `readany data` | 数据路径与大小查询 |

### 9.2 脚本工具链 (scripts/)

`scripts/` 目录包含多套验收/发布流程脚本（agent-acceptance, release-preflight, build, 等），使用 Node ESM (esbuild) 直接运行。

---

## 10. 文档站 (Astro + Starlight)

路径：[website/](file:///workspace/website/)

基于 Astro 7 + Starlight 主题 + Tailwind CSS v4。

| 组件 | 文件 | 说明 |
|-----|------|------|
| Header | [Header.astro](file:///workspace/website/src/components/Header.astro) | 顶部导航 |
| Hero / Features | [FeatureShowcase.astro](file:///workspace/website/src/components/FeatureShowcase.astro), [Features.astro](file:///workspace/website/src/components/Features.astro) | 特性展示 |
| Download | [Download.astro](file:///workspace/website/src/components/Download.astro) | 下载按钮（各平台版本链接） |
| FAQ | [FAQ.astro](file:///workspace/website/src/components/FAQ.astro) | 常见问题 |
| Community | [Community.astro](file:///workspace/website/src/components/Community.astro) | 社群链接 |
| Footer | [Footer.astro](file:///workspace/website/src/components/Footer.astro) | 页脚 |

部署：GitHub Pages（`.github/workflows/website.yml`）。

---

## 11. 反馈 Worker

路径：[packages/feedback-worker/](file:///workspace/packages/feedback-worker/)

Cloudflare Worker，负责接收客户端上报的用户反馈与日志。
- 入口：[src/index.ts](file:///workspace/packages/feedback-worker/src/index.ts)
- 部署：`.github/workflows/deploy-worker.yml`
- 客户端配置：默认 URL `https://feedback.readany.top`，可通过 `VITE_FEEDBACK_WORKER_URL` / `EXPO_PUBLIC_FEEDBACK_WORKER_URL` 环境变量覆盖

---

## 12. 关键依赖与依赖关系

### 12.1 包依赖图（简化）

```
                     ┌───────────────────┐
                     │    @readany/core   │
                     │ (business logic)   │
                     └────┬───────┬───────┘
                          │       │ depends on (peer: react 19)
                          │       │
              ┌───────────▼──┐   ┌▼───────────────┐
              │   packages/   │   │   packages/     │
              │   app         │   │   app-expo      │
              │  (Tauri)      │   │  (Expo RN)      │
              └────┬──────────┘   └────┬───────────┘
                   │ workspace:*        │ workspace:*
                   ▼                    ▼
              foliate-js            foliate-js
              (reader engine)       (reader engine)

        packages/cli ──workspace:*──▶ @readany/core
        feedback-worker (独立)
        website (独立)
```

### 12.2 核心运行时依赖

| 依赖 | 用途 | 使用包 |
|-----|------|--------|
| `zustand@^5` | 状态管理 | core, app, app-expo |
| `i18next` + `react-i18next` | 国际化 | core, app, app-expo |
| `zod@^4` | 数据校验 | core |
| `@aws-sdk/client-s3` | S3 同步后端 | core, app-expo |
| `pdfjs-dist` | PDF 渲染 | core, app, app-expo |
| `@zip.js/zip.js` | EPUB/ZIP 解析 | core, app, app-expo |
| `@xmldom/xmldom` | XML/DOM 解析 | core |
| `clsx` + `tailwind-merge` | className 合并 | core, app |
| `tauri-apps/*` (9个 plugin) | 桌面端原生能力 | app |
| `@radix-ui/*` (13个包) | 无障碍 Web UI 组件 | app |
| `@tiptap/*` (6个包) | Markdown 富文本编辑器 | app |
| `react-router@^7` | 桌面端路由（轻量） | app |
| `d3` / `d3-scale` / `d3-shape` | 统计图表 | app |
| `driver.js` | 新功能向导高亮 | app |
| `markmap-lib` + `markmap-view` | 思维导图（保留） | app |
| `react-window` | 长列表虚拟化 | app |
| `react-markdown` + `remark-gfm` + `rehype-highlight` | Markdown 渲染 | app |
| `sonner` | Toast 消息 | app |
| `expo@~54` (20+ expo-* 包) | Expo SDK 全套能力 | app-expo |
| `@react-navigation/*` (3包) | RN 导航 | app-expo |
| `react-native-track-player@4.1.2` (+patch) | 后台音频播控 | app-expo |
| `react-native-webview` | 阅读器 WebView | app-expo |
| `react-native-reanimated` / `react-native-svg` / `react-native-gesture-handler` | RN 动画/手势/SVG | app-expo |
| `lucide-react` / `lucide-react-native` | 图标库 | app / app-expo |

### 12.3 开发依赖

| 依赖 | 用途 |
|-----|------|
| `typescript ~5.8/5.9` | 类型系统 |
| `vite ^7` + `@vitejs/plugin-react` | 桌面端构建工具 |
| `vitest ^4` | 单元测试 (core + cli) |
| `@biomejs/biome ^1.9` | Lint + Format (全仓统一) |
| `esbuild ^0.28` | CLI 打包构建 |
| `tailwindcss ^4` + `@tailwindcss/vite` | 样式框架 v4 (无 config) |
| `@tauri-apps/cli ^2.10` | Tauri CLI (构建/开发) |
| `eas-cli ^18` | Expo EAS 云构建 |
| `astro ^7` + `@astrojs/starlight` | 文档站构建 |
| Rust: `tauri`, `rusqlite`, `axum`, `tokio`, `anyhow`, `serde`, `sha2`, `dashmap`, `uuid`, `base64` | Tauri 后端依赖 |

### 12.4 pnpm Overrides & Patches

```jsonc
// package.json
"pnpm": {
  "overrides": {
    "react": "19.1.0",         // 全局 React 锁定
    "react-dom": "19.1.0",
    "@types/react": "19.1.17"
  },
  "patchedDependencies": {
    "react-native-track-player@4.1.2": "patches/react-native-track-player@4.1.2.patch"
  }
}
```

**仅一个补丁**：`react-native-track-player` 解决 RN 0.81 新架构兼容问题。

---

## 13. 项目运行方式

### 13.1 环境要求

| 工具 | 最低版本 | 备注 |
|-----|---------|------|
| Node.js | ≥18 (推荐 24) | |
| pnpm | ≥9.15 | `npm i -g pnpm`；**禁止 npm/yarn** |
| Rust | 最新稳定版 | 桌面端 Tauri 编译 |
| Xcode | 最新 | iOS 开发（移动端） |
| Android Studio / SDK | 最新 | Android 开发（移动端） |

### 13.2 首次安装

```bash
git clone <repo>
cd <repo>
pnpm install    # 使用 hoisted linker (React Native 兼容)
```

### 13.3 桌面端开发 (Tauri)

```bash
# 启动 Vite dev server + Tauri（Rust + WebView）
pnpm dev
# 或显式：
pnpm tauri dev

# 构建发行版
pnpm build       # 等价 pnpm tauri build
```

输出：桌面可安装文件 (macOS .dmg / Windows .msi / Linux .AppImage)。

### 13.4 移动端开发 (Expo)

> 移动端使用 `expo-dev-client`（**不是 Expo Go**，Expo Go 无法加载原生模块）。

```bash
# === 首次（或原生依赖变动时）：构建并安装原生开发包 ===

# iOS 真机
pnpm expo:ios
# iOS 模拟器
pnpm expo:ios:simulator
# Android（先启动模拟器或连接真机）
pnpm expo:android

# === 日常 JS 调试：启动 Metro ===
pnpm expo:start
```

EAS 云构建（CI/CD）：
```bash
pnpm eas:build:ios           # 生产 iOS
pnpm eas:build:android       # 生产 Android
pnpm eas:build:ios:dev       # 开发版
pnpm eas:build:ios:simulator # 模拟器版
```

**重要**：修改 `app.config.js`、原生模块、权限、schemes、build plugins 后必须重新 `expo:ios` / `expo:android`（prebuild + native 编译），日常改 JS 只需 `expo:start`。

### 13.5 核心库与 CLI 测试

```bash
pnpm test                  # 运行 core 测试 (vitest)
pnpm test:core             # 同上
pnpm cli:test              # CLI 单元测试
pnpm cli:build             # 打包 CLI
pnpm cli:preflight         # 发布前预检查
```

### 13.6 文档站

```bash
cd website
pnpm dev       # Astro dev
pnpm build     # 构建 GitHub Pages 产物
```

### 13.7 Lint / Format

```bash
pnpm lint          # Biome 全仓检查 (linter + formatter)
pnpm lint:fix      # 自动修复
```

### 13.8 版本管理

```bash
pnpm version:check        # 检查所有包版本一致性
pnpm version:set 1.4.0    # 统一设置所有包版本号
```

### 13.9 GitHub Actions 工作流

| 文件 | 说明 |
|-----|------|
| [release.yml](file:///workspace/.github/workflows/release.yml) | 桌面端发版构建 (Tauri) |
| [update-homebrew.yml](file:///workspace/.github/workflows/update-homebrew.yml) | Homebrew cask 更新 |
| [deploy-worker.yml](file:///workspace/.github/workflows/deploy-worker.yml) | Feedback Worker 部署 |
| [website.yml](file:///workspace/.github/workflows/website.yml) | 文档站 GitHub Pages |

---

## 14. 关键开发规范

### 14.1 启动初始化顺序（强约束）

所有平台 App 启动时，必须严格按以下顺序初始化：

```
1. setPlatformService(impl)  ← 必须最先执行，数据库/存储都依赖它
2. setSyncAdapter(impl)
3. initDatabase() / initLocalDatabase()
4. initI18nLanguage()
5. 其他：Audio / TrackPlayer / 事件订阅
6. 渲染 UI
```

### 14.2 核心层禁止的依赖

`@readany/core` 包禁止直接 import 以下平台专属依赖：
- ❌ `@tauri-apps/*`（Tauri 插件）
- ❌ `expo-*`（Expo SDK）
- ❌ `react-native-*`（RN 原生库）
- ❌ 任何浏览器 DOM API（文件除外：如 i18n/feedback/tts-player）

应通过 `IPlatformService` 或独立 hooks 间接访问。

### 14.3 数据安全与隐私

- 🔐 **Local-first**：用户数据默认仅本地存储，同步是用户主动配置的可选项
- 🔐 敏感配置（WebDAV 密码 / S3 密钥）：移动端用 `expo-secure-store`，桌面端用 KV（Tauri scope 保护）
- 🔐 网络请求不安全证书选项明确需要用户勾选 `allowInsecure`
- 🔐 AI 功能已移除（2024-06），无 LLM/RAG/向量数据外发风险

### 14.4 代码风格（Biome）

- 缩进：2 空格，LF 行尾
- 引号：双引号
- 行宽：100 字符
- 必须带分号
- 未使用变量/导入：警告级别
- 显式 `any`：警告级别

### 14.5 node-linker

必须使用 **hoisted**（`.npmrc` + pnpm 配置），这是 React Native 和 expo 正常工作的硬性要求。**禁止使用 isolated/pnp linker**。

---

## 15. 扩展阅读与设计文档

| 文档 | 路径 | 内容 |
|-----|------|------|
| 统计设计 | [docs/stats-design/](file:///workspace/docs/stats-design/) | 架构 schema / 周期报告 / 实施路线图 |
| 同步设计 | [docs/sync-design.md](file:///workspace/docs/sync-design.md) | 同步协议、冲突处理、三后端架构 |
| WebDAV 导入设计 | [docs/webdav-import/](file:///workspace/docs/webdav-import/) | 产品定位 / 交互流程 / 实施路线 |
| CLI 设计 | [docs/readany-cli/](file:///workspace/docs/readany-cli/) | 12份规格文档：验收/交付/架构/命令规格 |
| TTS 迁移 | [docs/TTS_FOLIATE_NATIVE_MIGRATION.md](file:///workspace/docs/TTS_FOLIATE_NATIVE_MIGRATION.md) | 系统 TTS 迁移方案 |
| 系统音色设计 | [docs/system-voice-design.md](file:///workspace/docs/system-voice-design.md) | 系统音色界面与逻辑设计 |
| 技能设计 | [docs/skills-design.md](file:///workspace/docs/skills-design.md) | 技能系统设计（已移除 AI 但保留） |
| EPUB 转换 | [EPUB_CONVERSION_PLAN.md](file:///workspace/EPUB_CONVERSION_PLAN.md) | TXT/UMD → EPUB 方案 |
| 项目 README | [README.md](file:///workspace/README.md) / [README_CN.md](file:///workspace/README_CN.md) | 用户视角说明 |
| AI Agent 规范 | [AGENTS.md](file:///workspace/AGENTS.md) | 给 AI 编程助手的规格 |

---

*文档生成时间：2026-08-16 · 基于仓库完整源代码分析*
