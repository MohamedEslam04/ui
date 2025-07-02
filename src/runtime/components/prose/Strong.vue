<script lang="ts">
import theme from '#build/ui/prose/strong'

export interface ProseStrongProps {
  class?: any
}
export interface ProseStrongSlots {
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
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.strong || {} }))
</script>

<template>
  <strong :class="ui({ class: props.class })">
    <slot />
  </strong>
</template>
