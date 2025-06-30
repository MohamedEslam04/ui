<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { LinkProps } from '../Link.vue'
import theme from '#build/ui/prose/callout'
import type { ComponentConfig } from '../../types/utils'

type Callout = ComponentConfig<typeof theme, AppConfig, 'prose.callout'>

export interface CalloutProps {
  to?: LinkProps['to']
  target?: LinkProps['target']
  icon?: string
  /**
   * @defaultValue 'neutral'
   */
  color?: Callout['variants']['color']
  class?: any
  ui?: Callout['slots']
}

export interface CalloutSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { tv } from '../../utils/tv'
import ULink from '../Link.vue'
import UIcon from '../Icon.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<CalloutProps>()

defineSlots<CalloutSlots>()

const appConfig = useAppConfig()

const ui = computed(() => tv({
  extend: tv(theme),
  ...appConfig.ui?.prose?.callout || {}
})({
  color: props.color,
  to: !!props.to
}))

const target = computed(() => {
  if (props.target) {
    return props.target
  }

  if (props.to && typeof props.to === 'string' && props.to.startsWith('http')) {
    return '_blank'
  }

  return undefined
})
</script>

<template>
  <div :class="ui.base({ class: props.class })">
    <ULink
      v-if="to"
      v-bind="{ to, target, ...$attrs }"
      class="focus:outline-none"
      tabindex="-1"
      raw
    >
      <span
        class="absolute inset-0"
        aria-hidden="true"
      />
    </ULink>

    <UIcon
      v-if="icon"
      :name="icon"
      :class="ui.icon({ class: props.ui?.icon })"
    />
    <UIcon
      v-if="!!to && target === '_blank'"
      :name="appConfig.ui.icons.external"
      :class="ui.externalIcon({ class: props.ui?.externalIcon })"
    />

    <slot mdc-unwrap="p" />
  </div>
</template>
