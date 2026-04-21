<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group enter-active-class="animate__animated animate__fadeInRight">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbs"
        :key="item.path"
      >
        <span
          v-if="item.redirect === 'noredirect' || index === breadcrumbs.length - 1"
          class="breadcrumb-no-link"
        >
          {{ translateRouteTitle(item.meta.title) }}
        </span>
        <a v-else class="breadcrumb-link" @click.prevent="handleLink(item)">
          {{ translateRouteTitle(item.meta.title) }}
        </a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { RouteLocationMatched } from "vue-router";
import { compile } from "path-to-regexp";
import router from "@/router";
import { translateRouteTitle } from "@/utils/i18n";

const currentRoute = useRoute();

const pathCompile = (path: string) => {
  const { params } = currentRoute;
  const toPath = compile(path);
  return toPath(params);
};

const breadcrumbs = ref<Array<RouteLocationMatched>>([]);

function getBreadcrumb() {
  let matched = currentRoute.matched.filter(
    (item) => item.meta && item.meta.title
  );
  const first = matched[0];
  if (!isDashboard(first)) {
    matched = [
      { path: "/dashboard", meta: { title: "首页" } } as any,
    ].concat(matched);
  }
  breadcrumbs.value = matched.filter((item) => {
    return item.meta && item.meta.title && item.meta.breadcrumb !== false;
  });
}

function isDashboard(route: RouteLocationMatched) {
  const name = route && route.name;
  if (!name) {
    return false;
  }
  return (
    name.toString().trim().toLocaleLowerCase() === "Dashboard".toLocaleLowerCase()
  );
}

function handleLink(item: any) {
  const { redirect, path } = item;
  if (redirect) {
    router.push(redirect).catch((err) => {
      console.warn(err);
    });
    return;
  }
  router.push(pathCompile(path)).catch((err) => {
    console.warn(err);
  });
}

watch(
  () => currentRoute.path,
  (path) => {
    if (path.startsWith("/redirect/")) {
      return;
    }
    getBreadcrumb();
  }
);

onBeforeMount(() => {
  getBreadcrumb();
});
</script>

<style lang="scss" scoped>
$font-ui: 'DM Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
$text-primary: #222222;
$text-secondary: #45515e;
$text-muted: #8e8e93;
$brand-blue: #1456f0;
$border-color: #e5e7eb;

.app-breadcrumb {
  display: flex;
  align-items: center;

  :deep(.el-breadcrumb__item) {
    .el-breadcrumb__inner {
      font-family: $font-ui;
      font-size: 14px;
      font-weight: 400;
    }
  }

  .breadcrumb-link {
    font-family: $font-ui;
    font-size: 14px;
    font-weight: 400;
    color: $text-secondary;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: $brand-blue;
    }
  }

  .breadcrumb-no-link {
    font-family: $font-ui;
    font-size: 14px;
    font-weight: 500;
    color: $text-primary;
  }

  :deep(.el-breadcrumb__separator) {
    color: #d1d5db;
  }
}
</style>