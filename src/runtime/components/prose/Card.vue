<script lang="ts">
import theme from '#build/ui/prose/card'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig, LinkProps } from '../../types'

type ProseCard = ComponentConfig<typeof theme, AppConfig, 'card', 'ui.prose'>

export interface ProseCardProps {
  to?: LinkProps['to']
  target?: LinkProps['target']
  icon?: string
  title?: string
  description?: string
  /**
   * @defaultValue 'primary'
   */
  color?: ProseCard['variants']['color']
  class?: any
  ui?: ProseCard['slots']
}

export interface ProseCardSlots {
  default(): any
  title(): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { tv } from '../../utils/tv'
import ULink from '../Link.vue'
import UIcon from '../Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ProseCardProps>(), {
  color: 'primary'
})

defineSlots<ProseCardSlots>()

const appConfig = useAppConfig() as ProseCard['AppConfig']
const isExternal = computed(() => typeof props.to === 'string' && props.to.startsWith('http'))
const target = computed(() => props.target || (props.to && isExternal.value ? '_blank' : undefined))
const ariaLabel = computed(() => (props.title || 'Card link').trim())

const ui = computed(() =>
  tv({
    extend: tv(theme),
    ...appConfig.ui?.prose?.card || {} })({
    color: props.color,
    to: !!props.to,
    title: !!props.title
  })
)
</script>

<template>
  <div :class="ui.base({ class: props.class })">
    <!-- Clickable Overlay -->
    <ULink
      v-if="to"
      :to="to"
      :target="target"
      :aria-label="ariaLabel"
      class="focus:outline-none"
      tabindex="-1"
      raw
      v-bind="$attrs"
    >
      <span class="absolute inset-0" aria-hidden="true" />
    </ULink>

    <!-- Icon -->
    <UIcon
      v-if="icon"
      :name="icon"
      :class="ui.icon({ class: props.ui?.icon })"
    />

    <!-- External Link Icon -->
    <UIcon
      v-if="to && target === '_blank'"
      :name="appConfig.ui.icons.external"
      :class="ui.externalIcon({ class: props.ui?.externalIcon })"
    />

    <!-- Title -->
    <p v-if="title || $slots.title" :class="ui.title({ class: props.ui?.title })">
      <slot name="title">
        {{ title }}
      </slot>
    </p>

    <!-- Description / Default Slot -->
    <div v-if="$slots.default || description" :class="ui.description({ class: props.ui?.description })">
      <slot>
        {{ description }}
      </slot>
    </div>
  </div>
</template>
