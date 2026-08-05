## 项目概述

ReadAny — 本地优先的电子书阅读器，支持标注、笔记、TTS、阅读统计和跨设备同步。多平台产品：桌面端（Tauri）、移动端（Expo/React Native）、文档网站（Astro）。

> 2024-06 决策：移除 AI 功能（对话/RAG/技能/思维导图/向量/翻译），保留 TTS/同步/统计/标注/导出/书库/阅读器，让项目回归"纯粹的阅读工具"。

## 技术栈

- **语言**: TypeScript, Rust (Tauri backend)
- **运行时**: Node.js 24, pnpm 9.15 (monorepo)
- **桌面端**: Tauri 2 + Vite + React 19 + Radix UI
- **移动端**: Expo + React Native
- **文档站**: Astro + Starlight + Tailwind CSS v4
- **代码检查**: Biome
- **node-linker**: hoisted (React Native 兼容)

## 目录结构

```
/workspace/projects/
├── packages/
│   ├── app/            # Tauri 桌面端 (Vite + React)
│   │   ├── src/        # 前端源码
│   │   ├── src-tauri/  # Rust 后端 (已移除 vector 模块)
│   │   └── vite.config.ts
│   ├── app-expo/       # Expo 移动端 (iOS/Android)
│   │   ├── src/        # React Native 源码
│   │   ├── app.config.js
│   │   └── metro.config.js
│   ├── core/           # 核心库 (@readany/core) — 已移除 ai/rag/translation
│   │   └── src/        # DB, i18n, utils, services, sync, tts, stats, reader
│   ├── feedback-worker/ # 反馈 Worker
│   └── foliate-js/     # 电子书阅读器 JS 引擎
├── website/            # Astro 文档网站
├── scripts/            # 构建/版本脚本
├── patches/            # pnpm 补丁 (仅保留 react-native-track-player)
├── assets/             # 截图等静态资源
└── docs/               # 文档
```

## 关键入口 / 核心模块

- **桌面端入口**: `packages/app/src/` (React), `packages/app/src-tauri/` (Rust)
- **移动端入口**: `packages/app-expo/index.js` → `packages/app-expo/src/`
- **核心库**: `packages/core/src/` — 数据库 (`db/`), 同步 (`sync/`), TTS (`tts/`), 统计 (`stats/`), 国际化 (`i18n/`)
- **文档站**: `website/src/`

## 运行与预览

- 桌面端开发: `pnpm dev` (Vite dev server + Tauri)
- 移动端开发: `pnpm expo:start`
- 核心库测试: `pnpm test`
- 文档站: `cd website && pnpm dev`
- 当前项目类型为桌面应用 (Tauri)，预览链路不可用 (`preview_enable = "disabled"`)
- 部署：主产物为 Tauri 桌面应用，不支持标准 web 服务部署；文档站 (website/) 配置为 GitHub Pages 部署

## 用户偏好与长期约束

- 使用 pnpm，禁止 npm/yarn
- node-linker 必须为 hoisted（React Native 兼容要求）
- React 版本统一锁定 19.1.0 (pnpm overrides)
- 不使用 AI/LLM 功能（已移除 LangChain/HuggingFace 等依赖）

## 常见问题和预防

- pnpm patches: 仅保留 `react-native-track-player` 补丁（`@langchain/core` 补丁已随 AI 移除）
- 移动端构建前需先 `build:reader` (构建 foliate-js reader)
- Tauri Rust 后端编译产物在 `packages/app/src-tauri/target/`
- 同步系统保留三后端（WebDAV/S3/LAN），桌面端 LAN 同步依赖 Rust axum 服务器
