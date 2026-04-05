import router from "@/router";
import { useUserStore, usePermissionStore } from "@/store";
import NProgress from "@/utils/nprogress";
import { RouteRecordRaw } from "vue-router";
import { TOKEN_KEY } from "@/enums/CacheEnum";

export function setupPermission() {
  // 白名单路由
  const whiteList = ["/login"];

  router.beforeEach(async (to) => {
    NProgress.start();
    const hasToken = localStorage.getItem(TOKEN_KEY);

    if (hasToken) {
      if (to.path === "/login") {
        // 如果已登录，跳转首页
        NProgress.done();
        return { path: "/" };
      } else {
        const userStore = useUserStore();
        const hasRoles =
          userStore.user.roles && userStore.user.roles.length > 0;

        if (hasRoles) {
          // 未匹配到任何路由，跳转404
          if (to.matched.length === 0) {
            return "/404";
          } else {
            // 如果路由参数中有 title，覆盖路由元信息中的 title
            const title =
              (to.params.title as string) || (to.query.title as string);
            if (title) {
              to.meta.title = title;
            }
            return true;
          }
        } else {
          const permissionStore = usePermissionStore();
          try {
            const { roles } = await userStore.getUserInfo();
            const accessRoutes = await permissionStore.generateRoutes(roles);
            accessRoutes.forEach((route: RouteRecordRaw) => {
              router.addRoute(route);
            });
            // 重新进入路由，确保动态生成的路由已被完全加载
            return { ...to, replace: true };
          } catch (error) {
            console.error("Permission error:", error);
            // 移除 token 并跳转登录页
            await userStore.resetToken();
            // 重定向到登录页，并携带当前页面路由和参数
            const redirect = encodeURIComponent(to.fullPath);
            NProgress.done();
            return `/login?redirect=${redirect}`;
          }
        }
      }
    } else {
      // 未登录
      if (whiteList.includes(to.path)) {
        // 在白名单，直接进入
        return true;
      } else {
        // 不在白名单，重定向到登录页
        const redirect = encodeURIComponent(to.fullPath);
        NProgress.done();
        return `/login?redirect=${redirect}`;
      }
    }
  });

  router.afterEach(() => {
    NProgress.done();
  });
}

/**
 * 是否有权限
 */
export function hasAuth(
  value: string | string[],
  type: "button" | "role" = "button"
) {
  const { roles, perms } = useUserStore().user;
  //「超级管理员」拥有所有的按钮权限
  if (type === "button" && roles && roles.includes("ROOT")) {
    return true;
  }
  const auths = type === "button" ? perms : roles;
  if (!auths) return false;

  return typeof value === "string"
    ? auths.includes(value)
    : auths.some((perm) => {
        return value.includes(perm);
      });
}
