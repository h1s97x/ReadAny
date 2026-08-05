## 项目概述

ReadAny — AI 驱动的电子书阅读器，支持语义搜索、智能对话和知识管理。多平台产品：桌面端（Tauri）、移动端（Expo/React Native）、文档网站（Astro）。

## 技术栈

- **语言**: TypeScript, Rust (Tauri backend)
- **运行时**: Node.js 24, pnpm 9.15 (monorepo)
- **桌面端**: Tauri 2 + Vite + React 19 + Radix UI
- **移动端**: Expo + React Native
- **核心库**: LangChain (AI/RAG), HuggingFace Transformers (本地向量)
- **文档站**: Astro + Starlight + Tailwind CSS v4
- **代码检查**: Biome
- **node-linker**: hoisted (React Native 兼容)

## 目录结构

```
/workspace/projects/
├── packages/
│   ├── app/            # Tauri 桌面端 (Vite + React)
│   │   ├── src/        # 前端源码
│   │   ├── src-tauri/  # Rust 后端
│   │   └── vite.config.ts
│   ├── app-expo/       # Expo 移动端 (iOS/Android)
│   │   ├── src/        # React Native 源码
│   │   ├── app.config.js
│   │   └── metro.config.js
│   ├── core/           # 核心库 (@readany/core)
│   │   └── src/        # AI, RAG, DB, i18n, utils, services
│   ├── feedback-worker/ # 反馈 Worker
│   └── foliate-js/     # 电子书阅读器 JS 引擎
├── website/            # Astro 文档网站
├── scripts/            # 构建/版本脚本
├── patches/            # pnpm 补丁
├── assets/             # 截图等静态资源
└── docs/               # 文档
```

## 关键入口 / 核心模块

- **桌面端入口**: `packages/app/src/` (React), `packages/app/src-tauri/` (Rust)
- **移动端入口**: `packages/app-expo/index.js` → `packages/app-expo/src/`
- **核心库**: `packages/core/src/` — AI agents/tools (`ai/`), RAG pipeline (`rag/`), 数据库 (`db/`), 国际化 (`i18n/`)
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

## 常见问题和预防

- pnpm patches: `@langchain/core` 和 `react-native-track-player` 有自定义补丁，修改时注意
- 移动端构建前需先 `build:reader` (构建 foliate-js reader)
- Tauri Rust 后端编译产物在 `packages/app/src-tauri/target/`
