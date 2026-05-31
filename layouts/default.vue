<template>
  <div class="layout">
    <header class="header">
      <div class="container flex items-center justify-between">
        <h1 class="logo font-display">管理系统</h1>
        <nav class="nav flex gap-2">
          <UBadge variant="subtle" color="primary">首页</UBadge>
          <UBadge variant="soft">用户管理</UBadge>
          <UBadge variant="soft">系统设置</UBadge>
        </nav>
      </div>
    </header>
    
    <main class="main">
      <slot />
    </main>
    
    <footer class="footer">
      <div class="container">
        <p class="text-muted">© 2024 管理系统</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: var(--color-bg);
  border-bottom: 1px solid var(--color-border-light);
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text);
}

.main {
  flex: 1;
  padding: 32px 0;
}

.footer {
  background-color: var(--color-bg-dark);
  color: rgba(255, 255, 255, 0.8);
  padding: 24px 0;
  margin-top: auto;
}

.footer p {
  font-size: 14px;
}
</style>