import request from "@/utils/request";
import { LoginLogQuery, LoginLogPageVO } from "./loginLog/model";

const LOGIN_LOG_BASE_URL = "/api/v1/login-logs";

class LoginLogAPI {
  /**
   * 获取登录日志分页列表
   *
   * @param queryParams 查询参数
   * @returns 登录日志分页列表
   */
  static getPage(queryParams: LoginLogQuery) {
    return request<any, PageResult<LoginLogPageVO[]>>({
      url: `${LOGIN_LOG_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  }

  /**
   * 删除登录日志
   *
   * @param id 登录日志ID
   * @returns 请求结果
   */
  static delete(id: number) {
    return request({
      url: `${LOGIN_LOG_BASE_URL}/${id}`,
      method: "delete",
    });
  }

  /**
   * 批量删除登录日志
   *
   * @param ids 登录日志ID数组
   * @returns 请求结果
   */
  static deleteBatch(ids: number[]) {
    return request({
      url: `${LOGIN_LOG_BASE_URL}/batch`,
      method: "delete",
      data: ids,
    });
  }

  /**
   * 清理登录日志
   *
   * @param days 清理多少天前的日志
   * @returns 请求结果
   */
  static clean(days: number) {
    return request({
      url: `${LOGIN_LOG_BASE_URL}/clean`,
      method: "delete",
      params: { days },
    });
  }
}

export default LoginLogAPI;
