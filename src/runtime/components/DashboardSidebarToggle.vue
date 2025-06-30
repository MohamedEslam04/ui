<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ButtonProps, ComponentConfig } from '../types'
import theme from '#build/ui/dashboard-sidebar-toggle'

export type DashboardSidebarToggle = ComponentConfig<typeof theme, AppConfig, 'dashboardSidebarToggle'>

export interface DashboardSidebarToggleProps
  extends Pick<ButtonProps, 'as' | 'size' | 'disabled' | 'ui'> {
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
  ui?: DashboardSidebarToggle['slots']
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

const props = defineProps<DashboardSidebarToggleProps>()

const rootProps = useForwardProps(reactivePick(props, 'color', 'variant', 'size', 'as', 'disabled', 'ui'))

const { t } = useLocalePro()
const appConfig = useAppConfig() as DashboardSidebarToggle['AppConfig']
const { sidebarOpen, toggleSidebar } = useDashboard()

const uiPro = computed(() =>
  tv({
    extend: tv(theme),
    ...appConfig.ui?.dashboardSidebarToggle
  })()
)
</script>

<template>
  <UButton
    v-bind="rootProps"
    :aria-label="sidebarOpen ? t('dashboardSidebarToggle.close') : t('dashboardSidebarToggle.open')"
    :icon="sidebarOpen ? appConfig.ui.icons.close : appConfig.ui.icons.menu"
    :class="uiPro({ class: props.class, side: props.side })"
    @click="toggleSidebar"
  />
</template>
