<template>
  <div class="login-page">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <!-- 顶部栏 -->
    <header class="login-header">
      <div class="header-content">
        <div class="logo-section">
          <img src="@/assets/logo.png" alt="Logo" class="logo-image" />
          <span class="logo-text">{{ defaultSettings.title }}</span>
        </div>
        <div class="header-actions">
          <el-switch
            v-model="isDark"
            inline-prompt
            active-icon="Moon"
            inactive-icon="Sunny"
            @change="toggleTheme"
          />
          <lang-select class="lang-select" />
        </div>
      </div>
    </header>

    <!-- 登录卡片 -->
    <main class="login-main">
      <div class="login-card">
        <!-- 左侧品牌区域 -->
        <div class="brand-section">
          <div class="brand-content">
            <h1 class="brand-title">欢迎回来</h1>
            <p class="brand-subtitle">登录到 JOSP 系统管理平台</p>
            <div class="brand-features">
              <div class="feature-item">
                <div class="feature-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <span>高性能</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <span>安全可靠</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <span>体验极致</span>
              </div>
            </div>
            <!-- 装饰性数据卡片 -->
            <div class="brand-stat-card">
              <div class="stat-card-inner">
                <div class="stat-number">2,847</div>
                <div class="stat-label">系统活跃用户</div>
                <div class="stat-trend up">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="18 15 12 9 6 15"/>
                  </svg>
                  +12.5%
                </div>
              </div>
              <!-- 装饰圆 -->
              <div class="stat-decor-circle"></div>
            </div>
          </div>
          <!-- 渐变背景 -->
          <div class="brand-gradient"></div>
          <!-- 浮动装饰球 -->
          <div class="floating-ball ball-1"></div>
          <div class="floating-ball ball-2"></div>
        </div>

        <!-- 右侧表单区域 -->
        <div class="form-section">
          <div class="form-header">
            <h2 class="form-title">用户登录</h2>
            <p class="form-desc">请输入您的账号信息</p>
          </div>

          <el-form
            ref="loginFormRef"
            :model="loginData"
            :rules="loginRules"
            class="login-form"
            @submit.prevent="handleLogin"
          >
            <!-- 用户名 -->
            <el-form-item prop="username" class="form-item">
              <label class="input-label">{{ $t('login.username') }}</label>
              <el-input
                v-model="loginData.username"
                :placeholder="$t('login.username')"
                size="large"
                class="login-input"
              >
                <template #prefix>
                  <svg-icon icon-class="user" class="input-icon" />
                </template>
              </el-input>
            </el-form-item>

            <!-- 密码 -->
            <el-form-item prop="password" class="form-item">
              <label class="input-label">{{ $t('login.password') }}</label>
              <el-tooltip :visible="isCapslock" :content="$t('login.capsLock')" placement="right">
                <el-input
                  v-model="loginData.password"
                  :placeholder="$t('login.password')"
                  type="password"
                  size="large"
                  class="login-input"
                  show-password
                  @keyup="checkCapslock"
                  @keyup.enter="handleLogin"
                >
                  <template #prefix>
                    <svg-icon icon-class="lock" class="input-icon" />
                  </template>
                </el-input>
              </el-tooltip>
            </el-form-item>

            <!-- 验证码 -->
            <el-form-item prop="captchaCode" class="form-item">
              <label class="input-label">{{ $t('login.captchaCode') }}</label>
              <div class="captcha-wrapper">
                <el-input
                  v-model="loginData.captchaCode"
                  :placeholder="$t('login.captchaCode')"
                  size="large"
                  class="login-input captcha-input"
                  @keyup.enter="handleLogin"
                >
                  <template #prefix>
                    <svg-icon icon-class="captcha" class="input-icon" />
                  </template>
                </el-input>
                <el-image
                  :src="captchaBase64"
                  class="captcha-image"
                  @click="getCaptcha"
                />
              </div>
            </el-form-item>

            <!-- 记住登录 & 忘记密码 -->
            <div class="form-options">
              <el-checkbox v-model="rememberMe" label="记住登录状态" />
              <span class="forgot-link">忘记密码？</span>
            </div>

            <!-- 登录按钮 -->
            <el-button
              :loading="loading"
              type="primary"
              size="large"
              class="login-button"
              @click="handleLogin"
            >
              {{ loading ? '登录中...' : $t('login.login') }}
            </el-button>
          </el-form>
        </div>
      </div>
    </main>

    <!-- 底部版权 -->
    <footer class="login-footer">
      <p>Copyright &copy; 2024 杭州珀箫文化传媒有限公司 All Rights Reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore, useUserStore } from "@/store";
