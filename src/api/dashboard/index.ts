import request from "@/utils/request";
import type {
  UserStats,
  VisitTrend,
  DeptDistribution,
  SystemInfo,
  ActivityLog,
} from "./model";

class DashboardAPI {
  /**
   * 获取用户统计
   */
  static getUserStats() {
    return request<any, UserStats>({
      url: "/api/v1/dashboard/stats",
      method: "get",
    });
  }

  /**
   * 获取访问趋势
   */
  static getVisitTrend() {
    return request<any, VisitTrend>({
      url: "/api/v1/dashboard/visit-trend",
      method: "get",
    });
  }

  /**
   * 获取部门分布
   */
  static getDeptDistribution() {
    return request<any, DeptDistribution>({
      url: "/api/v1/dashboard/dept-distribution",
      method: "get",
    });
  }

  /**
   * 获取系统信息
   */
  static getSystemInfo() {
    return request<any, SystemInfo>({
      url: "/api/v1/dashboard/system-info",
      method: "get",
    });
  }

  /**
   * 获取操作日志
   */
  static getActivityLogs() {
    return request<any, ActivityLog[]>({
      url: "/api/v1/dashboard/activity-logs",
      method: "get",
    });
  }
}

export default DashboardAPI;
