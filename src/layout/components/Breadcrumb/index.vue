<template>
  <div class="breadcrumb-container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbs"
        :key="item.path"
      >
        <span
          :class="{ 'is-link': Number(index) < breadcrumbs.length - 1 }"
          @click="handleLink(item)"
        >
          {{ translateRouteTitle(item.meta?.title) }}
        </span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { translateRouteTitle } from "@/utils/i18n";

interface Breadcrumb {
  path: string;
  name: string;
  meta?: {
    title?: string;
  };
}

const route = useRoute();
const router = useRouter();

const breadcrumbs = computed(() => {
  const matched = route.matched.filter((item) => item.meta?.title);
  // Add home breadcrumb if not present
  if (matched.length > 0 && matched[0].path !== "/") {
    return [
      { path: "/", name: "Home", meta: { title: "首页" } },
      ...matched,
    ];
  }
  return matched;
});

function handleLink(item: Breadcrumb) {
  if (item.path) {
    router.push(item.path);
  }
}
</script>

<style lang="scss" scoped>
$font-ui: 'DM Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
$text-secondary: #45515e;
$brand-blue: #1456f0;

.breadcrumb-container {
  display: flex;
  align-items: center;

  :deep(.el-breadcrumb) {
    font-family: $font-ui;
    font-size: 14px;
  }

  :deep(.el-breadcrumb__item) {
    .el-breadcrumb__inner {
      color: $text-secondary;
      font-weight: 400;

      &.is-link:hover {
        color: $brand-blue;
      }
    }

    &:last-child .el-breadcrumb__inner {
      color: var(--el-text-color-primary);
      font-weight: 500;
    }
  }

  :deep(.el-breadcrumb__separator) {
    color: #d1d5db;
  }

  .is-link {
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: $brand-blue;
    }
  }
}
</style>