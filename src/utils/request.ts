/**
 * Axios HTTP 请求封装
 * @description 封装 axios 实例，配置请求/响应拦截器，统一处理 token 认证、错误响应、Token 刷新逻辑
 *
 * @package utils
 */
import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { useUserStoreHook } from "@/store/modules/user";
import { ResultEnum } from "@/enums/ResultEnum";
import { TOKEN_KEY } from "@/enums/CacheEnum";

// Token 刷新状态标记，防止多个请求同时触发刷新
let isRefreshing = false;
// 请求队列，刷新 token 成功后重新发起
let requestQueue: ((token: string) => void)[] = [];

/**
 * 处理 token 刷新后的请求重试
 * @description 将待执行的请求放入队列，刷新成功后依次重试
 * @param token - 刷新后的新 token
 */
const processQueue = (token: string) => {
  requestQueue.forEach((callback) => callback(token));
  requestQueue = [];
};

/**
 * Axios 实例配置
 * @description 创建预配置的 axios 实例，包含基础 URL 和超时设置
 */
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // 基础 API 路径，来自环境变量
  timeout: 50000, // 请求超时时间 50 秒
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

/**
 * 请求拦截器
 * @description 在请求发送前统一处理：添加 Authorization 头（Token）
 * @param config - Axios 请求配置对象
 * @returns 修改后的配置，包含认证 Token
 */
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 localStorage 读取 Token 并添加到请求头
    const accessToken = localStorage.getItem(TOKEN_KEY);
    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
    return config;
  },
  (error: any) => {
    // 请求错误处理，直接 rejected 错误
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 * @description 统一处理响应结果：
 * - 二进制类型（blob/arraybuffer）直接返回完整响应对象
 * - JSON 类型根据 code 判定成功/失败
 * - 错误处理：Token 失效时触发刷新逻辑，其他错误弹出提示
 *
 * @param response - Axios 响应对象
 * @returns 成功时返回 data，失败时返回 Promise.reject
 */
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 二进制响应类型（文件下载等）直接返回完整响应，不做 JSON 解析
    if (
      response.config.responseType === "blob" ||
      response.config.responseType === "arraybuffer"
    ) {
      return response;
    }

    // JSON 响应解析
    const { code, data, message } = response.data;

    // 根据响应码判断请求是否成功
    if (code === ResultEnum.SUCCESS) {
      // 成功：直接返回 data 部分
      return data;
    }

    // code 不为 SUCCESS，弹出错误提示并 reject
    ElMessage.error(message || "系统出错");
    return Promise.reject(new Error(message || "Error"));
  },
  /**
   * 响应错误处理（核心：Token 刷新逻辑）
   * @description 处理接口返回的错误，包括：
   * 1. Token 失效（TOKEN_INVALID）：尝试刷新 Token 并重试请求
   * 2. 其他错误：弹出错误提示
   */
  async (error: AxiosError) => {
    // 区分是否为 HTTP 错误响应（有 response 字段）
    if (error.response && error.response.data) {
      const { code, message } = error.response.data as { code: number; message: string };

      // Token 失效处理：尝试刷新 Token
      if (code === ResultEnum.TOKEN_INVALID) {
        // 已登录状态但 Token 失效，尝试刷新
        const userStore = useUserStoreHook();

        // 如果没有正在刷新，发起刷新请求
        if (!isRefreshing) {
          isRefreshing = true;

          try {
            // 调用刷新 Token 接口（需后端支持）
            // 注意：需确保存在刷新 Token 的 API，否则此逻辑需调整
            await userStore.refreshToken?.();

            // 刷新成功后，重试所有队列中的请求
            const newToken = localStorage.getItem(TOKEN_KEY);
            if (newToken) {
              processQueue(newToken);
            }
          } catch (refreshError) {
            // 刷新失败，清空队列并跳转登录
            processQueue("");
            await userStore.resetToken();
            const redirect = encodeURIComponent(window.location.pathname);
            window.location.href = `/login?redirect=${redirect}`;
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        // 正在刷新时，将请求加入队列等待
        return new Promise((resolve) => {
          requestQueue.push((token: string) => {
            // 重新设置 Authorization 头并发起请求
            if (error.config && token) {
              error.config.headers.Authorization = token;
            }
            resolve(service(error.config!));
          });
        });
      }

      // 其他业务错误：弹出提示并 reject
      ElMessage.error(message || "系统出错");
      return Promise.reject(error);
    }

    // 网络错误或请求取消等无响应情况
    ElMessage.error(error.message || "网络请求失败");
    return Promise.reject(error);
  }
);

export default service;
