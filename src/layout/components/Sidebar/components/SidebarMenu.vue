<!-- 侧边栏菜单组件 -->
<!-- 支持三种布局模式：left（垂直菜单）、top（水平菜单）、mix（垂直菜单） -->
<template>
  <el-menu
    :default-active="currentRoute.path"
    :collapse="!appStore.sidebar.opened"
    :background-color="variables['menu-background']"
    :text-color="variables['menu-text']"
    :active-text-color="variables['menu-active-text']"
    :unique-opened="false"
    :collapse-transition="false"
    :mode="layout === 'top' ? 'horizontal' : 'vertical'"
  >
    <SidebarMenuItem
      v-for="route in menuList"
      :key="route.path"
      :item="route"
      :base-path="resolvePath(route.path)"
      :is-collapse="!appStore.sidebar.opened"
    />
  </el-menu>
</template>

<script lang="ts" setup>
/**
 * 侧边栏菜单组件
 * 职责：渲染菜单列表，处理菜单路径解析
 */
import { useSettingsStore, useAppStore } from "@/store";
import { isExternal } from "@/utils/index";
import path from "path-browserify";
import variables from "@/styles/variables.module.scss";

const settingsStore = useSettingsStore();
const appStore = useAppStore();
const currentRoute = useRoute();

/** 计算属性：当前布局模式 */
const layout = computed(() => settingsStore.layout);

/** 组件属性定义 */
const props = defineProps({
  /** 菜单数据列表 */
  menuList: {
    required: true,
    default: () => {
      return [];
    },
    type: Array<any>,
  },
  /** 基础路径（用于解析相对路径） */
  basePath: {
    type: String,
    required: true,
  },
});

/**
 * 解析路由路径
 * - 如果是外部链接，直接返回
 * - 如果是相对路径，与基础路径合并为绝对路径
 *
 * @param routePath 路由路径（如 /user）
 * @returns 完整绝对路径
 */
function resolvePath(routePath: string) {
  // 外部链接直接返回
  if (isExternal(routePath)) {
    return routePath;
  }
  // 父级路径是外部链接直接返回
  if (isExternal(props.basePath)) {
    return props.basePath;
  }

  // 完整绝对路径 = 父级路径(/system) + 路由路径(/user)
  const fullPath = path.resolve(props.basePath, routePath);
  return fullPath;
}
</script>
