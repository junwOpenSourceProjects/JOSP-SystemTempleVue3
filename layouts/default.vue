<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const open = ref(false)

const links = [[{
  label: '首页',
  icon: 'i-lucide-house',
  to: '/',
  onSelect: () => { open.value = false }
}, {
  label: '仪表板',
  icon: 'i-lucide-layout-dashboard',
  to: '/dashboard',
  onSelect: () => { open.value = false }
}, {
  label: '模板管理',
  icon: 'i-lucide-files',
  to: '/templates',
  onSelect: () => { open.value = false }
}, {
  label: '用户管理',
  icon: 'i-lucide-users',
  to: '/users',
  onSelect: () => { open.value = false }
}, {
  label: '系统设置',
  to: '/settings',
  icon: 'i-lucide-settings',
  defaultOpen: true,
  type: 'trigger',
  children: [{
    label: '常规设置',
    to: '/settings',
    exact: true,
    onSelect: () => { open.value = false }
  }, {
    label: '权限管理',
    to: '/settings/permissions',
    onSelect: () => { open.value = false }
  }, {
    label: '操作日志',
    to: '/settings/logs',
    onSelect: () => { open.value = false }
  }]
}]] satisfies NavigationMenuItem[][]
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
    >
      <template #header="{ collapsed }">
        <div class="flex items-center gap-2 px-2 py-3">
          <UIcon name="i-lucide-layout-template" class="size-6 text-primary" />
          <span v-if="!collapsed" class="font-semibold text-base">系统模板</span>
        </div>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />
      </template>

      <template #footer="{ collapsed }">
        <div class="flex items-center gap-2 px-2 py-2">
          <UAvatar size="sm" icon="i-lucide-user" />
          <div v-if="!collapsed" class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">管理员</p>
            <p class="text-xs text-muted truncate">admin@example.com</p>
          </div>
        </div>
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
