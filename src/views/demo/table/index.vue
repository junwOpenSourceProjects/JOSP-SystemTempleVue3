<template>
  <div class="app-container">
    <el-card shadow="never">
      <div class="filter-container" style="margin-bottom: 20px;">
        <el-input
          v-model="listQuery.title"
          :placeholder="$t('common.search')"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter="handleFilter"
        />
        <el-select
          v-model="listQuery.status"
          :placeholder="$t('common.search')"
          clearable
          style="width: 120px; margin-left: 10px;"
          class="filter-item"
        >
          <el-option label="Published" value="published" />
          <el-option label="Draft" value="draft" />
          <el-option label="Deleted" value="deleted" />
        </el-select>
        <el-button
          class="filter-item"
          type="primary"
          icon="Search"
          style="margin-left: 10px;"
          @click="handleFilter"
        >
          {{ $t('common.search') }}
        </el-button>
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="Edit"
          @click="handleCreate"
        >
          {{ $t('common.add') }}
        </el-button>
      </div>

      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" />
        <el-table-column label="Date" width="180px" align="center">
          <template #default="scope">
            <span>{{ scope.row.timestamp }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Title" min-width="150px">
          <template #default="scope">
            <span class="link-type">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Author" width="110px" align="center">
          <template #default="scope">
            <span>{{ scope.row.author }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Readings" align="center" width="95">
          <template #default="scope">
            <span>{{ scope.row.pageviews }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Status" class-name="status-col" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'published' ? 'success' : 'info'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleUpdate(row)">
              {{ $t('common.edit') }}
            </el-button>
            <el-button v-if="row.status!='deleted'" size="small" type="danger" @click="handleDelete(row)">
              {{ $t('common.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 演示的分页组件 -->
      <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
         <el-pagination
          v-model:current-page="listQuery.page"
          v-model:page-size="listQuery.limit"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

defineOptions({
  name: "TableDemo",
});

const listLoading = ref(false);
const list = ref<any[]>([]);
const total = ref(0);

const listQuery = reactive({
  page: 1,
  limit: 10,
  title: undefined,
  status: undefined
});

// Mock 数据生成
const getList = () => {
  listLoading.value = true;
  setTimeout(() => {
    // 模拟数据
    const mockData = Array.from({ length: 40 }).map((_, i) => ({
      id: i + 1,
      title: `Table Component Example Title ${i + 1}`,
      author: `Author ${i + 1}`,
      pageviews: Math.floor(Math.random() * 1000) + 100,
      status: ['published', 'draft', 'deleted'][Math.floor(Math.random() * 3)],
      timestamp: new Date().toISOString().split('T')[0]
    }));
    
    // 过滤和分页
    let filteredData = mockData;
    if (listQuery.title) {
      filteredData = filteredData.filter(item => item.title.includes(listQuery.title!));
    }
    if (listQuery.status) {
      filteredData = filteredData.filter(item => item.status === listQuery.status);
    }
    
    total.value = filteredData.length;
    const start = (listQuery.page - 1) * listQuery.limit;
    list.value = filteredData.slice(start, start + listQuery.limit);
    
    listLoading.value = false;
  }, 500);
}

const handleFilter = () => {
  listQuery.page = 1;
  getList();
}

const handleSizeChange = (val: number) => {
  listQuery.limit = val;
  getList();
}

const handleCurrentChange = (val: number) => {
  listQuery.page = val;
  getList();
}

const handleCreate = () => {
  ElMessage.success("点击了新增按钮");
}

const handleUpdate = (row: any) => {
  ElMessage.success("点击了编辑按钮，当前项 ID：" + row.id);
}

const handleDelete = (row: any) => {
  ElMessage.success("点击了删除按钮，当前项 ID：" + row.id);
}

onMounted(() => {
  getList();
});
</script>
