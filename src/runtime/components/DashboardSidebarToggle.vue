<script lang="ts">
import type { ButtonProps } from '@nuxt/ui'
import theme from '#build/ui/dashboard-sidebar-toggle'

export interface DashboardSidebarToggleProps extends
  /** @vue-ignore */
  Pick<ButtonProps, 'as' | 'size' | 'disabled' | 'ui'> {
  side?: 'left' | 'right'
  /**
   * @defaultValue 'neutral'
   */
  color?: ButtonProps['color']
  /**
   * @defaultValue 'ghost'
   */
  variant?: ButtonProps['variant']
  class?: any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useForwardProps } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useLocalePro } from '../composables/useLocalePro'
import { useDashboard } from '../utils/dashboard'
import { tv } from '../utils/tv'

// define props
const props = defineProps<DashboardSidebarToggleProps>()

// forward base props to UButton
const rootProps = useForwardProps(reactivePick(props, 'color', 'variant', 'size', 'as', 'disabled', 'ui'))

// localization + dashboard toggle state
const { t } = useLocalePro()
const appConfig = useAppConfig() as DashboardSidebarToggle['AppConfig']
const { sidebarOpen, toggleSidebar } = useDashboard()

// handle theme merge
const ui = computed(() => {
  const baseTheme = typeof theme === 'string' ? { base: theme } : theme
  return tv({
    extend: tv(baseTheme),
    ...appConfig.ui?.dashboardSidebarToggle
  })
})
</script>

<template>
  <UButton
    v-bind="rootProps"
    :aria-label="sidebarOpen ? t('dashboardSidebarToggle.close') : t('dashboardSidebarToggle.open')"
    :icon="sidebarOpen ? appConfig.ui.icons.close : appConfig.ui.icons.menu"
    :class="typeof ui === 'function' ? ui({ class: props.class, side: props.side }) : ui"
    @click="toggleSidebar"
  />
</template>
