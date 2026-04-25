<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getMonitorInfo } from '@/api/monitor'
import type { MonitorVO } from '@/api/monitor'

// 监控数据
const monitorData = ref<MonitorVO | null>(null)

// 加载状态
const loading = ref(false)

// 最后更新时间
const lastUpdateTime = ref('')

// 格式化字节大小
const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// 格式化内存大小
const formatMemory = (bytes: number) => {
  if (bytes === 0) return '0 GB'
  const gb = bytes / 1024 / 1024 / 1024
  return gb.toFixed(2) + ' GB'
}

// 格式化百分比
const formatPercent = (value: number) => {
  return (value || 0).toFixed(1) + '%'
}

// 获取CPU使用率样式
const getCpuStyle = (used: number) => {
  const percent = used || 0
  let type = 'success'
  if (percent > 80) type = 'danger'
  else if (percent > 60) type = 'warning'
  return { width: percent + '%', type }
}

// 获取内存使用率样式
const getMemoryStyle = (usage: number) => {
  const percent = usage || 0
  let type = 'success'
  if (percent > 80) type = 'danger'
  else if (percent > 60) type = 'warning'
  return { width: percent + '%', type }
}

// 获取磁盘使用率样式
const getDiskStyle = (usage: number) => {
  const percent = usage || 0
  let type = 'success'
  if (percent > 80) type = 'danger'
  else if (percent > 60) type = 'warning'
  return { width: percent + '%', type }
}

// 加载监控数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getMonitorInfo()
    monitorData.value = res.data?.data
    lastUpdateTime.value = new Date().toLocaleString()
  } catch (error) {
    ElMessage.error('加载监控数据失败')
  } finally {
    loading.value = false
  }
}

// 刷新数据
const handleRefresh = () => {
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="monitor-container" v-loading="loading">
    <!-- 操作栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <span class="last-update">最后更新: {{ lastUpdateTime }}</span>
      </div>
      <div class="toolbar-right">
        <el-button type="primary" @click="handleRefresh">刷新</el-button>
      </div>
    </div>

    <template v-if="monitorData">
      <!-- 服务器信息 -->
      <el-card class="monitor-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span class="card-title">服务器信息</span>
          </div>
        </template>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="服务器名称">{{ monitorData.server?.sys?.computerName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="服务器IP">{{ monitorData.server?.sys?.computerIp || '-' }}</el-descriptions-item>
          <el-descriptions-item label="操作系统">{{ monitorData.server?.sys?.osName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="系统架构">{{ monitorData.server?.sys?.osArch || '-' }}</el-descriptions-item>
          <el-descriptions-item label="CPU核心数">{{ monitorData.server?.cpu?.count || '-' }}</el-descriptions-item>
          <el-descriptions-item label="JVM版本">{{ monitorData.server?.jvm?.version || '-' }}</el-descriptions-item>
          <el-descriptions-item label="JVM名称">{{ monitorData.server?.jvm?.name || '-' }}</el-descriptions-item>
          <el-descriptions-item label="JVM总内存">{{ formatMemory(monitorData.server?.jvm?.max || 0) }}</el-descriptions-item>
          <el-descriptions-item label="JVM已用内存">{{ formatMemory(monitorData.server?.jvm?.used || 0) }}</el-descriptions-item>
        </el-descriptions>

        <!-- CPU使用率 -->
        <div class="progress-item">
          <span class="progress-label">CPU使用率</span>
          <el-progress :percentage="monitorData.server?.cpu?.used || 0" :color="getCpuStyle(monitorData.server?.cpu?.used || 0).type" />
        </div>

        <!-- 内存使用率 -->
        <div class="progress-item">
          <span class="progress-label">内存使用率</span>
          <el-progress :percentage="monitorData.server?.memory?.usage || 0" :color="getMemoryStyle(monitorData.server?.memory?.usage || 0).type" />
        </div>

        <!-- 磁盘使用率 -->
        <div class="progress-item">
          <span class="progress-label">磁盘使用率</span>
          <el-progress :percentage="monitorData.server?.disk?.usage || 0" :color="getDiskStyle(monitorData.server?.disk?.usage || 0).type" />
        </div>
      </el-card>

      <!-- 数据库信息 -->
      <el-card class="monitor-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span class="card-title">数据库信息</span>
          </div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="数据库名称">{{ monitorData.database?.name || '-' }}</el-descriptions-item>
          <el-descriptions-item label="数据库类型">{{ monitorData.database?.type || '-' }}</el-descriptions-item>
          <el-descriptions-item label="版本">{{ monitorData.database?.version || '-' }}</el-descriptions-item>
          <el-descriptions-item label="数据表数量">{{ monitorData.database?.tables || '-' }}</el-descriptions-item>
          <el-descriptions-item label="数据库大小">{{ formatBytes(monitorData.database?.size || 0) }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- Redis信息 -->
      <el-card class="monitor-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span class="card-title">Redis信息</span>
          </div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="Redis版本">{{ monitorData.redis?.version || '-' }}</el-descriptions-item>
          <el-descriptions-item label="运行模式">{{ monitorData.redis?.mode || '-' }}</el-descriptions-item>
          <el-descriptions-item label="已连接客户端">{{ monitorData.redis?.connectedClients || '-' }}</el-descriptions-item>
          <el-descriptions-item label="已用内存">{{ monitorData.redis?.usedMemoryHuman || '-' }}</el-descriptions-item>
          <el-descriptions-item label="运行时间">{{ monitorData.redis?.uptimeInDays || '-' }} 天</el-descriptions-item>
          <el-descriptions-item label="总运行时长">{{ monitorData.redis?.uptime || 0 }} 秒</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </template>

    <!-- 无数据提示 -->
    <el-empty v-else description="暂无监控数据" />
  </div>
</template>

<style scoped>
.monitor-container {
  max-width: 1400px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toolbar-left {
  display: flex;
  align-items: center;
}

.last-update {
  font-size: 14px;
  color: #909399;
}

.toolbar-right {
  display: flex;
  gap: 12px;
}

.monitor-card {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-weight: bold;
  font-size: 16px;
}

.progress-item {
  margin-top: 20px;
}

.progress-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
}
</style>
