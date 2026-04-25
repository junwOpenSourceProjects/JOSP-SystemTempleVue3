import request from "@/utils/request";
import { LoginLogQuery, LoginLogPageVO } from "./model";

const LOGIN_LOG_BASE_URL = "/api/v1/login-logs";

class LoginLogAPI {
  static getPage(queryParams: LoginLogQuery) {
    return request<any, any>({
      url: `${LOGIN_LOG_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  }

  static delete(id: number) {
    return request({
      url: `${LOGIN_LOG_BASE_URL}/${id}`,
      method: "delete",
    });
  }

  static deleteBatch(ids: number[]) {
    return request({
      url: `${LOGIN_LOG_BASE_URL}/batch`,
      method: "delete",
      data: ids,
    });
  }

  static clean(days: number) {
    return request({
      url: `${LOGIN_LOG_BASE_URL}/clean`,
      method: "delete",
      params: { days },
    });
  }
}

export default LoginLogAPI;
