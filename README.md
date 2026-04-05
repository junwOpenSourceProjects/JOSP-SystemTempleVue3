# JOSP-SystemTempleVue3

![Vue](https://img.shields.io/badge/Vue-3.5.32-4FC08D?style=flat-square&logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-6.0.7-646CFF?style=flat-square&logo=vite)
![Element Plus](https://img.shields.io/badge/Element%20Plus-2.13.6-409EFF?style=flat-square&logo=element)
![Pinia](https://img.shields.io/badge/Pinia-3.0.4-FFD859?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-AGPL--3.0-blue?style=flat-square)

> **Vue3 + Element Plus 前端项目模板** - 基于最新 Vue 3.5 的现代化后台系统底座。

## 🚀 从模板创建新项目

### 方式1: GitHub 网页操作

1. 点击本页面上方的 **"Use this template"** 按钮
2. 选择 **"Create a new repository"**
3. 填写新项目名称
4. 点击 **"Create repository"**
5. 克隆并安装依赖:
   ```bash
   git clone https://github.com/你的用户名/JOSP-NewProjectVue3.git
   cd JOSP-NewProjectVue3
   pnpm install
   ```

## 📝 创建后修改项目信息

### 1. 修改 package.json

```json
{
  "name": "josp-system-vue3",
  "version": "1.0.0"
}
```

### 2. 修改 API 地址

编辑 `.env.development`:
```env
# 代理前缀
VITE_APP_BASE_API = '/dev-api'
# 本地后端接口地址 (JOSP-SystemTempleJava 默认为 8081)
VITE_APP_API_URL = http://localhost:8081
```

## 📖 项目简介

JOSP-SystemTempleVue3 是一个高性能前端项目模板，内置 JWT 鉴权流程、Axios 响应拦截封装、Pinia 状态管理以及 Element Plus 组件库。

**配套后端模板**: [JOSP-SystemTempleJava](https://github.com/junwOpenSourceProjects/JOSP-SystemTempleJava)

## 🛠️ 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.5.32 | 渐进式前端框架 |
| Vite | 6.0.7 | 下一代构建工具 |
| Element Plus | 2.13.6 | UI 组件库 |
| Pinia | 3.0.4 | 状态管理 |
| TypeScript | 5.7.3 | 类型支持 |
| Axios | 1.7.9 | HTTP 客户端 |

## 🚀 快速开始

```bash
# 1. 安装依赖
pnpm install

# 2. 运行项目
pnpm dev
```

## 📁 项目结构

- `src/api/auth` - 登录认证 API
- `src/store/modules/user` - 用户状态与 Token 存储
- `src/utils/request` - Axios 拦截器 (自动注入 Bearer Token)
- `src/enums/ResultEnum` - 同步后端的 200/401/403 状态码

## 📄 许可证

本项目采用 **AGPL-3.0** 许可证 - 详情见 [LICENSE](LICENSE) 文件。