import AuthAPI from "@/api/auth";
import { LoginData } from "@/api/auth/model";
import type { FormInstance } from "element-plus";
import { LocationQuery, useRoute } from "vue-router";
import router from "@/router";
import defaultSettings from "@/settings";
import { ThemeEnum } from "@/enums/ThemeEnum";

const userStore = useUserStore();
const settingsStore = useSettingsStore();
const route = useRoute();

// Internationalization
const { t } = useI18n();

// Reactive states
const isDark = ref(settingsStore.theme === ThemeEnum.DARK);
const loading = ref(false); // 按钮loading
const isCapslock = ref(false); // 是否大写锁定
const captchaBase64 = ref(); // 验证码图片Base64字符串
const loginFormRef = ref<FormInstance>(); // 登录表单ref
const rememberMe = ref(false);

const loginData = ref<LoginData>({
  username: "admin",
  password: "admin",
  captchaCode: "8888",
});

const loginRules = computed(() => {
  return {
    username: [
      {
        required: true,
        trigger: "blur",
        message: t("login.message.username.required"),
      },
    ],
    password: [
      {
        required: true,
        trigger: "blur",
        message: t("login.message.password.required"),
      },
    ],
    captchaCode: [],
  };
});

/** 获取验证码 */
function getCaptcha() {
  AuthAPI.getCaptcha().then((data) => {
    loginData.value.captchaKey = data.captchaKey;
    captchaBase64.value = data.captchaBase64;
  });
}

// 登录
function handleLogin() {
  loginFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      userStore
        .login(loginData.value)
        .then(() => {
          const { path, queryParams } = parseRedirect();
          router.push({ path: path, query: queryParams });
        })
        .catch(() => {
          getCaptcha();
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
}

// 解析 redirect 字符串 为 path 和  queryParams
function parseRedirect(): {
  path: string;
  queryParams: Record<string, string>;
} {
  const query: LocationQuery = route.query;
  const redirect = (query.redirect as string) ?? "/";

  const url = new URL(redirect, window.location.origin);
  const path = url.pathname;
  const queryParams: Record<string, string> = {};

  url.searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });

  return { path, queryParams };
}

/** 主题切换 */
const toggleTheme = () => {
  const newTheme =
    settingsStore.theme === ThemeEnum.DARK ? ThemeEnum.LIGHT : ThemeEnum.DARK;
  settingsStore.changeTheme(newTheme);
};

/** 检查输入大小写 */
function checkCapslock(event: KeyboardEvent) {
  if (event instanceof KeyboardEvent) {
    isCapslock.value = event.getModifierState("CapsLock");
  }
}

onMounted(() => {
  getCaptcha();
});
</script>

<style lang="scss" scoped>
// 设计规范变量
$brand-blue: #1456f0;
$brand-blue-light: #3b82f6;
$brand-pink: #ea5ec1;
$text-primary: #222222;
$text-secondary: #45515e;
$text-muted: #8e8e93;
$bg-white: #ffffff;
$bg-light: #f0f0f0;
$border-color: #e5e7eb;
$shadow-brand: rgba(44, 30, 116, 0.16);
$shadow-standard: rgba(0, 0, 0, 0.08);
$font-ui: 'DM Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
$font-display: 'Outfit', 'Helvetica Neue', Helvetica, Arial, sans-serif;

