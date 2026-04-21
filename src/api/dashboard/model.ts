/**
 * Dashboard data model
 */

export interface UserStats {
  total: number;
  active: number;
  new: number;
}

export interface VisitTrend {
  dates: string[];
  visits: number[];
  pageViews: number[];
}

export interface DeptDistribution {
  names: string[];
  values: number[];
}

export interface SystemInfo {
  version: string;
  nodeVersion: string;
  platform: string;
  memoryUsage: number;
  uptime: number;
}

export interface ActivityLog {
  id: number;
  user: string;
  action: string;
  module: string;
  time: string;
  status: "success" | "warning" | "danger";
}

export interface DashboardData {
  userStats: UserStats;
  visitTrend: VisitTrend;
  deptDistribution: DeptDistribution;
  systemInfo: SystemInfo;
  activityLogs: ActivityLog[];
}
