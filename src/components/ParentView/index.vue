<template>
  <router-view />
</template>

<script setup lang="ts">
/**
 * ParentView 组件
 * 仅用于多级嵌套路由的过渡层容器
 */
defineOptions({
  name: "ParentView"
});
</script>