.login-page {
  min-height: 100vh;
  background: $bg-white;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
}

// 背景装饰
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;

  .circle {
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(135deg, $brand-blue 0%, $brand-blue-light 100%);
    opacity: 0.05;

    &.circle-1 {
      width: 600px;
      height: 600px;
      top: -200px;
      right: -100px;
    }

    &.circle-2 {
      width: 400px;
      height: 400px;
      bottom: -100px;
      left: -100px;
    }

    &.circle-3 {
      width: 300px;
      height: 300px;
      top: 50%;
      right: 20%;
      background: linear-gradient(135deg, $brand-pink 0%, $brand-blue 100%);
      opacity: 0.03;
    }
  }
}

// 顶部栏
.login-header {
  position: relative;
  z-index: 10;
  padding: 20px 40px;
  background: transparent;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1400px;
    margin: 0 auto;
  }

  .logo-section {
    display: flex;
    align-items: center;
    gap: 12px;

    .logo-image {
      width: 36px;
      height: 36px;
    }

    .logo-text {
      font-family: $font-display;
      font-size: 20px;
      font-weight: 600;
      color: $text-primary;
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 16px;

    .lang-select {
      cursor: pointer;
    }
  }
}

// 登录主体
.login-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
  z-index: 10;
}

// 登录卡片
.login-card {
  display: flex;
  width: 900px;
  max-width: 100%;
  background: $bg-white;
  border-radius: 24px;
  box-shadow: rgba(44, 30, 116, 0.11) 6.5px 2px 17.5px;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

// 左侧品牌区域
.brand-section {
  flex: 1;
  background: linear-gradient(135deg, $brand-blue 0%, #1e3a8a 100%);
  padding: 60px 50px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;

  .brand-gradient {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
  }

  .brand-content {
    position: relative;
    z-index: 1;
  }

  .brand-title {
    font-family: $font-display;
    font-size: 36px;
    font-weight: 600;
    color: $bg-white;
    margin: 0 0 16px 0;
    line-height: 1.2;
  }

  .brand-subtitle {
    font-family: $font-ui;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.8);
    margin: 0 0 40px 0;
    line-height: 1.5;
  }

  .brand-features {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .feature-item {
      display: flex;
      align-items: center;
      gap: 12px;
      color: $bg-white;
      font-family: $font-ui;
      font-size: 14px;

      .feature-icon {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      }
    }
  }

  // 装饰性数据卡片
  .brand-stat-card {
    margin-top: 48px;
    position: relative;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 20px;
    padding: 24px 28px;
    overflow: hidden;
    backdrop-filter: blur(12px);

    .stat-card-inner {
      position: relative;
      z-index: 1;
    }

    .stat-number {
      font-family: $font-display;
      font-size: 36px;
      font-weight: 700;
      color: $bg-white;
      line-height: 1;
      margin-bottom: 6px;
      letter-spacing: -1px;
    }

    .stat-label {
      font-family: $font-ui;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 12px;
    }

    .stat-trend {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-family: $font-ui;
      font-size: 13px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 9999px;

      &.up {
        color: #86efac;
        background: rgba(134, 239, 172, 0.15);
      }

      &.down {
        color: #fca5a5;
        background: rgba(252, 165, 165, 0.15);
      }
    }

    .stat-decor-circle {
      position: absolute;
      right: -30px;
      top: -30px;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.06);
    }
  }

  // 浮动装饰球
  .floating-ball {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;

    &.ball-1 {
      width: 180px;
      height: 180px;
      right: -60px;
      bottom: 60px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
    }

    &.ball-2 {
      width: 100px;
      height: 100px;
      right: 60px;
      top: 80px;
      background: radial-gradient(circle, rgba(58, 174, 255, 0.3) 0%, transparent 70%);
    }
  }
}

