/**
 * Vue Router Configuration
 * @description Central router setup with constant routes and navigation guards.
 * Handles route initialization, guards for authentication, and router reset.
 *
 * @package router
 */
import type { App } from "vue";
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

export const Layout = () => import("@/layout/index.vue");

/**
 * Constant Routes
 * @description Static routes that are always available in the application.
 * Includes login, redirect, dashboard, personal center, notice, and error pages.
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue"),
      },
    ],
  },

  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: { hidden: true },
  },

  {
    path: "/",
    name: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard",
        meta: { title: "首页", icon: "homepage", affix: true },
      },
      {
        path: "personal",
        component: () => import("@/views/personal/index.vue"),
        name: "Personal",
        meta: { title: "个人中心", icon: "user" },
      },
      {
        path: "notice",
        component: () => import("@/views/notice/index.vue"),
        name: "Notice",
        meta: { title: "通知公告", icon: "message" },
      },
      {
        path: "notice/edit",
        component: () => import("@/views/notice/edit.vue"),
        name: "NoticeEdit",
        meta: { title: "编辑公告", hidden: true },
      },
      {
        path: "system/config",
        component: () => import("@/views/system/config/index.vue"),
        name: "SystemConfig",
        meta: { title: "系统配置", icon: "setting" },
      },
      {
        path: "401",
        component: () => import("@/views/error-page/401.vue"),
        meta: { hidden: true },
      },
      {
        path: "404",
        component: () => import("@/views/error-page/404.vue"),
        meta: { hidden: true },
      },
    ],
  },
];

/**
 * Create Router Instance
 * @description Initializes router with hash history mode and scroll behavior.
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  // Restore scroll position on refresh
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

/**
 * Setup Router
 * @description Registers router instance with the Vue application.
 * @param app - Vue application instance
 */
export function setupRouter(app: App<Element>) {
  app.use(router);
}

/**
 * Reset Router
 * @description Clears current router state and redirects to login page.
 * Used during logout or token expiration.
 */
export function resetRouter() {
  router.replace({ path: "/login" });
}

export default router;
