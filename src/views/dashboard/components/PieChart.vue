<!-- 饼图 -->
<template>
  <el-card>
    <template #header> {{ $t('dashboard.pieChartTitle') }} </template>
    <div :id="id" :class="className" :style="{ height, width }"></div>
  </el-card>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { DashboardAPI } from "@/api/dashboard";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  id: {
    type: String,
    default: "pieChart",
  },
  className: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "200px",
    required: true,
  },
  height: {
    type: String,
    default: "200px",
    required: true,
  },
});
const options: any = {
  grid: {
    left: "2%",
    right: "2%",
    bottom: "10%",
    containLabel: true,
  },
  legend: {
    top: "bottom",
    textStyle: {
      color: "#999",
    },
  },
  series: [
    {
      name: t('dashboard.pieChartName'),
      type: "pie",
      radius: [50, 130],
      center: ["50%", "50%"],
      roseType: "area",
      itemStyle: {
        borderRadius: 1,
        color: function (params: any) {
          //自定义颜色
          const colorList = ["#409EFF", "#F56C6C", "#E6A23C", "#67C23A"];
          return colorList[params.dataIndex];
        },
      },
      data: [],
    },
  ],
};

const chart = ref<any>("");

onMounted(() => {
  chart.value = markRaw(
    echarts.init(document.getElementById(props.id) as HTMLDivElement)
  );

  DashboardAPI.getPieChart().then(res => {
    if (res && res.series && res.series.length > 0) {
      options.series[0].data = res.series[0].data;
      chart.value.setOption(options);
    }
  });

  window.addEventListener("resize", () => {
    chart.value.resize();
  });
});

onActivated(() => {
  if (chart.value) {
    chart.value.resize();
  }
});
</script>
