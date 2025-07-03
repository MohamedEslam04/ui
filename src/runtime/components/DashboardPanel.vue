<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../types'
import type { UseResizableProps } from '../composables/useResizable'
import theme from '#build/ui/dashboard-panel'

type DashboardPanel = ComponentConfig<typeof theme, AppConfig, 'dashboardPanel'>

export interface DashboardPanelProps extends Pick<UseResizableProps, 'id' | 'minSize' | 'maxSize' | 'defaultSize' | 'resizable'> {
  class?: any
  ui?: DashboardPanel['slots']
}

export interface DashboardPanelSlots {
  'default'(props?: {}): any
  'header'(props?: {}): any
  'body'(props?: {}): any
  'footer'(props?: {}): any
  'resize-handle'(props: { onMouseDown: (e: MouseEvent) => void, onTouchStart: (e: TouchEvent) => void }): any
}
</script>

<script setup lang="ts">
import { useId, toRef, computed } from 'vue'
import { useAppConfig } from '#imports'
import { useResizable } from '../composables/useResizable'
import { useDashboard } from '../utils/dashboard'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<DashboardPanelProps>(), {
  resizable: false
})
defineSlots<DashboardPanelSlots>()

const appConfig = useAppConfig() as DashboardPanel['AppConfig']
const dashboardContext = useDashboard({ storageKey: 'dashboard', unit: '%' })
const panelId = `${dashboardContext.storageKey}-panel-${props.id || useId()}`
const { el, size, isDragging, onMouseDown, onTouchStart } = useResizable(panelId, toRef(() => ({ ...dashboardContext, ...props })))

const uiPro = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.dashboardPanel })())
</script>

<template>
  <div
    :id="panelId"
    ref="el"
    :data-dragging="isDragging"
    :class="uiPro.root({ class: [props.ui?.root, props.class] })"
    :style="size ? { '--width': `${size}${dashboardContext.unit}` } : undefined"
  >
    <slot>
      <slot name="header" />

      <div :class="uiPro.body({ class: props.ui?.body })">
        <slot name="body" />
      </div>

      <slot name="footer" />
    </slot>
  </div>

  <slot name="resize-handle" :on-mouse-down="onMouseDown" :on-touch-start="onTouchStart">
    <UDashboardResizeHandle
      v-if="props.resizable"
      :aria-controls="panelId"
      :class="uiPro.handle({ class: props.ui?.handle })"
      @mousedown="onMouseDown"
      @touchstart="onTouchStart"
    />
  </slot>
</template>
