<template>
  <div class="navbar-left">
    <!-- 汉堡菜单 -->
    <hamburger
      :is-active="appStore.sidebar.opened"
      @toggle-click="toggleSideBar"
    />
    <!-- 面包屑 -->
    <breadcrumb class="breadcrumb" />
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store";

const appStore = useAppStore();

function toggleSideBar() {
  appStore.toggleSidebar();
}
</script>

<style lang="scss" scoped>
$font-ui: 'DM Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
$text-primary: #222222;
$brand-blue: #1456f0;

.navbar-left {
  display: flex;
  align-items: center;
  height: 100%;

  :deep(.hamburger) {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 16px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .hamburger-icon {
      width: 20px;
      height: 20px;
      color: $text-primary;
    }
  }

  .breadcrumb {
    margin-left: 8px;
  }
}
</style>
