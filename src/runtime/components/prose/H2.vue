<script lang="ts">
import theme from '#build/ui/prose/h2'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types'

type ProseH2 = ComponentConfig<typeof theme, AppConfig, 'h2', 'ui.prose'>
export interface ProseH2Props {
  id?: string
  class?: any
  ui?: ProseH2['slots']
}
export interface ProseH2Slots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useRuntimeConfig, useAppConfig } from '#imports'
import { tv } from '../../utils/tv'

const props = defineProps<ProseH2Props>()
defineSlots<ProseH2Slots>()
const appConfig = useAppConfig() as ProseH2['AppConfig']
const { headings } = useRuntimeConfig().public.mdc
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.h2 || {} })())
const generate = computed(() => props.id && typeof headings?.anchorLinks === 'object' && headings.anchorLinks.h2)
</script>

<template>
  <h2 :id="id" :class="ui.base({ class: props.class })">
    <a v-if="id && generate" :href="`#${id}`" :class="ui.link({ class: props.ui?.link })">
      <span :class="ui.leading({ class: props.ui?.leading })">
        <UIcon :name="appConfig.ui.icons.hash" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
      </span>

      <slot />
    </a>
    <slot v-else />
  </h2>
</template>
