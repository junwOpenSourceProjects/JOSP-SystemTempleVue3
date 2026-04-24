<template>
  <div class="app-container">
    <el-card shadow="never" class="table-card">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-lg font-medium">综合表格</span>
          <el-button type="primary" @click="handleCreate">
            <i class="i-ep-plus mr-1" />
            新增
          </el-button>
        </div>
      </template>

      <!-- 搜索过滤 -->
      <div class="filter-container">
        <el-input
          v-model="listQuery.title"
          placeholder="搜索标题"
          style="width: 200px"
          clearable
          class="filter-item"
          @keyup.enter="handleFilter"
        />
        <el-select
          v-model="listQuery.status"
          placeholder="状态"
          clearable
          style="width: 120px"
          class="filter-item"
        >
          <el-option label="已发布" value="published" />
          <el-option label="草稿" value="draft" />
          <el-option label="已删除" value="deleted" />
        </el-select>
        <el-button type="primary" class="filter-item" @click="handleFilter">
          <i class="i-ep-search mr-1" />
          搜索
        </el-button>
        <el-button class="filter-item" @click="handleReset">
          <i class="i-ep-refresh mr-1" />
          重置
        </el-button>
      </div>

      <!-- 表格 -->
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        stripe
        highlight-current-row
        class="demo-table"
      >
        <el-table-column label="ID" prop="id" width="80" align="center" sortable />
        <el-table-column label="日期" width="120" align="center">
          <template #default="{ row }">
            <span class="text-sm text-gray">{{ row.timestamp }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标题" min-width="200">
          <template #default="{ row }">
            <el-link type="primary" class="font-medium">{{ row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="作者" width="100" align="center">
          <template #default="{ row }">
            <el-tag size="small">{{ row.author }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="阅读量" width="120" align="center">
          <template #default="{ row }">
            <span class="text-primary font-medium">{{ row.pageviews }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" text @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" text @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="listQuery.page"
          v-model:page-size="listQuery.limit"
          :page-sizes="[10, 20, 30, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 编辑/新增弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="formData.author" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="已发布" value="published" />
            <el-option label="草稿" value="draft" />
            <el-option label="已删除" value="deleted" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="formLoading" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox, FormInstance, FormRules } from "element-plus";
import { DemoAPI, TableListItem, TableForm } from "@/api/demo";

defineOptions({
  name: "TableDemo",
});

const listLoading = ref(false);
const list = ref<TableListItem[]>([]);
const total = ref(0);

const listQuery = reactive({
  page: 1,
  limit: 10,
  title: "",
  status: "",
});

// 弹窗相关
const dialogVisible = ref(false);
const dialogTitle = ref("新增");
const formLoading = ref(false);
const formRef = ref<FormInstance>();
const isEdit = ref(false);
const editId = ref<string | null>(null);

const formData = reactive<TableForm>({
  title: "",
  author: "",
  status: "draft",
});

const formRules: FormRules = {
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
  author: [{ required: true, message: "请输入作者", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }],
};

const getList = async () => {
  listLoading.value = true;
  try {
    const res = await DemoAPI.getTableList(listQuery);
    list.value = res.records;
    total.value = res.total;
  } catch (error) {
    console.error("Failed to fetch table list:", error);
  } finally {
    listLoading.value = false;
  }
};

const handleFilter = () => {
  listQuery.page = 1;
  getList();
};

const handleReset = () => {
  listQuery.title = "";
  listQuery.status = "";
  listQuery.page = 1;
  getList();
};

const handleSizeChange = (val: number) => {
  listQuery.limit = val;
  listQuery.page = 1;
  getList();
};

const handleCurrentChange = (val: number) => {
  listQuery.page = val;
  getList();
};

const handleCreate = () => {
  isEdit.value = false;
  editId.value = null;
  dialogTitle.value = "新增";
  resetForm();
  dialogVisible.value = true;
};

const handleUpdate = async (row: TableListItem) => {
  isEdit.value = true;
  editId.value = row.id;
  dialogTitle.value = "编辑";
  formLoading.value = true;
  try {
    const res = await DemoAPI.getTableItem(row.id);
    formData.title = res.title;
    formData.author = res.author;
    formData.status = res.status;
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error("获取记录失败");
  } finally {
    formLoading.value = false;
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return;

    formLoading.value = true;
    try {
      if (isEdit.value && editId.value !== null) {
        await DemoAPI.updateTableItem(editId.value, { ...formData });
        ElMessage.success("更新成功");
      } else {
        await DemoAPI.createTableItem({ ...formData });
        ElMessage.success("新增成功");
      }
      dialogVisible.value = false;
      getList();
    } catch (error: any) {
      ElMessage.error(error.message || "操作失败");
    } finally {
      formLoading.value = false;
    }
  });
};

const handleDelete = (row: TableListItem) => {
  ElMessageBox.confirm(`确定要删除「${row.title}」吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        await DemoAPI.deleteTableItem(row.id);
        ElMessage.success("删除成功");
        getList();
      } catch (error: any) {
        ElMessage.error(error.message || "删除失败");
      }
    })
    .catch(() => {});
};

const handleDialogClose = () => {
  resetForm();
};

const resetForm = () => {
  formData.title = "";
  formData.author = "";
  formData.status = "draft";
  formRef.value?.resetFields();
};

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    published: "success",
    draft: "warning",
    deleted: "info",
  };
  return map[status] || "info";
};

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    published: "已发布",
    draft: "草稿",
    deleted: "已删除",
  };
  return map[status] || status;
};

onMounted(() => {
  getList();
});
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
}

.table-card {
  :deep(.el-card__header) {
    padding: 16px 20px;
    background: var(--el-fill-color-light);
  }
}

.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);

  .filter-item {
    margin-right: 0;
  }
}

.demo-table {
  :deep(.el-table__header th) {
    background: var(--el-fill-color-light);
    font-weight: 600;
  }

  :deep(.el-table__row) {
    transition: background-color 0.2s;

    &:hover > td {
      background-color: var(--el-fill-color-light) !important;
    }
  }
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.text-primary {
  color: var(--el-color-primary);
}

.text-gray {
  color: var(--el-text-color-secondary);
}
</style>