// 右侧表单区域
.form-section {
  flex: 1;
  padding: 60px 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .form-header {
    margin-bottom: 40px;
  }

  .form-title {
    font-family: $font-display;
    font-size: 28px;
    font-weight: 600;
    color: $text-primary;
    margin: 0 0 8px 0;
    line-height: 1.3;
  }

  .form-desc {
    font-family: $font-ui;
    font-size: 14px;
    color: $text-muted;
    margin: 0;
  }
}

// 登录表单
.login-form {
  .form-item {
    margin-bottom: 24px;
  }

  .input-label {
    display: block;
    font-family: $font-ui;
    font-size: 14px;
    font-weight: 500;
    color: $text-primary;
    margin-bottom: 8px;
  }

  .login-input {
    :deep(.el-input__wrapper) {
      padding: 12px 16px;
      border-radius: 12px;
      border: 1px solid $border-color;
      background: $bg-white;
      box-shadow: none;
      transition: all 0.2s ease;

      &:hover {
        border-color: $brand-blue-light;
      }

      &.is-focus {
        border-color: $brand-blue;
        box-shadow: 0 0 0 3px rgba(20, 86, 240, 0.1);
      }
    }

    :deep(.el-input__inner) {
      font-family: $font-ui;
      font-size: 15px;
      color: $text-primary;

      &::placeholder {
        color: $text-muted;
      }
    }

    :deep(.el-input__prefix) {
      color: $text-muted;
    }
  }

  .input-icon {
    font-size: 18px;
    color: $text-muted;
  }

  // 验证码包装
  .captcha-wrapper {
    display: flex;
    gap: 12px;

    .captcha-input {
      flex: 1;
    }

    .captcha-image {
      width: 120px;
      height: 48px;
      border-radius: 12px;
      cursor: pointer;
      border: 1px solid $border-color;
      transition: transform 0.2s ease;

      &:hover {
        transform: scale(1.02);
      }
    }
  }
}

// 表单选项
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  :deep(.el-checkbox__label) {
    font-family: $font-ui;
    font-size: 14px;
    color: $text-secondary;
  }
}

.forgot-link {
  font-family: $font-ui;
  font-size: 14px;
  color: $brand-blue;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: $brand-blue-light;
  }
}

// 登录按钮
.login-button {
  width: 100%;
  height: 52px;
  background: $brand-blue;
  border: none;
  border-radius: 9999px;
  font-family: $font-ui;
  font-size: 16px;
  font-weight: 600;
  color: $bg-white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(20, 86, 240, 0.4);

  &:hover {
    background: #0f47d9;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(20, 86, 240, 0.5);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #93c5fd;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
}

// 底部版权
.login-footer {
  padding: 20px;
  text-align: center;
  position: relative;
  z-index: 10;

  p {
    font-family: $font-ui;
    font-size: 12px;
    color: $text-muted;
    margin: 0;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .login-card {
    flex-direction: column;
    width: 100%;
    border-radius: 16px;
  }

  .brand-section {
    padding: 40px 30px;

    .brand-title {
      font-size: 28px;
    }
  }

  .form-section {
    padding: 40px 30px;
  }

  .login-header {
    padding: 16px 20px;
  }
}

// 暗黑主题
html.dark {
  .login-page {
    background: #181e25;
  }

  .brand-section {
    background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
  }

  .form-section {
    .form-title {
      color: #ffffff;
    }
  }

  .login-form {
    .login-input {
      :deep(.el-input__wrapper) {
        background: #1f2937;
        border-color: #374151;

        &:hover {
          border-color: $brand-blue-light;
        }
      }

      :deep(.el-input__inner) {
        color: #f3f4f6;
      }
    }
  }

  .login-footer {
    p {
      color: #6b7280;
    }
  }
}
</style>