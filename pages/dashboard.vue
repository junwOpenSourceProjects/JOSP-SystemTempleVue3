<template>
  <div class="dashboard-page">
    <div class="page-header">
      <h1 class="font-display">仪表盘</h1>
      <p class="text-muted">系统数据概览</p>
    </div>

    <div class="stats-grid">
      <div class="card stat-card">
        <UIcon name="i-ph-users" class="stat-icon" />
        <div class="stat-content">
          <span class="stat-value font-display">{{ stats.users || 0 }}</span>
          <span class="stat-label">用户总数</span>
        </div>
      </div>
      
      <div class="card stat-card">
        <UIcon name="i-ph-chart-line" class="stat-icon" />
        <div class="stat-content">
          <span class="stat-value font-display">{{ stats.views || 0 }}</span>
          <span class="stat-label">访问量</span>
        </div>
      </div>
      
      <div class="card stat-card">
        <UIcon name="i-ph-file-text" class="stat-icon" />
        <div class="stat-content">
          <span class="stat-value font-display">{{ stats.posts || 0 }}</span>
          <span class="stat-label">文章数</span>
        </div>
      </div>
      
      <div class="card stat-card">
        <UIcon name="i-ph-clock" class="stat-icon" />
        <div class="stat-content">
          <span class="stat-value font-display">{{ stats.uptime }}</span>
          <span class="stat-label">运行时间</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const stats = ref({
  users: 0,
  views: 0,
  posts: 0,
  uptime: '0天0时0分'
})
</script>

<style scoped>
.dashboard-page {
  padding-bottom: 64px;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  border-radius: 20px;
}

.stat-icon {
  font-size: 32px;
  color: var(--color-brand);
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text);
}

.stat-label {
  font-size: 14px;
  color: var(--color-text-muted);
}
</style>