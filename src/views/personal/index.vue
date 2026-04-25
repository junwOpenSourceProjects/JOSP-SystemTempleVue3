<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { useUserStore } from "@/store/modules/user";
import UserAPI from "@/api/user";
import FileAPI from "@/api/file";

defineOptions({
  name: "Personal",
});

// User store
const userStore = useUserStore();

// Active tab
const activeTab = ref("profile");

// Profile form
const profileFormRef = ref<FormInstance>();
const profileForm = reactive({
  nickname: userStore.user.nickname || "",
  email: userStore.user.email || "",
  phone: userStore.user.phone || "",
  department: userStore.user.department || "",
  position: userStore.user.position || "",
  bio: userStore.user.bio || "",
});
const profileLoading = ref(false);

// Password form
const passwordFormRef = ref<FormInstance>();
const passwordForm = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const passwordLoading = ref(false);

// Avatar
const avatarUrl = ref(userStore.user.avatar || "");
const uploadingAvatar = ref(false);

// Profile form validation rules
const profileRules: FormRules = {
  nickname: [
    { required: true, message: "请输入昵称", trigger: "blur" },
    { min: 2, max: 20, message: "昵称长度为 2-20 个字符", trigger: "blur" },
  ],
  email: [
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号", trigger: "blur" },
  ],
};

// Password form validation rules
const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value !== passwordForm.newPassword) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};

const passwordRules: FormRules = {
  oldPassword: [
    { required: true, message: "请输入原密码", trigger: "blur" },
  ],
  newPassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度为 6-20 个字符", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "请确认新密码", trigger: "blur" },
    { validator: validateConfirmPassword, trigger: "blur" },
  ],
};

// Brand colors
const BRAND = {
  primary: "#1456f0",
  primaryLight: "#3b82f6",
  success: "#67c23a",
  danger: "#f56c6c",
  warning: "#e6a23c",
  text: "#18181b",
  textSecondary: "#45515e",
  textMuted: "#8e8e93",
  border: "#e5e7eb",
  bg: "#f2f3f5",
};

// Upload avatar
const handleAvatarUpload = async (options: { file: File }) => {
  uploadingAvatar.value = true;
  try {
    const res = await FileAPI.upload(options.file);
    avatarUrl.value = res.url || res;
    ElMessage.success("头像上传成功");
  } catch (error) {
    ElMessage.error("头像上传失败");
  } finally {
    uploadingAvatar.value = false;
  }
};

// Submit profile form
const submitProfile = async () => {
  if (!profileFormRef.value) return;
  await profileFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      profileLoading.value = true;
      try {
        await UserAPI.update(userStore.user.userId, profileForm);
        await userStore.getUserInfo();
        ElMessage.success("个人信息更新成功");
      } catch (error) {
        ElMessage.error("更新失败");
      } finally {
        profileLoading.value = false;
      }
    }
  });
};

// Submit password form
const submitPassword = async () => {
  if (!passwordFormRef.value) return;
  await passwordFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      passwordLoading.value = true;
      try {
        await UserAPI.changePassword(passwordForm.oldPassword, passwordForm.newPassword);
        ElMessage.success("密码修改成功");
        passwordFormRef.value?.resetFields();
      } catch (error) {
        ElMessage.error("密码修改失败");
      } finally {
        passwordLoading.value = false;
      }
    }
  });
};

// Reset profile form
const resetProfile = () => {
  profileForm.nickname = userStore.user.nickname || "";
  profileForm.email = userStore.user.email || "";
  profileForm.phone = userStore.user.phone || "";
  profileForm.department = userStore.user.department || "";
  profileForm.position = userStore.user.position || "";
  profileForm.bio = userStore.user.bio || "";
};
</script>

