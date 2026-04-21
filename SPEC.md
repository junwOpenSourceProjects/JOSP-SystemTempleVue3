# JOSP-SystemTempleVue3 Specification

## 1. Project Overview

| Item | Value |
|------|-------|
| **Project Name** | JOSP-SystemTempleVue3 |
| **Type** | Vue 3 Enterprise Admin Template |
| **Description** | 企业级后台管理系统前端，基于 Vue 3 + Vite + TypeScript + Element Plus |
| **Repository** | https://github.com/junwOpenSourceProjects/JOSP-SystemTempleVue3 |
| **License** | AGPL-3.0 |

## 2. Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Vue 3 | ^3.5.32 |
| Build Tool | Vite | ^8.0.9 |
| Language | TypeScript | ^5.7.2 |
| UI Library | Element Plus | ^2.13.5 |
| State Management | Pinia | ^3.0.3 |
| Router | Vue Router | ^5.0.4 |
| HTTP Client | Axios | ^1.7.9 |
| Charts | ECharts + vue-echarts | ^5.5.1 |
| CSS | UnoCSS | ^66.6.7 |
| i18n | vue-i18n | ^10.0.4 |

## 3. Project Structure

```
src/
├── api/                  # API 接口层
│   ├── auth/             # 认证相关 API
│   ├── dashboard/        # 看板 API
│   ├── notice/           # 通知公告 API
│   └── system/           # 系统管理 API
├── components/           # 公共组件
├── composables/           # 组合式函数
├── layout/               # 布局组件
├── router/               # 路由配置
├── store/                # Pinia 状态管理
│   └── modules/          # Store 模块
├── styles/               # 全局样式
├── utils/                # 工具函数
└── views/                # 页面视图
    ├── dashboard/        # 数据看板
    ├── login/            # 登录页
    ├── notice/           # 通知公告
    ├── personal/         # 个人中心
    └── system/           # 系统管理
        ├── user/         # 用户管理
        ├── role/         # 角色管理
        ├── menu/         # 菜单管理
        └── dept/         # 部门管理
```

## 4. Features

- [x] 用户登录/登出
- [x] 动态路由生成
- [x] 权限管理（用户、角色、菜单）
- [x] 部门管理（树形结构）
- [x] 字典管理
- [x] 登录日志 & 操作日志
- [x] 通知公告管理
- [x] 系统监控（服务器、Redis、DB状态）
- [x] 个人中心
- [x] ECharts 数据看板
- [x] 富文本编辑（WangEditor）
- [x] Excel 导入导出
- [x] WebSocket 实时通信

## 5. Design System

See [DESIGN.md](DESIGN.md) for the complete design specification.

### Brand Colors
- Primary: `#1456f0`
- Success: `#10b981`
- Warning: `#f59e0b`
- Danger: `#ef4444`

### Typography
- Chinese: `DM Sans`, `Outfit`
- English/Numbers: `Outfit`
- Code: `JetBrains Mono`, `Fira Code`

## 6. Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_APP_TITLE` | Application title | JOSP-System |
| `VITE_API_BASE_URL` | API base path | `/api/v1` |

## 7. Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build |
| `pnpm type-check` | TypeScript type checking |
| `pnpm lint:eslint` | ESLint checking |
| `pnpm lint:prettier` | Prettier formatting |
| `pnpm lint:stylelint` | Stylelint checking |

## 8. Requirements

- Node.js >= 20.0.0
- pnpm >= 8.0.0

## 9. Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.