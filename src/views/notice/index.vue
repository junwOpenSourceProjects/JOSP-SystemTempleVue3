<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import NoticeAPI from "@/api/notice";
import type { Notice, NoticeQuery } from "@/api/notice/model";
import { hasAuth } from "@/plugins/permission";

defineOptions({
  name: "NoticeList",
});

const router = useRouter();

// Loading state
const loading = ref(false);

// Notice data
const noticeList = ref<Notice[]>([]);

// Query parameters
const queryParams = reactive<NoticeQuery>({
  title: "",
  type: undefined,
  status: undefined,
  pageNum: 1,
  pageSize: 10,
});

// Pagination
const total = ref(0);

// Notice type options
const typeOptions = [
  { label: "通知", value: "info" },
  { label: "警告", value: "warning" },
  { label: "成功", value: "success" },
  { label: "危险", value: "danger" },
];

// Status options
const statusOptions = [
  { label: "已发布", value: "published" },
  { label: "草稿", value: "draft" },
  { label: "已归档", value: "archived" },
];

// Brand colors
const typeColors: Record<string, string> = {
  info: "#1456f0",
  warning: "#e6a23c",
  success: "#67c23a",
  danger: "#f56c6c",
};

const typeLabels: Record<string, string> = {
  info: "通知",
  warning: "警告",
  success: "成功",
  danger: "危险",
};

const statusLabels: Record<string, string> = {
  published: "已发布",
  draft: "草稿",
  archived: "已归档",
};

// Load data
const loadData = async () => {
  loading.value = true;
  try {
    const res = await NoticeAPI.getPage(queryParams);
    noticeList.value = res.list || (res as any).records || [];
    total.value = res.total || 0;
  } catch (error) {
    console.error("Failed to load notices:", error);
  } finally {
    loading.value = false;
  }
};

// Search
const handleSearch = () => {
  queryParams.pageNum = 1;
  loadData();
};

// Reset
const handleReset = () => {
  queryParams.title = "";
  queryParams.type = undefined;
  queryParams.status = undefined;
  queryParams.pageNum = 1;
  loadData();
};

// Pagination change
const handlePageChange = (page: number) => {
  queryParams.pageNum = page;
  loadData();
};

// Page size change
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  queryParams.pageNum = 1;
  loadData();
};

// View notice
const handleView = (row: Notice) => {
  router.push({ path: "/notice/detail", query: { id: String(row.id) } });
};

// Add notice
const handleAdd = () => {
  router.push({ path: "/notice/edit" });
};

// Edit notice
const handleEdit = (row: Notice) => {
  router.push({ path: "/notice/edit", query: { id: String(row.id) } });
};

// Delete notice
const handleDelete = async (row: Notice) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除通知 "${row.title}" 吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );
    await NoticeAPI.deleteByIds(String(row.id));
    ElMessage.success("删除成功");
    loadData();
  } catch (error) {
    // Cancelled
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="notice-container">
    <!-- Search Card -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" :inline="true" class="search-form">
        <el-form-item label="标题">
          <el-input
            v-model="queryParams.title"
            placeholder="请输入标题"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="类型">
          <el-select
            v-model="queryParams.type"
            placeholder="请选择类型"
            clearable
            style="width: 140px"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择状态"
            clearable
            style="width: 140px"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <i class="i-carbon-search"></i>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <i class="i-carbon-reset"></i>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Table Card -->
    <el-card shadow="never" class="table-card">
      <template #header>
        <div class="table-header">
          <span class="table-title">通知公告列表</span>
          <el-button
            v-if="hasAuth('system:notice:add')"
            type="primary"
            @click="handleAdd"
          >
            <i class="i-carbon-add"></i>
            新增
          </el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="noticeList"
        stripe
        class="notice-table"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="title" label="标题" min-width="200">
          <template #default="{ row }">
            <el-link type="primary" @click="handleView(row)">
              {{ row.title }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag
              :color="typeColors[row.type]"
              effect="dark"
              style="border: none"
            >
              {{ typeLabels[row.type] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="author" label="作者" width="120" align="center" />
        <el-table-column
          prop="publishTime"
          label="发布时间"
          width="180"
          align="center"
        />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'info'">
              {{ statusLabels[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="viewCount"
          label="浏览量"
          width="100"
          align="center"
        />
        <el-table-column
          label="操作"
          width="160"
          align="center"
          fixed="right"
        >
          <template #default="{ row }">
            <el-button
              v-if="hasAuth('system:notice:edit')"
              type="primary"
              link
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="hasAuth('system:notice:delete')"
              type="danger"
              link
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.notice-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 16px;
  border-radius: 12px;
  border: none;

  :deep(.el-card__body) {
    padding: 16px 20px;
  }
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 0;
  }
}

.table-card {
  border-radius: 12px;
  border: none;

  :deep(.el-card__header) {
    padding: 16px 20px;
    border-bottom: 1px solid #f2f3f5;
  }

  :deep(.el-card__body) {
    padding: 0;
  }
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.table-title {
  font-size: 16px;
  font-weight: 600;
  color: #18181b;
}

.notice-table {
  :deep(.el-table__header th) {
    background-color: #f9fafb;
    color: #45515e;
    font-weight: 500;
  }

  :deep(.el-table__row) {
    &:hover > td {
      background-color: #f9fafb;
    }
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid #f2f3f5;
}
</style>
