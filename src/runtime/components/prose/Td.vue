<script lang="ts">
import theme from '#build/ui/prose/td'

export interface ProseTdProps {
  class?: any
}
export interface ProseTdSlots {
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
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.td || {} }))
</script>

<template>
  <td :class="ui({ class: props.class })">
    <slot />
  </td>
</template>
