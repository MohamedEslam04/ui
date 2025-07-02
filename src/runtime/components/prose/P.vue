<script lang="ts">
import theme from '#build/ui/prose/p'

export interface ProsePProps {
  class?: any
}
export interface ProsePSlots {
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
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.p || {} }))
</script>

<template>
  <p :class="ui({ class: props.class })">
    <slot />
  </p>
</template>