<template>
  <div class="personal-container">
    <div class="personal-header">
      <h1 class="page-title">个人中心</h1>
      <p class="page-desc">管理您的个人信息和账户安全</p>
    </div>

    <div class="personal-content">
      <!-- Tabs -->
      <div class="tabs-wrapper">
        <el-tabs v-model="activeTab" class="personal-tabs">
          <el-tab-pane label="个人信息" name="profile">
            <template #label>
              <span class="tab-label">
                <i class="i-carbon-user"></i>
                个人信息
              </span>
            </template>
          </el-tab-pane>
          <el-tab-pane label="账户安全" name="security">
            <template #label>
              <span class="tab-label">
                <i class="i-carbon-security"></i>
                账户安全
              </span>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- Profile Tab -->
      <div v-show="activeTab === 'profile'" class="tab-content">
        <el-row :gutter="32">
          <!-- Avatar Section -->
          <el-col :xs="24" :lg="8">
            <div class="avatar-section">
              <div class="avatar-card">
                <div class="avatar-wrapper">
                  <el-avatar
                    :size="120"
                    :src="avatarUrl"
                    class="user-avatar"
                  >
                    <i class="i-carbon-user" style="font-size: 48px"></i>
                  </el-avatar>
                  <div class="avatar-overlay">
                    <el-upload
                      :show-file-list="false"
                      :http-request="handleAvatarUpload"
                      accept="image/*"
                    >
                      <el-button
                        type="primary"
                        size="small"
                        :loading="uploadingAvatar"
                        class="upload-btn"
                      >
                        <i class="i-carbon-upload"></i>
                        更换头像
                      </el-button>
                    </el-upload>
                  </div>
                </div>
                <p class="avatar-hint">支持 JPG、PNG 格式，文件小于 2MB</p>
              </div>
            </div>
          </el-col>

          <!-- Profile Form -->
          <el-col :xs="24" :lg="16">
            <div class="form-section">
              <el-card class="form-card">
                <template #header>
                  <div class="card-header">
                    <span class="card-title">基本信息</span>
                  </div>
                </template>
                <el-form
                  ref="profileFormRef"
                  :model="profileForm"
                  :rules="profileRules"
                  label-width="100px"
                  class="profile-form"
                >
                  <el-form-item label="昵称" prop="nickname">
                    <el-input
                      v-model="profileForm.nickname"
                      placeholder="请输入昵称"
                      maxlength="20"
                      show-word-limit
                    />
                  </el-form-item>
                  <el-form-item label="邮箱" prop="email">
                    <el-input
                      v-model="profileForm.email"
                      placeholder="请输入邮箱"
                    />
                  </el-form-item>
                  <el-form-item label="手机号" prop="phone">
                    <el-input
                      v-model="profileForm.phone"
                      placeholder="请输入手机号"
                      maxlength="11"
                    />
                  </el-form-item>
                  <el-form-item label="部门" prop="department">
                    <el-input
                      v-model="profileForm.department"
                      placeholder="请输入部门"
                    />
                  </el-form-item>
                  <el-form-item label="职位" prop="position">
                    <el-input
                      v-model="profileForm.position"
                      placeholder="请输入职位"
                    />
                  </el-form-item>
                  <el-form-item label="个人简介" prop="bio">
                    <el-input
                      v-model="profileForm.bio"
                      type="textarea"
                      :rows="3"
                      placeholder="请输入个人简介"
                      maxlength="200"
                      show-word-limit
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      type="primary"
                      :loading="profileLoading"
                      @click="submitProfile"
                    >
                      保存更改
                    </el-button>
                    <el-button @click="resetProfile">重置</el-button>
                  </el-form-item>
                </el-form>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- Security Tab -->
      <div v-show="activeTab === 'security'" class="tab-content">
        <div class="security-section">
          <el-card class="security-card">
            <template #header>
              <div class="card-header">
                <span class="card-title">修改密码</span>
              </div>
            </template>
            <el-form
              ref="passwordFormRef"
              :model="passwordForm"
              :rules="passwordRules"
              label-width="120px"
              class="password-form"
            >
              <el-form-item label="原密码" prop="oldPassword">
                <el-input
                  v-model="passwordForm.oldPassword"
                  type="password"
                  placeholder="请输入原密码"
                  show-password
                  maxlength="20"
                />
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input
                  v-model="passwordForm.newPassword"
                  type="password"
                  placeholder="请输入新密码"
                  show-password
                  maxlength="20"
                />
              </el-form-item>
              <el-form-item label="确认新密码" prop="confirmPassword">
                <el-input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  placeholder="请再次输入新密码"
                  show-password
                  maxlength="20"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  :loading="passwordLoading"
                  @click="submitPassword"
                >
                  修改密码
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- Security Tips -->
          <el-card class="tips-card">
            <template #header>
              <div class="card-header">
                <span class="card-title">
                  <i class="i-carbon-information"></i>
                  安全提示
                </span>
              </div>
            </template>
            <ul class="security-tips">
              <li>密码长度至少为 6 个字符</li>
              <li>建议使用大小写字母、数字和特殊字符的组合</li>
              <li>不要在其他网站重复使用相同的密码</li>
              <li>定期更换密码有助于保护账户安全</li>
            </ul>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.personal-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.personal-header {
  margin-bottom: 32px;

  .page-title {
    margin: 0 0 8px;
    font-size: 28px;
    font-weight: 600;
    color: #18181b;
  }

  .page-desc {
    margin: 0;
    font-size: 14px;
    color: #8e8e93;
  }
}

.personal-content {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.tabs-wrapper {
  padding: 0 24px;
  border-bottom: 1px solid #f2f3f5;

  :deep(.el-tabs__header) {
    margin: 0;
  }

  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }

  :deep(.el-tabs__item) {
    height: 56px;
    line-height: 56px;
    font-size: 15px;
    color: #8e8e93;

    &:hover {
      color: #1456f0;
    }

    &.is-active {
      color: #1456f0;
      font-weight: 500;
    }
  }

  :deep(.el-tabs__active-bar) {
    height: 3px;
    border-radius: 2px;
  }
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 8px;

  i {
    font-size: 16px;
  }
}

.tab-content {
  padding: 32px 24px;
}

// Avatar Section
.avatar-section {
  display: flex;
  justify-content: center;
}

.avatar-card {
  text-align: center;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;

  .user-avatar {
    border: 4px solid #f2f3f5;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .avatar-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, transparent 60%);
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s;
    padding-bottom: 8px;
  }

  &:hover .avatar-overlay {
    opacity: 1;
  }

  .upload-btn {
    font-size: 12px;
  }
}

.avatar-hint {
  margin: 0;
  font-size: 12px;
  color: #8e8e93;
}

// Form Section
.form-section {
  max-width: 560px;
}

.form-card,
.security-card,
.tips-card {
  border: 1px solid #f2f3f5;
  border-radius: 12px;

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
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #18181b;
}

.profile-form,
.password-form {
  max-width: 420px;

  :deep(.el-form-item__label) {
    color: #45515e;
    font-weight: 400;
  }
}

// Security Section
.security-section {
  max-width: 560px;
}

.tips-card {
  margin-top: 24px;
}

.security-tips {
  margin: 0;
  padding-left: 20px;
  color: #45515e;
  font-size: 14px;
  line-height: 2;

  li {
    list-style: decimal;
  }
}

// Responsive
@media (max-width: 768px) {
  .personal-container {
    padding: 16px;
  }

  .avatar-section {
    margin-bottom: 24px;
  }

  .tab-content {
    padding: 24px 16px;
  }
}
</style>
