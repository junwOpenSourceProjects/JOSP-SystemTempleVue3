import request from "@/utils/request";

export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  growthRate: number;
  todayVisits: number;
  yesterdayVisits: number;
}

export interface WeeklyVisits {
  xAxis: string[];
  visits: number[];
  pageViews: number[];
}

export interface CategoryRatio {
  categories: string[];
  values: number[];
}

export interface MonthlySales {
  months: string[];
  sales: number[];
  target: number[];
}

class DashboardAPI {
  static getStats() {
    return request<any, DashboardStats>({
      url: "/api/v1/dashboard/stats",
      method: "get",
    });
  }

  static getWeeklyVisits() {
    return request<any, WeeklyVisits>({
      url: "/api/v1/dashboard/weekly-visits",
      method: "get",
    });
  }

  static getCategoryRatio() {
    return request<any, CategoryRatio>({
      url: "/api/v1/dashboard/category-ratio",
      method: "get",
    });
  }

  static getMonthlySales() {
    return request<any, MonthlySales>({
      url: "/api/v1/dashboard/monthly-sales",
      method: "get",
    });
  }
}

export default DashboardAPI;
