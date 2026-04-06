<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts";
import DashboardAPI from "@/api/dashboard";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// 统计数据
const stats = ref({
  totalUsers: 0,
  totalOrders: 0,
  totalRevenue: 0,
  growthRate: 0,
  todayVisits: 0,
  yesterdayVisits: 0,
});

// 加载状态
const loading = ref(false);

// 图表实例
let weeklyChart: echarts.ECharts | null = null;
let categoryChart: echarts.ECharts | null = null;
let salesChart: echarts.ECharts | null = null;

// 图表容器
const weeklyChartRef = ref<HTMLDivElement>();
const categoryChartRef = ref<HTMLDivElement>();
const salesChartRef = ref<HTMLDivElement>();

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + "w";
  }
  return num.toLocaleString();
};

// 刷新数据
const handleRefresh = async () => {
  loading.value = true;
  await Promise.all([loadStats(), loadCharts()]);
  loading.value = false;
};

// 加载统计数据
const loadStats = async () => {
  try {
    const data = await DashboardAPI.getStats();
    stats.value = data;
  } catch (error) {
    console.error("Failed to load stats:", error);
  }
};

// 初始化周访问趋势图
const initWeeklyChart = (data: { xAxis: string[]; visits: number[]; pageViews: number[] }) => {
  if (!weeklyChartRef.value) return;

  weeklyChart = echarts.init(weeklyChartRef.value);
  weeklyChart.setOption({
    title: { text: "周访问趋势", left: "center", textStyle: { fontSize: 16 } },
    tooltip: { trigger: "axis" },
    legend: { data: ["访问量", "页面浏览"], bottom: 0 },
    grid: { left: "3%", right: "4%", bottom: "15%", top: "15%", containLabel: true },
    xAxis: {
      type: "category",
      data: data.xAxis,
      boundaryGap: false,
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "访问量",
        type: "line",
        smooth: true,
        data: data.visits,
        areaStyle: { opacity: 0.3 },
        lineStyle: { width: 2 },
        itemStyle: { color: "#409eff" },
      },
      {
        name: "页面浏览",
        type: "line",
        smooth: true,
        data: data.pageViews,
        areaStyle: { opacity: 0.3 },
        lineStyle: { width: 2 },
        itemStyle: { color: "#67c23a" },
      },
    ],
  });
};

// 初始化分类占比图
const initCategoryChart = (data: { categories: string[]; values: number[] }) => {
  if (!categoryChartRef.value) return;

  categoryChart = echarts.init(categoryChartRef.value);
  categoryChart.setOption({
    title: { text: "分类占比", left: "center", textStyle: { fontSize: 16 } },
    tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
    legend: { orient: "vertical", right: "5%", top: "center" },
    series: [
      {
        type: "pie",
        radius: ["40%", "65%"],
        center: ["40%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: "#fff", borderWidth: 2 },
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: "bold" },
        },
        data: data.categories.map((name, index) => ({
          value: data.values[index],
          name,
          itemStyle: {
            color: ["#409eff", "#67c23a", "#e6a23c", "#f56c6c", "#909399"][index % 5],
          },
        })),
      },
    ],
  });
};

// 初始化月度销售图
const initSalesChart = (data: { months: string[]; sales: number[]; target: number[] }) => {
  if (!salesChartRef.value) return;

  salesChart = echarts.init(salesChartRef.value);
  salesChart.setOption({
    title: { text: "月度销售", left: "center", textStyle: { fontSize: 16 } },
    tooltip: { trigger: "axis" },
    legend: { data: ["实际销售", "目标"], bottom: 0 },
    grid: { left: "3%", right: "4%", bottom: "15%", top: "15%", containLabel: true },
    xAxis: { type: "category", data: data.months },
    yAxis: { type: "value" },
    series: [
      {
        name: "实际销售",
        type: "bar",
        data: data.sales,
        itemStyle: { color: "#409eff", borderRadius: [4, 4, 0, 0] },
        barWidth: "30%",
      },
      {
        name: "目标",
        type: "line",
        data: data.target,
        lineStyle: { color: "#e6a23c", width: 2 },
        itemStyle: { color: "#e6a23c" },
        symbol: "circle",
      },
    ],
  });
};

