<script lang="ts">
import theme from '#build/ui/prose/ul'

export interface ProseUlProps {
  class?: any
}
export interface ProseUlSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { tv } from '../../utils/tv'

const props = defineProps({
  class: { type: null, required: false }
})
defineSlots()
const appConfig = useAppConfig()
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.ul || {} }))
</script>

<template>
  <ul :class="ui({ class: props.class })">
    <slot />
  </ul>
</template>
