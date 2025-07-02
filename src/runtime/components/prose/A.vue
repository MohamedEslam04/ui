<script lang="ts">
import theme from '#build/ui/prose/a'

export interface ProseAProps {
  href?: string
  target?: '_blank' | '_parent' | '_self' | '_top' | (string & object) | null | undefined
  class?: any
}
export interface ProseASlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { tv } from '../../utils/tv'

const appConfig = useAppConfig()
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.a || {} }))
const props = defineProps({
  href: { type: String, required: false },
  target: { type: null, required: false },
  class: { type: null, required: false }
})
defineSlots()
</script>

<template>
  <ULink :href="href" :target="target" :class="ui({ class: props.class })" raw>
    <slot />
  </ULink>
</template>
