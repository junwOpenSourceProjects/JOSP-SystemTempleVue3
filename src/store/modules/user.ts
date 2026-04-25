import AuthAPI from "@/api/auth";
import UserAPI from "@/api/user";
import { resetRouter } from "@/router";
import { store } from "@/store";

import { LoginData, LoginResult } from "@/api/auth/model";
import { UserInfo } from "@/api/user/model";
import { TOKEN_KEY } from "@/enums/CacheEnum";

/**
 * 用户状态管理
 * @description 管理用户认证状态、登录/登出操作、用户信息
 * 使用 Pinia Composition API 风格
 *
 * @package store
 */
export const useUserStore = defineStore("user", () => {
  /** 当前登录用户信息 */
  const user = ref<UserInfo>({
    roles: [],
    perms: [],
  });

  /**
   * 执行用户登录
   * @description 提交用户名密码进行认证，登录成功后存储 Token
   * @param loginData - 登录凭证（username, password, captchaKey, captchaCode）
   * @returns Promise，登录成功时 resolve
   */
  function login(loginData: LoginData) {
    return new Promise<void>((resolve, reject) => {
      AuthAPI.login(loginData)
        .then((data: LoginResult) => {
          const { token, tokenHead } = data;
          // 将 Token 存储到 localStorage 实现持久化
          localStorage.setItem(TOKEN_KEY, tokenHead + token);
          resolve();
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  /**
   * 获取当前用户信息
   * @description 从后端获取用户资料，包括昵称、头像、角色、权限等
   * @returns Promise resolving to UserInfo 对象
   * @throws 验证失败时抛出错误
   */
  function getUserInfo() {
    return new Promise<UserInfo>((resolve, reject) => {
      AuthAPI.getUserInfo()
        .then((data: UserInfo) => {
          if (!data) {
            reject("Verification failed, please Login again.");
            return;
          }
          Object.assign(user.value, { ...data });
          resolve(data);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  /**
   * 刷新访问令牌
   * @description 调用后端刷新 Token 接口，获取新 Token 并更新本地存储
   * 用于 Token 即将过期时自动续期，避免用户重新登录
   *
   * @returns Promise，刷新成功时 resolve 新 Token
   */
  function refreshToken() {
    return new Promise<void>((resolve, reject) => {
      AuthAPI.refreshToken()
        .then((data: LoginResult) => {
          if (data) {
            const { token, tokenHead } = data;
            localStorage.setItem(TOKEN_KEY, tokenHead + token);
            resolve();
          } else {
            reject(new Error("Refresh token failed"));
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  /**
   * 执行用户登出
   * @description 调用后端登出接口，清除本地存储的 Token，然后刷新页面
   * 刷新页面用于重置 Vue 应用状态（路由、Store 等）
   * @returns Promise，登出完成后 resolve
   */
  function logout() {
    return new Promise<void>((resolve, reject) => {
      AuthAPI.logout()
        .then(() => {
          // 使用 removeItem 而非 setItem("")，避免空字符串仍被 JavaScript 当作 truthy
          localStorage.removeItem(TOKEN_KEY);
          location.reload(); // 刷新页面以清除路由状态
          resolve();
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  /**
   * 重置用户 Token 和路由状态
   * @description 清除本地 Token，重置路由到初始状态
   * 用于 Token 失效或用户会话失效时的清理工作
   * @returns Promise，重置完成后 resolve
   */
  function resetToken() {
    console.log("resetToken");
    return new Promise<void>((resolve) => {
      // 使用 removeItem 而非 setItem("") 正确清除 Token
      // 空字符串在 JavaScript 中仍是 truthy，可能导致 hasToken 检查异常
      localStorage.removeItem(TOKEN_KEY);
      resetRouter();
      resolve();
    });
  }

  return {
    user,
    login,
    getUserInfo,
    refreshToken,
    logout,
    resetToken,
  };
});

/**
 * Hook：在 Vue 组件外部访问用户状态
 * @description 提供 store 实例的访问方式，用于非组件场景（如 request 拦截器）
 * @returns 用户状态 store 实例
 */
export function useUserStoreHook() {
  return useUserStore(store);
}