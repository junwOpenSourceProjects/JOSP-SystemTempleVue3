<!-- 侧边栏菜单项组件 -->
<!-- 负责渲染单个菜单项，支持一级菜单和有多级子菜单的父菜单 -->
<template>
    <div v-if="!item.meta || !item.meta.hidden">
      <!--
        显示具有单个子路由的菜单项或没有子路由的父路由
        条件：
          1. 只有一个子路由
          2. 或者没有子路由
          3. 且没有配置 alwaysShow（强制显示为父菜单）
      -->
      <template v-if="
        hasOneShowingChild(item.children, item as RouteRecordRaw) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.meta?.alwaysShow
      ">
      <AppLink
        v-if="onlyOneChild.meta"
        :to="{
          path: resolvePath(onlyOneChild.path),
          query: onlyOneChild.meta.params,
        }"
      >
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <SidebarMenuItemTitle
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :title="onlyOneChild.meta.title"
          />
        </el-menu-item>
      </AppLink>
    </template>

    <!-- 显示具有多个子路由的父菜单项（可展开的下拉菜单） -->
    <el-sub-menu v-else :index="resolvePath(item.path)" teleported>
      <template #title>
        <SidebarMenuItemTitle
          v-if="item.meta"
          :icon="item.meta && item.meta.icon"
          :title="item.meta.title"
        />
      </template>

      <SidebarMenuItem
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>
  </div>
</template>
<script setup lang="ts">
/**
 * 侧边栏菜单项组件
 * 职责：渲染单个菜单项，处理菜单的展开/收起逻辑，解析菜单路径
 */
defineOptions({
  name: "SidebarMenuItem",
  inheritAttrs: false,
});

import path from "path-browserify";
import { isExternal } from "@/utils/index";
import { RouteRecordRaw } from "vue-router";
import { MenuTypeEnum } from "@/enums/MenuTypeEnum";

/** 组件属性定义 */
const props = defineProps({
  /** 路由对象（如 {path: 'user', meta: {title: '用户管理'}} ） */
  item: {
    type: Object,
    required: true,
  },

  /** 父级完整路由路径（如 /system），用于解析相对路径 */
  basePath: {
    type: String,
    required: true,
  },

  /** 是否为嵌套菜单（嵌套时无左侧圆角） */
  isNest: {
    type: Boolean,
    default: false,
  },
});

/** 临时变量：存储唯一的子路由（当只有一个子路由时使用） */
const onlyOneChild = ref();

/**
 * 判断当前路由是否只有一个子路由或无子路由
 *
 * 规则：
 * 1. 如果只有一个子路由：返回 true，显示该子路由
 * 2. 如果无子路由：返回 true，显示父级路由本身
 * 3. 如果有多个子路由：返回 false，显示为可展开的父菜单
 *
 * @param children 子路由数组
 * @param parent 当前路由
 * @returns 是否只有一个显示的子路由
 */
function hasOneShowingChild(
  children: RouteRecordRaw[] = [],
  parent: RouteRecordRaw
) {
  // 过滤掉隐藏的路由和按钮类型的路由（按钮是权限不是路由）
  const showingChildren = children.filter((route: RouteRecordRaw) => {
    // 隐藏路由或按钮类型路由不显示
    if (route.meta?.hidden || (route as any).type === MenuTypeEnum.BUTTON) {
      return false;
    } else {
      // 重置隐藏状态
      route.meta!.hidden = false;
      onlyOneChild.value = route;
      return true;
    }
  });

  // 只有一个子路由，返回 true
  if (showingChildren.length === 1) {
    return true;
  }

  // 没有子路由，显示父级路由本身
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: "", noShowingChildren: true };
    return true;
  }

  // 有多个子路由，返回 false（显示为父菜单）
  return false;
}

/**
 * 解析路由路径（相对路径 → 绝对路径）
 *
 * @param routePath 路由路径（如 'user' 或 '/user'）
 * @returns 完整绝对路径（如 '/system/user'）
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

  // 完整路径 = 父级路径(/system) + 路由路径(user) = /system/user
  const fullPath = path.resolve(props.basePath, routePath);
  return fullPath;
}
</script>

<style lang="scss">
.hideSidebar {
  .submenu-title-noDropdown {
    position: relative;
    padding: 0 !important;

    .el-tooltip {
      padding: 0 !important;

      .sub-el-icon {
        margin-left: 19px;
      }
    }

    & > span {
      display: inline-block;
      width: 0;
      height: 0;
      overflow: hidden;
      visibility: hidden;
    }
  }

  .el-sub-menu {
    overflow: hidden;

    & > .el-sub-menu__title {
      padding: 0 !important;

      .sub-el-icon {
        margin-left: 19px;
      }

      .el-sub-menu__icon-arrow {
        display: none;
      }
    }
  }

  .el-menu--collapse {
    width: $sidebar-width-collapsed;

    .el-sub-menu {
      & > .el-sub-menu__title {
        & > span {
          display: inline-block;
          width: 0;
          height: 0;
          overflow: hidden;
          visibility: hidden;
        }
      }
    }
  }
}

.el-menu-item:hover {
  background-color: $menu-hover;
}
</style>
