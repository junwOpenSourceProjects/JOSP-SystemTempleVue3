<!-- 主布局组件 -->
<!-- 支持三种布局模式：left（左侧导航）、top（顶部导航）、mix（混合布局） -->
<template>
  <div class="wh-full" :class="classObj">
    <!-- 移动端遮罩层 - 当侧边栏打开时覆盖内容 -->
    <div
      v-if="isMobile && isOpenSidebar"
      class="wh-full fixed-lt z-999 bg-black bg-opacity-30"
      @click="handleOutsideClick"
    ></div>

    <!-- 公用侧边栏 -->
    <Sidebar class="sidebar-container" />

    <!-- 混合布局 -->
    <div v-if="layout === LayoutEnum.MIX" class="mix-container">
      <div class="mix-container__left">
        <SidebarMenu :menu-list="mixLeftMenus" :base-path="activeTopMenuPath" />
        <div class="sidebar-toggle">
          <hamburger
            :is-active="appStore.sidebar.opened"
            @toggle-click="toggleSidebar"
          />
        </div>
      </div>

      <div :class="{ hasTagsView: showTagsView }" class="main-container">
        <div :class="{ 'fixed-header': fixedHeader }">
          <TagsView v-if="showTagsView" />
        </div>
        <AppMain />
        <Settings v-if="defaultSettings.showSettings" />
        <!-- 返回顶部 -->
        <el-backtop target=".main-container">
          <svg-icon icon-class="backtop" size="24px" />
        </el-backtop>
      </div>
    </div>

    <!-- 左侧和顶部布局 -->
    <div v-else :class="{ hasTagsView: showTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <NavBar v-if="layout === 'left'" />
        <TagsView v-if="showTagsView" />
      </div>
      <AppMain />
      <Settings v-if="defaultSettings.showSettings" />
      <!-- 返回顶部 -->
      <el-backtop target=".main-container">
        <svg-icon icon-class="backtop" size="24px" />
      </el-backtop>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 主布局组件
 * 职责：管理整体布局结构，支持响应式设计，处理侧边栏展开/收起逻辑
 */
import { useAppStore, useSettingsStore, usePermissionStore } from "@/store";
import defaultSettings from "@/settings";
import { DeviceEnum } from "@/enums/DeviceEnum";
import { LayoutEnum } from "@/enums/LayoutEnum";

const appStore = useAppStore();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();
const width = useWindowSize().width;

/**
 * 响应式布局断点宽度
 * - 大屏 >=1200px
 * - 中屏 >=992px
 * - 小屏 >=768px
 */
const WIDTH_DESKTOP = 992;

/** 计算属性：是否为移动端设备 */
const isMobile = computed(() => appStore.device === DeviceEnum.MOBILE);

/** 计算属性：侧边栏是否打开 */
const isOpenSidebar = computed(() => appStore.sidebar.opened);

/** 计算属性：是否固定header */
const fixedHeader = computed(() => settingsStore.fixedHeader);

/** 计算属性：是否显示标签视图 */
const showTagsView = computed(() => settingsStore.tagsView);

/** 计算属性：当前布局模式 (left/top/mix) */
const layout = computed(() => settingsStore.layout);

/** 计算属性：顶部菜单激活路径（混合布局用） */
const activeTopMenuPath = computed(() => appStore.activeTopMenuPath);

/** 计算属性：混合布局左侧菜单 */
const mixLeftMenus = computed(() => permissionStore.mixLeftMenus);

/**
 * 监听顶部菜单激活路径变化
 * 当混合布局中顶部菜单切换时，更新左侧二级菜单
 */
watch(
  () => activeTopMenuPath.value,
  (newVal: string) => {
    permissionStore.setMixLeftMenus(newVal);
  },
  {
    deep: true,
    immediate: true,
  }
);

/**
 * 计算属性：动态样式类
 * 根据侧边栏状态和布局模式生成对应CSS类名
 */
const classObj = computed(() => ({
  hideSidebar: !appStore.sidebar.opened,
  openSidebar: appStore.sidebar.opened,
  mobile: appStore.device === DeviceEnum.MOBILE,
  [`layout-${settingsStore.layout}`]: true,
}));

