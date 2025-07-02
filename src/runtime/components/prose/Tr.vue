<script lang="ts">
import theme from '#build/ui/prose/tr'

export interface ProseTrProps {
  class?: any
}
export interface ProseTrSlots {
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
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.tr || {} }))
</script>

<template>
  <tr :class="ui({ class: props.class })">
    <slot />
  </tr>
</template>
