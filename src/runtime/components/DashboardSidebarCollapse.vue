<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ButtonProps, ComponentConfig } from '../types'
import theme from '#build/ui/dashboard-sidebar-collapse'

type DashboardSidebarCollapse = ComponentConfig<typeof theme, AppConfig, 'dashboardSidebarCollapse'>
export interface DashboardSidebarCollapseProps
  extends /** @vue-ignore */ Pick<ButtonProps, 'as' | 'size' | 'disabled' | 'ui'> {
  side?: 'left' | 'right'
  /** @defaultValue 'neutral' */
  color?: ButtonProps['color']
  /** @defaultValue 'ghost' */
  variant?: ButtonProps['variant']
  class?: any
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useForwardProps } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useLocalePro } from '../composables/useLocalePro'
import { useDashboard } from '../utils/dashboard'
import { tv } from '../utils/tv'
// import type { DashboardSidebarCollapseProps } from './DashboardSidebarCollapse.vue'

const props = withDefaults(defineProps<DashboardSidebarCollapseProps>(), {
  side: 'left',
  color: 'neutral',
  variant: 'ghost'
})

const rootProps = useForwardProps(
  reactivePick(props, 'color', 'variant', 'size', 'as', 'disabled', 'ui')
)

const { t } = useLocalePro()
const appConfig = useAppConfig() as DashboardSidebarCollapse['AppConfig']
const { sidebarCollapsed, collapseSidebar } = useDashboard({ sidebarCollapsed: ref(false), collapseSidebar: () => { } })

const ui = computed(() =>
  tv({ extend: tv(theme), ...appConfig.ui?.dashboardSidebarCollapse })
)

function toggleCollapse() {
  collapseSidebar?.(!(sidebarCollapsed?.value ?? false))
}
</script>

<template>
  <UButton
    v-bind="rootProps"
    :aria-label="
      sidebarCollapsed
        ? t('dashboardSidebarCollapse.expand')
        : t('dashboardSidebarCollapse.collapse')
    "
    :icon="
      sidebarCollapsed
        ? appConfig.ui.icons.panelOpen
        : appConfig.ui.icons.panelClose
    "
    :class="ui({ class: props.class })"
    @click="toggleCollapse"
  />
</template>
