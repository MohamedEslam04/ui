<script lang="ts">
import theme from '#build/ui/content/content-search-button'
import type { AppConfig } from '@nuxt/schema'
import type { ButtonProps, ButtonSlots, KbdProps, ComponentConfig, TooltipProps } from '../../types'

type ContentSearchButton = ComponentConfig<typeof theme, AppConfig, 'contentSearchButton'>
export interface ContentSearchButtonProps {
  /**
   * The icon displayed in the button.
   * @defaultValue appConfig.ui.icons.search
   * @IconifyIcon
   */
  icon?: string
  /**
   * The label displayed in the button.
   * @defaultValue t('contentSearchButton.label')
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
   * @defaultValue true
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
  ui?: ContentSearchButton['slots'] & ButtonProps['ui']
  class?: any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { defu } from 'defu'
import { useForwardProps } from 'reka-ui'
import { reactivePick, createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useContentSearch } from '../../composables/useContentSearch'
import { useLocalePro } from '../../composables/useLocalePro'
import { transformUI, omit } from '../../utils'
import { tv } from '../../utils/tv'
import UTooltip from '../Tooltip.vue'

const props = withDefaults(defineProps<ContentSearchButtonProps>(), {
  color: 'neutral',
  collapsed: true,
  tooltip: false,
  kbds: () => ['meta', 'k']
})

const slots = defineSlots<ButtonSlots>()
const [DefineButtonTemplate, ReuseButtonTemplate] = createReusableTemplate()

const { open } = useContentSearch()
const { t } = useLocalePro()
const appConfig = useAppConfig() as ContentSearchButton['AppConfig']

const rootProps = useForwardProps(reactivePick(props, 'color', 'size'))

const ui = computed(() =>
  tv({
    extend: tv(theme),
    ...appConfig.ui?.contentSearchButton
  })()
)

const proxySlots = omit(slots, ['trailing'])

const tooltipProps = computed<TooltipProps>(() =>
  defu(typeof props.tooltip === 'boolean' ? {} : props.tooltip, {
    delayDuration: 0,
    content: { side: 'right' as const }
  })
)
</script>

<template>
  <DefineButtonTemplate>
    <UButton
      :icon="icon || appConfig.ui.icons.search"
      :label="label || t('contentSearchButton.label')"
      :variant="variant || (collapsed ? 'ghost' : 'outline')"
      v-bind="{
        ...rootProps,
        ...collapsed ? {
          'square': true,
          'label': void 0,
          'aria-label': label || t('contentSearchButton.label')
        } : {}
      }"
      :class="ui.base({ class: [props.ui?.base, props.class] })"
      :ui="transformUI(ui, props.ui)"
      @click="open = true"
    >
      <template v-for="(_, name) in proxySlots" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>

      <template v-if="!props.collapsed" #trailing>
        <div :class="ui.trailing({ class: props.ui?.trailing })">
          <slot name="trailing">
            <UKbd
              v-for="(kbd, index) in props.kbds"
              :key="index"
              variant="subtle"
              v-bind="typeof kbd === 'string' ? { value: kbd } : kbd"
            />
          </slot>
        </div>
      </template>
    </UButton>
  </DefineButtonTemplate>

  <UTooltip
    v-if="props.collapsed && props.tooltip"
    :text="props.label || t('contentSearchButton.label')"
    v-bind="tooltipProps"
  >
    <ReuseButtonTemplate />
  </UTooltip>

  <ReuseButtonTemplate v-else />
</template>