// 加载图表数据
const loadCharts = async () => {
  try {
    const [weekly, category, sales] = await Promise.all([
      DashboardAPI.getWeeklyVisits(),
      DashboardAPI.getCategoryRatio(),
      DashboardAPI.getMonthlySales(),
    ]);

    initWeeklyChart(weekly);
    initCategoryChart(category);
    initSalesChart(sales);
  } catch (error) {
    console.error("Failed to load charts:", error);
  }
};

// 窗口调整时重绘图表
const handleResize = () => {
  weeklyChart?.resize();
  categoryChart?.resize();
  salesChart?.resize();
};

onMounted(() => {
  loadStats();
  loadCharts();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  weeklyChart?.dispose();
  categoryChart?.dispose();
  salesChart?.dispose();
});
</script>

<template>
  <div class="dashboard-container">
    <!-- 操作栏 -->
    <div class="操作栏">
      <el-button type="primary" :loading="loading" @click="handleRefresh">
        <i class="i-ep-refresh mr-1" />
        刷新数据
      </el-button>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon users">
              <i class="i-carbon-user-multiple"></i>
            </div>
            <div class="stat-info">
              <p class="stat-label">总用户数</p>
              <p class="stat-value">{{ formatNumber(stats.totalUsers) }}</p>
              <p class="stat-growth">
                <i class="i-carbon-arrow-up"></i>
                12.5%
              </p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon orders">
              <i class="i-carbon-document"></i>
            </div>
            <div class="stat-info">
              <p class="stat-label">总订单数</p>
              <p class="stat-value">{{ formatNumber(stats.totalOrders) }}</p>
              <p class="stat-growth">
                <i class="i-carbon-arrow-up"></i>
                8.3%
              </p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon revenue">
              <i class="i-carbon-currency"></i>
            </div>
            <div class="stat-info">
              <p class="stat-label">总收入</p>
              <p class="stat-value">¥{{ formatNumber(stats.totalRevenue) }}</p>
              <p class="stat-growth">
                <i class="i-carbon-arrow-up"></i>
                {{ stats.growthRate }}%
              </p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon visits">
              <i class="i-carbon-view"></i>
            </div>
            <div class="stat-info">
              <p class="stat-label">今日访问</p>
              <p class="stat-value">{{ formatNumber(stats.todayVisits) }}</p>
              <p class="stat-growth">
                <i class="i-carbon-arrow-up"></i>
                {{ Math.round((stats.todayVisits / stats.yesterdayVisits - 1) * 100) }}%
              </p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-row">
      <el-col :span="16">
        <el-card shadow="hover">
          <div ref="weeklyChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div ref="categoryChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-row">
      <el-col :span="24">
        <el-card shadow="hover">
          <div ref="salesChartRef" class="chart-container-large"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.操作栏 {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

.stats-row {
  margin-bottom: 20px;
}

.charts-row {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 12px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #fff;
}

.stat-icon.users {
  background: linear-gradient(135deg, #409eff, #66b1ff);
}

.stat-icon.orders {
  background: linear-gradient(135deg, #67c23a, #85ce61);
}

.stat-icon.revenue {
  background: linear-gradient(135deg, #e6a23c, #ebb563);
}

.stat-icon.visits {
  background: linear-gradient(135deg, #f56c6c, #f78989);
}

.stat-info {
  flex: 1;
}

.stat-label {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.stat-value {
  margin: 4px 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.stat-growth {
  margin: 0;
  font-size: 12px;
  color: #67c23a;
  display: flex;
  align-items: center;
  gap: 4px;
}

.chart-container {
  height: 320px;
}

.chart-container-large {
  height: 300px;
}
</style>
