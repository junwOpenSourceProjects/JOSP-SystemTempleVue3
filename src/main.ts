/**
 * 应用入口文件
 * @description Vue3 应用初始化、插件注册、样式导入
 *
 * @package main
 */
import { createApp } from "vue";
import App from "./App.vue";
import setupPlugins from "@/plugins";

// 本地SVG图标注册（vite-plugin-svg-icons）
import "virtual:svg-icons-register";

// 全局样式导入
import "element-plus/theme-chalk/dark/css-vars.css"; // Element Plus 暗色主题 CSS 变量
import "@/styles/index.scss"; // 自定义全局样式
import "uno.css"; // UnoCSS 原子化 CSS
import "animate.css"; // CSS 动画库

const app = createApp(App);

// 注册所有插件（包含路由、权限、Element Plus 等）
app.use(setupPlugins);

// 挂载应用到 #app 容器
app.mount("#app");
