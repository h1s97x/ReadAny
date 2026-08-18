<p align="center">
  <img src="packages/app/public/logo.svg" alt="ReadAny Logo" width="120" height="120">
</p>

<h1 align="center">ReadAny</h1>

<p align="center">
  <strong>本地优先的电子书阅读器，覆盖桌面端与移动端</strong>
</p>

<p align="center">
  <em>"本地优先的电子书阅读器，支持高亮、笔记、TTS 与跨设备同步。"</em>
</p>

<p align="center">
  ReadAny 帮助你阅读、标注和管理你的电子书库，支持高亮、笔记、TTS、阅读统计与 WebDAV 同步。
</p>

<p align="center">
  <a href="https://github.com/codedogQBY/ReadAny/releases/latest">
    <img src="https://img.shields.io/github/v/release/codedogQBY/ReadAny?color=blue&label=Download" alt="Release">
  </a>
  <a href="https://github.com/codedogQBY/ReadAny/stargazers">
    <img src="https://img.shields.io/github/stars/codedogQBY/ReadAny?color=yellow" alt="Stars">
  </a>
  <a href="https://github.com/codedogQBY/ReadAny/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/codedogQBY/ReadAny?color=green" alt="License">
  </a>
  <img src="https://img.shields.io/badge/平台-macOS%20%7C%20Windows%20%7C%20Linux%20%7C%20iOS%20%7C%20Android-blue" alt="Platform">
  <a href="README.md">
    <img src="https://img.shields.io/badge/lang-English-blue" alt="English">
  </a>
</p>

---

