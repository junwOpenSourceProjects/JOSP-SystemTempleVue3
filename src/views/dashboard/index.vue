<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useUserStore } from "@/store/modules/user";
import DashboardAPI from "@/api/dashboard";
import type {
  UserStats,
  VisitTrend,
  DeptDistribution,
  SystemInfo,
  ActivityLog,
} from "@/api/dashboard/model";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import type { EChartsOption } from "echarts";

// 注册 ECharts 组件
use([
  CanvasRenderer,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);

defineOptions({
  name: "Dashboard",
});

const userStore = useUserStore();
const currentTime = ref(new Date());
let timer: ReturnType<typeof setInterval>;

// 统计数据
const userStats = ref<UserStats>({
  total: 0,
  active: 0,
  new: 0,
});

// 访问趋势数据
const visitTrendData = ref<VisitTrend>({
  dates: [],
  visits: [],
  pageViews: [],
});

// 部门分布数据
const deptData = ref<DeptDistribution>({
  names: [],
  values: [],
});

// 系统信息
const systemInfo = ref<SystemInfo>({
  version: "",
  nodeVersion: "",
  platform: "",
  memoryUsage: 0,
  uptime: 0,
});

// 操作日志
const activityLogs = ref<ActivityLog[]>([]);

// 加载状态
const loading = ref(false);

// 品牌色
const BRAND_COLORS = {
  brand: "#1456f0",
  primary: "#3b82f6",
  primaryLight: "#60a5fa",
  primary200: "#bfdbfe",
  pink: "#ea5ec1",
  success: "#67c23a",
  warning: "#e6a23c",
  danger: "#f56c6c",
};

// 访问趋势图表配置
const visitTrendOption = computed<EChartsOption>(() => ({
  title: {
    text: "访问趋势",
    left: 24,
    top: 16,
    textStyle: {
      fontSize: 16,
      fontWeight: 600,
      color: "#18181b",
    },
  },
  tooltip: {
    trigger: "axis",
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    borderWidth: 1,
    textStyle: { color: "#45515e" },
  },
  legend: {
    data: ["访问量", "页面浏览"],
    bottom: 16,
    textStyle: { color: "#45515e" },
  },
  grid: {
    left: "3%",
    right: "4%",
    top: "15%",
    bottom: "18%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: visitTrendData.value.dates,
    boundaryGap: false,
    axisLine: { lineStyle: { color: "#e5e7eb" } },
    axisLabel: { color: "#45515e" },
  },
  yAxis: {
    type: "value",
    axisLine: { show: false },
    splitLine: { lineStyle: { color: "#f2f3f5" } },
    axisLabel: { color: "#45515e" },
  },
  series: [
    {
      name: "访问量",
      type: "line",
      smooth: true,
      data: visitTrendData.value.visits,
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: "rgba(59, 130, 246, 0.3)" },
            { offset: 1, color: "rgba(59, 130, 246, 0.02)" },
          ],
        },
      },
      lineStyle: { width: 2, color: BRAND_COLORS.primary },
      itemStyle: { color: BRAND_COLORS.primary },
      symbol: "circle",
      symbolSize: 6,
    },
    {
      name: "页面浏览",
      type: "line",
      smooth: true,
      data: visitTrendData.value.pageViews,
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: "rgba(103, 194, 58, 0.3)" },
            { offset: 1, color: "rgba(103, 194, 58, 0.02)" },
          ],
        },
      },
      lineStyle: { width: 2, color: BRAND_COLORS.success },
      itemStyle: { color: BRAND_COLORS.success },
      symbol: "circle",
      symbolSize: 6,
    },
  ],
}));

// 部门分布饼图配置
const deptPieOption = computed<EChartsOption>(() => ({
  title: {
    text: "部门分布",
    left: 24,
    top: 16,
    textStyle: {
      fontSize: 16,
      fontWeight: 600,
      color: "#18181b",
    },
  },
  tooltip: {
    trigger: "item",
    formatter: "{b}: {c} ({d}%)",
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    borderWidth: 1,
    textStyle: { color: "#45515e" },
  },
  legend: {
    orient: "vertical",
    right: "5%",
    top: "center",
    textStyle: { color: "#45515e" },
  },
  series: [
    {
      type: "pie",
      radius: ["45%", "70%"],
      center: ["38%", "55%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 8,
        borderColor: "#ffffff",
        borderWidth: 3,
      },
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 13, fontWeight: "bold", color: "#18181b" },
      },
      data: deptData.value.names.map((name: string, index: number) => ({
        value: deptData.value.values[index],
        name,
        itemStyle: {
          color: [
            BRAND_COLORS.brand,
            BRAND_COLORS.primary,
            BRAND_COLORS.primaryLight,
            "#93c5fd",
            BRAND_COLORS.primary200,
          ][index % 5],
        },
      })),
    },
  ],
}));

// 获取问候语
const getGreeting = () => {
  const hour = currentTime.value.getHours();
  if (hour < 6) return "凌晨好";
  if (hour < 9) return "早上好";
  if (hour < 12) return "上午好";
  if (hour < 14) return "中午好";
  if (hour < 18) return "下午好";
  if (hour < 22) return "晚上好";
  return "夜深了";
};

