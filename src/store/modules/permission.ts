/**
 * Permission Store Module
 * @description Manages dynamic route generation and user permissions.
 * Filters routes based on user roles and generates accessible navigation.
 *
 * @package store
 */
import { RouteRecordRaw } from "vue-router";
import { constantRoutes } from "@/router";
import { store } from "@/store";
import MenuAPI from "@/api/menu";
import { RouteVO } from "@/api/menu/model";
import { MenuTypeEnum } from "@/enums/MenuTypeEnum";

const modules = import.meta.glob("../../views/**/**.vue");
const Layout = () => import("@/layout/index.vue");

/**
 * Permission Checker
 * @description Determines if user has access to a specific route based on roles.
 * The ROOT role (super admin) has access to all routes.
 *
 * @param roles - Array of user role identifiers
 * @param route - Vue Router route record to check
 * @returns True if user has permission, false otherwise
 */
const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  if (route.meta && route.meta.roles) {
    // ROOT role (super admin) has all permissions, bypass check
    if (roles.includes("ROOT")) {
      return true;
    }
    return roles.some((role) => {
      if (route.meta?.roles) {
        return route.meta.roles.includes(role);
      }
    });
  }
  return true;
};

/**
 * Filter Async Routes by Permission
 * @description Recursively filters routes that the user has permission to access.
 * Button-type menus are filtered out as they don't need route generation.
 *
 * @param routes - Routes from API containing all accessible routes
 * @param roles - User's role collection
 * @returns Filtered array of routes user has permission to access
 */
const filterAsyncRoutes = (routes: RouteVO[], roles: string[]) => {
  const asyncRoutes: RouteRecordRaw[] = [];
  routes.forEach((route) => {
    // Filter button-type menus (buttons don't need route generation)
    if ((route as any).type === MenuTypeEnum.BUTTON) {
      return;
    }

    const tmpRoute = { ...route } as RouteRecordRaw; // Deep copy to avoid mutation
    if (hasPermission(roles, tmpRoute)) {
      // If top-level directory, replace with Layout component
      if (tmpRoute.component?.toString() == "Layout") {
        tmpRoute.component = Layout;
      } else {
        // If sub-directory, dynamically load component
        const component = modules[`../../views/${tmpRoute.component}.vue`];
        if (component) {
          tmpRoute.component = component;
        } else {
          // Fallback to 404 error page if component not found
          tmpRoute.component = modules[`../../views/error-page/404.vue`];
        }
      }

      if (tmpRoute.children) {
        tmpRoute.children = filterAsyncRoutes(route.children ?? [], roles);
      }

      asyncRoutes.push(tmpRoute);
    }
  });

  return asyncRoutes;
};

/**
 * Permission Store
 * @description Manages route state and dynamic route generation for the application.
 * Provides functions to set routes, generate routes by roles, and handle mix mode menus.
 */
 // setup
export const usePermissionStore = defineStore("permission", () => {
  /** Accumulated routes (constant + dynamic) */
  const routes = ref<RouteRecordRaw[]>([]);

  /**
   * Set Routes
   * @description Combines constant routes with dynamically generated routes.
   * @param newRoutes - Array of RouteRecordRaw to add
   */
  function setRoutes(newRoutes: RouteRecordRaw[]) {
    routes.value = constantRoutes.concat(newRoutes);
  }

  /**
   * Generate Dynamic Routes
   * @description Fetches all routes from API and filters them by user permissions.
   * @param roles - User role collection for permission filtering
   * @returns Promise resolving to array of accessible RouteRecordRaw
   */
  function generateRoutes(roles: string[]) {
    return new Promise<RouteRecordRaw[]>((resolve, reject) => {
      // Fetch all routes from API
      MenuAPI.getRoutes()
        .then((data) => {
          // Filter routes user has permission to access
          const accessedRoutes = filterAsyncRoutes(data, roles);
          setRoutes(accessedRoutes);
          resolve(accessedRoutes);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Mix Mode Left Menus
   * @description Stores the left-side menus for mix layout mode based on active top menu.
   */
  const mixLeftMenus = ref<RouteRecordRaw[]>([]);

  /**
   * Set Mix Left Menus
   * @description Finds and sets left menus for the active top menu path in mix mode.
   * @param topMenuPath - Path of the active top-level menu
   */
  function setMixLeftMenus(topMenuPath: string) {
    const matchedItem = routes.value.find((item: RouteRecordRaw) => item.path === topMenuPath);
    if (matchedItem && matchedItem.children) {
      mixLeftMenus.value = matchedItem.children;
    }
  }
  return {
    routes,
    setRoutes,
    generateRoutes,
    mixLeftMenus,
    setMixLeftMenus,
  };
});

/**
 * Hook for accessing permission store outside of Vue components
 * @description Provides access to the permission store instance for non-component usage.
 * @returns Permission store instance
 */
// 非setup
export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
