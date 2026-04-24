/**
 * User Store Module
 * @description Manages user authentication state, login/logout operations, and user information.
 * Uses Pinia for state management with Composition API style.
 *
 * @package store
 */
import AuthAPI from "@/api/auth";
import UserAPI from "@/api/user";
import { resetRouter } from "@/router";
import { store } from "@/store";

import { LoginData, LoginResult } from "@/api/auth/model";
import { UserInfo } from "@/api/user/model";
import { TOKEN_KEY } from "@/enums/CacheEnum";

/**
 * User Store
 * @description Handles user authentication and user information management.
 * Provides login, logout, token management, and user profile retrieval.
 */
export const useUserStore = defineStore("user", () => {
  /** Current logged-in user information */
  const user = ref<UserInfo>({
    roles: [],
    perms: [],
  });

  /**
   * Perform user login
   * @description Authenticates user with credentials and stores the access token.
   * @param loginData - Login credentials (username, password, captcha)
   * @returns Promise that resolves when login is successful
   */
  function login(loginData: LoginData) {
    return new Promise<void>((resolve, reject) => {
      AuthAPI.login(loginData)
        .then((data: LoginResult) => {
          const { token, tokenHead } = data;
          // Store token in localStorage for persistence
          localStorage.setItem(TOKEN_KEY, tokenHead + token);
          resolve();
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  /**
   * Fetch current user information
   * @description Retrieves user profile including nickname, avatar, roles, and permissions.
   * @returns Promise resolving to UserInfo object
   * @throws Error if verification fails
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
   * Perform user logout
   * @description Calls logout API and clears local storage, then reloads the page.
   * @returns Promise that resolves after logout is complete
   */
  function logout() {
    return new Promise<void>((resolve, reject) => {
      AuthAPI.logout()
        .then(() => {
          // BUG FIX: Use removeItem instead of setItem("") to properly clear token
          // An empty string "" is still truthy in JavaScript, causing token checks to fail
          localStorage.removeItem(TOKEN_KEY);
          location.reload(); // Clear routes by reloading
          resolve();
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  /**
   * Reset user token and router state
   * @description Clears the stored token and resets router to initial state.
   * Used when token expires or user session is invalidated.
   * @returns Promise that resolves after reset is complete
   */
  function resetToken() {
    console.log("resetToken");
    return new Promise<void>((resolve) => {
      // BUG FIX: Use removeItem instead of setItem("") to properly clear token
      // An empty string "" would still pass truthy checks like if(hasToken)
      localStorage.removeItem(TOKEN_KEY);
      resetRouter();
      resolve();
    });
  }

  return {
    user,
    login,
    getUserInfo,
    logout,
    resetToken,
  };
});

/**
 * Hook for accessing user store outside of Vue components
 * @description Provides access to the user store instance for non-component usage.
 * @returns User store instance
 */
export function useUserStoreHook() {
  return useUserStore(store);
}