// 格式化日期
const formatDate = () => {
  const d = currentTime.value;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const week = weekdays[d.getDay()];
  return `${year}年${month}月${day}日 星期${week}`;
};

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 10000) return (num / 10000).toFixed(1) + "w";
  return num.toLocaleString();
};

// 加载所有数据
const loadData = async () => {
  loading.value = true;
  try {
    const [stats, trend, dept, sys, logs] = await Promise.all([
      DashboardAPI.getUserStats(),
      DashboardAPI.getVisitTrend(),
      DashboardAPI.getDeptDistribution(),
      DashboardAPI.getSystemInfo(),
      DashboardAPI.getActivityLogs(),
    ]);
    userStats.value = stats;
    visitTrendData.value = trend;
    deptData.value = dept;
    systemInfo.value = sys;
    activityLogs.value = logs;
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
  timer = setInterval(() => {
    currentTime.value = new Date();
  }, 1000 * 60);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <div class="dashboard-container">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1 class="welcome-title">
          {{ getGreeting() }}，{{ userStore.user.nickname || "管理员" }}
          <span class="wave">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </span>
        </h1>
        <p class="welcome-date">{{ formatDate() }}</p>
      </div>
      <div class="welcome-illustration">
        <div class="illustration-circle circle-1"></div>
        <div class="illustration-circle circle-2"></div>
        <div class="illustration-circle circle-3"></div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :lg="8">
        <div class="stat-card stat-card--blue">
          <div class="stat-icon">
            <i class="i-carbon-user-multiple"></i>
          </div>
          <div class="stat-body">
            <p class="stat-label">用户总数</p>
            <p class="stat-value">{{ formatNumber(userStats.total) }}</p>
            <p class="stat-desc">
              <i class="i-carbon-arrow-up"></i>
              较上月 +12.5%
            </p>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8">
        <div class="stat-card stat-card--green">
          <div class="stat-icon">
            <i class="i-carbon-user-online"></i>
          </div>
          <div class="stat-body">
            <p class="stat-label">活跃用户</p>
            <p class="stat-value">{{ formatNumber(userStats.active) }}</p>
            <p class="stat-desc">
              <i class="i-carbon-arrow-up"></i>
              较上月 +8.3%
            </p>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8">
        <div class="stat-card stat-card--pink">
          <div class="stat-icon">
            <i class="i-carbon-user-new"></i>
          </div>
          <div class="stat-body">
            <p class="stat-label">新增用户</p>
            <p class="stat-value">+{{ formatNumber(userStats.new) }}</p>
            <p class="stat-desc">
              <i class="i-carbon-arrow-up"></i>
              较上月 +5.2%
            </p>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-row">
      <el-col :xs="24" :lg="16">
        <div class="chart-card">
          <v-chart
            class="chart"
            :option="visitTrendOption"
            autoresize
          />
        </div>
      </el-col>
      <el-col :xs="24" :lg="8">
        <div class="chart-card">
          <v-chart
            class="chart"
            :option="deptPieOption"
            autoresize
          />
        </div>
      </el-col>
    </el-row>

    <!-- 日志和系统信息 -->
    <el-row :gutter="20" class="bottom-row">
      <el-col :xs="24" :lg="14">
        <div class="log-card">
          <div class="log-header">
            <h3 class="log-title">最近操作日志</h3>
          </div>
          <div class="log-list">
            <div
              v-for="log in activityLogs"
              :key="log.id"
              class="log-item"
            >
              <div class="log-status">
                <span
                  class="status-dot"
                  :class="`status-dot--${log.status}`"
                ></span>
              </div>
              <div class="log-body">
                <p class="log-action">
                  <span class="log-user">{{ log.user }}</span>
                  {{ log.action }}
                </p>
                <p class="log-meta">
                  <span class="log-module">{{ log.module }}</span>
                  <span class="log-time">{{ log.time }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :lg="10">
        <div class="system-card">
          <div class="system-header">
            <h3 class="system-title">系统信息</h3>
          </div>
          <div class="system-body">
            <div class="system-item">
              <span class="system-label">系统版本</span>
              <span class="system-value">v{{ systemInfo.version }}</span>
            </div>
            <div class="system-item">
              <span class="system-label">Node版本</span>
              <span class="system-value">{{ systemInfo.nodeVersion }}</span>
            </div>
            <div class="system-item">
              <span class="system-label">运行平台</span>
              <span class="system-value">{{ systemInfo.platform }}</span>
            </div>
            <div class="system-item">
              <span class="system-label">内存占用</span>
              <div class="memory-bar">
                <el-progress
                  :percentage="systemInfo.memoryUsage"
                  :stroke-width="8"
                  :color="
                    systemInfo.memoryUsage > 80
                      ? BRAND_COLORS.danger
                      : systemInfo.memoryUsage > 60
                        ? BRAND_COLORS.warning
                        : BRAND_COLORS.success
                  "
                  :show-text="false"
                />
                <span class="memory-text">{{ systemInfo.memoryUsage }}%</span>
              </div>
            </div>
            <div class="system-item">
              <span class="system-label">运行时间</span>
              <span class="system-value">{{ systemInfo.uptime }} 小时</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

// 欢迎区域
.welcome-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 32px;
  background: linear-gradient(135deg, #1456f0 0%, #1e3a8a 100%);
  border-radius: 20px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
  }
}

.welcome-content {
  position: relative;
  z-index: 1;
}

.welcome-title {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: 28px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.3;

  .wave {
    display: inline-block;
    animation: wave 1.2s ease-in-out infinite;
  }
}

@keyframes wave {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(20deg);
  }
  75% {
    transform: rotate(-15deg);
  }
}

.welcome-date {
  margin: 8px 0 0;
  font-family: var(--font-family-ui);
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.welcome-illustration {
  position: absolute;
  right: 32px;
  top: 50%;
  transform: translateY(-50%);
}

.illustration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
}

.circle-1 {
  width: 120px;
  height: 120px;
  right: 0;
  top: -40px;
}

.circle-2 {
  width: 80px;
  height: 80px;
  right: 100px;
  top: -20px;
}

.circle-3 {
  width: 50px;
  height: 50px;
  right: 60px;
  top: 30px;
}

// 统计卡片
.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: #ffffff;
  border-radius: var(--radius-generous);
  box-shadow: var(--shadow-brand-purple-offset);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-bottom: 20px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-brand-purple);
  }
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #ffffff;
  flex-shrink: 0;
}

