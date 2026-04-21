<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/store/modules/user";
import NoticeAPI from "@/api/notice";
import type { NoticeForm } from "@/api/notice/model";
import WangEditor from "@/components/WangEditor/index.vue";

defineOptions({
  name: "NoticeEdit",
});

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// Loading state
const loading = ref(false);
const pageLoading = ref(false);

// Is edit mode
const isEdit = computed(() => !!route.query.id);

// Form data
const formRef = ref();
const formData = reactive<NoticeForm>({
  title: "",
  content: "",
  type: "info",
  status: "draft",
});

// Form validation rules
const rules = {
  title: [
    { required: true, message: "请输入标题", trigger: "blur" },
    { max: 100, message: "标题长度不能超过100个字符", trigger: "blur" },
  ],
  content: [
    { required: true, message: "请输入内容", trigger: "blur" },
  ],
  type: [
    { required: true, message: "请选择类型", trigger: "change" },
  ],
  status: [
    { required: true, message: "请选择状态", trigger: "change" },
  ],
};

// Type options
const typeOptions = [
  { label: "通知", value: "info" },
  { label: "警告", value: "warning" },
  { label: "成功", value: "success" },
  { label: "危险", value: "danger" },
];

// Status options
const statusOptions = [
  { label: "草稿", value: "draft" },
  { label: "已发布", value: "published" },
  { label: "已归档", value: "archived" },
];

// Load form data for edit
const loadFormData = async () => {
  if (!route.query.id) return;
  pageLoading.value = true;
  try {
    const res = await NoticeAPI.getFormData(Number(route.query.id));
    Object.assign(formData, res);
  } catch (error) {
    ElMessage.error("加载数据失败");
  } finally {
    pageLoading.value = false;
  }
};

// Submit form
const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        if (isEdit.value) {
          await NoticeAPI.update(Number(route.query.id), formData);
          ElMessage.success("修改成功");
        } else {
          await NoticeAPI.add(formData);
          ElMessage.success("添加成功");
        }
        router.push({ path: "/notice" });
      } catch (error) {
        ElMessage.error(isEdit.value ? "修改失败" : "添加失败");
      } finally {
        loading.value = false;
      }
    }
  });
};

// Save as draft
const handleSaveDraft = async () => {
  formData.status = "draft";
  await handleSubmit();
};

// Cancel
const handleCancel = () => {
  router.push({ path: "/notice" });
};

// Content change handler
const handleContentChange = (html: string) => {
  formData.content = html;
};

onMounted(() => {
  if (isEdit.value) {
    loadFormData();
  }
});
</script>

<template>
  <div class="notice-edit-container">
    <el-card shadow="never" class="form-card" v-loading="pageLoading">
      <template #header>
        <div class="card-header">
          <span class="card-title">{{ isEdit ? "编辑公告" : "新增公告" }}</span>
          <div class="header-actions">
            <el-button @click="handleCancel">取消</el-button>
            <el-button @click="handleSaveDraft" :loading="loading">保存草稿</el-button>
            <el-button
              type="primary"
              :loading="loading"
              @click="handleSubmit"
            >
              {{ formData.status === "published" ? "发布" : "保存" }}
            </el-button>
          </div>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
        class="notice-form"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input
                v-model="formData.title"
                placeholder="请输入公告标题"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="类型" prop="type">
              <el-select v-model="formData.type" placeholder="请选择类型" style="width: 100%">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" prop="status">
              <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="内容" prop="content">
          <div class="editor-wrapper">
            <WangEditor
              :model-value="formData.content"
              @update:model-value="handleContentChange"
              placeholder="请输入公告内容..."
            />
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.notice-edit-container {
  padding: 20px;
}

.form-card {
  border-radius: 12px;
  border: none;

  :deep(.el-card__header) {
    padding: 16px 20px;
    border-bottom: 1px solid #f2f3f5;
  }

  :deep(.el-card__body) {
    padding: 24px 20px;
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #18181b;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.notice-form {
  max-width: 100%;

  :deep(.el-form-item__label) {
    color: #45515e;
    font-weight: 400;
  }
}

.editor-wrapper {
  width: 100%;
  min-height: 400px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}
</style>
