<script lang="ts">
import theme from '#build/ui/dashboard-group'
import type { UseResizableProps } from '../composables/useResizable'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../types/utils'

type DashboardGroup = ComponentConfig<typeof theme, AppConfig, 'dashboardGroup'>

export interface DashboardGroupProps extends Pick<UseResizableProps, 'storage' | 'storageKey' | 'persistent' | 'unit'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  class?: any
}

export interface DashboardGroupSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useNuxtApp, useAppConfig } from '#imports'
import { provideDashboardContext } from '../utils/dashboard'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<DashboardGroupProps>(), {
  as: 'div',
  storage: 'cookie',
  storageKey: 'dashboard',
  persistent: true,
  unit: '%'
})

const appConfig = useAppConfig() as DashboardGroup['AppConfig']
const nuxtApp = useNuxtApp()

const ui = computed(() =>
  tv({
    extend: tv(theme),
    ...(appConfig.ui?.dashboardGroup || {})
  })
)

const sidebarOpen = ref(false)
const sidebarCollapsed = ref(false)

provideDashboardContext({
  storage: props.storage,
  storageKey: props.storageKey,
  persistent: props.persistent,
  unit: props.unit,
  sidebarOpen,
  sidebarCollapsed,
  toggleSidebar: () => nuxtApp.hooks.callHook('dashboard:sidebar:toggle' as any),
  collapseSidebar: (collapsed: boolean) => nuxtApp.hooks.callHook('dashboard:sidebar:collapse' as any, collapsed),
  toggleSearch: () => nuxtApp.hooks.callHook('dashboard:search:toggle' as any)
})
</script>

<template>
  <Primitive :as="props.as" :class="ui({ class: props.class })">
    <slot />
  </Primitive>
</template>