> 🚀 **v2.0 更新**: 移动端应用（iOS/Android）现已上线！详见下方 [移动端](#移动端应用) 章节。

## 为什么选择 ReadAny？

| 痛点 | 传统阅读器 | ReadAny |
|------|-----------|---------|
| 搜索内容 | 只能关键词 | **全文搜索**，覆盖整个书库 |
| 提问书籍 | 自己翻找答案 | **搜索并跳转**到相关段落 |
| 做笔记 | 手动复制粘贴 | **选中即高亮**，一键导出 |
| 知识管理 | 笔记散落各处 | **统一管理**，多格式导出 |
| 隐私安全 | 上传云端 | **本地优先**，完全离线可用 |

### 与竞品对比

| 特性 | ReadAny | Calibre | KOReader | Apple Books |
|------|---------|---------|----------|-------------|
| TTS 语音朗读 | ✅ | ❌ | 有限 | 有限 |
| 阅读统计 | ✅ | ❌ | ❌ | 有限 |
| WebDAV 同步 | ✅ | ❌ | ❌ | ❌ |
| 多格式支持 | 10+ | 15+ | 10+ | 2 |
| 笔记导出 | 5 种格式 | 有限 | 有限 | 有限 |
| 开源免费 | ✅ | ✅ | ✅ | ❌ |

---

## 应用截图

### 主界面

<div align="center">
  <img src="assets/hero-screenshot.png" width="80%" alt="ReadAny 主界面">
</div>

### 笔记和高亮

<div align="center">
  <img src="assets/notes-desktop.png" width="60%" alt="笔记 - 桌面端">
  <img src="assets/notes-mobile.png" width="20%" alt="笔记 - 移动端">
</div>

### TTS 语音朗读

<div align="center">
  <img src="assets/tts-desktop.png" width="60%" alt="语音朗读 - 桌面端">
  <img src="assets/tts-mobile.png" width="20%" alt="语音朗读 - 移动端">
</div>

### 阅读统计

<div align="center">
  <img src="assets/stats-desktop.png" width="60%" alt="阅读统计 - 桌面端">
  <img src="assets/stats-mobile.png" width="20%" alt="阅读统计 - 移动端">
</div>

### 跨设备同步

<div align="center">
  <img src="assets/sync-desktop.png" width="60%" alt="同步 - 桌面端">
  <img src="assets/sync-mobile.png" width="20%" alt="同步 - 移动端">
</div>

---

## 核心功能

### 📝 标注与知识管理

- **5 色高亮** - 黄/绿/蓝/粉/紫，悬停预览笔记
- **Markdown 笔记** - 富文本编辑器，工具栏操作，所见即所得
- **多格式导出** - Markdown、HTML、JSON、Obsidian、Notion

### 🔊 语音朗读 (TTS)

- **多引擎支持** - Edge TTS、浏览器 TTS、通义千问
- **丰富音色** - 100+ 种语音，多语言支持
- **语速调节** - 可调节播放速度
- **后台播放** - 边听边做其他事情

### 📊 阅读统计

- **阅读热力图** - 类似 GitHub 贡献图，可视化阅读习惯
- **趋势图表** - 追踪每日/每周/每月阅读时长
- **连续天数** - 记录最长连续阅读天数
- **书籍统计** - 每本书的阅读时长、完成度

### ☁️ 跨设备同步

- **WebDAV 支持** - 跨设备同步书库、高亮、笔记
- **自动同步** - 后台自动同步
- **冲突解决** - 智能合并并发编辑

### 📚 多格式支持

**EPUB** · **PDF** · **MOBI** · **AZW** · **AZW3** · **FB2** · **FBZ** · **CBZ** · **TXT** · **UMD**

TXT 和 UMD 会在导入时转换为 EPUB，以支持阅读、笔记、搜索与同步。

### 🎨 个性化体验

- 5 种字体主题（含 CJK 优化）
- 明/暗主题切换
- 分页/连续滚动
- 快捷键支持
- 中英双语界面

---

## 快速开始

### 下载安装

| 平台 | 下载 |
|------|------|
| macOS (Apple Silicon) | [下载 .dmg](https://github.com/codedogQBY/ReadAny/releases/latest) |
| macOS (Intel) | [下载 .dmg](https://github.com/codedogQBY/ReadAny/releases/latest) |
| Windows | [下载 .msi](https://github.com/codedogQBY/ReadAny/releases/latest) |
| Linux | [下载 .AppImage](https://github.com/codedogQBY/ReadAny/releases/latest) |
| iOS | [加入 TestFlight](https://testflight.apple.com/join/qNdvNv2p) |
| Android | [下载 .apk](https://github.com/codedogQBY/ReadAny/releases/latest) |

#### Homebrew（macOS）

```bash
brew tap codedogQBY/readany
brew install --cask readany
```

### 2 步上手

1. **导入书籍** - 拖拽文件到书库
2. **开始阅读** - 双击打开，沉浸体验

### 移动端应用

ReadAny 现已支持移动设备！

**Expo (React Native) 版本：**
```bash
# 克隆并设置
git clone https://github.com/codedogQBY/ReadAny.git
cd ReadAny
pnpm install

# 安装/运行 iOS 开发构建
pnpm expo:ios

# 安装/运行 iOS 模拟器开发构建
pnpm expo:ios:simulator

# 安装/运行 Android 开发构建
# 先启动 Android 模拟器，或连接真机。
pnpm expo:android

# 为已安装的开发构建启动 Metro
pnpm expo:start
```

移动端开发使用带 `expo-dev-client` 的 Expo development build，不再使用
Expo Go。Expo Go 无法加载 ReadAny 当前依赖的原生模块和应用配置。首次调试，
或原生依赖/配置发生变化时，先运行 `pnpm expo:ios`、`pnpm expo:ios:simulator`
或 `pnpm expo:android` 安装开发版 App；日常 JS 调试再运行 `pnpm expo:start`，
用已安装的 ReadAny 开发版 App 连接 Metro。

模拟器调试时，iOS 使用 `pnpm expo:ios:simulator`；Android 先启动 Android
模拟器，再运行 `pnpm expo:android`。

移动端源码位于 [`packages/app-expo`](packages/app-expo)。

## 技术栈

| 层级 | 技术 |
|------|------|
| 桌面框架 | [Tauri 2](https://tauri.app/) (Rust) |
| 移动端 | [Expo](https://expo.dev/) (React Native) + Tauri Mobile |
| 前端 | [React 19](https://react.dev/) + TypeScript |
| 构建 | [Vite 7](https://vite.dev/) |
| 样式 | [Tailwind CSS 4](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/) |
| 状态 | [Zustand](https://zustand.docs.pmnd.rs/) |
| 数据库 | SQLite |
| 电子书 | [foliate-js](https://github.com/johnfactotum/foliate-js) |

---

## 开发

```bash
# 克隆
git clone https://github.com/codedogQBY/ReadAny.git
cd ReadAny

# 安装依赖
pnpm install

# 开发模式（桌面端）
pnpm tauri dev

# 开发模式（移动端 - Expo development build，不是 Expo Go）
# 首次先安装/运行原生开发构建：
pnpm expo:ios
pnpm expo:ios:simulator
pnpm expo:android

# 然后为已安装的开发版 App 启动 Metro：
pnpm expo:start

# 构建
pnpm tauri build
```

移动端使用 `expo-dev-client`，不支持 Expo Go。修改原生依赖、`app.config.js`、
权限、scheme 或 Expo plugins 后，需要重新运行 `pnpm expo:ios`、
`pnpm expo:ios:simulator` 或 `pnpm expo:android` 生成/安装开发构建。

**环境要求：** Node.js ≥18, pnpm ≥9, Rust（Tauri 需要）；移动端开发还需要
iOS 的 Xcode 或 Android 的 Android Studio/SDK。

---

## 开发路线

- [x] **移动端应用** — iOS 和 Android 版本已上线
- [x] **TTS 语音朗读** — Edge TTS，多音色
- [x] **阅读统计** — 热力图、趋势、连续天数
- [x] **WebDAV 同步** — 跨设备同步
- [ ] PDF 重排/重渲染
- [ ] 插件系统
- [ ] 官方云同步服务

---

## 参与贡献

欢迎贡献代码、报告 Bug、提出建议！

1. Fork → 2. Branch → 3. PR

提交前请运行 `pnpm lint` 确保代码风格一致。

---

## 开源协议

[GPL-3.0](LICENSE) © 2024 ReadAny Team

本项目采用 GNU General Public License v3.0 开源协议。你可以自由使用、修改和分发代码，但任何衍生作品必须以相同协议开源。

**说明：** 源代码完全开源免费，但官方应用商店版本可能会收取一定费用，用于支持持续开发和覆盖证书成本。你始终可以免费自行编译使用。

---

## 致谢

- [foliate-js](https://github.com/johnfactotum/foliate-js) - 电子书渲染引擎
- [Tauri](https://tauri.app/) - 跨平台桌面框架
- [Expo](https://expo.dev/) - React Native 开发平台
- [Radix UI](https://www.radix-ui.com/) - 无障碍 UI 组件
- [Lucide](https://lucide.dev/) - 图标库

---

## 社区

感谢 [linux.do](https://linux.do/) — 一个活跃的中文技术社区，在这里你可以学习 AI、开发等前沿技术。

---

<p align="center">
  用 ❤️ 打造 by ReadAny Team
</p>

<p align="center">
  <a href="https://github.com/codedogQBY/ReadAny/discussions">💬 讨论区</a> •
  <a href="https://github.com/codedogQBY/ReadAny/issues">🐛 问题反馈</a>
</p>

<p align="center">
  <img src="assets/小红书群.jpg" width="200" alt="小红书群">
  <img src="assets/微信群.jpg" width="200" alt="微信群">
</p>

## ☕ 请作者喝杯咖啡

如果你觉得 ReadAny 对你有帮助，欢迎请我喝杯咖啡，支持项目的持续开发！

<p align="center">
  <img src="assets/微信赞赏码.jpg" width="200" alt="微信赞赏码">
  <img src="assets/支付宝收款码.jpg" width="200" alt="支付宝收款码">
</p>

<p align="center">
  <a href="https://ifdian.net/a/codedogQBY">餐桌：爱发电支持</a>
</p>

---

## Star 历史

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/image?repos=codedogQBY/ReadAny&type=Date&theme=dark" />
  <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/image?repos=codedogQBY/ReadAny&type=Date" />
  <img alt="Star History Chart" src="https://api.star-history.com/image?repos=codedogQBY/ReadAny&type=Date" />
</picture>
