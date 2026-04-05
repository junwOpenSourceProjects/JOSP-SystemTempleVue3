import request from "@/utils/request";
import { CaptchaResult, LoginData, LoginResult } from "./model";

const AUTH_BASE_URL = "/api/v1/auth";

class AuthAPI {
  /**
   * 登录API
   *
   * @param data 登录数据
   * @returns 登录结果
   */
  static login(data: LoginData) {
    return request<any, LoginResult>({
      url: `${AUTH_BASE_URL}/login`,
      method: "post",
      data,
    });
  }

  /**
   * 注销API
   *
   * @returns 请求结果
   */
  static logout() {
    return request({
      url: `${AUTH_BASE_URL}/logout`,
      method: "post",
    });
  }

  /**
   * 获取当前用户信息
   */
  static getUserInfo() {
    return request<any, any>({
      url: `${AUTH_BASE_URL}/me`,
      method: "get",
    });
  }

  /**
   * 获取验证码
   *
   * @returns 验证码结果
   */
  static getCaptcha() {
    return request<any, CaptchaResult>({
      url: `${AUTH_BASE_URL}/captcha`,
      method: "get",
    });
  }
}

export default AuthAPI;
