<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-card shadow="never" class="mb-4">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="配置名称">
          <el-input
            v-model="queryParams.configName"
            placeholder="请输入配置名称"
            clearable
            @keyup.enter="loadData"
          />
        </el-form-item>
        <el-form-item label="配置键">
          <el-input
            v-model="queryParams.configKey"
            placeholder="请输入配置键"
            clearable
            @keyup.enter="loadData"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="全部" clearable style="width: 120px">
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格主体 -->
    <el-card shadow="never">
      <template #header>
        <div class="flex-x-between">
          <span class="font-semibold">配置列表</span>
          <div>
            <el-button type="primary" @click="handleAdd">新增</el-button>
            <el-button :disabled="!multiple" @click="handleBatchDelete">批量删除</el-button>
            <el-button @click="handleRefreshCache">刷新缓存</el-button>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="tableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="配置名称" prop="name" min-width="140" show-overflow-tooltip />
        <el-table-column label="配置键" prop="configKey" min-width="160" show-overflow-tooltip />
        <el-table-column label="配置值" prop="value" min-width="200" show-overflow-tooltip />
        <el-table-column label="类型" prop="type" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="typeTagMap[row.type] || 'info'" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
              {{ row.status === 1 ? "正常" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" min-width="120" show-overflow-tooltip />
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex-x-end mt-4">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.limit"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadData"
          @current-change="loadData"
        />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="560px"
      :close-on-click-modal="false"
      draggable
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="配置名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入配置名称" />
        </el-form-item>
        <el-form-item label="配置键" prop="configKey">
          <el-input v-model="formData.configKey" placeholder="请输入配置键（唯一标识）" />
        </el-form-item>
        <el-form-item label="配置值" prop="value">
          <el-input v-model="formData.value" placeholder="请输入配置值" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="formData.type" style="width: 100%">
            <el-option label="字符串" value="string" />
            <el-option label="数字" value="number" />
            <el-option label="布尔值" value="boolean" />
            <el-option label="JSON" value="json" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import ConfigAPI from "@/api/config";

defineOptions({ name: "SystemConfig" });

// ========== 状态 ==========
const loading = ref(false);
const tableData = ref<any[]>([]);
const total = ref(0);
const multiple = ref(false);
const selectedRows = ref<any[]>([]);

const queryParams = ref({
  page: 1,
  limit: 10,
  configName: "",
  configKey: "",
  status: undefined as number | undefined,
});

// ========== 弹窗 ==========
const dialogVisible = ref(false);
const dialogTitle = ref("");
const submitLoading = ref(false);
const formRef = ref<FormInstance>();
const formData = ref({
  id: undefined as number | undefined,
  name: "",
  configKey: "",
  value: "",
  type: "string",
  status: 1,
  remark: "",
});

const formRules: FormRules = {
  name: [{ required: true, message: "请输入配置名称", trigger: "blur" }],
  configKey: [{ required: true, message: "请输入配置键", trigger: "blur" }],
  value: [{ required: true, message: "请输入配置值", trigger: "blur" }],
  type: [{ required: true, message: "请选择类型", trigger: "change" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }],
};

const typeTagMap: Record<string, string> = {
  string: "primary",
  number: "success",
  boolean: "warning",
  json: "info",
};

// ========== 加载数据 ==========
function loadData() {
  loading.value = true;
  ConfigAPI.getPage(queryParams.value)
    .then((res: any) => {
      tableData.value = res.list ?? res.records ?? [];
      total.value = res.total ?? 0;
    })
    .finally(() => {
      loading.value = false;
    });
}

function handleReset() {
  queryParams.value = { page: 1, limit: 10, configName: "", configKey: "", status: undefined };
  loadData();
}

function handleSelectionChange(rows: any[]) {
  selectedRows.value = rows;
  multiple.value = rows.length > 0;
}

// ========== 操作 ==========
function handleAdd() {
  formData.value = { id: undefined, name: "", configKey: "", value: "", type: "string", status: 1, remark: "" };
  dialogTitle.value = "新增配置";
  dialogVisible.value = true;
}

function handleEdit(row: any) {
  ConfigAPI.getById(row.id).then((res: any) => {
    formData.value = { ...res };
    dialogTitle.value = "编辑配置";
    dialogVisible.value = true;
  });
}

function handleSubmit() {
  formRef.value?.validate((valid: boolean) => {
    if (!valid) return;
    submitLoading.value = true;
    const { id, ...rest } = formData.value;
    const promise = id ? ConfigAPI.update(id, rest) : ConfigAPI.add(rest);
    promise
      .then(() => {
        ElMessage.success(id ? "更新成功" : "创建成功");
        dialogVisible.value = false;
        loadData();
      })
      .finally(() => {
        submitLoading.value = false;
      });
  });
}

function handleDelete(row: any) {
  ElMessageBox.confirm(`确定删除配置"${row.name}"吗？`, "删除确认", { type: "warning" })
    .then(() => ConfigAPI.deleteByIds(String(row.id)))
    .then(() => {
      ElMessage.success("删除成功");
      loadData();
    })
    .catch(() => {});
}

function handleBatchDelete() {
  if (!selectedRows.value.length) return;
  const ids = selectedRows.value.map((r: any) => String(r.id));
  ElMessageBox.confirm(`确定删除选中的 ${ids.length} 条配置吗？`, "批量删除", { type: "warning" })
    .then(() => ConfigAPI.deleteBatch(ids))
    .then(() => {
      ElMessage.success("批量删除成功");
      loadData();
    })
    .catch(() => {});
}

function handleRefreshCache() {
  ConfigAPI.refreshCache()
    .then(() => ElMessage.success("缓存刷新成功"))
    .catch(() => ElMessage.error("刷新失败"));
}

// ========== 初始化 ==========
loadData();
</script>

<style scoped>
.mb-4 { margin-bottom: 16px; }
.mt-4 { margin-top: 16px; }
.flex-x-between { display: flex; justify-content: space-between; align-items: center; }
.flex-x-end { display: flex; justify-content: flex-end; }
.font-semibold { font-weight: 600; }
</style>
