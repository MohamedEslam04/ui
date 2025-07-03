<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ButtonProps, KbdProps, ComponentConfig, TooltipProps } from '../types'
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
   * Display a tooltip on the button when is collapsed with the button label.
   * This has priority over the global `tooltip` prop.
   */
  tooltip?: boolean | TooltipProps

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
import { computed, toRef } from 'vue'
import { useForwardProps } from 'reka-ui'
import { defu } from 'defu'
import { reactivePick, createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'

import UTooltip from './Tooltip.vue'
import { useLocalePro } from '../composables/useLocalePro'
import { useDashboard } from '../utils/dashboard'
import { transformUI, omit } from '../utils'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<DashboardSearchButtonProps>(), {
  color: 'neutral',
  collapsed: false,
  tooltip: false,
  kbds: () => ['meta', 'k']
})

const slots = defineSlots()
const [DefineButtonTemplate, ReuseButtonTemplate] = createReusableTemplate()
const proxySlots = omit(slots, ['trailing'])

const appConfig = useAppConfig() as DashboardSearchButton['AppConfig']
const { t } = useLocalePro()
const { toggleSearch } = useDashboard()

const labelText = computed(() => props.label || t('dashboardSearchButton.label'))

const uiPro = computed(() =>
  tv({
    extend: tv(theme),
    ...appConfig.ui?.dashboardSearchButton
  })()
)

const tooltipProps = toRef(() =>
  defu(
    typeof props.tooltip === 'boolean' ? {} : props.tooltip,
    { delayDuration: 0, content: { side: 'right' as const } }
  )
)

const rootProps = useForwardProps(reactivePick(props, 'color', 'size'))
</script>

<template>
  <DefineButtonTemplate>
    <UButton
      :icon="props.icon || appConfig.ui.icons.search"
      :label="props.collapsed ? undefined : labelText"
      :variant="props.variant || (props.collapsed ? 'ghost' : 'outline')"
      :aria-label="props.collapsed ? labelText : undefined"
      :square="props.collapsed"
      :class="uiPro.base({ class: [props.ui?.base, props.class] })"
      :ui="transformUI(uiPro, props.ui)"
      v-bind="rootProps"
      @click="toggleSearch"
    >
      <template #default="slotProps">
        <template v-for="(_, name) in proxySlots" :key="name">
          <slot :name="name" v-bind="slotProps" />
        </template>
      </template>

      <template v-if="!props.collapsed" #trailing>
        <div :class="uiPro.trailing({ class: props.ui?.trailing })">
          <slot name="trailing">
            <template v-if="props.kbds?.length">
              <UKbd
                v-for="(kbd, index) in props.kbds"
                :key="index"
                variant="subtle"
                v-bind="typeof kbd === 'string' ? { value: kbd } : kbd"
              />
            </template>
          </slot>
        </div>
      </template>
    </UButton>
  </DefineButtonTemplate>

  <UTooltip
    v-if="props.collapsed && props.tooltip"
    :text="labelText"
    v-bind="tooltipProps"
  >
    <ReuseButtonTemplate />
  </UTooltip>
  <ReuseButtonTemplate v-else />
</template>
