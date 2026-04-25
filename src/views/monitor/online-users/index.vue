<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { OnlineUser, PageResult } from '@/api/onlineUser'
import { getOnlineUserPage, forceLogout, logoutAll, getOnlineUserCount } from '@/api/onlineUser'

// 搜索表单
const searchForm = ref({
  username: ''
})

// 分页参数
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 在线人数
const onlineCount = ref(0)

// 表格数据
const tableData = ref<OnlineUser[]>([])

// 加载状态
const loading = ref(false)

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: pagination.value.pageNum,
      pageSize: pagination.value.pageSize,
      username: searchForm.value.username
    }
    const res = await getOnlineUserPage(params)
    const result: PageResult<OnlineUser> = res.data?.data || { list: [], total: 0, pageNum: 1, pageSize: 10 }
    tableData.value = result.list || []
    pagination.value.total = result.total || 0
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 加载在线人数
const loadOnlineCount = async () => {
  try {
    const res = await getOnlineUserCount()
    onlineCount.value = res.data?.data || 0
  } catch (error) {
    console.error('获取在线人数失败', error)
  }
}

// 搜索
const handleSearch = () => {
  pagination.value.pageNum = 1
  loadData()
}

// 重置搜索
const handleReset = () => {
  searchForm.value.username = ''
  handleSearch()
}

// 分页变化
const handlePageChange = (page: number) => {
  pagination.value.pageNum = page
  loadData()
}

// 每页条数变化
const handleSizeChange = (size: number) => {
  pagination.value.pageSize = size
  pagination.value.pageNum = 1
  loadData()
}

// 强制下线
const handleForceLogout = async (row: OnlineUser) => {
  try {
    await ElMessageBox.confirm(`确定要强制下线用户 "${row.nickname}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await forceLogout(row.token)
    ElMessage.success('下线成功')
    loadData()
    loadOnlineCount()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('下线失败')
    }
  }
}

// 全部下线
const handleLogoutAll = async () => {
  try {
    await ElMessageBox.confirm('确定要强制所有在线用户下线吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await logoutAll()
    ElMessage.success('全部下线成功')
    loadData()
    loadOnlineCount()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

// 格式化时间
const formatTime = (time: string) => {
  if (!time) return '-'
  return time
}

onMounted(() => {
  loadData()
  loadOnlineCount()
})
</script>

<template>
  <div class="online-users-container">
    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-label">在线人数</div>
            <div class="stat-value">{{ onlineCount }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="hover">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作按钮 -->
    <div class="table-toolbar">
      <div class="toolbar-left">
        <el-button type="danger" @click="handleLogoutAll">全部下线</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-card class="table-card" shadow="hover">
      <el-table
        v-loading="loading"
        :data="tableData"
      >
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="nickname" label="昵称" width="120" />
        <el-table-column prop="ip" label="IP地址" width="140" show-overflow-tooltip />
        <el-table-column prop="address" label="登录地点" width="160" show-overflow-tooltip />
        <el-table-column prop="browser" label="浏览器" width="120" show-overflow-tooltip />
        <el-table-column prop="os" label="操作系统" width="120" show-overflow-tooltip />
        <el-table-column prop="loginTime" label="登录时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.loginTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="expireTime" label="过期时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.expireTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" size="small" @click="handleForceLogout(row)">强制下线</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.pageNum"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.online-users-container {
  max-width: 1600px;
}

.stat-row {
  margin-bottom: 16px;
}

.stat-card {
  text-align: center;
}

.stat-content {
  padding: 8px 0;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #409eff;
}

.search-card {
  margin-bottom: 16px;
}

.search-form {
  margin-bottom: 0;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toolbar-left {
  display: flex;
  gap: 12px;
}

.table-card {
  margin-bottom: 16px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