.stat-card--blue .stat-icon {
  background: linear-gradient(135deg, #1456f0, #3b82f6);
}

.stat-card--green .stat-icon {
  background: linear-gradient(135deg, #67c23a, #85ce61);
}

.stat-card--pink .stat-icon {
  background: linear-gradient(135deg, #ea5ec1, #f56c6c);
}

.stat-body {
  flex: 1;
  min-width: 0;
}

.stat-label {
  margin: 0;
  font-size: 13px;
  color: #8e8e93;
  line-height: 1.5;
}

.stat-value {
  margin: 4px 0;
  font-family: var(--font-family-display);
  font-size: 26px;
  font-weight: 600;
  color: #18181b;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.stat-desc {
  margin: 0;
  font-size: 12px;
  color: #67c23a;
  display: flex;
  align-items: center;
  gap: 4px;
}

// 图表区域
.charts-row {
  margin-bottom: 20px;
}

.chart-card {
  background: #ffffff;
  border-radius: var(--radius-generous);
  box-shadow: var(--shadow-brand-purple-offset);
  padding: 8px 0;
  margin-bottom: 20px;
  height: 360px;
}

.chart {
  width: 100%;
  height: 100%;
}

// 日志卡片
.log-card {
  background: #ffffff;
  border-radius: var(--radius-generous);
  box-shadow: var(--shadow-brand-purple-offset);
  margin-bottom: 20px;
  overflow: hidden;
}

.log-header,
.system-header {
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f2f3f5;
}

.log-title,
.system-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #18181b;
}

.log-list {
  padding: 8px 0;
  max-height: 340px;
  overflow-y: auto;
}

.log-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 24px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9fafb;
  }
}

.log-status {
  padding-top: 6px;
}

.status-dot {
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #dcdfe6;
}

.status-dot--success {
  background: #67c23a;
}

.status-dot--warning {
  background: #e6a23c;
}

.status-dot--danger {
  background: #f56c6c;
}

.log-body {
  flex: 1;
  min-width: 0;
}

.log-action {
  margin: 0;
  font-size: 14px;
  color: #45515e;
  line-height: 1.5;
}

.log-user {
  color: #18181b;
  font-weight: 500;
  margin-right: 4px;
}

.log-meta {
  margin: 4px 0 0;
  font-size: 12px;
  color: #8e8e93;
  display: flex;
  gap: 12px;
}

// 系统信息卡片
.system-card {
  background: #ffffff;
  border-radius: var(--radius-generous);
  box-shadow: var(--shadow-brand-purple-offset);
  margin-bottom: 20px;
  overflow: hidden;
}

.system-body {
  padding: 16px 24px 20px;
}

.system-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f9fafb;

  &:last-child {
    border-bottom: none;
  }
}

.system-label {
  font-size: 14px;
  color: #45515e;
}

.system-value {
  font-size: 14px;
  color: #18181b;
  font-weight: 500;
}

.memory-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  margin-left: 16px;

  :deep(.el-progress) {
    flex: 1;
  }
}

.memory-text {
  font-size: 13px;
  color: #45515e;
  min-width: 36px;
  text-align: right;
}

// 响应式
@media (max-width: 768px) {
  .dashboard-container {
    padding: 16px;
  }

  .welcome-section {
    padding: 20px;
  }

  .welcome-title {
    font-size: 20px;
  }

  .welcome-illustration {
    display: none;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-value {
    font-size: 22px;
  }

  .chart-card {
    height: 300px;
  }
}
</style>
