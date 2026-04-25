<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { OperLog, PageResult } from '@/api/operLog'
import { getOperLogPage, batchDeleteOperLog, cleanOperLog } from '@/api/operLog'

// 搜索表单
const searchForm = ref({
  title: '',
  operName: '',
  status: ''
})

// 分页参数
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 表格数据
const tableData = ref<OperLog[]>([])

// 选中行
const selectedRows = ref<OperLog[]>([])

// 加载状态
const loading = ref(false)

const statusOptions = [
  { label: '成功', value: '0' },
  { label: '失败', value: '1' }
]

// 格式化状态
const formatStatus = (status: string) => {
  return status === '0' ? '成功' : '失败'
}

// 获取状态类型
const getStatusType = (status: string) => {
  return status === '0' ? 'success' : 'danger'
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: pagination.value.pageNum,
      pageSize: pagination.value.pageSize,
      title: searchForm.value.title,
      operName: searchForm.value.operName,
      status: searchForm.value.status
    }
    const res = await getOperLogPage(params)
    const result: PageResult<OperLog> = res.data?.data || { list: [], total: 0, pageNum: 1, pageSize: 10 }
    tableData.value = result.list || []
    pagination.value.total = result.total || 0
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.value.pageNum = 1
  loadData()
}

// 重置搜索
const handleReset = () => {
  searchForm.value = {
    title: '',
    operName: '',
    status: ''
  }
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

// 选择变化
const handleSelectionChange = (rows: OperLog[]) => {
  selectedRows.value = rows
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的数据')
    return
  }
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 条数据吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const ids = selectedRows.value.map(row => row.id)
    await batchDeleteOperLog(ids)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 清理日志
const handleClean = async () => {
  try {
    await ElMessageBox.confirm('确定要清理30天前的操作日志吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await cleanOperLog(30)
    ElMessage.success('清理成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('清理失败')
    }
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="oper-log-container">
    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="hover">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="操作标题">
          <el-input v-model="searchForm.title" placeholder="请输入操作标题" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="操作人">
          <el-input v-model="searchForm.operName" placeholder="请输入操作人" clearable style="width: 150px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 120px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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
        <el-button type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
          批量删除
        </el-button>
        <el-button type="warning" @click="handleClean">清理30天前</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-card class="table-card" shadow="hover">
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="title" label="操作标题" min-width="150" show-overflow-tooltip />
        <el-table-column prop="operName" label="操作人" width="120" />
        <el-table-column prop="operType" label="操作类型" width="100" />
        <el-table-column prop="method" label="请求方法" width="120" show-overflow-tooltip />
        <el-table-column prop="requestMethod" label="请求方式" width="90" />
        <el-table-column prop="operUrl" label="请求地址" min-width="180" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" effect="dark">
              {{ formatStatus(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="costTime" label="耗时(ms)" width="100" />
        <el-table-column prop="ip" label="IP地址" width="140" show-overflow-tooltip />
        <el-table-column prop="address" label="操作地点" width="140" show-overflow-tooltip />
        <el-table-column prop="operTime" label="操作时间" width="180" />
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
.oper-log-container {
  max-width: 1600px;
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
