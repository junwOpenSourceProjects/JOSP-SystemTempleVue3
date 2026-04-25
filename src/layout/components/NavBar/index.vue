<template>
  <!-- 顶部导航栏组件 -->
  <!-- 包含左侧区域（面包屑、搜索等）和右侧区域（用户信息、设置等） -->
  <div class="navbar-container">
    <!-- 导航栏左侧 -->
    <NavbarLeft />
    <!-- 导航栏右侧 -->
    <NavbarRight />
  </div>
</template>

<script setup lang="ts">
/**
 * NavBar 组件
 * 职责：顶部导航栏容器，组合左侧导航和右侧工具栏
 */
</script>

<style lang="scss" scoped>
/** 导航栏容器 - 水平两端对齐布局 */
.navbar-container {
  @apply flex-x-between;

  height: $navbar-height;
  background: var(--el-bg-color);
}
</style>
