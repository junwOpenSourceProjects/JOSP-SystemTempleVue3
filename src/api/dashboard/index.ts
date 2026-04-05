import request from "@/utils/request";

export interface DashboardStats {
  userCount: number;
  menuCount: number;
  roleCount: number;
  loginCount: number;
}

export interface ChartSeries {
  name: string;
  type: string;
  data: any[];
}

export interface ChartData {
  labels: string[];
  series: ChartSeries[];
}

export class DashboardAPI {
  /**
   * 获取顶部统计数据
   */
  static getStats() {
    return request<any, DashboardStats>({
      url: "/api/v1/dashboard/stats",
      method: "get",
    });
  }

  /**
   * 获取饼图数据
   */
  static getPieChart() {
    return request<any, ChartData>({
      url: "/api/v1/dashboard/chart/pie",
      method: "get",
    });
  }

  /**
   * 获取柱状图数据
   */
  static getBarChart() {
    return request<any, ChartData>({
      url: "/api/v1/dashboard/chart/bar",
      method: "get",
    });
  }
}