/**
 * 响应式监听：监听窗口宽度变化
 * - 当宽度小于桌面断点时，切换为移动端设备
 * - 大屏设备自动展开侧边栏，小屏设备自动关闭
 */
watchEffect(() => {
  appStore.toggleDevice(
    width.value < WIDTH_DESKTOP ? DeviceEnum.MOBILE : DeviceEnum.DESKTOP
  );
  if (width.value >= WIDTH_DESKTOP) {
    appStore.openSideBar();
  } else {
    appStore.closeSideBar();
  }
});

/** 点击遮罩层关闭侧边栏（移动端） */
function handleOutsideClick() {
  appStore.closeSideBar();
}

/** 切换侧边栏展开/收起状态 */
function toggleSidebar() {
  appStore.toggleSidebar();
}

/** 监听路由变化，移动端时自动关闭侧边栏 */
const route = useRoute();
watch(route, () => {
  if (isMobile.value && isOpenSidebar.value) {
    appStore.closeSideBar();
  }
});
</script>

<style lang="scss" scoped>
.sidebar-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  width: $sidebar-width;
  background-color: $menu-background;
  transition: width 0.28s;

  :deep(.el-menu) {
    border: none;
  }
}

.main-container {
  position: relative;
  height: 100%;
  margin-left: $sidebar-width;
  overflow-y: auto;
  transition: margin-left 0.28s;

  .fixed-header {
    position: sticky;
    top: 0;
    z-index: 9;
    transition: width 0.28s;
  }
}

.layout-top {
  .sidebar-container {
    position: sticky;
    z-index: 999;
    display: flex;
    width: 100% !important;
    height: $navbar-height;

    :deep(.el-scrollbar) {
      flex: 1;
      height: $navbar-height;
    }

    :deep(.el-menu-item),
    :deep(.el-sub-menu__title),
    :deep(.el-menu--horizontal) {
      height: $navbar-height;
      line-height: $navbar-height;
    }

    :deep(.el-menu--collapse) {
      width: 100%;
    }
  }

  .main-container {
    height: calc(100vh - $navbar-height);
    margin-left: 0;
  }
}

.layout-mix {
  .sidebar-container {
    width: 100% !important;
    height: $navbar-height;

    :deep(.el-scrollbar) {
      flex: 1;
      height: $navbar-height;
    }

    :deep(.el-menu-item),
    :deep(.el-sub-menu__title),
    :deep(.el-menu--horizontal) {
      height: $navbar-height;
      line-height: $navbar-height;
    }

    :deep(.el-menu--horizontal.el-menu) {
      border: none;
    }
  }

  .mix-container {
    display: flex;
    height: 100%;
    padding-top: $navbar-height;

    .mix-container__left {
      position: relative;
      width: $sidebar-width;
      height: 100%;

      :deep(.el-menu) {
        height: 100%;
        border: none;
      }

      .sidebar-toggle {
        position: absolute;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 50px;
        line-height: 50px;
        box-shadow: 0 0 6px -2px var(--el-color-primary);

        div:hover {
          background-color: var(--menu-background);
        }

        :deep(svg) {
          color: var(--el-color-primary) !important;
        }
      }
    }

    .main-container {
      flex: 1;
      min-width: 0;
      margin-left: 0;
    }
  }
}

.hideSidebar {
  .main-container {
    margin-left: $sidebar-width-collapsed;
  }

  &.layout-top {
    .main-container {
      margin-left: 0;
    }
  }

  &.layout-mix {
    .sidebar-container {
      width: 100% !important;
    }

    .mix-container {
      .mix-container__left {
        width: $sidebar-width-collapsed;
      }
    }
  }
}

.layout-left.hideSidebar {
  .sidebar-container {
    width: $sidebar-width-collapsed !important;
  }

  .main-container {
    margin-left: $sidebar-width-collapsed;
  }

  &.mobile {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(-210px, 0, 0);
    }

    .main-container {
      margin-left: 0;
    }
  }
}

.mobile {
  .main-container {
    margin-left: 0;
  }

  &.layout-top {
    // 顶部模式全局变量修改
    --el-menu-item-height: $navbar-height;
  }
}
</style>
