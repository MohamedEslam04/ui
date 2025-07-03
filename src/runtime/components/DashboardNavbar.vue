<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ButtonProps, ComponentConfig } from '../types'
import type { DashboardContext } from '../utils/dashboard'
import theme from '#build/ui/dashboard-navbar'

type DashboardNavbar = ComponentConfig<typeof theme, AppConfig, 'dashboardNavbar'>

export interface DashboardNavbarProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * The icon displayed next to the title.
   * @IconifyIcon
   */
  icon?: string
  title?: string
  /**
   * Customize the toggle button to open the sidebar.
   * `{ color: 'neutral', variant: 'ghost' }`
   * @defaultValue true
   */
  toggle?: boolean | Partial<ButtonProps>
  /**
   * The side to render the toggle button on.
   * @defaultValue 'left'
   */
  toggleSide?: 'left' | 'right'
  class?: any
  ui?: DashboardNavbar['slots']
}

export interface DashboardNavbarSlotsProps extends Omit<DashboardContext, 'storage' | 'storageKey' | 'persistent' | 'unit'> {}

export interface DashboardNavbarSlots {
  title(props?: {}): any
  leading(props: DashboardNavbarSlotsProps): any
  trailing(props: DashboardNavbarSlotsProps): any
  left(props: DashboardNavbarSlotsProps): any
  default(props: DashboardNavbarSlotsProps): any
  right(props: DashboardNavbarSlotsProps): any
  toggle(props: DashboardNavbarSlotsProps): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useDashboard } from '../utils/dashboard'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<DashboardNavbarProps>(), {
  as: 'div',
  toggle: true,
  toggleSide: 'left'
})

defineSlots<DashboardNavbarSlots>()

const dashboardContext = useDashboard()
const appConfig = useAppConfig() as DashboardNavbar['AppConfig']
const [DefineToggleTemplate, ReuseToggleTemplate] = createReusableTemplate()

const uiPro = computed(() =>
  tv({
    extend: tv(theme),
    ...appConfig.ui?.dashboardNavbar
  })()
)
</script>

<template>
  <DefineToggleTemplate>
    <slot name="toggle" v-bind="dashboardContext">
      <UDashboardSidebarToggle
        v-if="props.toggle"
        v-bind="typeof props.toggle === 'object' ? props.toggle : {}"
        :side="props.toggleSide"
        :class="uiPro.toggle({ class: props.ui?.toggle, toggleSide: props.toggleSide })"
      />
    </slot>
  </DefineToggleTemplate>

  <Primitive :as="props.as" :class="uiPro.root({ class: [props.ui?.root, props.class] })">
    <div :class="uiPro.left({ class: props.ui?.left })">
      <ReuseToggleTemplate v-if="props.toggleSide === 'left'" />

      <slot name="left" v-bind="dashboardContext">
        <slot name="leading" v-bind="dashboardContext">
          <UIcon v-if="props.icon" :name="props.icon" :class="uiPro.icon({ class: props.ui?.icon })" />
        </slot>

        <h1 :class="uiPro.title({ class: props.ui?.title })">
          <slot name="title">
            {{ props.title }}
          </slot>
        </h1>

        <slot name="trailing" v-bind="dashboardContext" />
      </slot>
    </div>

    <div v-if="$slots.default" :class="uiPro.center({ class: props.ui?.center })">
      <slot v-bind="dashboardContext" />
    </div>

    <div :class="uiPro.right({ class: props.ui?.right })">
      <slot name="right" v-bind="dashboardContext" />

      <ReuseToggleTemplate v-if="props.toggleSide === 'right'" />
    </div>
  </Primitive>
</template>
