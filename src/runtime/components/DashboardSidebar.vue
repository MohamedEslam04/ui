<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ButtonProps, DrawerProps, ModalProps, SlideoverProps, ComponentConfig } from '../types'
import type { UseResizableProps } from '../composables/useResizable'
import theme from '#build/ui/dashboard-sidebar'

export type DashboardSidebar = ComponentConfig<typeof theme, AppConfig, 'dashboardSidebar'>
export type DashboardSidebarMode = 'modal' | 'slideover' | 'drawer'
export type DashboardSidebarMenu<T extends DashboardSidebarMode>
    = T extends 'modal' ? ModalProps
      : T extends 'slideover' ? SlideoverProps
        : T extends 'drawer' ? DrawerProps
          : never

export interface DashboardSidebarProps<T extends DashboardSidebarMode = DashboardSidebarMode>
  extends Pick<UseResizableProps,
        'id' | 'side' | 'minSize' | 'maxSize' | 'defaultSize' | 'resizable' | 'collapsible' | 'collapsedSize'
  > {
  /** @defaultValue 'slideover' */
  mode?: T
  /** Props for the sidebar menu component */
  menu?: DashboardSidebarMenu<T>
  /** Customize the toggle button */
  toggle?: boolean | Partial<ButtonProps>
  /** @defaultValue 'left' */
  toggleSide?: 'left' | 'right'
  class?: any
  ui?: DashboardSidebar['slots']
}

export interface DashboardSidebarSlots {
  'header'(props: { collapsed?: boolean, collapse?: (value: boolean) => void }): any
  'default'(props: { collapsed?: boolean, collapse?: (value: boolean) => void }): any
  'footer'(props: { collapsed?: boolean, collapse?: (value: boolean) => void }): any
  'toggle'(props: { open: boolean, toggle: () => void }): any
  'content'(props?: {}): any
  'resize-handle'(props: { onMouseDown: (e: MouseEvent) => void, onTouchStart: (e: TouchEvent) => void }): any
}
</script>

<script setup lang="ts">
import { ref, computed, toRef, useId, watch } from 'vue'
import { defu } from 'defu'
import { createReusableTemplate } from '@vueuse/core'
import USlideover from './Slideover.vue'
import UModal from './Modal.vue'
import UDrawer from './Drawer.vue'
import { useAppConfig, useRuntimeHook, useRoute } from '#imports'
import { useResizable } from '../composables/useResizable'
import { useDashboard } from '../utils/dashboard'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<DashboardSidebarProps>(), {
  mode: 'slideover',
  toggle: true,
  toggleSide: 'left',
  side: 'left',
  minSize: 10,
  maxSize: 20,
  defaultSize: 15,
  resizable: false,
  collapsible: false,
  collapsedSize: 0
})

defineSlots<DashboardSidebarSlots>()

const open = defineModel('open', { type: Boolean, default: false })
const collapsed = defineModel('collapsed', { type: Boolean, default: false })

const route = useRoute()
const appConfig = useAppConfig() as DashboardSidebar['AppConfig']
const dashboardCtx = useDashboard({
  storageKey: 'dashboard', unit: '%', sidebarOpen: ref(false), sidebarCollapsed: ref(false)
})

const id = `${dashboardCtx.storageKey}-sidebar-${props.id || useId()}`

const {
  el, size, collapse, isCollapsed, isDragging,
  onMouseDown, onTouchStart
} = useResizable(
  id,
  toRef(() => ({ ...dashboardCtx, ...props })),
  { collapsed }
)

const [DefineToggle, ReuseToggle] = createReusableTemplate()
const [DefineHandle, ReuseHandle] = createReusableTemplate()

useRuntimeHook('dashboard:sidebar:toggle', () => {
  open.value = !open.value
})
useRuntimeHook('dashboard:sidebar:collapse', (v) => {
  isCollapsed.value = v
})

watch(open, () => {
  if (dashboardCtx.sidebarOpen) {
    dashboardCtx.sidebarOpen.value = open.value
  }
}, { immediate: true })
watch(isCollapsed, () => {
  if (dashboardCtx.sidebarCollapsed) {
    dashboardCtx.sidebarCollapsed.value = isCollapsed.value
  }
}, { immediate: true })
watch(() => route.fullPath, () => {
  open.value = false
})

const ui = computed(() =>
  tv({ extend: tv(theme), ...appConfig.ui?.dashboardSidebar })({ side: props.side })
)

const Menu = computed(() => ({ slideover: USlideover, modal: UModal, drawer: UDrawer })[props.mode])

const menuProps = toRef(() => defu(
  props.menu,
  { content: { onOpenAutoFocus: (e: Event) => e.preventDefault() } },
  props.mode === 'modal'
    ? { fullscreen: true, transition: false }
    : props.mode === 'slideover' ? { side: 'left' } : {}
))

function toggleOpen() {
  open.value = !open.value
}
</script>

<template>
  <DefineToggle>
    <slot name="toggle" :open="open" :toggle="toggleOpen">
      <UDashboardSidebarToggle
        v-if="props.toggle"
        v-bind="typeof props.toggle === 'object' ? props.toggle : {}"
        :side="props.toggleSide"
        :class="ui.toggle({ class: props.ui?.toggle, toggleSide: props.toggleSide })"
      />
    </slot>
  </DefineToggle>

  <DefineHandle>
    <slot name="resize-handle" :on-mouse-down="onMouseDown" :on-touch-start="onTouchStart">
      <UDashboardResizeHandle
        v-if="props.resizable"
        :aria-controls="id"
        :class="ui.handle({ class: props.ui?.handle })"
        @mousedown="onMouseDown"
        @touchstart="onTouchStart"
      />
    </slot>
  </DefineHandle>

  <ReuseHandle v-if="props.side === 'right'" />

  <div
    :id="id"
    ref="el"
    :data-collapsed="isCollapsed"
    :data-dragging="isDragging"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    :style="{ '--width': `${size}${dashboardCtx.unit}` }"
  >
    <div v-if="$slots.header" :class="ui.header({ class: props.ui?.header })">
      <slot name="header" :collapsed="isCollapsed" :collapse="collapse" />
    </div>

    <div :class="ui.body({ class: props.ui?.body })">
      <slot :collapsed="isCollapsed" :collapse="collapse" />
    </div>

    <div v-if="$slots.footer" :class="ui.footer({ class: props.ui?.footer })">
      <slot name="footer" :collapsed="isCollapsed" :collapse="collapse" />
    </div>
  </div>

  <ReuseHandle v-if="props.side === 'left'" />

  <Menu
    v-model:open="open"
    v-bind="menuProps"
    :ui="{
      overlay: ui.overlay({ class: props.ui?.overlay }),
      content: ui.content({ class: props.ui?.content })
    }"
  >
    <template #content>
      <slot name="content">
        <div
          v-if="$slots.header || props.mode !== 'drawer'"
          :class="ui.header({ class: props.ui?.header, menu: true })"
        >
          <ReuseToggle v-if="props.mode !== 'drawer' && props.toggleSide === 'left'" />
          <slot name="header" />
          <ReuseToggle v-if="props.mode !== 'drawer' && props.toggleSide === 'right'" />
        </div>

        <div :class="ui.body({ class: props.ui?.body, menu: true })">
          <slot />
        </div>

        <div v-if="$slots.footer" :class="ui.footer({ class: props.ui?.footer, menu: true })">
          <slot name="footer" />
        </div>
      </slot>
    </template>
  </Menu>
</template>
