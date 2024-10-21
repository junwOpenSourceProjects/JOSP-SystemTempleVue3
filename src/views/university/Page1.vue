<!-- src/views/Page1.vue -->
<template>
  <div class="app-container">
    <el-card class="search-card">
      <el-form
        :inline="true"
        :model="searchForm"
        @submit.prevent="handleSearch"
        class="search-form"
      >
        <el-row :gutter="20" type="flex" justify="start">
          <el-col :span="6">
            <el-form-item label="大学名称">
              <el-input
                v-model="searchForm.universityName"
                placeholder="请输入大学名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所在大洲">
              <el-select
                v-model="searchForm.universityTagsState"
                placeholder="请选择大洲"
                clearable
              >
                <el-option label="亚洲" value="亚洲" />
                <el-option label="欧洲" value="欧洲" />
                <el-option label="北美洲" value="北美洲" />
                <el-option label="南美洲" value="南美洲" />
                <el-option label="非洲" value="非洲" />
                <el-option label="大洋洲" value="大洋洲" />
                <el-option label="南极洲" value="南极洲" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所在国家">
              <el-input
                v-model="searchForm.universityTags"
                placeholder="请输入所在国家"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="QS排名高于">
              <el-input-number
                v-model="searchForm.currentRank"
                :min="1"
                placeholder="请输入排名"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex" justify="start">
          <el-col :span="6">
            <el-form-item label="排名类型">
              <el-select
                v-model="searchForm.rankVariant"
                placeholder="请选择排名类型"
                clearable
              >
                <el-option label="QS" value="qs" />
                <el-option label="QS CS" value="qs_cs" />
                <el-option label="US News" value="usnews" />
                <el-option label="US News CS" value="usnews_cs" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex" justify="start" class="button-row">
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="resetSearch">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-scrollbar>
      <el-table :data="tableData" style="width: 100%" :loading="loading">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="universityNameChinese" label="中文名称" />
        <el-table-column prop="universityNameEnglish" label="英文名称" />
        <el-table-column prop="universityTags" label="所在国家" />
        <el-table-column prop="universityTagsState" label="所在大洲" />
        <el-table-column prop="rankingCategory" label="排名类别" />
        <el-table-column prop="rankingYear" label="排名年份" />
        <el-table-column prop="currentRankInteger" label="QS当前排名" />
        <el-table-column prop="currentRankRaw" label="QS原始排名" />
        <el-table-column prop="rankVariant" label="排名类型" />
      </el-table>
    </el-scrollbar>

    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next, jumper, ->, total"
        v-model:current-page="currentPage"
        :page-size="limit"
        :total="total"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";

export default {
  name: "Page1",
  setup() {
    const tableData = ref([]);
    const searchForm = ref({
      universityName: "",
      universityTagsState: "",
      universityTags: "",
      currentRank: 10,
      rankVariant: "",
    });

    const currentPage = ref(1);
    const limit = ref(10);
    const total = ref(0);
    const loading = ref(false);

    const fetchData = async () => {
      loading.value = true;
      try {
        const params = {
          page: currentPage.value,
          limit: limit.value,
          universityName: searchForm.value.universityName,
        };

        if (searchForm.value.universityTagsState) {
          params.universityTagsState = searchForm.value.universityTagsState;
        }
        if (searchForm.value.universityTags) {
          params.universityTags = searchForm.value.universityTags;
        }
        if (searchForm.value.currentRank) {
          params.currentRank = searchForm.value.currentRank;
        }
        if (searchForm.value.rankVariant) {
          params.rankVariant = searchForm.value.rankVariant;
        }

        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`/dev-api/query/queryAll?${queryString}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        tableData.value = data.records;
        total.value = data.total;
      } catch (error) {
        ElMessage.error(`获取数据失败: ${error.message}`);
        console.error(error);
      } finally {
        loading.value = false;
      }
    };

    const handleSearch = () => {
      currentPage.value = 1;
      fetchData();
    };

    const resetSearch = () => {
      searchForm.value.universityName = "";
      searchForm.value.universityTagsState = "";
      searchForm.value.universityTags = "";
      searchForm.value.currentRank = "";
      searchForm.value.rankVariant = "";
      handleSearch();
    };

    const handlePageChange = (page) => {
      currentPage.value = page;
      fetchData();
    };

    onMounted(() => {
      fetchData();
    });

    return {
      tableData,
      searchForm,
      currentPage,
      limit,
      total,
      loading,
      handleSearch,
      resetSearch,
      handlePageChange,
    };
  },
};
</script>

<style scoped>
.search-card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin-bottom: 20px;
}

.search-form {
  width: 100%;
}

.button-row {
  margin-top: 10px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.el-table th,
.el-table td {
  text-align: center;
}
</style>
