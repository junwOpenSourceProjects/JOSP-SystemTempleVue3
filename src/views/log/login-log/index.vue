<!-- 登录日志 -->
<template>
  <div class="app-container">
    <el-card shadow="never" class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="queryParams.username"
            placeholder="请输入用户名"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="全部"
            clearable
            class="!w-[100px]"
          >
            <el-option label="成功" value="0" />
            <el-option label="失败" value="1" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery"
            ><i-ep-search />搜索</el-button
          >
          <el-button @click="handleResetQuery">
            <i-ep-refresh />
            重置</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-container">
      <template #header>
        <div class="flex justify-between">
          <div>
            <el-button
              v-hasPerm="['log:login-log:delete']"
              type="danger"
              :disabled="removeIds.length === 0"
              @click="handleBatchDelete"
              ><i-ep-delete />批量删除</el-button
            >
            <el-button
              v-hasPerm="['log:login-log:clean']"
              type="warning"
              @click="handleClean"
              ><i-ep-delete />清理</el-button
            >
          </div>
          <div>
            <el-button icon="refresh" circle @click="handleQuery" title="刷新" />
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="pageData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column
          key="id"
          label="编号"
          align="center"
          prop="id"
          width="100"
        />
        <el-table-column
          key="username"
          label="用户名"
          align="center"
          prop="username"
          width="150"
        />
        <el-table-column
          label="状态"
          align="center"
          prop="status"
          width="100"
        >
          <template #default="scope">
            <el-tag :type="scope.row.status === '0' ? 'success' : 'danger'">
              {{ scope.row.status === "0" ? "成功" : "失败" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="登录IP地址"
          align="center"
          prop="ip"
          width="150"
        />
        <el-table-column
          label="登录地点"
          align="center"
          prop="address"
          width="150"
        />
        <el-table-column
          label="浏览器"
          align="center"
          prop="browser"
          width="150"
        />
        <el-table-column
          label="提示消息"
          align="center"
          prop="msg"
          min-width="200"
          show-overflow-tooltip
        />
        <el-table-column
          label="登录时间"
          align="center"
          prop="loginTime"
          width="180"
        />
        <el-table-column label="操作" fixed="right" width="100">
          <template #default="scope">
            <el-button
              v-hasPerm="['log:login-log:delete']"
              type="danger"
              link
              size="small"
              @click="handleDelete(scope.row.id)"
              ><i-ep-delete />删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "LoginLog",
  inheritAttrs: false,
});

import LoginLogAPI from "@/api/loginLog";
import type { LoginLogPageVO } from "@/api/loginLog/model";

const queryFormRef = ref(ElForm); // 查询表单

const loading = ref(false); // 加载状态
const removeIds = ref<number[]>([]); // 删除ID集合 用于批量删除
const queryParams = reactive<{
  pageNum: number;
  pageSize: number;
  username?: string;
  status?: string;
}>({
  pageNum: 1,
  pageSize: 10,
});
const total = ref(0); // 数据总数
const pageData = ref<LoginLogPageVO[]>(); // 分页数据

/** 查询 */
function handleQuery() {
  loading.value = true;
  LoginLogAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list || (data as any).records;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置查询 */
function handleResetQuery() {
  queryFormRef.value?.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/** 行选中 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id);
}

/** 删除 */
function handleDelete(id: number) {
  ElMessageBox.confirm("确定要删除该登录日志吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    LoginLogAPI.delete(id).then(() => {
      ElMessage.success("删除成功");
      handleQuery();
    });
  });
}

/** 批量删除 */
function handleBatchDelete() {
  if (removeIds.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }
  ElMessageBox.confirm("确定要删除选中的登录日志吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    LoginLogAPI.deleteBatch(removeIds.value).then(() => {
      ElMessage.success("批量删除成功");
      handleQuery();
    });
  });
}

/** 清理 */
function handleClean() {
  ElMessageBox.confirm("确定要清理30天前的登录日志吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    LoginLogAPI.clean(30).then(() => {
      ElMessage.success("清理成功");
      handleQuery();
    });
  });
}

// 初始化
onMounted(() => {
  handleQuery();
});
</script>
