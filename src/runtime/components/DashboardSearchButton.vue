<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ButtonProps, ButtonSlots, KbdProps, ComponentConfig } from '../types'
import theme from '#build/ui/dashboard-search-button'

export type DashboardSearchButton
  = ComponentConfig<typeof theme, AppConfig, 'dashboardSearchButton'>

export interface DashboardSearchButtonProps {
  /**
   * The icon displayed in the button.
   * @defaultValue appConfig.ui.icons.search
   * @IconifyIcon
   */
  icon?: string

  /**
   * The label displayed in the button.
   * @defaultValue t('dashboardSearchButton.label')
   */
  label?: string

  /**
   * The color of the button.
   * @defaultValue 'neutral'
   */
  color?: ButtonProps['color']

  /**
   * The variant of the button.
   * Defaults to 'outline' when not collapsed, 'ghost' when collapsed.
   */
  variant?: ButtonProps['variant']

  size?: ButtonProps['size']

  /**
   * Whether the button is collapsed.
   * @defaultValue false
   */
  collapsed?: boolean

  /**
   * The keyboard keys to display in the button.
   * `{ variant: 'subtle' }`{lang="ts-type"}
   * @defaultValue ['meta', 'k']
   */
  kbds?: KbdProps['value'][] | KbdProps[]

  ui?: DashboardSearchButton['slots'] & ButtonProps['ui']
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
import { transformUI, omit } from '../utils'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<DashboardSearchButtonProps>(), {
  color: 'neutral',
  collapsed: false,
  kbds: () => ['meta', 'k']
})

defineSlots<ButtonSlots>()

const proxySlots = omit(defineSlots(), ['trailing'])
const rootProps = useForwardProps(reactivePick(props, 'color', 'size', 'variant'))

const { t } = useLocalePro()
const appConfig = useAppConfig() as DashboardSearchButton['AppConfig']
const { toggleSearch } = useDashboard()

const ui = computed(() =>
  tv({
    extend: tv(theme),
    ...appConfig.ui?.dashboardSearchButton
  })()
)
</script>

<template>
  <UButton
    :icon="props.icon || appConfig.ui.icons.search"
    :label="props.label || t('dashboardSearchButton.label')"
    v-bind="{
      ...rootProps,
      ...(props.collapsed
        ? { 'square': true, 'label': undefined, 'aria-label': props.label || t('dashboardSearchButton.label') }
        : {})
    }"
    :variant="props.variant || (props.collapsed ? 'ghost' : 'outline')"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    :ui="transformUI(ui, props.ui)"
    @click="toggleSearch"
  >
    <template v-for="(_, name) in proxySlots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>

    <template v-if="!props.collapsed" #trailing>
      <div :class="ui.trailing({ class: props.ui?.trailing })">
        <slot name="trailing">
          <template v-if="props.kbds?.length">
            <UKbd
              v-for="(kbd, idx) in props.kbds"
              :key="idx"
              variant="subtle"
              v-bind="typeof kbd === 'string' ? { value: kbd } : kbd"
            />
          </template>
        </slot>
      </div>
    </template>
  </UButton>
</template>
