<!-- 侧边栏组件 -->
<!-- 根据布局模式渲染不同的侧边栏样式：混合布局/左侧布局/顶部布局 -->
<template>
  <div :class="{ 'has-logo': sidebarLogo }">
    <!--混合布局 - 顶部水平菜单 + 左侧垂直菜单 -->
    <div class="flex w-full" v-if="layout == LayoutEnum.MIX">
      <SidebarLogo v-if="sidebarLogo" :collapse="!appStore.sidebar.opened" />
      <SidebarMixTopMenu class="flex-1" />
      <NavbarRight />
    </div>
    <!--左侧布局 || 顶部布局 -->
    <!-- 左侧布局：垂直菜单 + 可选右侧用户栏 -->
    <!-- 顶部布局：水平菜单 + 右侧用户栏 -->
    <template v-else>
      <SidebarLogo v-if="sidebarLogo" :collapse="!appStore.sidebar.opened" />
      <el-scrollbar>
        <SidebarMenu :menu-list="permissionStore.routes" base-path="" />
      </el-scrollbar>
      <NavbarRight v-if="layout === LayoutEnum.TOP" />
    </template>
  </div>
</template>

<script setup lang="ts">
/**
 * 侧边栏组件
 * 职责：根据布局配置渲染对应的侧边栏结构
 */
import { useSettingsStore, usePermissionStore, useAppStore } from "@/store";
import { LayoutEnum } from "@/enums/LayoutEnum";

const appStore = useAppStore();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();

/** 计算属性：是否显示Logo */
const sidebarLogo = computed(() => settingsStore.sidebarLogo);

/** 计算属性：当前布局模式 */
const layout = computed(() => settingsStore.layout);
</script>

<style lang="scss" scoped>
.has-logo {
  .el-scrollbar {
    height: calc(100vh - $navbar-height);
  }
}
</style>
