/**
 * Permission Plugin
 * @description Vue plugin for permission checks and route navigation guards.
 * Handles authentication verification, dynamic route loading, and permission checks.
 *
 * @package plugins
 */
import router from "@/router";
import { useUserStore, usePermissionStore } from "@/store";
import NProgress from "@/utils/nprogress";
import { RouteRecordRaw } from "vue-router";
import { TOKEN_KEY } from "@/enums/CacheEnum";

/**
 * Setup Permission Plugin
 * @description Initializes Vue Router navigation guards for authentication and authorization.
 * Guards check for valid tokens, load dynamic routes on first access, and handle redirects.
 */
export function setupPermission() {
  // Whitelist routes that don't require authentication
  const whiteList = ["/login"];

  router.beforeEach(async (to) => {
    NProgress.start();
    const hasToken = localStorage.getItem(TOKEN_KEY);

    if (hasToken) {
      if (to.path === "/login") {
        // If already logged in, redirect to home page
        NProgress.done();
        return { path: "/" };
      } else {
        const userStore = useUserStore();
        const hasRoles =
          userStore.user.roles && userStore.user.roles.length > 0;

        if (hasRoles) {
          // No routes matched, redirect to 404
          if (to.matched.length === 0) {
            return "/404";
          } else {
            // If title is in route params/query, override meta title
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
            // Fetch user info and generate dynamic routes
            const { roles } = await userStore.getUserInfo();
            const accessRoutes = await permissionStore.generateRoutes(roles);
            accessRoutes.forEach((route: RouteRecordRaw) => {
              router.addRoute(route);
            });
            // Re-enter route to ensure dynamic routes are fully loaded
            return { ...to, replace: true };
          } catch (error) {
            console.error("Permission error:", error);
            // Remove token and redirect to login
            await userStore.resetToken();
            // Redirect to login with current page route and parameters
            const redirect = encodeURIComponent(to.fullPath);
            NProgress.done();
            return `/login?redirect=${redirect}`;
          }
        }
      }
    } else {
      // Not logged in
      if (whiteList.includes(to.path)) {
        // In whitelist, allow direct access
        return true;
      } else {
        // Not in whitelist, redirect to login
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
 * Check Authentication Permission
 * @description Verifies if user has the required permission/role.
 * ROOT role has all button permissions.
 *
 * @param value - Permission string or array of strings to check
 * @param type - Type of check: "button" for permissions, "role" for roles
 * @returns True if user has permission, false otherwise
 */
export function hasAuth(
  value: string | string[],
  type: "button" | "role" = "button"
) {
  const { roles, perms } = useUserStore().user;
  // ROOT role (super admin) has all button permissions
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
