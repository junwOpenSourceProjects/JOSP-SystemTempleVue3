/**
 * Axios HTTP Request Utility
 * @description Centralized axios instance with request/response interceptors for API handling.
 * Handles authentication tokens, error responses, and token refresh logic.
 *
 * @package utils
 */
import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { useUserStoreHook } from "@/store/modules/user";
import { ResultEnum } from "@/enums/ResultEnum";
import { TOKEN_KEY } from "@/enums/CacheEnum";

/**
 * Axios Instance
 * @description Pre-configured axios instance with base URL and timeout settings.
 */
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

 /**
  * Request Interceptor
  * @description Attaches authentication token to all outgoing requests.
  * @param config - Axios request configuration
  * @returns Modified config with Authorization header if token exists
  */
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem(TOKEN_KEY);
    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

 /**
  * Response Interceptor
  * @description Handles API responses, checks for success codes, and processes errors.
  * For binary responses (blob/arraybuffer), returns the full response object.
  * For JSON responses, extracts data on success or rejects with error message.
  *
  * @param response - Axios response object
  * @returns Data on success, Promise.reject on failure
  */
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // Check if response type is binary (blob or arraybuffer) - return full response
    if (
      response.config.responseType === "blob" ||
      response.config.responseType === "arraybuffer"
    ) {
      return response;
    }

    const { code, data, message } = response.data;
    // BUG CHECK: When code === ResultEnum.SUCCESS, returns data correctly
    // This is the expected behavior - data is extracted from response body
    if (code === ResultEnum.SUCCESS) {
      return data;
    }

    ElMessage.error(message || "系统出错");
    return Promise.reject(new Error(message || "Error"));
  },
  (error: any) => {
    // Error handler - processes API errors and user notifications
    if (error.response && error.response.data) {
      const { code, message } = error.response.data;
      if (code === ResultEnum.TOKEN_INVALID) {
        ElMessageBox.confirm("当前页面已失效，请重新登录", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          const userStore = useUserStoreHook();
          userStore.resetToken().then(() => {
            location.reload();
          });
        });
      } else {
        ElMessage.error(message || "系统出错");
      }
    } else {
      ElMessage.error(error.message || "网络请求失败");
    }
    return Promise.reject(error);
  }
);

/**
 * Export axios instance
 * @description Singleton axios instance for making HTTP requests across the application.
 */
export default service;
